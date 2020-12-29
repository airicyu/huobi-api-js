'use strict'

import axios from 'axios'
import http from 'http'
import https from 'https'

const httpAgent = new http.Agent({
    keepAlive: true,
    keepAliveMsecs: 5000,
})

const httpsAgent = new https.Agent({
    keepAlive: true,
    keepAliveMsecs: 5000,
})

const axiosHttpClient = axios.create({
    headers: {
        'content-type': 'application/json;charset=utf-8',
        Accept: 'application/json',
    },
    maxRedirects: 1,
    timeout: 5000,
    httpAgent,
    httpsAgent,
    validateStatus: (status) => {
        return status < 400
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as HttpClient<any>

const httpClient: HttpClient<any> = async (options) => {
    const decoratedOptions = {
        ...options,
        params: options.query,
        data: options.body,
    }
    return axiosHttpClient(decoratedOptions)
}

export { httpClient }
