import { UPDATE_USERS } from '../shared/actions';

const initialState = {
  users: []
};

exports.rrBotApp = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USERS:
      return { ...state, users: action.users };
    default:
      return state;
  }
};
