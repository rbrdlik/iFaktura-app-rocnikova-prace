import { useAuth } from "../../context/AuthProvider";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { updateUser } from "../../models/user";

// Import styles
import "../../scss/styles.scss";
import "../../scss/Buttons.scss";

// Import components
import Content from "../../components/Content";

// Import assets
import userImg from "../../assets/images/user.png";
import Camera from "../../assets/icons/Camera.svg";

// Import mixinAlert
import { mixinAlert } from "../../utils/sweetAlerts";

export default function Settings() {
  const { user, fetchUser } = useAuth();

  const sendData = async (updatedData) => {
    console.log(updatedData);
    const res = await updateUser(user._id, updatedData);
    if (res.status === 200) {
      await fetchUser();
      mixinAlert("success", "Vaše údaje byly uloženy.");
    }
  };

  /**
 * Funkce pro změnu jména nebo příjmení uživatele.
 * Zobrazí modální okno, kde uživatel zadá nové jméno nebo příjmení. Funkce následně zkontroluje vstup a pokud je platný, pošle data na server.
   */
  const handleNameChange = async (e) => {
    const text = e.target.name === "first_name" ? "jméno" : "příjmení";

    const { value: input } = await Swal.fire({
      title: `Zadejte své nové ${text}`,
      confirmButtonText: "Potvrdit",
      color: "black",
      confirmButtonColor: "#28a745",
      input: "text",
      showCancelButton: true,
      cancelButtonText: "Zrušit",
      cancelButtonColor: "#dc3545",
      inputValidator: (value) => {
        if (!value) {
          return "Textové pole je prázdné.";
        }
      },
    });
    if (input) {
      const updatedData = { [e.target.name]: input };
      await sendData(updatedData);
    }
  };

  /**
   * Tato funkce bere informace o tom kdy si uživatel založil účet. V databázi je to uloženo ve formátu `2025-03-14T21:23:44.405Z`
   * Tato funkce převádí tento formát datumu na český datum a vrací ho zpět překonvertovaný
   */
  const convertDate = () => {
    const date = new Date(user.createdAt);
    return date.toLocaleString("cs-CZ");
  }

  useEffect(() => {
    document.title = "Nastavení • iFaktura";
  }, []);

  return (
    <Content headtext="Nastavení" page="Nastavení" box_width="210">
      <div className="myAccount">
        <h1>Můj účet</h1>
        <div className="myAccountBox">
          <div className="myAccountImageBox" title="Nahrát profilový obrázek">
            <img src={userImg} alt="" id="img" />
            <img src={Camera} alt="" id="circleSmallImage" />
          </div>
          <div className="myAccountBoxText">
            <h2>
              {user.first_name} {user.last_name}
            </h2>
            <p>{user.email}</p>
            <p>Účet vytvořen: <b>{convertDate()}</b></p>
          </div>
        </div>
      </div>
      <div className="accSettings">
        <h1>Nastavení účtu</h1>
        <div className="accSettingsBox">
          <div className="accSetting">
            <div className="leftSide">
              <h2>Křestní jméno</h2>
              <p>{user.first_name}</p>
            </div>
            <div className="rightSide">
              <button
                id="empty"
                className="btn"
                name="first_name"
                onClick={handleNameChange}
              >
                Změnit jméno
              </button>
            </div>
          </div>
          <div className="accSetting">
            <div className="leftSide">
              <h2>Příjmení</h2>
              <p>{user.last_name}</p>
            </div>
            <div className="rightSide">
              <button
                id="empty"
                className="btn"
                name="last_name"
                onClick={handleNameChange}
              >
                Změnit příjmení
              </button>
            </div>
          </div>
          <div className="accSetting">
            <div className="leftSide">
              <h2>E-Mail</h2>
              <p>{user.email}</p>
            </div>
            <div className="rightSide">
              <button id="empty" className="btn">
                Změnit email
              </button>
            </div>
          </div>
          <div className="accSetting">
            <div className="leftSide">
              <h2>Heslo</h2>
              <p>**********</p>
            </div>
            <div className="rightSide">
              <button id="empty" className="btn">
                Změnit heslo
              </button>
            </div>
          </div>
        </div>
      </div>
      <button className="btn" id="red">
        Smazat účet
      </button>
    </Content>
  );
}
