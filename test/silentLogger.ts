'use strict'

const logger: Logger = {
    info: function (msg: string, params?: Record<string, unknown>): void {},
    debug: function (msg: string, params?: Record<string, unknown>): void {},
    error: function (msg: string, params?: Record<string, unknown>): void {},
}

export { logger }
