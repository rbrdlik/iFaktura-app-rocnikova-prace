import { useEffect } from "react";

// Import components
import Content from "../../components/Content";
import Input from "../../components/Input";
import Buttons from "../../components/Buttons";
import NumberInput from "../../components/NumberInput";

// Import styles
import "../../scss/styles.scss";

export default function CreateItem() {
  useEffect(() => {
    document.title = "Vytvořit položku • iFaktura";
  }, []);

  const platceDph = false;

  return (
    <>
      <Content
        headtext="Vytvořit položku"
        page="Vytvořit položku"
        box_width="295"
      >
        <h1 className="input-header-text">Základní údaje položky</h1>
        <div className="inputs">
          <NumberInput text={"Množství"} required={true} numberValue={0} />
          <Input text="Jednotka" required={true} width={180}>
            <div className="select-container">
              <select>
                <option value="" disabled selected>
                  Vybrat...
                </option>
                <option>ks</option>
                <option>hod.</option>
                <option>den</option>
                <option>litr</option>
                <option>kg</option>
                <option>g</option>
                <option>m</option>
                <option>km</option>
                <option>m²</option>
                <option>m³</option>
                <option>balení</option>
              </select>
            </div>
          </Input>
          <Input text="Název položky" required={true}>
            <input type="text" />
          </Input>
        </div>

        <h1 className="input-header-text">Cena {platceDph ? "& DPH" : ""}</h1>
        <div className="inputs">
          <Input text="Cena položky" required={true} width={350}>
            <input type="text" />
          </Input>
          {platceDph ? (
            <Input text="Sazba DPH" required={true} width={170}>
              <div className="select-container">
                <select>
                  <option value="" disabled selected>
                    Vybrat...
                  </option>
                  <option>0 %</option>
                  <option>11 %</option>
                  <option>21 %</option>
                </select>
              </div>
            </Input>
          ) : (
            ""
          )}
          {platceDph ? (
            <Input text="Zadaná cena je:" required={true} width={180}>
              <div className="select-container">
                <select>
                  <option value="" disabled selected>
                    Vybrat...
                  </option>
                  <option>Bez DPH</option>
                  <option>S DPH</option>
                </select>
              </div>
            </Input>
          ) : (
            ""
          )}
        </div>

        <h1 className="input-header-text">Sleva</h1>
        <div className="inputs">
          <Input text="Výše slevy" required={false} width={350}>
            <input type="text" />
          </Input>
          <Input text="Typ slevy" required={false} width={160}>
            <div className="select-container">
              <select>
                <option value="" disabled selected>
                  Vybrat...
                </option>
                <option>Kč</option>
                <option>%</option>
              </select>
            </div>
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
            <button id="empty">Zrušit</button>
            <button id="fill">Vytvořit</button>
          </Buttons>
        </div>
      </Content>
    </>
  );
}
