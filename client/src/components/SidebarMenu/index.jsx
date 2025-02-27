import { Link } from "react-router-dom";


// Import assets
import logoWhite from "../../assets/logo/iFakturaLogoWhite.png";
import FileIcon from "../../assets/icons/File.svg"
import LogoutIcon from "../../assets/icons/Logout.svg"
import PlusIcon from "../../assets/icons/Plus.svg"
import ProductIcon from "../../assets/icons/Products.svg"
import SettingsIcon from "../../assets/icons/Settings.svg"
import UserIcon from "../../assets/icons/User.svg"
import UserGroupIcon from "../../assets/icons/UserGroup.svg"
import HouseIcon from "../../assets/icons/House.svg"

import UserPfpImg from "../../assets/images/user.png"

// Import style
import "../../scss/SidebarMenu.scss";
import "../../scss/styles.scss"

export default function SidebarMenu({active_page}){
    return(
        <>
            <section className="sidebar">
                <div className="sidebar-logo">
                    <img src={logoWhite} alt="" />
                </div>
                <nav className="sidebar-navbar">
                    <ul id="topBtn">
                        <Link to={"/dashboard"}><li className={active_page === "Přehled" ? "active-li" : ""}><img src={HouseIcon} alt="" className="icon"/>Přehled</li></Link>
                    </ul>
                    <div className="sidebar-nav" id="top">
                        <h3>Faktury</h3>
                        <ul>
                            <Link to={"#"}><li className={active_page === "Vytvořit fakturu" ? "active-li" : ""}><img src={PlusIcon} alt="" className="icon"/>Vytvořit fakturu</li></Link>
                            <Link to={"#"}><li className={active_page === "Vydané faktury" ? "active-li" : ""}><img src={FileIcon} alt="" className="icon"/>Vydané faktury</li></Link>
                        </ul>
                    </div>
                    <div className="sidebar-nav">
                        <h3>Kontakty</h3>
                        <ul>
                            <Link to={"#"}><li className={active_page === "Vytvořit kontakt" ? "active-li" : ""}><img src={PlusIcon} alt="" className="icon"/>Vytvořit kontakt</li></Link>
                            <Link to={"#"}><li className={active_page === "Seznam kontaktů" ? "active-li" : ""}><img src={UserGroupIcon} alt="" className="icon"/>Seznam kontaktů</li></Link>
                        </ul>
                    </div>
                    <div className="sidebar-nav">
                        <h3>Produkty</h3>
                        <ul>
                            <Link to={"#"}><li className={active_page === "Vytvořit produkt" ? "active-li" : ""}><img src={PlusIcon} alt="" className="icon"/>Vytvořit produkt</li></Link>
                            <Link to={"#"}><li className={active_page === "Seznam produktů" ? "active-li" : ""}><img src={ProductIcon} alt="" className="icon"/>Seznam produktů</li></Link>
                        </ul>
                    </div>
                    <div className="sidebar-nav">
                        <h3>Moje údaje</h3>
                        <ul>
                            <Link to={"/details"}><li className={active_page === "Moje údaje" ? "active-li" : ""}><img src={UserIcon} alt="" className="icon"/>Moje údaje</li></Link>
                        </ul>
                    </div>
                </nav>
                <div className="sidebar-user">
                    <div className="sidebar-user-content">
                        <img src={UserPfpImg} alt="" id="su-img"/>
                        <div className="sidebar-user-text">
                            <p><b>Profil:</b></p>
                            <p className="username">@Username</p>
                        </div>
                        <div className="sidebar-user-btn">
                            <Link to={"#"}><img src={SettingsIcon} alt="" className="action-btn" id="settings"/></Link>
                            <Link to={"#"}><img src={LogoutIcon} alt="" className="action-btn"/></Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}