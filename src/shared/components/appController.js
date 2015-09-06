import React from "react";
import  UserList from "./userList";
import store from "../../client/store"


let AppController = React.createClass({

   getInitialState: function(){
    return {users: [ {name: "test user"} ]};
  },

  render: function() {
    return (
      <div>
        <p>Maggie controller here</p>
        <UserList data={this.state.users}></UserList>
      </div>
    )
  }

});

export default AppController;
