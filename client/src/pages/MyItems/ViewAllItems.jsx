import { useEffect } from "react";
import { Link } from "react-router-dom";

// Import components
import Content from "../../components/Content";
import Table from "../../components/Table";

// Import assets
import trashcan from "../../assets/icons/TrashCan.svg";
import fileedit from "../../assets/icons/FileEdit.svg";

// Import styles
import "../../scss/styles.scss";

export default function ViewAllItems() {
  useEffect(() => {
    document.title = "Seznam položek • iFaktura";
  }, []);

  const platceDph = false;

  return (
    <>
      <Content headtext="Seznam položek" page="Seznam položek" box_width="295">
        <Table>
          <tr>
            <th id="checkbox-th"></th>
            <th id="header">Název položky</th>
            <th>Sleva</th>
            <th>Jednotka</th>
            {platceDph ? <th>Cena s DPH</th> : ""}
            {platceDph ? <th>Cena bez DPH</th> : ""}
            {platceDph ? <th>DPH (%)</th> : ""}
            {platceDph ?  "" : <th>Cena</th>}
            <th id="edit-btn"></th>
          </tr>
          <tr>
            <label className="checkbox" id="checkbox-th">
              <input type="checkbox" />
              <span className="checkmark"></span>
            </label>
            <td id="header">
              <Link to={""}>Položka 1</Link>
            </td>
            <td>10 Kč</td>
            <td>ks</td>
            {platceDph ? <td>100,00 Kč</td> : ""}
            {platceDph ? <td>200,00 Kč</td> : ""}
            {platceDph ? <td>300,00 Kč</td> : ""}
            {platceDph ?  "" : <td>300,00 Kč</td>}
            <td id="edit-btn">
              <img src={fileedit} alt="" id="img" title="Upravit" />
              <img src={trashcan} alt="" id="img" title="Smazat" />
            </td>
          </tr>
          <tr>
            <label className="checkbox" id="checkbox-th">
              <input type="checkbox" />
              <span className="checkmark"></span>
            </label>
            <td id="header">
              <Link to={""}>Položka 1</Link>
            </td>
            <td>10 Kč</td>
            <td>ks</td>
            {platceDph ? <td>100,00 Kč</td> : ""}
            {platceDph ? <td>200,00 Kč</td> : ""}
            {platceDph ? <td>300,00 Kč</td> : ""}
            {platceDph ?  "" : <td>300,00 Kč</td>}
            <td id="edit-btn">
              <img src={fileedit} alt="" id="img" title="Upravit" />
              <img src={trashcan} alt="" id="img" title="Smazat" />
            </td>
          </tr>
        </Table>
      </Content>
    </>
  );
}
