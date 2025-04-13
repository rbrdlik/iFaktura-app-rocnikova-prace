import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

// Import models
import { registerUser } from "../../models/user";

// Import components
import SignInAndUp from "../../components/signInAndUp";

// Import alert
import { mixinAlert } from "../../utils/sweetAlerts";

// Import styles
import "../../scss/signInAndUp.scss";

export default function SignUp() {
  const [formData, setFormData] = useState();
  const [info, setInfo] = useState();
  const navigate = useNavigate();
  const { login } = useAuth();

  const sendData = async () => {
    const res = await registerUser(formData);
    if (res.status === 201) {
      login(res.token);
      mixinAlert("success", "Úspěšně registrován. Nyní se prosím přihlašte.");
      return navigate("/details");
    }
    setInfo(res.message);
  };

  const handleInput = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleButton = (e) => {
    e.preventDefault();
    sendData();
  };

  useEffect(() => {
    document.title = "Registrace • iFaktura";
  }, []);

  return (
    <>
      <SignInAndUp>
        <div className="form">
          <h1>Zaregistrovat se</h1>
          <form>
            <div className="input">
              <h4>Jméno</h4>
              <input
                type="text"
                name="first_name"
                placeholder="Zadejte své jméno"
                required
                onChange={handleInput}
              />
            </div>
            <div className="input">
              <h4>Příjmení</h4>
              <input
                type="text"
                name="last_name"
                placeholder="Zadejte své příjmení"
                required
                onChange={handleInput}
              />
            </div>
            <div className="input">
              <h4>Email</h4>
              <input
                type="email"
                name="email"
                placeholder="Zadejte svůj email"
                required
                onChange={handleInput}
              />
            </div>
            <div className="input">
              <h4>Heslo</h4>
              <input
                type="password"
                name="password"
                placeholder="Zadejte své heslo"
                required
                onChange={handleInput}
              />
            </div>
            <p
              style={{
                marginTop: "-15px",
                textAlign: "left",
                color: "red",
                marginLeft: "10px",
              }}
            >
              {info}
            </p>
            <button onClick={handleButton}>Zaregistrovat se</button>
          </form>
          <p>
            Již máte účet? <Link to={"/signIn"}>Přihlásit se</Link>
          </p>
        </div>
      </SignInAndUp>
    </>
  );
}
