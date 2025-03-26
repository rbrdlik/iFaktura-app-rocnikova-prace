import { useEffect } from "react";
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
import sendicon from "../../assets/icons/PaperPlane.svg";
import pdficon from "../../assets/icons/Pdf.svg";

export default function ViewInvoice() {
  useEffect(() => {
    document.title = "Faktura • iFaktura";
  }, []);

  const platceDph = true;

  return (
    <>
      <Content headtext="Vydané faktury" page="Vydané faktury" box_width="280">
        <header className="table-navbar">
          <div
            className="table-navbar-icons"
            style={{ width: "100%", marginTop: "1px", marginBottom: "-8px" }}
          >
            <img
              src={pdficon}
              alt=""
              title="Faktura do PDF"
            />
            <img
              src={sendicon}
              alt=""
              title="Odeslat fakturu"
            />
            <img
              src={fileedit}
              alt=""
              title="Upravit fakturu"
            />
            <img
              src={trashcan}
              alt=""
              title="Smazat fakturu"
            />
            <hr class="vertical-line"></hr>
          </div>
        </header>

        <h1 className="input-header-text">Základní informace</h1>
        <div className="inputs">
          <Input text="Odběratel" required={true} width={400}>
            <Link className="linkText">Firma 1</Link>
          </Input>
        </div>

        <div className="inputs">
          <Input text="Číslo objednávky" required={true}>
            <b>664s4ef6464169849</b>
          </Input>
          <Input text="Popis" required={true}>
            <b>Nejaky popis</b>
          </Input>
          <Input text="Konstantní symbol" required={false}>
            <b>3308</b>
          </Input>
        </div>

        <h1 className="input-header-text">Datum</h1>
        <div className="inputs">
          <Input text="Datum vystavení" required={false}>
            <b>10.05.2025</b>
          </Input>
          <Input text="Datum splatnosti" required={false}>
            <b>28.05.2025</b>
          </Input>
          <Input text="Datum zdaněného plnění (DUZP)" required={true}>
            <b>10.05.2025</b>
          </Input>
        </div>

        <h1 className="input-header-text">Platební údaje</h1>
        <div className="inputs">
          <Input text="Způsob úhrady" required={true}>
            <b>Bankovní převod</b>
            <span className="status-text status-text-invoice" id="overdue">Po splatnosti</span>
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
            </div>
          </Input>
        </div>

        <h1 className="input-header-text" style={{ marginBottom: "5px" }}>
          Položky
        </h1>
        <div className="inputs">
          <section className="table-container" style={{ width: "100%" }}>
            <table className="table">
              <tr style={{ marginBottom: "5px" }}>
                <th style={{ width: "9%" }}>Množství</th>
                <th style={{ width: "13%" }}>Jednotka</th>
                <th style={{ width: "15%" }}>Název položky</th>
                <th style={{ width: "9%" }}>Cena</th>
                {platceDph ? (
                  <th style={{ width: "13%" }}>Zadaná cena je</th>
                ) : (
                  ""
                )}
                {platceDph ? <th style={{ width: "10%" }}>DPH (%)</th> : ""}
                <th style={{ width: "9%" }}>Sleva</th>
                <th style={{ width: "10%" }}>Typ slevy</th>
                <th style={{ width: "25%", textAlign: "right" }}>Celkem</th>
              </tr>

              <tr>
                <td style={{ width: "9%" }}>10</td>
                <td style={{ width: "9%" }}>balení</td>
                <td style={{ width: "15%" }}>Nejaky nazev lololol</td>
                <td style={{ width: "9%" }}>100.00</td>
                {platceDph ? <td style={{ width: "13%" }}>Bez DPH</td> : ""}
                {platceDph ? <td style={{ width: "10%" }}>21%</td> : ""}
                <td style={{ width: "9%" }}>100</td>
                <td style={{ width: "10%" }}>Kč</td>
                <td style={{ width: "25%" }}>
                  <p>100,000.00kč</p>
                </td>
              </tr>
            </table>
          </section>
        </div>
      </Content>
    </>
  );
}
