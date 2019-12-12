import React from "react";
import { PageLayout } from "../../src/layouts/PageLayout/PageLayout";
import css from "./login.scss";
import { auth, firebase } from "../../src/utils/firebase";
import { Router } from "next/router";

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      pwd: "",
      errorMsg: ""
    };
  }

  static async getInitialProps({ req }) {
    console.log("hiiii");
    return {};
  }

  /**
   * Function to update username on keypress
   */
  updateUsername = event => {
    this.setState({ username: event.target.value, errorMsg: "" });
  };

  /**
   * Function to update password on keypress
   */
  updatePwd = event => {
    this.setState({ pwd: event.target.value, errorMsg: "" });
  };

  /**
   * Function to handle firebase signIn.
   * Successful signin will navigate the user to dashboard page.
   */
  handleSignIn = async () => {
    console.log(this.state);
    if (this.state.username.trim() !== "" && this.state.pwd.trim() !== "") {
      try {
        await firebase
          .auth()
          .signInWithEmailAndPassword(this.state.username, this.state.pwd);
        Router.push("/dashboard");
      } catch (error) {
        var errorMessage = error.message;
        this.setState({ errorMsg: errorMessage });
      }
    } else {
      this.setState({ errorMsg: "Enter username and password" });
    }
  };

  handleSignInWithGoogle = async () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
    auth
      .signInWithPopup(provider)
      .then(() => {
        alert("You are signed In");
      })
      .catch(err => {
        alert("OOps something went wrong check your console");
        console.log(err);
      });
  };

  render() {
    return (
      <div>
        <PageLayout headers="false" wrapperPadding={false}>
          <div className={css["login-wrapper"]}>
            {/* !-------- BEGIN : Left Section ------- */}
            <div className={css["left-section"]}>
              <div className={css["login-section-wrapper"]}>
                <div className={css["login-heading"]}>WALLET</div>
                <div className={css["login-desc"]}>
                  Hello there! Sign In and start managing your bank transactions
                </div>
                <div className={css["login-form-wrapper"]}>
                  <div className={css["login-form-name"]}>Username</div>
                  <input
                    className={css["login-form-field"]}
                    type="text"
                    name="username"
                    value={this.state.username}
                    onChange={() => {
                      this.updateUsername(event);
                    }}
                  />
                  <div className={css["login-form-name"]}>Password</div>
                  <input
                    className={css["login-form-field"]}
                    type="password"
                    name="pwd"
                    value={this.state.pwd}
                    onChange={() => {
                      this.updatePwd(event);
                    }}
                  />
                  <div className={css["error-message"]}>
                    {this.state.errorMsg}
                  </div>
                  <button
                    className={css["signin-button"]}
                    onClick={this.handleSignIn}
                  >
                    Sign In Now
                  </button>
                </div>
              </div>
            </div>
            {/* !-------- END : Left Section ------- */}
            {/* !-------- BEGIN : Right Section ------- */}
            <div className={css["right-section"]}>
              <div className="image-wrapper">
                <img src="../../static/images/wallet.png" />
              </div>
            </div>
            {/* !-------- END : Right Section ------- */}
          </div>
        </PageLayout>
      </div>
    );
  }
}
