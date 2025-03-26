import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Import components
import Content from "../../components/Content";
import Table from "../../components/Table";

// Import assets
import trashcan from "../../assets/icons/TrashCan.svg";
import fileedit from "../../assets/icons/FileEdit.svg";
import sendicon from "../../assets/icons/PaperPlane.svg";
import pdficon from "../../assets/icons/Pdf.svg";

// Import styles
import "../../scss/styles.scss";

export default function ViewAllInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [indexOfFirstItem, setIndexOfFirstItem] = useState();
  const [indexOfLastItem, setIndexOfLastItem] = useState();

  useEffect(() => {
    document.title = "Vydané faktury • iFaktura";
  }, []);

  const filteredInvoices = searchValue
    ? invoices.filter((invoice) =>
        invoice.detailsName.toLowerCase().includes(searchValue.toLowerCase())
      )
    : invoices;

  const platceDph = true;

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

          <tr>
            <td id="invoiceHeader">
              <Link to={""} className="linkText">2025000001</Link>
            </td>
            <td><span className="status-text" id="overdue">Po splatnosti</span></td>
            <td>
              <Link to={""} className="linkText">Firma 1</Link>
            </td>
            <td>10.10.2025</td>
            <td>24.10.2025</td>
            <td>100.000.00 Kč</td>
            <td id="edit-btn">
              <img src={pdficon} alt="" id="img" title="Upravit" />
              <img src={sendicon} alt="" id="img" title="Smazat" />
              <img src={fileedit} alt="" id="img" title="Upravit" />
              <img src={trashcan} alt="" id="img" title="Upravit" />
            </td>
          </tr>
        </Table>
      </Content>
    </> 
  );
}
