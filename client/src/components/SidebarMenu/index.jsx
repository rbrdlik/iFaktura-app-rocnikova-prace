import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import Swal from "sweetalert2";

// Import assets
import logoWhite from "../../assets/logo/iFakturaLogoWhite.png";
import FileIcon from "../../assets/icons/File.svg";
import LogoutIcon from "../../assets/icons/Logout.svg";
import PlusIcon from "../../assets/icons/Plus.svg";
import ProductIcon from "../../assets/icons/Products.svg";
import SettingsIcon from "../../assets/icons/Settings.svg";
import UserIcon from "../../assets/icons/User.svg";
import UserGroupIcon from "../../assets/icons/UserGroup.svg";
import HouseIcon from "../../assets/icons/House.svg";

import UserPfpImg from "../../assets/images/user.png";

// Import alert
import { mixinAlert } from "../../utils/sweetAlerts";

// Import style
import "../../scss/SidebarMenu.scss";
import "../../scss/styles.scss";

export default function SidebarMenu({ active_page }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  /**
   * Nejprve se zeptá uživatele pomocí SweetAlert zda chce být odhlášen.
   * Pokud ano, zavoláme funkci `logout()` z `AuthProvideru`.
   */
  const logoutConfirm = () => {
    const Alert = Swal.mixin({
      buttonsStyling: true,
    });
    Alert.fire({
      title: "Opravdu se chcete odhlásit?",
      showCancelButton: true,
      confirmButtonText: "Ano, odhlásit se",
      color: "black",
      confirmButtonColor: "#28a745",
      cancelButtonText: "Zůstat přihlášen",
      cancelButtonColor: "#dc3545",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/signIn");
        mixinAlert("info", "Byl(a) jste odhlášen(a).");
      }
    });
  };

  return (
    <>
      <section className="sidebar">
        <div className="sidebar-logo">
          <img src={logoWhite} alt="" />
        </div>
        <nav className="sidebar-navbar">
          <ul id="topBtn">
            <Link to={"/dashboard"}>
              <li className={active_page === "Přehled" ? "active-li" : ""}>
                <img src={HouseIcon} alt="" className="icon" />
                Přehled
              </li>
            </Link>
          </ul>
          <div className="sidebar-nav" id="top">
            <h3>Faktury</h3>
            <ul>
              <Link to={"/createInvoice"}>
                <li
                  className={active_page === "Vydat fakturu" ? "active-li" : ""}
                >
                  <img src={PlusIcon} alt="" className="icon" />
                  Vydat fakturu
                </li>
              </Link>
              <Link to={"/invoices"}>
                <li
                  className={
                    active_page === "Vydané faktury" ? "active-li" : ""
                  }
                >
                  <img src={FileIcon} alt="" className="icon" />
                  Vydané faktury
                </li>
              </Link>
            </ul>
          </div>
          <div className="sidebar-nav">
            <h3>Kontakty</h3>
            <ul>
              <Link to={"/createContact"}>
                <li
                  className={
                    active_page === "Vytvořit kontakt" ? "active-li" : ""
                  }
                >
                  <img src={PlusIcon} alt="" className="icon" />
                  Vytvořit kontakt
                </li>
              </Link>
              <Link to={"/contacts"}>
                <li
                  className={
                    active_page === "Seznam kontaktů" ? "active-li" : ""
                  }
                >
                  <img src={UserGroupIcon} alt="" className="icon" />
                  Seznam kontaktů
                </li>
              </Link>
            </ul>
          </div>
          <div className="sidebar-nav">
            <h3>Položky</h3>
            <ul>
              <Link to={"/createProduct"}>
                <li
                  className={
                    active_page === "Vytvořit položku" ? "active-li" : ""
                  }
                >
                  <img src={PlusIcon} alt="" className="icon" />
                  Vytvořit položku
                </li>
              </Link>
              <Link to={"/products"}>
                <li
                  className={
                    active_page === "Seznam položek" ? "active-li" : ""
                  }
                >
                  <img src={ProductIcon} alt="" className="icon" />
                  Seznam položek
                </li>
              </Link>
            </ul>
          </div>
          <div className="sidebar-nav">
            <h3>Moje údaje</h3>
            <ul>
              <Link to={"/details"}>
                <li className={active_page === "Moje údaje" ? "active-li" : ""}>
                  <img src={UserIcon} alt="" className="icon" />
                  Moje údaje
                </li>
              </Link>
            </ul>
          </div>
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-user-content">
            <img src={user.profilePicture ? `/uploads/${user.profilePicture}` : UserPfpImg} alt="" id="su-img" />
            <div className="sidebar-user-text">
              <p>
                <b>
                  {user.first_name} {user.last_name}
                </b>
              </p>
              <p className="username">{user.email}</p>
            </div>
            <div className="sidebar-user-btn">
              <Link to={"/settings"}>
                <img
                  src={SettingsIcon}
                  alt=""
                  className={
                    active_page === "Nastavení"
                      ? "action-btn active-settings"
                      : "action-btn"
                  }
                  id="settings"
                />
              </Link>
              <Link>
                <img
                  src={LogoutIcon}
                  alt=""
                  className="action-btn"
                  onClick={logoutConfirm}
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
