import { useEffect } from "react";
import { Link } from "react-router-dom";
import SignInAndUp from "../../components/signInAndUp";

// Import style
import "../../scss/signInAndUp.scss";

export default function SignUp(){
      useEffect(() => {
        document.title = "Registrace • iFaktura";
      }, []);
    
    return(
        <>
            <SignInAndUp>
                <div className="form">
                    <h1>Zaregistrovat se</h1>
                    <form>
                        <div className="input">
                            <h4>Jméno</h4>
                            <input type="text" placeholder="Zadejte své jméno"/>
                        </div>
                        <div className="input">
                            <h4>Příjmení</h4>
                            <input type="text" placeholder="Zadejte své příjmení"/>
                        </div>
                        <div className="input">
                            <h4>Email</h4>
                            <input type="email" placeholder="Zadejte svůj email"/>
                        </div>
                        <div className="input">
                            <h4>Heslo</h4>
                            <input type="password" placeholder="Zadejte své heslo"/>
                        </div>
                        <p style={{marginTop: "-15px", textAlign: "left", color: "red", marginLeft: "10px"}}>..</p>
                        <button>Zaregistrovat se</button>
                    </form> 
                    <p>Již máte účet? <Link to={"/signIn"}>Přihlásit se</Link></p>
                </div>
            </SignInAndUp>
        </>
    )
}