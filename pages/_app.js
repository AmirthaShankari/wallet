import React from "react";
import App from "next/app";
import Router from "next/router";
import { auth } from "../src/utils/firebase";
import UserContext from "../src/contexts/UserContext";
//import Login from "./login";

export default class MyApp extends App {
  state = {
    user: null
  };

  componentDidMount = () => {
    auth.onAuthStateChanged(authUser => {
      console.log(authUser);
      if (authUser) {
        this.setState({ user: authUser.email });
        console.log(Router.route);
        if (Router.route === "/" || Router.route === "/login") {
          Router.push("/dashboard");
        }
      } else {
        this.setState({ user: null });
        Router.push("/login");
      }
    });
  };

  render() {
    const { Component, pageProps } = this.props;

    return (
      <UserContext.Provider
        value={{
          user: this.state.user
        }}
      >
        <Component {...pageProps} />
      </UserContext.Provider>
    );
  }
}
