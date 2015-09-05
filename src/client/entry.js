import React from "react";
import Router from "react-router";
import routes from "../shared/routes";

console.log("hello from entry.js");

Router.run(routes, Router.HistoryLocation, (Handler, state) => {
  React.render(<Handler/>, document.getElementById('react-app'));
});
