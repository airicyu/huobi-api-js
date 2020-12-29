import CryptoJS from 'crypto-js'
import moment from 'moment'
import { HmacSHA256 } from 'crypto-js'
import url from 'url'
import qs from 'qs'
import { logger as defaultLogger } from './defaultLogger'
import { httpClient as defaultHttpClient } from './defaultHttpClient'

const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
}

/**
 * API helper for HB
 */
class HbApi {
    private apiBaseUrl: string
    private profileConfig: {
        accessKey: string
        secretKey: string
    }
    private logger: Logger
    private httpClient: HttpClient<HbRawAPIResponse>

    constructor({
        apiBaseUrl,
        profileConfig,
        logger,
        httpClient,
    }: {
        apiBaseUrl: string
        profileConfig: {
            accessKey: string
            secretKey: string
        }
        logger?: Logger
        httpClient?: HttpClient<HbRawAPIResponse>
    }) {
        this.apiBaseUrl = apiBaseUrl
        this.profileConfig = profileConfig
        this.logger = logger || defaultLogger
        this.httpClient = httpClient || defaultHttpClient
    }

    /**
     * Generic REST API call with handle of signature
     * @param {*} param0
     */
    async restApi({
        path,
        method,
        query,
        body,
        timeout = 5000,
    }: {
        path: string
        method: string
        query?: Record<string, unknown>
        body?: Record<string, unknown>
        timeout?: number
    }): Promise<HbApiResponse> {
        const signPayload: Record<string, string | number | boolean | unknown> = { ...this.getDefaultSignPayload(), ...query }
        const baseUrl = url.parse(this.apiBaseUrl).host
        if (!baseUrl) {
            const error = new Error('api base url invalid')
            this.logger.error(error.message, { error })
            throw error
        }
        const signedQuery = this.buildQueryStringWithSignedSHA({
            method,
            baseUrl,
            path,
            signPayload,
        })
        return this.callApi({ method, path, query: signedQuery, body, timeout })
    }

    /**
     * Build signed query string
     * @param {*} method
     * @param {*} baseurl
     * @param {*} path
     * @param {*} data
     */
    protected buildQueryStringWithSignedSHA({
        method,
        baseUrl,
        path,
        signPayload,
    }: {
        method: string
        baseUrl: string
        path: string
        signPayload: Record<string, string | number | boolean | unknown>
    }): Record<string, string | number | boolean | unknown> {
        const params = Object.entries(signPayload).map((_) => _)
        params.sort((a, b) => {
            if (a[0] === b[0]) {
                return 0
            }
            return a[0] < b[0] ? -1 : 1
        })

        const query: Record<string, string | number | boolean | unknown> = {}
        params.forEach(([k, v]) => {
            query[k] = v
        })

        const queryString = qs.stringify(query)

        const meta = [method, baseUrl, path, queryString].join('\n')
        const hash = HmacSHA256(meta, this.profileConfig.secretKey)
        const signature = CryptoJS.enc.Base64.stringify(hash)

        query['Signature'] = signature

        return query
    }

    /**
     * Default payload for sign
     */
    private getDefaultSignPayload(): Record<string, string | number | boolean> {
        return {
            AccessKeyId: this.profileConfig.accessKey,
            SignatureMethod: 'HmacSHA256',
            SignatureVersion: 2,
            Timestamp: moment.utc().format('YYYY-MM-DDTHH:mm:ss'),
        }
    }

    /**
     * Low level Http call
     * @param {*} method
     * @param {*} path
     * @param {*} queryString
     * @param {*} body
     */
    private async callApi({
        method,
        path,
        query,
        body,
        timeout = 5000,
    }: {
        path: string
        method: string
        query?: Record<string, unknown>
        body?: Record<string, unknown>
        timeout?: number
    }): Promise<HbApiResponse> {
        const url = `${this.apiBaseUrl}${path}`

        try {
            const response = await this.httpClient({
                url,
                method,
                timeout,
                headers: DEFAULT_HEADERS,
                query,
                body,
            })

            const data: HbRawAPIResponse = response.data
            if (data?.status == 'ok' || data?.code == 200) {
                this.logger.debug(`API call success. method=[${method}], url=[${url}]`)
                return data?.data ?? null
            } else {
                this.logger.error(`API return error. method=[${method}], url=[${url}]`, {
                    data,
                })
                return null
            }
        } catch (error) {
            this.logger.error(`API error. method=[${method}], url=[${url}]`, {
                error: error.message,
                stack: error.stack,
            })
            return null
        }
    }
}

export { HbApi }
