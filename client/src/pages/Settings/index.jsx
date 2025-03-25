import { useAuth } from "../../context/AuthProvider";
import { useEffect } from "react";
import Swal from "sweetalert2";
import bcrypt from "bcryptjs";

import { updateUser, verifyUserPassword, deleteUser } from "../../models/user";

// Import styles
import "../../scss/styles.scss";
import "../../scss/Buttons.scss";

// Import components
import Content from "../../components/Content";

// Import assets
import userImg from "../../assets/images/user.png";
import Camera from "../../assets/icons/Camera.svg";

// Import alert
import { mixinAlert } from "../../utils/sweetAlerts";

export default function Settings() {
  const { user, fetchUser, logout } = useAuth();

  const sendData = async (updatedData) => {
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

    const { value } = await Swal.fire({
      title: `Změna jména/příjmení`,
      html: `
        <div>
          <p style="margin-left: -270px; margin-bottom: -15px; margin-top: 20px">Zadejte své nové ${text}</p>
          <input type="email" id="swal-input1" class="swal2-input" style="width: 440px; margin-left: 2px">
        </div>
      `,
      confirmButtonText: "Potvrdit",
      confirmButtonColor: "#28a745",
      color: "black",
      showCancelButton: true,
      cancelButtonText: "Zrušit",
      cancelButtonColor: "#dc3545",
      reverseButtons: true,
      preConfirm: () => {
        const inputText = document.getElementById("swal-input1").value;

        if(!inputText){
          Swal.showValidationMessage("Vyplňte prosím toto pole.");
          return false;
        }

        return { inputText }
      }
    });
    if (value) {
      const updatedData = { [e.target.name]: value.inputText };
      await sendData(updatedData);
    }
  };

  /**
   * Funkce pro změnu emailu
   * Zobrazí modální okno, kde uživatel musí zadat svůj nový email a jeho heslo jako ověření. Email i heslo se zkontroluje a pokud něco z toho nesedí vyhodí se error hláška.
   * Pokud je vše v pořádku, odešleme request na server pro změnu emailu
   */
  const handleEmailChange = async () => {
    const { value } = await Swal.fire({
      title: "Změna emailu",
      html: `
        <div>
          <p style="margin-left: -285px; margin-bottom: -15px; margin-top: 20px">Zadejte váš nový email</p>
          <input type="email" id="swal-input1" class="swal2-input" style="width: 440px; margin-left: 2px">
  
          <p style="margin-left: -320px; margin-bottom: -15px; margin-top: 20px">Zadejte své heslo</p>
          <input type="password" id="swal-input2" class="swal2-input" style="width: 440px; margin-left: 2px">
        </div>
      `,
      confirmButtonText: "Potvrdit",
      confirmButtonColor: "#28a745",
      color: "black",
      showCancelButton: true,
      cancelButtonText: "Zrušit",
      cancelButtonColor: "#dc3545",
      reverseButtons: true,
      preConfirm: () => {
        const email = document.getElementById("swal-input1").value;
        const password = document.getElementById("swal-input2").value;

        const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

        if(email === user.email){
          Swal.showValidationMessage("Zadaný email je stejný jako váš současný.");
          return false;
        }

        if (!emailRegex.test(email)) {
          Swal.showValidationMessage("Zadejte platný e-mail.");
          return false;
        }

        if (!password) {
          Swal.showValidationMessage("Zadejte své heslo k ověření.");
          return false;
        }

        return { email, password };
      },
    });

    if (value) {
      const res = await verifyUserPassword(value.password);
      if (res.status !== 200)
        return mixinAlert("error", "Zadané heslo není správné!");

      await sendData({ email: value.email });
    }
  };

  /**
   * Funkce pro změnu hesla
   * Zobrazí modální okno, kde uživatel musí zadat své staré heslo jako ověření. A poté 2x své nové heslo, aby si uživatel ověřil že své nové heslo zadává opravdu správně.
   * Pokud nějaká podmínka nesedí, vyhodíme chybu.
   * Pokud je vše v pořádku, pomocí bcrypt uděláme hashedPassowrd a odešleme request na server pro změnu hesla
   */
  const handlePasswordChange = async () => {
    const { value } = await Swal.fire({
      title: "Změna hesla",
      html: `
          <div>
            <p style="margin-left: -285px; margin-bottom: -15px; margin-top: 20px">Zadejte své staré heslo</p>
            <input type="password" id="swal-input1" class="swal2-input" style="width: 440px; margin-left: 2px">
    
            <p style="margin-left: -290px; margin-bottom: -15px; margin-top: 20px">Zadejte své nové heslo</p>
            <input type="password" id="swal-input2" class="swal2-input" style="width: 440px; margin-left: 2px">

            <p style="margin-left: -230px; margin-bottom: -15px; margin-top: 20px">Zadejte své nové heslo znovu</p>
            <input type="password" id="swal-input3" class="swal2-input" style="width: 440px; margin-left: 2px">
          </div>
        `,
      confirmButtonText: "Potvrdit",
      confirmButtonColor: "#28a745",
      showCancelButton: true,
      color: "black",
      cancelButtonText: "Zrušit",
      cancelButtonColor: "#dc3545",
      reverseButtons: true,
      preConfirm: () => {
        const oldPassword = document.getElementById("swal-input1").value;
        const newPassword = document.getElementById("swal-input2").value;
        const newPasswordAgain = document.getElementById("swal-input3").value;

        if (!oldPassword || !newPassword) {
          Swal.showValidationMessage("Vyplně prosím obě pole.");
          return false;
        }

        if (oldPassword === newPassword) {
          Swal.showValidationMessage("Vaše hesla jsou stejná.");
          return false;
        }

        if (newPassword !== newPasswordAgain) {
          Swal.showValidationMessage("Vaše hesla se neshodují!");
          return false;
        }

        return { oldPassword, newPassword };
      },
    });

    if (value) {
      const res = await verifyUserPassword(value.oldPassword);
      if (res.status !== 200)
        return mixinAlert("error", "Zadané heslo není správné!");
      const hashedPassword = await bcrypt.hash(value.newPassword, 10);

      await sendData({ password: hashedPassword });
      await logout();
    }
  };

  /**
   * Funkce pro smazání účtu
   * Zobrazí modální okno, kde uživatel musí nejprve v jednom okně potvrdit zda chce opravdu smazat svůj účet, pokud ano, zobrazí se mu druhé okno kam musí zadat své heslo jako ověření
   * Pokud je vše v pořádku, odešleme request na server a ten smaže údaje uživatele. Následně uživatele odhlásíme
   */
  const handleDeleteAccount = async () => {
    const Alert = Swal.mixin({
      buttonsStyling: true,
    });
    Alert.fire({
      title: "Opravdu chcete smazat váš účet?",
      icon: "warning",
      text: "Tato akce je nevratná",
      showCancelButton: true,
      confirmButtonText: "Ano, smazat účet",
      color: "black",
      confirmButtonColor: "#28a745",
      cancelButtonText: "Zrušit",
      cancelButtonColor: "#dc3545",
      reverseButtons: true,
    }).then(async (result) => {
        if(result.isConfirmed){
          const { value } = await Swal.fire({
            title: "Ověření identity",
            html: `
                <div>
                  <p style="margin-left: -310px; margin-bottom: -15px; margin-top: 20px">Zadejte své heslo</p>
                  <input type="password" id="swal-input1" class="swal2-input" style="width: 440px; margin-left: 2px">
                </div>
              `,
            confirmButtonText: "Potvrdit",
            confirmButtonColor: "#28a745",
            showCancelButton: true,
            color: "black",
            cancelButtonText: "Zrušit",
            cancelButtonColor: "#dc3545",
            reverseButtons: true,
            preConfirm: () => {
              const password = document.getElementById("swal-input1").value;
      
              if (!password) {
                Swal.showValidationMessage("Zadejte prosím své heslo.");
                return false;
              }
      
              return { password };
            },
          });

          if (value) {
            const res = await verifyUserPassword(value.password);
            if(res.status !== 200) return mixinAlert("error", "Zadané heslo není správné!");
            mixinAlert("info", "Váš účet byl smazán")
            await deleteUser(user._id);
            await logout();
          }
        }
    });
  }

  /**
   * Tato funkce bere informace o tom kdy si uživatel založil účet. V databázi je to uloženo ve formátu `2025-03-14T21:23:44.405Z`
   * Tato funkce převádí tento formát datumu na český datum a vrací ho zpět překonvertovaný
   */
  const convertDate = () => {
    const date = new Date(user.createdAt);
    return date.toLocaleString("cs-CZ");
  };

  useEffect(() => {
    document.title = "Nastavení • iFaktura";
  }, []);

  return (
    <Content headtext="Nastavení" page="Nastavení" box_width="215">
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
            <p>
              Účet vytvořen: <b>{convertDate()}</b>
            </p>
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
              <button id="empty" className="btn" onClick={handleEmailChange}>
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
              <button id="empty" className="btn" onClick={handlePasswordChange}>
                Změnit heslo
              </button>
            </div>
          </div>
        </div>
      </div>
      <button className="btn" id="red" onClick={handleDeleteAccount}>
        Smazat účet
      </button>
    </Content>
  );
}
