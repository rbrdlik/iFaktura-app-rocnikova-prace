import { Link } from "react-router-dom";

// Import components
import Content from "../../components/Content";
import Input from "../../components/Input";
import Buttons from "../../components/Buttons";
import LoadingPage from "../../components/LoadingPage";
import NotFound from "../../components/NotFound";
import Table from "../../components/Table";

// Import assets
import trashcan from "../../assets/icons/TrashCan.svg";
import fileedit from "../../assets/icons/FileEdit.svg";
import plus from "../../assets/icons/Plus.svg";

export default function CreateInvoice() {
  const platceDph = true;

  return (
    <>
      <Content headtext="Vydat fakturu" page="Vydat fakturu" box_width="280">
        <h1 className="input-header-text">Základní informace</h1>
        <div className="inputs">
          <Input text="Odběratel" required={true} width={450}>
            <div className="select-container">
              <select name="unit" required>
                <option value="" disabled selected>
                  Vybrat...
                </option>
                <option>jeden</option>
                <option>druhej</option>
              </select>
            </div>
          </Input>
        </div>

        <div className="inputs">
          <Input text="Číslo objednávky" required={true}>
            <input type="text" />
          </Input>
          <Input text="Popis" required={true}>
            <input type="text" />
          </Input>
          <Input text="Konstantní symbol" required={false}>
            <input type="number" />
          </Input>
        </div>

        <h1 className="input-header-text">Datum</h1>
        <div className="inputs">
          <Input text="Datum vystavení" required={false}>
            <input type="date" />
          </Input>
          <Input text="Datum splatnosti" required={false}>
            <input type="date" />
          </Input>
          <Input text="Datum zdaněného plnění (DUZP)" required={true}>
            <input type="date" />
          </Input>
        </div>

        <h1 className="input-header-text">Platební údaje</h1>
        <div className="inputs">
          <Input text="Způsob úhrady" required={true}>
            <div className="select-container">
              <select name="unit" required>
                <option value="" disabled selected>
                  Vybrat...
                </option>
                <option>Bankovní převod</option>
                <option>PayPal</option>
              </select>
            </div>
            <div className="switch-text">
              <label class="switch">
                <input type="checkbox" />
                <span class="slider round"></span>
              </label>
              <p>Uhrazeno</p>
            </div>
          </Input>
          <Input text="Bankovní účet" required={false}>
            <div className="bankText">
              <p>
                <b>Číslo účtu:</b> 7586
              </p>
              <p>
                <b>IBAN:</b> 5475784
              </p>
              <p>
                <b>SWIFT:</b> 34568
              </p>
              <Link to={"/details"}>Upravit bankovní údaje</Link>
            </div>
          </Input>
        </div>

        <h1 className="input-header-text" style={{ marginBottom: "5px" }}>
          Položky
        </h1>
        <div className="inputs">
          <section className="table-container" style={{ width: "100%" }}>
            <table className="table">
              <tr style={{marginBottom: "5px"}}>
                <th style={{ width: "9%", textAlign: "center" }}>Množství</th>
                <th style={{ width: "13%", textAlign: "center" }}>Jednotka</th>
                <th style={{ width: "20%", textAlign: "center" }}>Název položky</th>
                <th style={{ width: "9%", textAlign: "center" }}>Cena</th>
                {platceDph ? (
                  <th style={{ width: "13%", textAlign: "center" }}>Zadaná cena je</th>
                ) : (
                  ""
                )}
                {platceDph ? <th style={{ width: "13%", textAlign: "center" }}>DPH (%)</th> : ""}
                <th style={{ width: "9%", textAlign: "center" }}>Sleva</th>
                <th style={{ width: "13%", textAlign: "center" }}>Typ slevy</th>
                <th style={{ width: "20%", textAlign: "right" }}>Celkem</th>
                <th style={{ width: "10%", textAlign: "center" }}></th>
              </tr>

              <tr>
                <td style={{ width: "9%" }}>
                  <input type="number" id="invoiceProductInput" min={1}/>
                </td>
                <td style={{ width: "9%" }}>
                  <div className="select-container">
                    <select name="unit" required>
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
                </td>
                <td style={{ width: "20%" }}>
                  <input type="text" id="invoiceProductInput" />
                </td>
                <td style={{ width: "9%" }}>
                  <input type="number" id="invoiceProductInput" min={1}/>
                </td>
                {platceDph ? (
                  <td style={{ width: "13%" }}>
                    <div className="select-container">
                      <select name="dphType" required>
                        <option value="" disabled selected>
                          Vybrat...
                        </option>
                        <option>Bez DPH</option>
                        <option>S DPH</option>
                      </select>
                    </div>
                  </td>
                ) : (
                  ""
                )}
                {platceDph ? (
                  <td style={{ width: "13%" }}>
                    <div className="select-container">
                      <select name="dph" required>
                        <option value="" disabled selected>
                          Vybrat...
                        </option>
                        <option>0 %</option>
                        <option>11 %</option>
                        <option>21 %</option>
                      </select>
                    </div>
                  </td>
                ) : (
                  ""
                )}
                <td style={{ width: "9%" }}>
                  <input type="number" id="invoiceProductInput" min={1} />
                </td>
                <td style={{ width: "13%" }}>
                  <div className="select-container">
                    <select name="discountType">
                      <option value="" disabled selected>
                        Vybrat...
                      </option>
                      <option>Kč</option>
                      <option>%</option>
                    </select>
                  </div>
                </td>
                <td style={{ width: "20%" }}>
                  <p>100,000.00kč</p>
                </td>
                <td style={{ width: "10%" }}>
                  <img
                    src={trashcan}
                    alt=""
                    id="img"
                    style={{ marginLeft: "15px" }}
                  />
                </td>
              </tr>

            </table>
          </section>
          <div className="btns">
            <button>
              <img src={plus} alt="" />
              Další řádek
            </button>
            <button>
              <img src={plus} alt="" />
              Přidat položku ze seznamu
            </button>
          </div>
        </div>

        <div style={{ marginTop: "50px" }}>
          <Buttons>
            <button id="empty">Zrušit</button>
            <button id="fill">Vytvořit</button>
          </Buttons>
        </div>
      </Content>
    </>
  );
}
