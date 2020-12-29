import { assert } from 'console'
import sinon from 'sinon'
import { HbApi } from '../src/main'
import { logger as silentLogger } from './silentLogger'
import { stubHttpClientProxy } from './stubHttpClientProxy'

const dummyConfig = {
    apiBaseUrl: 'https://api.huobipro.com',
    huobi: {
        accessKey: 'd326b4a4-5eb24204-af16bc922b-fd0db',
        secretKey: 'e11b8b8c-d2c747b0-92131eea-ceadc',
    },
}

describe('Test API call', function () {
    const sandbox = sinon.createSandbox()
    let hbApi: HbApi | null

    const DUMMY_ACC_BAL_RESPONSE_DATA = {
        status: 'ok',
        data: [{ id: 12345678, type: 'spot', subtype: '', state: 'working' }],
    }

    /**
     * Stubbing API
     * @param param0
     */
    const stubHttpClientHandle: HttpClient<HbRawAPIResponse> = async ({
        url,
        method,
        headers,
        query,
        body,
        timeout,
    }): Promise<{
        status: number
        headers: Record<string, string>
        data: HbRawAPIResponse
        [propName: string]: any
    }> => {
        const checkPath = ({ url, checkPath }: { url: string; checkPath: string }): boolean => {
            return url.startsWith(`${dummyConfig.apiBaseUrl}${checkPath}`)
        }

        if (checkPath({ url, checkPath: `/v1/account/accounts` })) {
            return {
                status: 200,
                headers: {},
                data: DUMMY_ACC_BAL_RESPONSE_DATA,
            }
        } else {
            throw new Error('unmapped path')
        }
    }

    beforeAll(() => {
        hbApi = new HbApi({
            apiBaseUrl: dummyConfig.apiBaseUrl,
            profileConfig: dummyConfig.huobi,
            httpClient: stubHttpClientProxy(sandbox, stubHttpClientHandle),
            logger: silentLogger,
        })
    })

    afterAll(() => {
        sandbox.restore()
    })

    it('Test API signature', async () => {
        const DEFAULT_SIGN_PAYLOAD = {
            AccessKeyId: dummyConfig.huobi.accessKey,
            SignatureMethod: 'HmacSHA256',
            SignatureVersion: 2,
            Timestamp: '2020-12-17T13:30:05',
        }

        sandbox.replace(hbApi as any, 'getDefaultSignPayload', sandbox.fake.returns(DEFAULT_SIGN_PAYLOAD))

        const buildSignQuerySpy = sandbox.spy(hbApi as any, 'buildQueryStringWithSignedSHA')

        const result = await hbApi?.restApi({ path: `/v1/account/accounts`, method: 'GET' })

        assert(buildSignQuerySpy.calledOnce)
        expect(buildSignQuerySpy.lastCall.returnValue as any).toEqual({
            ...DEFAULT_SIGN_PAYLOAD,
            Signature: 'fLVCkAld1BN08lITsm9Ge1WztYzNYE9fnGhI3+rTxgI=',
        })
    })

    it('Test API call flow with mock server', async () => {
        const result = await hbApi?.restApi({ path: `/v1/account/accounts`, method: 'GET' })
        expect(result).not.toBeNull()
        expect(result).toEqual(DUMMY_ACC_BAL_RESPONSE_DATA.data)
    })
})
