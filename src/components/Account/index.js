import css from "./Account.scss";
import { formatCurrency } from "../../utils/CurrencyFormatter";

export function Account(props) {
  if (props.account) {
    return (
      <div
        className={css["account-box-wrapper"]}
        onClick={() => {
          props.click(props.account);
        }}
      >
        <div className={css["account-name"]}>{props.account.name}</div>
        <div className={css["account-balance"]}>
          {formatCurrency(props.account.balance)}
        </div>
        <div className={css["account-number"]}>
          Account Number:
          <span>{props.account.number}</span>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={css["account-add-wrapper"]}
        onClick={() => {
          props.click(props.account);
        }}
      >
        <div className={css["add-img-wrapper"]}>
          <img src="../../../static/images/add.png" />
        </div>
      </div>
    );
  }
}
