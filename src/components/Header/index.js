import css from "./Header.scss";
import { useContext } from "react";
import UserContext from "../../contexts/UserContext";
import { auth } from "../../utils/firebase";

export function Header(props) {
  const { user } = useContext(UserContext);
  // Function to handle signOut
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      console.log("signout complete");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <header className={css[props.className]}>
      <div className={css["header-wrapper"]}>
        <div className={css["left-section"]}>
          <div className={css["logo-wrapper"]}>
            <img src="../../static/images/logo.png" />
          </div>
          <div className={css["app-name"]}>WALLET</div>
        </div>
        <div className={css["right-section"]}>
          <div className={css["user-profile-wrapper"]}>
            <div className={css["avathar-wrapper"]}>
              <img src="../../static/images/UserProfile.png" />
            </div>
            <div className={css["dropdownContain"]}>
              <div className={css["dropOut"]}>
                <div className={css["triangle"]}></div>
                <div className={css["userdetail"]}>
                  <div>Hi!</div>
                  {user ? user.split("@")[0] : ""}
                </div>
                <ul>
                  <li onClick={handleSignOut}>Sign Out</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
