import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

// Import components
import Content from "../../components/Content";
import Input from "../../components/Input";
import Buttons from "../../components/Buttons";
import NotFound from "../../components/NotFound";
import LoadingPage from "../../components/LoadingPage";

// Import styles
import "../../scss/styles.scss";

// Import models
import { getContactById, updateContact } from "../../models/contact";

// Import alert
import { mixinAlert } from "../../utils/sweetAlerts";

export default function UpdateContact() {
  const { id } = useParams();
  const [contact, setContact] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const data = await getContactById(id);
      if (data.status === 500 || data.status === 404) return setIsLoading(null);
      if (data.status === 200) {
        setContact(data.payload);
        setFormData({
          ...data.payload,
        });
        setIsLoading(false);
      }
    };
    load();
    document.title = "Upravit kontakt • iFaktura";
  }, []);

  const sendData = async () => {
    const res = await updateContact(id, formData);
    if (res.status === 200) {
      mixinAlert("success", "Změny byly uloženy.");
      return navigate(`/contact/${res.payload._id}`);
    }
    if (res.status === 500) {
      mixinAlert("error", "Někde nastala chyba.");
    }
  };

  const handleInput = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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

  if (isLoading === null) {
    return <NotFound />;
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <>
      <Content
        headtext="Upravit kontakt"
        page="Seznam kontaktů"
        box_width="295"
      >
        <h1 className="input-header-text">Základní údaje</h1>
        <div className="inputs">
          <Input text="Jméno a příjmení / Název firmy" required={true}>
            <input type="text" name="detailsName" onChange={handleInput} defaultValue={contact.detailsName} required/>
          </Input>
          <Input text="IČO" required={false}>
            <input type="text" name="ico" onChange={handleInput} defaultValue={contact.ico}/>
          </Input>
        </div>

        <div className="inputs">
          <Input text="Ulice a číslo popisné" required={true}>
            <input type="text" name="street" onChange={handleInput} defaultValue={contact.street} required/>
          </Input>
          <Input text="Město" required={true}>
            <input type="text" name="city" onChange={handleInput} defaultValue={contact.city} required/>
          </Input>
          <Input text="PSČ" required={true}>
            <input type="text" name="zipCode" onChange={handleInput} defaultValue={contact.zipCode} required/>
          </Input>
        </div>

        <h1 className="input-header-text">Kontaktní údaje</h1>
        <div className="inputs">
          <Input text="Telefon" required={false}>
            <input type="text" name="phone" onChange={handleInput} defaultValue={contact.phone} />
          </Input>
          <Input text="Webové stránky" required={false}>
            <input type="text" name="website" onChange={handleInput} defaultValue={contact.website} />
          </Input>
          <Input text="E-mail" required={true}>
            <input type="text" name="email" onChange={handleInput} defaultValue={contact.email} required/>
          </Input>
        </div>

        <div className="inputs">
          <Input text="DIČ" required={false}>
            <input type="text" name="dic" onChange={handleInput} defaultValue={contact.dic} />
          </Input>
        </div>

        <div style={{ marginTop: "150px" }}>
          <Buttons>
            <Link to={"/contacts"}><button id="empty">Zrušit</button></Link>
            <button id="fill" onClick={handleButton}>Upravit</button>
          </Buttons>
        </div>
      </Content>
    </>
  );
}
