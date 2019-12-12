import React from "react";
import Router from "next/router";
import { auth } from "../firebase";
//import Login from "../../../pages/login";
import css from "./AuthGuard.scss";

const AuthGuard = Component => {
  return class extends React.Component {
    AuthUnsubscribe;
    constructor(props) {
      super(props);
      this.state = {
        status: "LOADING"
      };
    }

    /**
     * Function to make the getInitialProps defined in page to work.
     * @param ctx
     */
    static getInitialProps(ctx) {
      if (Component.getInitialProps) return Component.getInitialProps(ctx);
    }

    componentDidMount() {
      this.AuthUnsubscribe = auth.onAuthStateChanged(authUser => {
        console.log(authUser);
        if (authUser) {
          this.setState({
            status: "SIGNED_IN"
          });
        } else {
          console.log("nav login");
          Router.push("/login");
        }
      });
    }

    componentWillUnmount() {
      this.AuthUnsubscribe();
    }
    renderContent() {
      const { status } = this.state;
      const { extraProp, ...passThroughProps } = this.props;

      if (status == "LOADING") {
        return <div className={css.loader}>Loading...</div>;
      } else if (status == "SIGNED_IN") {
        return <Component {...passThroughProps} />;
      }
    }
    render() {
      return <React.Fragment>{this.renderContent()}</React.Fragment>;
    }
  };
};
export default AuthGuard;
