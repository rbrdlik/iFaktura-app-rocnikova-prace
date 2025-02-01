import { Link } from "react-router-dom";
import SignInAndUp from "../../components/signInAndUp";

// Import style
import "../../scss/signInAndUp.scss";

export default function SignUp(){
    return(
        <>
            <SignInAndUp>
                <div className="form">
                    <h1>Zaregistrovat se</h1>
                    <form>
                        <div className="input">
                            <h4>Uživatelské jméno</h4>
                            <input type="text" placeholder="Vytvořte si uživatelské jméno"/>
                        </div>
                        <div className="input">
                            <h4>Email</h4>
                            <input type="email" placeholder="Zadejte svůj email"/>
                        </div>
                        <div className="input">
                            <h4>Heslo</h4>
                            <input type="password" placeholder="Zadejte své heslo"/>
                        </div>
                        <div className="input">
                            <h4>Heslo znovu</h4>
                            <input type="password" placeholder="Zadejte své heslo znovi"/>
                        </div>
                        <button>Zaregistrovat se</button>
                    </form> 
                    <p>Již máte účet? <Link to={"/sign-in"}>Přihlásit se</Link></p>
                </div>
            </SignInAndUp>
        </>
    )
}