import css from "./NewTransaction.scss";
import { useState } from "react";

export function NewTransaction(props) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [comment, setComment] = useState("");
  const [btnStatus, setBtnStatus] = useState("enable");

  const display = props.showModal ? "show" : "hide";

  function charCheck(evt) {
    if (evt.which < 48 || evt.which > 57) {
      evt.preventDefault();
    }
  }

  function resetFormFields() {
    setAmount("");
    setType("");
    setComment("");
    var ele = document.getElementsByName("transType");
    for (var i = 0; i < ele.length; i++) ele[i].checked = false;
  }

  function updateBtnStatus(trantype) {
    if (trantype === "Credit") {
      document.getElementById("addTranBtn").disabled = false;
    } else {
      if (parseFloat(amount) > parseFloat(props.balance)) {
        document.getElementById("addTranBtn").disabled = true;
      } else {
        document.getElementById("addTranBtn").disabled = false;
      }
    }
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
        <h3>Add Transaction</h3>
        <div>
          <div className={css["form-name"]}>Amount</div>
          <input
            type="number"
            value={amount}
            onKeyPress={charCheck}
            onChange={e => setAmount(e.target.value)}
            className={css["form-field"]}
          />
          <div className={css["form-name"]}>
            Transaction type
            <input
              type="radio"
              value="Credit"
              name="transType"
              onChange={e => {
                setType(e.target.value);
                //updateBtnStatus(e.target.value);
              }}
            />
            Credit
            <input
              type="radio"
              value="Debit"
              name="transType"
              onChange={e => {
                setType(e.target.value);
                //updateBtnStatus(e.target.value);
              }}
            />
            Debit
          </div>
          <div className={css["form-name"]}>Comment</div>
          <input
            type="text"
            value={comment}
            onChange={e => setComment(e.target.value)}
            className={css["form-field"]}
          />
          <br />
          <button
            id="addTranBtn"
            className={`${css["add-button"]} ${css[btnStatus]}`}
            disabled={
              amount === "" ||
              type === "" ||
              comment === "" ||
              (type === "Debit" &&
                parseFloat(amount) > parseFloat(props.balance))
            }
            onClick={() => {
              props.createNewTransaction(amount, type, comment);
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
