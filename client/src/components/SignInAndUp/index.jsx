// Import assets
import image from "../../assets/images/LoginRegisterImage.png"
import logoDark from "../../assets/logo/iFakturaLogoDark.png";

// Import style
import "../../scss/signInAndUp.scss";

export default function SignInAndUp({children}){
    return(
        <>
            <section>
                <img src={image} className="side-img" alt="register" />
                <div className="side-bar">
                    <div className="logo-box">
                        <img src={logoDark} className="logo" alt="logoDark" />
                    </div>
                    <div className="form-box">
                        {children}
                    </div>
                </div>
            </section>
        </>
    )
}