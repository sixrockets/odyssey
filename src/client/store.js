import { createStore } from "redux"
import { rrBotApp } from "./reducers"
import { updateUsers } from "../shared/actions"

// console.log(rrBotApp);

const store = createStore(rrBotApp)

// console.log(store.getState());

// Every time the state changes, log it
const unsubscribe = store.subscribe(() =>
  console.log(store.getState())
)

store.dispatch(updateUsers( ["pepe", "fulano", "mengano"]) )

// Stop listening to state updates
unsubscribe()


exports.store = store
