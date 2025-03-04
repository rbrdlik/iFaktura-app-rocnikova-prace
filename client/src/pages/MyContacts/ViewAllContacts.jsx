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

export default function ViewAllContacts() {
  useEffect(() => {
    document.title = "Seznam kontaktů • iFaktura";
  }, []);

  const platceDph = false;

  return (
    <>
      <Content headtext="Seznam kontaktů" page="Seznam kontaktů" box_width="302">
        <Table>
          <tr>
            <th id="checkbox-th"></th>
            <th id="header">Jméno / Firma</th>
            <th>IČO</th>
            <th>DIČ</th>
            <th>E-mail</th>
            <th id="edit-btn"></th>
          </tr>
          <tr>
            <label className="checkbox" id="checkbox-th">
              <input type="checkbox" />
              <span className="checkmark"></span>
            </label>
            <td id="header">
              <Link to={""}>Jméno Příjmení</Link>
            </td>
            <td>4864854856</td>
            <td>CZ4864854856</td>
            <td>nejakyemail@email.cz</td>
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
              <Link to={""}>Firma 1</Link>
            </td>
            <td>4864854856</td>
            <td>CZ4864854856</td>
            <td>nejakyemail@email.cz</td>
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
