import css from "./Transaction.scss";
import { formatCurrency } from "../../utils/CurrencyFormatter";

export function Transaction(props) {
  if (props.transc) {
    let time = new Date(props.transc.time).toLocaleString("en-IN");
    return (
      <div className={css["transc-wrapper"]}>
        <div className={`${css["transc-time"]} ${css["numeric"]}`}>
          {time.toUpperCase()}
        </div>
        <div className={css["transc-comment"]}>{props.transc.comment}</div>
        <div className={`${css["transc-amount"]} ${css["numeric"]}`}>
          {formatCurrency(props.transc.amount)}
        </div>
        <div className={css["transc-type"]}>{props.transc.type}</div>
      </div>
    );
  } else {
    return (
      <div className={`${css["header"]}`}>
        <div className={css["transc-time"]}>Transaction Time</div>
        <div className={css["transc-comment"]}>Comment</div>
        <div className={css["transc-amount"]}>Amount</div>
        <div className={css["transc-type"]}>Type</div>
      </div>
    );
  }
}
