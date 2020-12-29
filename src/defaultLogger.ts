'use strict'

const logger: Logger = {
    info: function (msg: string, params?: Record<string, unknown>): void {
        console.log(`${new Date().toISOString()} [info]: ${msg}`, this.serializeParams(params))
    },
    debug: function (msg: string, params?: Record<string, unknown>): void {
        console.debug(`${new Date().toISOString()} [debug]: ${msg}`, this.serializeParams(params))
    },
    error: function (msg: string, params?: Record<string, unknown>): void {
        console.error(`${new Date().toISOString()} [error]: ${msg}`, this.serializeParams(params))
    },
    serializeParams: function (params?: Record<string, unknown>): string {
        let paramsStr = ''
        if (params !== undefined) {
            try {
                paramsStr = JSON.stringify(params)
            } catch (e) {
                paramsStr = '[Cannot serialize params]'
            }
        }
        return paramsStr
    },
}

export { logger }
