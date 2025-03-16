import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

// Import components
import Content from "../../components/Content";
import Input from "../../components/Input";
import Buttons from "../../components/Buttons";
import ImageUpload from "../../components/ImageUpload";

// Import model
import { updateUser } from "../../models/user";

// Import styles
import "../../scss/styles.scss";

// Import alert
import { mixinAlert } from "../../utils/sweetAlerts";

export default function UpdateDetails() {
  const [image, setImage] = useState(null);
  const { user, fetchUser } = useAuth();
  const [selectOption, setSelectOption] = useState(user.dph);
  const [isChecked, setIsChecked] = useState(!user.hasIco);

  const [formData, setFormData] = useState();

  const sendData = async () => {
    console.log(formData)
    const res = await updateUser(user._id, formData);
    if (res.status === 200) {
      await fetchUser();
      mixinAlert("success", "Vaše údaje byly uloženy.");
    }
  };

  const handleCheckboxChange = (e) => {
    const newChecked = e.target.checked;
    setIsChecked(newChecked);

    setFormData(prev => ({
      ...prev,
      hasIco: !newChecked
    }))
  };

  const handleSelectChange = (e) => {
    const newOption = e.target.value;
    setSelectOption(newOption);

    setFormData(prev => ({
      ...prev,
      dph: newOption
    }))
  };

  const handleInput = (e) => {
    setFormData(prev => ({
      ...prev, 
      [e.target.name]: e.target.value
    }))
  };

  const handleButton = (e) => {
    e.preventDefault();

    const requiredInputs = document.querySelectorAll("input[required]");
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

  return (
    <>
      <Content headtext="Moje údaje" page="Moje údaje" box_width="225">
        <h1 className="input-header-text">Základní údaje</h1>
        <div className="inputs">
          <Input text="Jméno a příjmení / Název firmy" required={true}>
            <input
              type="text"
              name="detailsName"
              required
              onChange={handleInput}
              defaultValue={user.detailsName}
            />
          </Input>
          <Input text="IČO" required={false}>
            {isChecked ? (
              <input type="text" disabled />
            ) : (
              <input
                type="text"
                name="ico"
                required
                onChange={handleInput}
                defaultValue={user.ico}
              />
            )}
            <div className="switch-text">
              <label class="switch">
                {isChecked ? <input type="checkbox" onChange={handleCheckboxChange} defaultChecked/> : <input type="checkbox" onChange={handleCheckboxChange} />}
                <span class="slider round"></span>
              </label>
              <p>Nemám IČO</p>
            </div>
          </Input>
        </div>
        <div className="inputs">
          <Input text="Ulice a číslo popisné" required={true}>
            <input
              type="text"
              name="street"
              required
              onChange={handleInput}
              defaultValue={user.street}
            />
          </Input>
          <Input text="Město" required={true}>
            <input
              type="text"
              name="city"
              required
              onChange={handleInput}
              defaultValue={user.city}
            />
          </Input>
          <Input text="PSČ" required={true}>
            <input
              type="text"
              name="zipCode"
              required
              onChange={handleInput}
              defaultValue={user.zipCode}
            />
          </Input>
        </div>

        <h1 className="input-header-text">Kontaktní údaje</h1>
        <div className="inputs">
          <Input text="Telefon" required={false}>
            <input
              type="text"
              name="phone"
              required
              onChange={handleInput}
              defaultValue={user.phone}
            />
          </Input>
          <Input text="Webové stránky" required={false}>
            <input
              type="text"
              name="website"
              required
              onChange={handleInput}
              defaultValue={user.website}
            />
          </Input>
          <Input text="E-mail" required={true}>
            <div className="email-input">
              <h3>{user.email}</h3>
              <Link to={"/settings"}><button>Změnit email</button></Link>
            </div>
          </Input>
        </div>

        <h1 className="input-header-text">Daňové údaje</h1>
        <div className="inputs">
          <Input text="DPH" required={true}>
            <div className="select-container">
              <select onChange={handleSelectChange} defaultValue={user.dph}>
                <option>Neplátce DPH</option>
                <option>Plátce DPH</option>
              </select>
            </div>
          </Input>
          {selectOption === "Plátce DPH" ? (
            <Input text="DIČ" required={false}>
              <input
                type="text"
                name="dic"
                onChange={handleInput}
                defaultValue={user.dic}
              />
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
          <Link to={"/dashboard"}>
            <button id="empty">Zrušit</button>
          </Link>
          <button id="fill" onClick={handleButton}>
            Upravit
          </button>
        </Buttons>
      </Content>
    </>
  );
}
