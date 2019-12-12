import React from "react";
import AuthGuard from "../../src/utils/AuthGuard/index";

class About extends React.Component {
  render() {
    return (
      <div>
        <h1>About Page</h1>
        <p>You can't go into this page if you are not authenticated.</p>
      </div>
    );
  }
}
export default AuthGuard(About);
