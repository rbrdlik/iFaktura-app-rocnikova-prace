import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

// Import model
import { updateUser } from "../../models/user";

// Import components
import Content from "../../components/Content";
import Input from "../../components/Input";
import Buttons from "../../components/Buttons";
import ImageUpload from "../../components/ImageUpload";
import LoadingPage from "../../components/LoadingPage";

// Import styles
import "../../scss/styles.scss";

// Import alert
import { mixinAlert } from "../../utils/sweetAlerts";

export default function CreateDetails() {
  const [image, setImage] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [selectOption, setSelectOption] = useState("Neplátce DPH");
  const { user, fetchUser } = useAuth();

  const [formData, setFormData] = useState();
  const navigate = useNavigate();

  /**
   * Odešleme upravená formData a po úspěšném uložení přesměrujeme uživatele na `/dashboard`
   */
  const sendData = async () => {
    const res = await updateUser(user._id, formData);
    if (res.status === 200) {
      await fetchUser();
      mixinAlert("success", "Vaše údaje byly uloženy.");
      return navigate("/dashboard");
    }
    if(res.status === 500){
      mixinAlert("error", "Špatně zadané informace.")
    }
  };

  /**
   * Aktualizuje stav podle checkboxu
   */
  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
    setFormData((prev) => ({
      ...prev,
      hasIco: !e.target.checked,
    }));
  };

  /**
   * Aktualizuje stav podle selectu
   */
  const handleSelectChange = (e) => {
    setSelectOption(e.target.value);
    setFormData((prev) => ({
      ...prev,
      dph: e.target.value,
    }));
  };

  /**
   * Aktualizuje `formData` při změně inputu
   */
  const handleInput = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /**
   * Po kliknutí na button zavoláme funkci `sendData()`
   */
  const handleButton = (e) => {
    e.preventDefault();

    // Najdeme všechny inputy, které mají atribut "required" a zkontrolujeme, jestli jsou všechny vyplněné
    const requiredInputs = document.querySelectorAll("input[required], select[required]");
    const emptyFields = Array.from(requiredInputs).filter(
      (input) => !input.value.trim()
    );

    if (emptyFields.length > 0) {
      mixinAlert("error", "Vyplňte všechna povinná pole.");
      return;
    }

    sendData();
  };

  useEffect(() => {
    document.title = "Moje údaje • iFaktura";
  }, []);

  if (!user) {
    return <LoadingPage />;
  }

  return (
    <>
      <Content
        headtext="Nastavte si své údaje"
        page="Moje údaje"
        box_width="350"
        sidebarMenu={false}
      >
        <h1 className="input-header-text">Základní údaje</h1>
        <div className="inputs">
          <Input text="Jméno a příjmení / Název firmy" required={true}>
            <input
              type="text"
              name="detailsName"
              required
              onChange={handleInput}
            />
          </Input>
          <Input text="IČO" required={isChecked ? false : true}>
            {isChecked ? (
              <input type="text" disabled />
            ) : (
              <input type="text" name="ico" required onChange={handleInput} />
            )}
            <div className="switch-text">
              <label class="switch">
                <input type="checkbox" onChange={handleCheckboxChange} />
                <span class="slider round"></span>
              </label>
              <p>Nemám IČO</p>
            </div>
          </Input>
        </div>

        <div className="inputs">
          <Input text="Ulice a číslo popisné" required={true}>
            <input type="text" name="street" required onChange={handleInput} />
          </Input>
          <Input text="Město" required={true}>
            <input type="text" name="city" required onChange={handleInput} />
          </Input>
          <Input text="PSČ" required={true}>
            <input type="text" name="zipCode" required onChange={handleInput} />
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
        </div>

        <h1 className="input-header-text">Platební údaje</h1>
        <div className="inputs">
          <Input text="Číslo bankovního účtu" required={false}>
            <input type="text" name="accountNumber" onChange={handleInput} />
          </Input>
          <Input text="IBAN" required={false}>
            <input type="text" name="iban" onChange={handleInput} />
          </Input>
          <Input text="SWIFT" required={false}>
            <input type="text" name="swift" onChange={handleInput} />
          </Input>
        </div>

        <h1 className="input-header-text">Daňové údaje</h1>
        <div className="inputs">
          <Input text="DPH" required={true}>
            <div className="select-container">
              <select onChange={handleSelectChange}>
                <option>Neplátce DPH</option>
                <option>Plátce DPH</option>
              </select>
            </div>
          </Input>
          {selectOption === "Plátce DPH" ? (
            <Input text="DIČ" required={true}>
              <input type="text" name="dic" required onChange={handleInput}/>
            </Input>
          ) : (
            ""
          )}
        </div>

        <h1 id="header-text2">Personalizace faktury</h1>
        <div className="input-img-content-box">
          <ImageUpload
            header={"Logo na faktuře"}
            imgSize={"200x200"}
            imgId={"1"}
            setImage={setImage}
          />
        </div>

        <Buttons>
          <button id="fill" onClick={handleButton}>
            Uložit
          </button>
        </Buttons>
      </Content>
    </>
  );
}
