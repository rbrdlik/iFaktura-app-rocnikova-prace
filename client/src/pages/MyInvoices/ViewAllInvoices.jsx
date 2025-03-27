import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

// Import components
import Content from "../../components/Content";
import Table from "../../components/Table";
import NotFound from "../../components/NotFound";
import LoadingPage from "../../components/LoadingPage";

// Import assets
import trashcan from "../../assets/icons/TrashCan.svg";
import fileedit from "../../assets/icons/FileEdit.svg";
import sendicon from "../../assets/icons/PaperPlane.svg";
import pdficon from "../../assets/icons/Pdf.svg";

// Import styles
import "../../scss/styles.scss";

// Import models
import { deleteInvoice, getAllInvoices } from "../../models/invoice";

// Import alert
import { mixinAlert } from "../../utils/sweetAlerts";

export default function ViewAllInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [indexOfFirstItem, setIndexOfFirstItem] = useState();
  const [indexOfLastItem, setIndexOfLastItem] = useState();

  useEffect(() => {
    /**
     * Načteme všechny faktury, pokud žádný neexistují, nastavíme `setIsLoading` na null, tím uživatele přesměrujeme na `NotFound` stránku.
     * Pokud ano, uložíme je do `invoices`
     */
    const load = async () => {
      const res = await getAllInvoices();
      if (res.status === 500 || res.status === 404) return setIsLoading(null);
      if (res.status === 200) {
        setInvoices(res.payload);
        setIsLoading(false);
      }
    };

    load();
    document.title = "Vydané faktury • iFaktura";
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
          window.location.reload(); // Znovu načteme stránku aby se změny projevily a tabulka se znovu vypsala
          return;
        }
        setInfo(data.message);
      }
    });
  };

  const convertDate = (dateInput) => {
    const date = new Date(dateInput);
    return date.toLocaleDateString("cs-CZ");
  };

  /**
   * Tato funkce počítá celkovou částku všech produktů podle toho i zda má nějaký produkt nastavenou slevu, dph, atd..
   * @param {*} products - Pole všech produktů
   * @returns - Celkovou částku všech produktů
   */
  const calculateInvoiceTotal = (products) => {
    const total = products.reduce((sum, product) => {
      const pricePerUnit = parseFloat(product.price);
      const dphRate = product.dph ? parseFloat(product.dph) / 100 : 0;
      const discount = parseFloat(product.discount);

      let priceWithoutDph = product.dphType === "S DPH" ? pricePerUnit / (1 + dphRate) : pricePerUnit;
      let totalPriceWithoutDph = priceWithoutDph * parseFloat(product.amount);
      let dphAmount = product.dph ? totalPriceWithoutDph * dphRate : 0;
      let discountAmount = product.discount ? product.discountType === "%" ? (totalPriceWithoutDph * discount) / 100 : discount : 0;
      let totalWithDph = totalPriceWithoutDph + dphAmount - discountAmount
      if (totalWithDph < 0) totalWithDph = 0;

      return sum + totalWithDph;
    }, 0);

    return `${total.toFixed(2)} Kč`;
  };

  /**
   * Tento kód provádí filtrování produktů podle hledaného výrazu (`searchValue`).
   * Použije se metoda `.filter()`, která prochází pole invoices a vybere jen ty kontakty, které odpovídají hledání.
   */
  const filteredInvoices = searchValue
    ? invoices.filter((invoice) => invoice.invoice_id.includes(searchValue))
    : invoices;

  if (isLoading === null) {
    return <NotFound />;
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <>
      <Content headtext="Vydané faktury" page="Vydané faktury" box_width="280">
        <Table
          setSearch={setSearchValue}
          items={filteredInvoices}
          setIndexOfFirstItem={setIndexOfFirstItem}
          setIndexOfLastItem={setIndexOfLastItem}
          linkToCreate={"createInvoice"}
        >
          <tr>
            <th id="invoiceHeader">Číslo faktury</th>
            <th>Stav</th>
            <th>Odběratel</th>
            <th>Vystaveno</th>
            <th>Splatnost</th>
            <th>Cena celkem</th>
            <th id="edit-btn"></th>
          </tr>

          {filteredInvoices
            .slice(indexOfFirstItem, indexOfLastItem)
            .map((invoice) => (
              <tr key={invoice._id}>
                <td id="invoiceHeader">
                  <Link to={`/invoice/${invoice._id}`} className="linkText">
                    {invoice.invoice_id}
                  </Link>
                </td>
                <td>
                  {Date.now() > Date.parse(invoice.dueDate) ? <span className="status-text" id="overdue">Po splatnosti</span> : (invoice.paid ? <span className="status-text" id="paid">Uhrazeno</span> : <span className="status-text" id="unpaid">Neuhrazeno</span>)}
                </td>
                <td>
                  <Link to={`/contact/${invoice.contact_id}`} className="linkText">
                    .
                  </Link>
                </td>
                <td>{convertDate(invoice.dateOfIssuing)}</td>
                <td>{convertDate(invoice.dueDate)}</td>
                <td>{calculateInvoiceTotal(invoice.products)}</td>
                <td id="edit-btn">
                  <img src={pdficon} alt="" id="img" title="Upravit" />
                  <img src={sendicon} alt="" id="img" title="Smazat" />
                  <Link to={`/updateInvoice/${invoice._id}`}>
                    <img src={fileedit} alt="" id="img" title="Upravit" />
                  </Link>
                  <img src={trashcan} alt="" id="img" title="Upravit" onClick={(e) => handleDelete(e, invoice._id)} />
                </td>
              </tr>
            ))}
          {filteredInvoices.length === 0 ? (
            <p style={{ color: "grey", marginTop: "5px", marginLeft: "20px" }}>
              Nebyly nalezeny faktury...
            </p>
          ) : (
            ""
          )}
        </Table>
      </Content>
    </>
  );
}
