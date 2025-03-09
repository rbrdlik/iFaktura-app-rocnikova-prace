import { useEffect } from "react";
import { Link } from "react-router-dom";
import SignInAndUp from "../../components/signInAndUp";

// Import style
import "../../scss/signInAndUp.scss";

export default function SignIn(){
      useEffect(() => {
        document.title = "Přihlášení • iFaktura";
      }, []);
    
    return(
        <>
            <SignInAndUp>
                <div className="form">
                    <h1>Přihlásit se</h1>
                    <form>
                        <div className="input">
                            <h4>Email</h4>
                            <input type="email" placeholder="Zadejte svůj email"/>
                        </div>
                        <div className="input">
                            <h4>Heslo</h4>
                            <input type="password" placeholder="Zadejte své heslo"/>
                        </div>
                        <button>Přihlásit se</button>
                    </form> 
                    <p>Ještě nemáte účet? <Link to={"/signUp"}>Zaregistrovat se</Link></p>
                </div>
            </SignInAndUp>
        </>
    )
}