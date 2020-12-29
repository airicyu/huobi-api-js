import { HbApi } from 'huobi-api-js'

const options = {
    apiBaseUrl: 'https://api.huobipro.com',
    profileConfig: {
        accessKey: '<REPLACE_WITH_YOUR_ACCESS_KEY>',
        secretKey: '<REPLACE_WITH_YOUR_SECRET_KEY>',
    },
}

async function run() {
    const hbApi = new HbApi(options)

    const CURRENCY_USDC = 'usdc'

    /*****
     * root user info
     */
    const account = await hbApi.restApi({ path: `/v1/acco3unt/accounts`, method: 'GET' })
    console.log('account:', { account })

    const subUsers = await hbApi.restApi({ path: `/v2/sub-user/user-list`, method: 'GET' })
    console.log('subUsers:', { subUsers })

    /**
     * Get sub account aggregate balance
     */
    const subAccountAggregateBalance = await hbApi.restApi({
        path: `/v1/subuser/aggregate-balance`,
        method: 'GET',
    })
    console.log('subAccountAggregateBalance:', { subAccountAggregateBalance })

    const withdrawQuota = await hbApi.restApi({
        path: `/v2/account/withdraw/quota`,
        method: 'GET',
        query: {
            currency: CURRENCY_USDC,
        },
    })
    console.log(`withdrawQuota:`, {
        withdrawQuota,
    })

    console.log('exit')
}

run()
