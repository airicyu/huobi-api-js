const stubHttpClientProxy = (sandbox: sinon.SinonSandbox, hbHttpClient: HbHttpClient) => {
    return sandbox
        .stub()
        .callsFake(
            async (args: {
                url: string
                method: string
                headers?: Record<string, string>
                query?: any
                body?: any
                timeout?: number
                [propName: string]: any
            }) => {
                return hbHttpClient?.(args)
            },
        )
}

export { stubHttpClientProxy }
