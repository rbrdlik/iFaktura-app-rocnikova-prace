// Import assets
import logo from "../../assets/logo/iFakturaLogoDark.png";

// Import styles
import "../../scss/NotFound.scss";

export default function NotFound() {
  return (
    <>
      <div className="loading">
        <div className="logoBox">
          <img src={logo} alt="logo" className="logo" />
          <div className="spinnerBox">
            <div className="spinner"></div>
          </div>
          <h1 style={{marginTop: "20px"}}>404 - Stránka nenalezena</h1>
          <p>Omlouváme se, ale stránka, kterou hledáte, neexistuje.</p>
        </div>
      </div>
    </>
  );
}
