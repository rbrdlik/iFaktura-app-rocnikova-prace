import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";

// Import alerts
import { mixinAlert } from "../../utils/sweetAlerts"

// Import models
import { loginUser } from "../../models/user";

// Import components
import SignInAndUp from "../../components/signInAndUp";

// Import styles
import "../../scss/signInAndUp.scss";

export default function SignIn(){
    const [formData, setFormData] = useState();
    const [info, setInfo] = useState();
    const navigate = useNavigate();
    const { login } = useAuth();

    const sendData = async () => {
        const res = await loginUser(formData);
        if(res.status === 200){
            await login(res.token)
            mixinAlert("success", "Přihlášení proběhlo úspěšně.");
            navigate("/dashboard");
        }
        setInfo(res.message);
    }

    const handleInput = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    const handleButton = (e) => {
        e.preventDefault();
        sendData();
    }

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
                            <input type="email" name="email" placeholder="Zadejte svůj email" required onChange={handleInput}/>
                        </div>
                        <div className="input">
                            <h4>Heslo</h4>
                            <input type="password" name="password" placeholder="Zadejte své heslo" required onChange={handleInput}/>
                        </div>
                        <p style={{marginTop: "-15px", textAlign: "left", color: "red", marginLeft: "10px"}}>{info}</p>
                        <button onClick={handleButton}>Přihlásit se</button>
                    </form> 
                    <p>Ještě nemáte účet? <Link to={"/signUp"}>Zaregistrovat se</Link></p>
                </div>
            </SignInAndUp>
        </>
    )
}