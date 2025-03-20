import { useEffect } from "react";

// Import components
import Content from "../../components/Content";
import Input from "../../components/Input";
import Buttons from "../../components/Buttons";

// Import styles
import "../../scss/styles.scss";

export default function ViewItem() {
  useEffect(() => {
    document.title = "Položka č. 00001 • iFaktura";
  }, []);

  const platceDph = true;

  return (
    <>
      <Content
        headtext="Položka č. 00001"
        page="Seznam položek"
        box_width="295"
      >
        <h1 className="input-header-text">Základní údaje položky</h1>
        <div className="inputs">
          <Input text="Název položky" required={true} width={180}>
          <b>1</b>
          </Input>
          <Input text="Jednotka" required={true} width={180}>
          <b>ks</b>
          </Input>
          <Input text="Název položky" required={true}>
            <b>Položka nějaká nevím co vymyslet nejaky vtipny</b>
          </Input>
        </div>

        <h1 className="input-header-text">Cena {platceDph ? "& DPH" : ""}</h1>
        <div className="inputs">
          <Input text="Cena položky" required={true} width={350}>
          <b>156,00 Kč</b>
          </Input>
          {platceDph ? (
            <Input text="Sazba DPH" required={true} width={170}>
              <b>21 %</b>
            </Input>
          ) : (
            ""
          )}
          {platceDph ? (
            <Input text="Zadaná cena je:" required={true} width={180}>
              <b>Bez DPH</b>
            </Input>
          ) : (
            ""
          )}
        </div>

        <h1 className="input-header-text">Sleva</h1>
        <div className="inputs">
          <Input text="Výše slevy" required={false} width={350}>
          <b>11</b>
          </Input>
          <Input text="Typ slevy" required={false} width={160}>
          <b>%</b>
          </Input>
        </div>

        <div className="info-box">
          <div className="text-left">
            {platceDph ? <p>Celkem bez DPH</p> : <p>Cena položky</p>}
            {platceDph ? <p>DPH 21%</p> : ""}
            <p>Sleva 11%</p>
            <h1>Cena celkem</h1>
          </div>
          <div className="text-right">
            <p>156,00 Kč</p>
            {platceDph ? <p>+32,75 Kč</p> : ""}
            <p>-12,35 Kč</p>
            <h1>165,95 Kč</h1>
          </div>
        </div>

        <div style={{ marginTop: "230px" }}>
          <Buttons>
            <button id="empty">Zpět</button>
          </Buttons>
        </div>
      </Content>
    </>
  );
}
