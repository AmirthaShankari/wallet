import css from "./NewAccount.scss";
import { useState, useContext } from "react";

export function NewAccount(props) {
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [balance, setBalance] = useState("");

  const display = props.showModal ? "show" : "hide";

  function charCheck(evt) {
    if (evt.which < 48 || evt.which > 57) {
      evt.preventDefault();
    }
  }

  function resetFormFields() {
    setAccountName("");
    setAccountNumber("");
    setBalance("");
  }

  return (
    <div className={`${css["overlay"]} ${css[display]}`}>
      <div className={css["form-wrapper"]}>
        <div
          className={css["close-button"]}
          onClick={() => {
            props.close();
          }}
        >
          X
        </div>
        <h3>New Account</h3>
        <div>
          <div className={css["form-name"]}>Account Name</div>
          <input
            type="text"
            value={accountName}
            onChange={e => setAccountName(e.target.value)}
            className={css["form-field"]}
          />
          <div className={css["form-name"]}>Account Number</div>
          <input
            type="number"
            value={accountNumber}
            onChange={e => setAccountNumber(e.target.value)}
            onKeyPress={charCheck}
            className={css["form-field"]}
          />
          <div className={css["form-name"]}>Balance</div>
          <input
            type="number"
            value={balance}
            onChange={e => setBalance(e.target.value)}
            onKeyPress={charCheck}
            className={css["form-field"]}
          />
          <br />
          <button
            className={css["add-button"]}
            onClick={() => {
              props.createNewAccount(accountName, accountNumber, balance);
              resetFormFields();
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
