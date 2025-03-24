import { Link } from "react-router-dom";

// Import components
import Content from "../../components/Content";
import Input from "../../components/Input";
import Buttons from "../../components/Buttons";
import LoadingPage from "../../components/LoadingPage";
import NotFound from "../../components/NotFound";
import Table from "../../components/Table";

export default function CreateInvoice() {
  return (
    <>
      <Content headtext="Vydat fakturu" page="Vydat fakturu" box_width="280">
        <h1 className="input-header-text">Základní informace</h1>
        <div className="inputs">
          <Input text="Odběratel" required={true} width={400}>
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
                <option>Bankovní účet</option>
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
            <p>
              <b>Číslo účtu:</b> 7586
            </p>
            <p>
              <b>IBAN:</b> 5475784
            </p>
            <p>
              <b>SWIFT:</b> 34568
            </p>
            <Link>Upravit bankovní údaje</Link>
          </Input>
        </div>

        <h1 className="input-header-text">Položky</h1>
        <div className="inputs">
          <section className="table-container" style={{width: "100%"}}>
            <table className="table">
              <tr>
                <th id="header">Jméno / Firma</th>
                <th>IČO</th>
                <th>DIČ</th>
                <th>E-mail</th>
              </tr>

              <tr>
                <td id="header">
                  <input type="text" />
                </td>
                <td>
                  <input type="text" />
                </td>
                <td>
                  <input type="text" />
                </td>
                <td>
                  <input type="text" />
                </td>
              </tr>
            </table>
          </section>
          <button>Další řádek</button>
          <button>Přidat položku ze seznamu</button>
        </div>

        <div style={{ marginTop: "150px" }}>
          <Buttons>
            <button id="empty">Zrušit</button>
            <button id="fill">Vytvořit</button>
          </Buttons>
        </div>
      </Content>
    </>
  );
}
