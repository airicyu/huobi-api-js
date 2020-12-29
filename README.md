# huobi-api-js

[![npm version](https://img.shields.io/npm/v/huobi-api-js.svg)](https://www.npmjs.com/package/huobi-api-js)
[![Build](https://travis-ci.org/airicyu/huobi-api-js.svg?branch=master)](https://travis-ci.org/airicyu/huobi-api-js)
[![Codecov branch](https://img.shields.io/codecov/c/github/airicyu/huobi-api-js/master.svg)](https://codecov.io/gh/airicyu/huobi-api-js)

[![dependencies Status](https://david-dm.org/airicyu/huobi-api-js/status.svg)](https://david-dm.org/airicyu/huobi-api-js)
[![devDependencies Status](https://david-dm.org/airicyu/huobi-api-js/dev-status.svg)](https://david-dm.org/airicyu/huobi-api-js?type=dev)

This is a non-official HuoBi Rest API nodejs module which support for signature version 2.

(這是非官方的火幣REST API nodejs module，支援簽名版本2。)

---------------------------------

## Install

```bash
$ npm i huobi-api-js
```

---------------------------------

## Usage

- calling huobi REST API without handling signature protocol yourself

```javascript
import { HbApi } from 'huobi-js'

...

const hbApi = new HbApi({
    apiConfig: config.api,
    profileConfig: config.huobi,
})

...

const account = await hbApi.restApi({ path: `/v1/acco3unt/accounts`, method: 'GET' })
```

---------------------------------

## API

### New service class

Create a new service class which is reusable to call multiple REST APIs

```javascript
const hbApi = new HbApi({
    apiBaseUrl: config.apiBaseUrl,
    profileConfig: config.huobi,
})
```

constructor parameters:

```
{
    apiBaseUrl: string
    profileConfig: {
        accessKey: string
        secretKey: string
    }
    logger?: Logger
    httpClient?: HttpClient
}
```

| Parameter               | Type     | Description                    | Mandatory |
|-------------------------|----------|--------------------------------|-----------|
| apiBaseUrl              | string   | API base URL                   | Y         |
| profileConfig.accessKey | string   | access key                     | Y         |
| profileConfig.secretKey | string   | secretKey                      | Y         |
| logger                  | object   | your logger implementation     | N         |
| httpClient              | function | your httpClient implementation | N         |


---------------------------------

### Call huobi Rest API

Call REST API which internally handled the signature protocol and return result as Promise

```javascript
hbApi.restApi({ path: `/v1/acco3unt/accounts`, method: 'GET' })
```

Method: restAPI

Parameters:

| Parameter | Type                    | Description                                         | Mandatory |
|-----------|-------------------------|-----------------------------------------------------|-----------|
| path      | string                  | REST API path, e.g: "/v1/acco3unt/accounts"         | Y         |
| method    | string                  | either "GET" or "POST"                              | Y         |
| query     | Record<string, unknown> | query parameters                                    | N         |
| body      | Record<string, unknown> | post body data                                      | N         |
| timeout   | number                  | HTTP request timeout in ms, default value is 5000ms | N         |

Return type:
Promise of data

---------------------------------

## Example

```javascript
import { HbApi } from 'huobi-js'

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
```