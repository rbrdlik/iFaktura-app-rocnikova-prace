import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";

// Import model
import { createContact } from "../../models/contact";

// Import components
import Content from "../../components/Content";
import Input from "../../components/Input";
import Buttons from "../../components/Buttons";

// Import styles
import "../../scss/styles.scss";

// Import alert
import { mixinAlert } from "../../utils/sweetAlerts";

export default function CreateContact() {
  const { user } = useAuth();
  const [formData, setFormData] = useState()

  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Vytvořit kontakt • iFaktura";
  }, []);

  const sendData = async () => {
    const res = await createContact(formData);
    if (res.status === 201) {
      mixinAlert("success", "Kontakt byl vytvořen.");
      return navigate("/contacts");
    }
    if(res.status === 500){
      mixinAlert("error", "Někde nastala chyba.")
    }
  };

  const handleInput = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      user_id: user._id,
    }));
  };

  /**
   * Po kliknutí na button, kontrolujeme zda mají všechny povinné inputy nějakou `value`, pokud ano, zavoláme `sendData()`.
   * Pokud ne, odešleme error alert
   */
  const handleButton = (e) => {
    e.preventDefault();

    const requiredInputs = document.querySelectorAll(
      "input[required], select[required]"
    );
    const emptyFields = Array.from(requiredInputs).filter(
      (input) => !input.value.trim()
    );

    if (emptyFields.length > 0) {
      mixinAlert("error", "Vyplňte všechna povinná pole.");
      return;
    }

    sendData();
  };

  return (
    <>
      <Content
        headtext="Vytvořit kontakt"
        page="Vytvořit kontakt"
        box_width="295"
      >
        <h1 className="input-header-text">Základní údaje</h1>
        <div className="inputs">
          <Input text="Jméno a příjmení / Název firmy" required={true}>
            <input type="text" name="detailsName" onChange={handleInput} required/>
          </Input>
          <Input text="IČO" required={false}>
            <input type="text" name="ico" onChange={handleInput}/>
          </Input>
        </div>

        <div className="inputs">
          <Input text="Ulice a číslo popisné" required={true}>
            <input type="text" name="street" onChange={handleInput} required/>
          </Input>
          <Input text="Město" required={true}>
            <input type="text" name="city" onChange={handleInput} required/>
          </Input>
          <Input text="PSČ" required={true}>
            <input type="text" name="zipCode" onChange={handleInput} required/>
          </Input>
        </div>

        <h1 className="input-header-text">Kontaktní údaje</h1>
        <div className="inputs">
          <Input text="Telefon" required={false}>
            <input type="tel" name="phone" onChange={handleInput} />
          </Input>
          <Input text="Webové stránky" required={false}>
            <input type="text" name="website" onChange={handleInput} />
          </Input>
          <Input text="E-mail" required={true}>
            <input type="email" name="email" onChange={handleInput} required/>
          </Input>
        </div>

        <div className="inputs">
          <Input text="DIČ" required={false}>
            <input type="text" name="dic" onChange={handleInput} />
          </Input>
        </div>

        <div style={{ marginTop: "150px" }}>
          <Buttons>
            <Link to={"/dashboard"}><button id="empty">Zrušit</button></Link>
            <button id="fill" onClick={handleButton}>Vytvořit</button>
          </Buttons>
        </div>
      </Content>
    </>
  );
}
