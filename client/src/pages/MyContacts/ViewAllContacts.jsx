import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

// Import model
import { deleteContact, getAllContacts } from "../../models/contact"

// Import components
import Content from "../../components/Content";
import Table from "../../components/Table";
import NotFound from "../../components/NotFound";
import LoadingPage from "../../components/LoadingPage";

// Import assets
import trashcan from "../../assets/icons/TrashCan.svg";
import fileedit from "../../assets/icons/FileEdit.svg";

// Import styles
import "../../scss/styles.scss";

// Import alert
import { mixinAlert } from "../../utils/sweetAlerts";

export default function ViewAllContacts() {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [indexOfFirstItem, setIndexOfFirstItem] = useState();
  const [indexOfLastItem, setIndexOfLastItem] = useState();

  useEffect(() => {
    /**
     * Načteme všechny kontakty, pokud žádný neexistují, nastavíme `setIsLoading` na null, tím uživatele přesměrujeme na `NotFound` stránku. 
     * Pokud ano, uložíme je do `contacts`
     */
    const load = async () => {
      const res = await getAllContacts();
      if(res.status === 500 || res.status === 404) return setIsLoading(null);
      if(res.status === 200){
        setContacts(res.payload);
        setIsLoading(false);
      }
    }

    load();
    document.title = "Seznam položek • iFaktura";
  }, []);

  /**
   * Tato funkce odešle modal, kde se zeptáme uživatele zda chce smazat kontakt, pokud odsouhlasí, zavoláme funkci `deleteContact()`
   * @param {*} contactId - id kontaktu
   */
  const handleDelete = async (e, contactId) => {
    e.preventDefault();

    const Alert = Swal.mixin({
      buttonsStyling: true,
    });
    Alert.fire({
      title: "Opravdu chcete smazat tento kontakt?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ano, smazat",
      color: "black",
      confirmButtonColor: "#28a745",
      cancelButtonText: "Zrušit",
      cancelButtonColor: "#dc3545",
      reverseButtons: true,
    }).then(async (result) => {
      if(result.isConfirmed){
        const data = await deleteContact(contactId);
        if(data.status === 200){
          mixinAlert("success", "Kontakt byl smazán.");
          window.location.reload(); // Znovu načteme stránku aby se změny projevily a tabulka se znovu vypsala
          return;
        }
        setInfo(data.message);
      }
    })
  }

  /**
  * Tento kód provádí filtrování produktů podle hledaného výrazu (`searchValue`).
  * Použije se metoda `.filter()`, která prochází pole contacts a vybere jen ty kontakty, které odpovídají hledání.
  */
  const filteredContacts = searchValue ? contacts.filter((contact) => contact.detailsName.toLowerCase().includes(searchValue.toLowerCase())) : contacts;

  if(isLoading === null){
    return <NotFound />
  }

  if(isLoading) {
    return <LoadingPage />
  }

  return (
    <>
      <Content headtext="Seznam kontaktů" page="Seznam kontaktů" box_width="302">
        <Table setSearch={setSearchValue} items={filteredContacts} setIndexOfFirstItem={setIndexOfFirstItem} setIndexOfLastItem={setIndexOfLastItem} linkToCreate={"createContact"}>
          <tr>
            <th id="header">Jméno / Firma</th>
            <th>IČO</th>
            <th>DIČ</th>
            <th>E-mail</th>
            <th id="edit-btn"></th>
          </tr>
          
          {filteredContacts.slice(indexOfFirstItem, indexOfLastItem).map((contact) => (
            <tr key={contact._id}>
              <td id="header">
                <Link to={`/contact/${contact._id}`}>{contact.detailsName}</Link>
              </td>
              <td>{contact.ico ? contact.ico : "-"}</td>
              <td>{contact.dic ? contact.dic : "-"}</td>
              <td>{contact.email}</td>
              <td id="edit-btn">
                <Link to={`/updateContact/${contact._id}`}>
                  <img src={fileedit} alt="Upravit" id="img" title="Upravit" />
                </Link>
                <img src={trashcan} alt="" id="img" title="Smazat" onClick={(e) => handleDelete(e, contact._id)}
                />
              </td>
            </tr>
          ))}
          {filteredContacts.length === 0 ? <p style={{color: "grey", marginTop: "5px", marginLeft: "20px"}}>Nebyly nalezeny žádné položky...</p> : ""}
        </Table>
      </Content>
    </>
  );
}
