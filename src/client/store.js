import { createStore } from 'redux';
import { rrBotApp } from './reducers';
import { updateUsers } from '../shared/actions';

// console.log(rrBotApp);

let store = createStore(rrBotApp);

// console.log(store.getState());

// Every time the state changes, log it
let unsubscribe = store.subscribe(() =>
  console.log(store.getState())
);

store.dispatch(updateUsers( ['pepe', 'fulano', 'mengano']) );

// Stop listening to state updates
unsubscribe();


exports.store = store;
