import React from "react";

import User from "./user";


export default class UserList extends React.Component {

  render() {
    var userNodes = this.props.data.map( function(user){
      return (
        <User name={user.name}>

        </User>
      )
    })

    return (
      <ul className="userList">
        {userNodes}
      </ul>
    )

  }

}
