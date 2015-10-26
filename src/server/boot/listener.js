import Q from "Q"

export default function listener(app){
  return async event => {
    try {
      await app.middlewares.reduce(Q.when, Q(event))
    } catch (error) {
      console.trace(error)
    }
  }
}
