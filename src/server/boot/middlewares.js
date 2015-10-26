import sendLocationPolyfill from "../middlewares/sendLocationPolyfill"
import botsMiddleware from "../middlewares/botsMiddleware"

export default app => [sendLocationPolyfill, botsMiddleware.bind(app)]
