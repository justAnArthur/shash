import { HttpContext } from '@adonisjs/core/http'

export default class LoggerMiddleware {
  public async handle({
                        request,
                        route,
                        response,
                        auth,
                        logger,
                        ...ctx
                      }: HttpContext, next: () => Promise<void>) {
    let user = 'Guest'

    if (auth?.isAuthenticated) {
      user = auth.user?.email || 'Authenticated User'
    }

    if (route) {
      const controller = route.controller || 'UnknownController'
      const method = route.handler || 'UnknownMethod'

      console.log('route', route)

      logger.info(`-> [User: ${user}] ${request.method()} ${request.url()} -> ${controller}.${method} called with params: ${JSON.stringify(request.params())}`)
    } else {
      logger.warn(`-> [User: ${user}] ${request.method()} ${request.url()} -> No route matched`)
    }

    const startTime = Date.now()

    await next()

    const duration = Date.now() - startTime

    logger.info(`<- [User: ${user}] ${request.method()} ${request.url()} -> Completed in ${duration}ms with status ${response.response.statusCode}`)
  }
}
