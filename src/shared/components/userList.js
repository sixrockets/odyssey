import React from "react"

import User from "./user"


export default class UserList extends React.Component {

  render() {
    const userNodes = this.props.data.map(user => {
      return (
        <User name={user.name} />
      )
    })

    return (
      <ul className="userList">
        {userNodes}
      </ul>
    )

  }

}
