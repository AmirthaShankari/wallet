import React from "react";
import Router from "next/router";
import AuthGuard from "../../src/utils/AuthGuard/index";
import { Header } from "../../src/components/Header";
import { PageLayout } from "../../src/layouts/PageLayout/PageLayout";
import { db } from "../../src/utils/firebase";
import { Account } from "../../src/components/Account";
import css from "./dashboard.scss";
import UserContext from "../../src/contexts/UserContext";
import { NewAccount } from "../../src/components/NewAccount";
import { AppConstants } from "../../src/constants/AppConstants";

class Dashboard extends React.Component {
  accountDetails = [];
  walletDetails;
  walletId;
  userDetail;

  constructor(props) {
    super(props);

    this.state = {
      account: [],
      showAccountOverlay: false
    };
  }

  static async getInitialProps({ req }) {
    return {};
  }

  async componentDidMount() {
    var databaseRef = db.ref(AppConstants.FIREBASE_DB_REF.WALLET);
    databaseRef.on("value", this.processAccountDetails, function(error) {
      console.log("Error: " + error.code);
    });
  }

  async componentWillUnmount() {
    var databaseRef = db.ref(AppConstants.FIREBASE_DB_REF.WALLET);
    databaseRef.off("value");
  }

  /**
   * Function to process account details.
   * Queries the firebase realtime database and fetches the account details for the current user.
   */
  processAccountDetails = snapshot => {
    let snapshotValue = snapshot.val();
    for (var prop in snapshotValue) {
      if (
        Object.prototype.hasOwnProperty.call(snapshotValue, prop) &&
        snapshotValue[prop].user === this.userDetail
      ) {
        this.walletDetails = snapshotValue[prop];
        this.walletId = prop;
        this.accountDetails = this.walletDetails.account;
        this.setState({ account: this.accountDetails });
      }
    }
  };

  /**
   * Function to handle Account selection
   * @param data
   */
  handleAccountSelection(data) {
    console.log(data);
    Router.push("/accdetail/[accountId]", `/accdetail/${data.number}`);
  }

  /**
   * Function to toggle the new account form display.
   */
  toggleNewAccountModalDisplay = () => {
    console.log("Open new account modal");
    this.setState(prevState => {
      return {
        showAccountOverlay: !prevState.showAccountOverlay
      };
    });
  };

  /**
   * Function to add new account
   */
  addNewAccount = (accountName, accNumber, balance) => {
    const account = {
      balance: balance,
      name: accountName.toUpperCase(),
      number: accNumber,
      transactions: []
    };
    if (this.walletDetails && this.accountDetails.length > 0) {
      this.walletDetails.account.push(account);
      db.ref(AppConstants.FIREBASE_DB_REF.WALLET + this.walletId).set(
        this.walletDetails,
        function(error) {
          if (error) {
            console.log(error);
          } else {
            console.log("updated successfully");
          }
        }
      );
    } else {
      this.accountDetails.push(account);
      this.walletDetails = {
        user: this.userDetail,
        account: this.accountDetails
      };
      db.ref(AppConstants.FIREBASE_DB_REF.WALLET).push(this.walletDetails);
    }
    this.toggleNewAccountModalDisplay();
  };

  render() {
    return (
      <React.Fragment>
        <UserContext.Consumer>
          {contextData => {
            this.userDetail = contextData.user;
            return (
              <PageLayout headers="true" wrapperPadding={true}>
                <Header />
                <h3>Accounts</h3>
                <div className={css["accounts-wrapper"]}>
                  {this.state.account.map(account => {
                    return (
                      <Account
                        account={account}
                        key={account.number}
                        click={this.handleAccountSelection}
                      />
                    );
                  })}
                  <Account
                    account={null}
                    click={this.toggleNewAccountModalDisplay}
                  />
                  <NewAccount
                    showModal={this.state.showAccountOverlay}
                    createNewAccount={this.addNewAccount}
                    close={this.toggleNewAccountModalDisplay}
                  />
                </div>
              </PageLayout>
            );
          }}
        </UserContext.Consumer>
      </React.Fragment>
    );
  }
}
export default AuthGuard(Dashboard);
