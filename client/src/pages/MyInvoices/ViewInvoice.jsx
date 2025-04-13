import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { generatePDF } from "../../utils/pdfGenerator";

// Import assets
import trashcan from "../../assets/icons/TrashCan.svg";
import fileedit from "../../assets/icons/FileEdit.svg";
import pdficon from "../../assets/icons/Pdf.svg";

// Import components
import Content from "../../components/Content";
import Input from "../../components/Input";
import LoadingPage from "../../components/LoadingPage";
import NotFound from "../../components/NotFound";

// Import styles
import "../../scss/styles.scss";
import "../../scss/Table.scss";

// Import model
import { getInvoiceById, deleteInvoice } from "../../models/invoice";
import { getContactById } from "../../models/contact";

// Import utils
import { mixinAlert } from "../../utils/sweetAlerts";
import { calculateInvoiceTotal, calculateTotals } from "../../utils/calculateTotals";

export default function ViewInvoice() {
  const { id } = useParams();
  const { user } = useAuth();
  const [invoice, setInvoice] = useState([]);
  const [invoiceProducts, setInvoiceProducts] = useState();
  const [contactName, setContactName] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * Načteme specifickou fakturu, pokud neexistuje, nastavíme `setIsLoading` na null, tím uživatele přesměrujeme na `NotFound` stránku.
     * Pokud ano, uložíme její data do proměnné
     */
    const load = async () => {
      const data = await getInvoiceById(id);
      if (data.status === 500 || data.status === 404) return setIsLoading(null);
      if (data.status === 200) {
        setInvoice(data.payload);
        setInvoiceProducts(data.payload.products)

        const contact = await getContactById(data.payload.contact_id)
        if(contact.status === 200){
          setContactName(contact.payload.detailsName)
        } else{
          setContactName("-")
        }
        setIsLoading(false);
      }
    };
    load();
    document.title = `Faktura • iFaktura`;
  }, []);

  /**
   * Tato funkce odešle modal, kde se zeptáme uživatele zda chce smazat fakturu, pokud odsouhlasí, zavoláme funkci `deleteInvoice()`
   * @param {*} invoiceId - id faktury
   */
  const handleDelete = async (e, invoiceId) => {
    e.preventDefault();

    const Alert = Swal.mixin({
      buttonsStyling: true,
    });
    Alert.fire({
      title: "Opravdu chcete smazat tuto fakturu?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ano, smazat",
      color: "black",
      confirmButtonColor: "#28a745",
      cancelButtonText: "Zrušit",
      cancelButtonColor: "#dc3545",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const data = await deleteInvoice(invoiceId);
        if (data.status === 200) {
          mixinAlert("success", "Faktura byla smazána.");
          navigate("/invoices");
          return;
        }
      }
    });
  };

  const convertDate = (dateInput) => {
    const date = new Date(dateInput);
    return date.toLocaleDateString("cs-CZ");
  };

  const platceDph = user.dph === "Plátce DPH" ? true : false;

  if (isLoading === null) {
    return <NotFound />;
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <>
      <Content
        headtext={`Faktura č. ${invoice.invoice_id}`}
        page="Vydané faktury"
        box_width="375"
      >
        <header className="table-navbar">
          <div
            className="table-navbar-icons"
            style={{ width: "100%", marginTop: "1px", marginBottom: "-8px" }}
          >
            <img src={pdficon} alt="" title="Faktura do PDF" onClick={async () => generatePDF(user, await getContactById(invoice.contact_id), invoice, calculateInvoiceTotal(invoice.products, user))}/>
            <img
              src={fileedit}
              alt=""
              title="Upravit fakturu"
              onClick={() => navigate(`/updateInvoice/${invoice._id}`)}
            />
            <img
              src={trashcan}
              alt=""
              title="Smazat fakturu"
              onClick={(e) => handleDelete(e, invoice._id)}
            />
            <hr class="vertical-line"></hr>
          </div>
        </header>

        <h1 className="input-header-text">Základní informace</h1>
        <div className="inputs">
          <Input text="Odběratel" required={true} width={400}>
            {contactName === "-" ? "-" : <Link to={`/contact/${invoice.contact_id}`} className="linkText">{contactName}</Link>}
          </Input>
        </div>

        <div className="inputs">
          <Input text="Číslo objednávky" required={true}>
            <b>{invoice.orderNumber}</b>
          </Input>
          <Input text="Popis" required={true}>
            <b>{invoice.description}</b>
          </Input>
        </div>

        <h1 className="input-header-text">Datum</h1>
        <div className="inputs">
          <Input text="Datum vystavení" required={false}>
            <b>{convertDate(invoice.dateOfIssuing)}</b>
          </Input>
          <Input text="Datum splatnosti" required={false}>
            <b>{convertDate(invoice.dueDate)}</b>
          </Input>
          {platceDph && (
            <Input text="Datum zdaněného plnění (DUZP)" required={true}>
              <b>{convertDate(invoice.duzp)}</b>
            </Input>
          )}
        </div>

        <h1 className="input-header-text">Platební údaje</h1>
        <div className="inputs">
          <Input text="Způsob úhrady" required={true}>
            <b>{invoice.paymentMethod}</b>
            {invoice.paid ? (
              <span className="status-text status-text-invoice" id="paid">
                Uhrazeno
              </span>
            ) : Date.now() > Date.parse(invoice.dueDate) ? (
              <span className="status-text status-text-invoice" id="overdue">
                Po splatnosti
              </span>
            ) : (
              <span className="status-text status-text-invoice" id="unpaid">
                Neuhrazeno
              </span>
            )}
          </Input>
          {invoice.paymentMethod === "Bankovni prevod" ? (
            <Input text="Bankovní účet" required={false}>
              <div className="bankText">
                {user.accountNumber && user.iban && user.swift ? (
                  <>
                    <p>
                      <b>Číslo účtu:</b> {user.accountNumber}
                    </p>
                    <p>
                      <b>IBAN:</b> {user.iban}
                    </p>
                    <p>
                      <b>SWIFT:</b> {user.swift}
                    </p>
                  </>
                ) : (
                  <p style={{ color: "red" }}>Bankovní údaje nejsou správně nastaveny</p>
                )}
              </div>
            </Input>
          ) : (
            ""
          )}
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
                {platceDph && <th style={{ width: "10%" }}>DPH (%)</th>}
                <th style={{ width: "9%" }}>Sleva</th>
                <th style={{ width: "10%" }}>Typ slevy</th>
                <th style={{ width: "25%", textAlign: "right" }}>Celkem</th>
              </tr>

              {invoiceProducts.map((product) => {  
                const totals = calculateTotals(product, undefined, user);
                return(
                  <tr key={product._id}>
                    <td style={{ width: "9%", textAlign: "center" }}>{product.amount}</td>
                    <td style={{ width: "9%" }}>{product.unit}</td>
                    <td style={{ width: "15%" }}>{product.productName}</td>
                    <td style={{ width: "9%" }}>{product.price}</td>
                    {platceDph && <td style={{ width: "13%" }}>{product.dph ? product.dph : "-"}</td>}
                    {platceDph && <td style={{ width: "10%" }}>{product.dphType ? product.dphType : "-"}</td>}
                    <td style={{ width: "9%" }}>{product.discount ? product.discount : "-"}</td>
                    <td style={{ width: "10%" }}>{product.discountType ? product.discountType  : "-"}</td>
                    <td style={{ width: "25%" }}>
                      <p>{totals.totalWithDph} Kč</p>
                    </td>
                  </tr>
                )
              })}
            </table>
          </section>
        </div>
      </Content>
    </>
  );
}
