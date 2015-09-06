/*
 * action types
 */

export const UPDATE_USERS = 'UPDATE_USERS';

export function updateUsers(users) {
  return { type: UPDATE_USERS, users };
}
