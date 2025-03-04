import { useEffect } from "react";

// Import components
import Content from "../../components/Content";
import Input from "../../components/Input";
import Buttons from "../../components/Buttons";

// Import styles
import "../../scss/styles.scss";

export default function ViewContact() {
  useEffect(() => {
    document.title = "Kontakt č. 00001 • iFaktura";
  }, []);

  const platceDph = true;

  return (
    <>
      <Content
        headtext="Kontakt č. 00001"
        page="Seznam položek"
        box_width="295"
      >
        <h1 className="input-header-text">Základní údaje</h1>
        <div className="inputs">
          <Input text="Jméno a příjmení / Název firmy" required={true}>
            <b>Jmeno Prijmeni</b>
          </Input>
          <Input text="IČO" required={false}>
            <b>44856348563</b>
          </Input>
        </div>

        <div className="inputs">
          <Input text="Ulice a číslo popisné" required={true}>
            <b>Ulice, 15</b>
          </Input>
          <Input text="Město" required={true}>
            <b>Mesto</b>
          </Input>
          <Input text="PSČ" required={true}>
            <b>29301</b>
          </Input>
        </div>

        <h1 className="input-header-text">Kontaktní údaje</h1>
        <div className="inputs">
          <Input text="Telefon" required={false}>
            <b>+420 777 558 123</b>
          </Input>
          <Input text="Webové stránky" required={false}>
            <b>www.webova-stranka.cz</b>
          </Input>
          <Input text="E-mail" required={true}>
            <b>nejakyemail@email.com</b>
          </Input>
        </div>

        <div className="inputs">
          <Input text="DIČ" required={false}>
            <b>CZ44856348563</b>
          </Input>
        </div>

        <div style={{ marginTop: "200px" }}>
          <Buttons>
            <button id="empty">Zpět</button>
          </Buttons>
        </div>
      </Content>
    </>
  );
}
