// Import components
import Content from "../../components/Content";
import Input from "../../components/Input";
import Buttons from "../../components/Buttons";
import LoadingPage from "../../components/LoadingPage";
import NotFound from "../../components/NotFound";

export default function UpdateInvoice() {
  return (
    <>
      <Content headtext="Vydané faktury" page="Vydané faktury" box_width="280">
        <h1 className="input-header-text">Základní údaje</h1>
        <div className="inputs">
          <Input text="Jméno a příjmení / Název firmy" required={true}>
            <input type="text" />
          </Input>
          <Input text="IČO" required={false}>
            <input type="text" />
          </Input>
        </div>

        <div className="inputs">
          <Input text="Ulice a číslo popisné" required={true}>
            <input type="text" />
          </Input>
          <Input text="Město" required={true}>
            <input type="text" />
          </Input>
          <Input text="PSČ" required={true}>
            <input type="text" />
          </Input>
        </div>

        <h1 className="input-header-text">Kontaktní údaje</h1>
        <div className="inputs">
          <Input text="Telefon" required={false}>
            <input type="text" />
          </Input>
          <Input text="Webové stránky" required={false}>
            <input type="text" />
          </Input>
          <Input text="E-mail" required={true}>
            <input type="text" />
          </Input>
        </div>

        <div className="inputs">
          <Input text="DIČ" required={false}>
            <input type="text" />
          </Input>
        </div>

        <div style={{ marginTop: "150px" }}>
          <Buttons>
            <button id="empty">Zrušit</button>
            <button id="fill">Upravit</button>
          </Buttons>
        </div>
      </Content>
    </>
  );
}
