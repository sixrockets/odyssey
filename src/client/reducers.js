import { UPDATE_USERS } from '../shared/actions';
import  _ from 'lodash';

console.log(_);

const initialState = {
  users: []
};

exports.rrBotApp = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USERS:
      return _.assign( {}, state, { users: action.users });
    default:
      return state;
  }
};
