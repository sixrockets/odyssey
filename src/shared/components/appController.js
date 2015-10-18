import React from "react"
import UserList from "./userList"
import store from "../../client/store"

const AppController = React.createClass({

  getInitialState: function getInitialState() {
    return {users: [ {name: "test user"} ]}
  },

  render: function render() {
    return (
      <div>
        <p>Maggie controller here</p>
        <UserList data={this.state.users} />
      </div>
    )
  }

})

export default AppController
