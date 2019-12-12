import React from "react";
import Router from "next/router";
import AuthGuard from "../../src/utils/AuthGuard/index";
import { Header } from "../../src/components/Header";
import { PageLayout } from "../../src/layouts/PageLayout/PageLayout";
import { AppConstants } from "../../src/constants/AppConstants";
import UserContext from "../../src/contexts/UserContext";
import { db } from "../../src/utils/firebase";
import { Transaction } from "../../src/components/Transaction";
import css from "./AccDetail.scss";
import { formatCurrency } from "../../src/utils/CurrencyFormatter";
import { NewTransaction } from "../../src/components/NewTransaction";

class AccDetail extends React.Component {
  userDetail;
  accNumber;
  walletDetails;
  walletId;

  constructor(props) {
    super(props);

    this.state = {
      accountDetails: null,
      showTransOverlay: false
    };
  }

  static async getInitialProps({ req }) {
    return {};
  }
  async componentDidMount() {
    const { accountId } = Router.query;
    console.log("accid", accountId);
    this.accNumber = accountId;
    var databaseRef = db.ref(AppConstants.FIREBASE_DB_REF.WALLET);
    databaseRef.on("value", this.fetchAccTransactionDetails, function(error) {
      console.log("Error: " + error.code);
    });
  }

  async componentWillUnmount() {
    var databaseRef = db.ref(AppConstants.FIREBASE_DB_REF.WALLET);
    databaseRef.off("value");
  }

  fetchAccTransactionDetails = snapshot => {
    let snapshotValue = snapshot.val();
    for (var prop in snapshotValue) {
      if (
        Object.prototype.hasOwnProperty.call(snapshotValue, prop) &&
        snapshotValue[prop].user === this.userDetail
      ) {
        this.walletDetails = snapshotValue[prop];
        this.walletId = prop;
        let accountDetails = this.walletDetails.account.find(account => {
          return account.number === this.accNumber;
        });
        console.log(accountDetails);
        if (!accountDetails.hasOwnProperty("transactions")) {
          accountDetails["transactions"] = [];
        }
        this.setState({ accountDetails: accountDetails });
      }
    }
  };

  /**
   * Function to toggle the add transaction form display.
   */
  toggleNewTransModalDisplay = () => {
    console.log("Open new Trans modal");
    this.setState(prevState => {
      return {
        showTransOverlay: !prevState.showTransOverlay
      };
    });
  };

  addNewtransaction = (amount, type, comment) => {
    let newTran = {
      id: new Date().getTime(),
      amount: amount,
      type: type,
      comment: comment,
      time: new Date().toISOString()
    };
    let accIndex = this.walletDetails.account.findIndex(account => {
      return account.number === this.accNumber;
    });

    type === "Credit"
      ? (this.walletDetails.account[accIndex].balance =
          parseFloat(this.walletDetails.account[accIndex].balance) +
          parseFloat(amount))
      : (this.walletDetails.account[accIndex].balance =
          parseFloat(this.walletDetails.account[accIndex].balance) - amount);

    if (this.walletDetails.account[accIndex].hasOwnProperty("transactions")) {
      this.walletDetails.account[accIndex].transactions = [newTran].concat(
        this.walletDetails.account[accIndex].transactions
      );
    } else {
      this.walletDetails.account[accIndex]["transactions"] = [newTran];
    }

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
    this.toggleNewTransModalDisplay();
  };

  render() {
    let content;
    if (
      this.state.accountDetails &&
      this.state.accountDetails.transactions.length > 0
    ) {
      content = this.state.accountDetails.transactions.map(transaction => {
        return <Transaction key={transaction.id} transc={transaction} />;
      });
    }
    return (
      <React.Fragment>
        <UserContext.Consumer>
          {contextData => {
            this.userDetail = contextData.user;
            return (
              <PageLayout headers="true" wrapperPadding={true}>
                <Header />
                {this.state.accountDetails && (
                  <div>
                    <h3>{`${this.state.accountDetails.name} Transaction Details`}</h3>
                    <div className={css["acct-transc-wrapper"]}>
                      <div
                        className={css["add-btn"]}
                        onClick={this.toggleNewTransModalDisplay}
                      >
                        <img src="../../static/images/add.png" />
                      </div>
                      <div className={css["curr-bal"]}>
                        {formatCurrency(this.state.accountDetails.balance)}
                      </div>
                    </div>

                    {this.state.accountDetails.transactions.length === 0 && (
                      <div>No transactions available</div>
                    )}
                    {this.state.accountDetails.transactions.length > 0 && (
                      <div>
                        <Transaction transc={null} />
                        {content}
                      </div>
                    )}
                    <NewTransaction
                      showModal={this.state.showTransOverlay}
                      balance={this.state.accountDetails.balance}
                      createNewTransaction={this.addNewtransaction}
                      close={this.toggleNewTransModalDisplay}
                    />
                  </div>
                )}
              </PageLayout>
            );
          }}
        </UserContext.Consumer>
      </React.Fragment>
    );
  }
}
export default AuthGuard(AccDetail);
