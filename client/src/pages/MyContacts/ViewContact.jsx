import { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import Swal from "sweetalert2";

// Import assets
import trashcan from "../../assets/icons/TrashCan.svg";
import fileedit from "../../assets/icons/FileEdit.svg";

// Import components
import Content from "../../components/Content";
import Input from "../../components/Input";
import Buttons from "../../components/Buttons";
import LoadingPage from "../../components/LoadingPage";
import NotFound from "../../components/NotFound";

// Import styles
import "../../scss/styles.scss";
import "../../scss/Table.scss";

// Import model
import { getContactById, deleteContact } from "../../models/contact";

// Import alert
import { mixinAlert } from "../../utils/sweetAlerts";

export default function ViewContact() {
  const { id } = useParams();
  const { user } = useAuth();
  const [contact, setContact] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * Načteme specifický kontakt, pokud neexistuje, nastavíme `setIsLoading` na null, tím uživatele přesměrujeme na `NotFound` stránku.
     * Pokud ano, uložíme jeho data do proměnné
     */
    const load = async () => {
      const data = await getContactById(id);
      if (data.status === 500 || data.status === 404) return setIsLoading(null);
      if (data.status === 200) {
        setContact(data.payload);
        setIsLoading(false);
      }
    };
    load();
    document.title = `Kontakt • iFaktura`;
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
      if (result.isConfirmed) {
        const data = await deleteContact(contactId);
        if (data.status === 200) {
          mixinAlert("success", "Kontakt byl smazán.");
          navigate("/contacts");
          return;
        }
        setInfo(data.message);
      }
    });
  };

  if (isLoading === null) {
    return <NotFound />;
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <>
      <Content
        headtext={contact.detailsName}
        page="Seznam položek"
        box_width="280"
      >
        <header className="table-navbar">
          <div
            className="table-navbar-icons"
            style={{ width: "100%", marginTop: "1px", marginBottom: "-8px" }}
          >
            <img
              src={fileedit}
              alt=""
              title="Upravit kontakt"
              onClick={() => navigate(`/updateContact/${contact._id}`)}
            />
            <img
              src={trashcan}
              alt=""
              title="Smazat kontakt"
              onClick={(e) => handleDelete(e, contact._id)}
            />
            <hr class="vertical-line"></hr>
          </div>
        </header>
        <h1 className="input-header-text">Základní údaje</h1>
        <div className="inputs">
          <Input text="Jméno a příjmení / Název firmy" required={true}>
            <b>{contact.detailsName}</b>
          </Input>
          <Input text="IČO" required={false}>
            <b>{contact.ico ? contact.ico : "-"}</b>
          </Input>
        </div>

        <div className="inputs">
          <Input text="Ulice a číslo popisné" required={true}>
            <b>{contact.street}</b>
          </Input>
          <Input text="Město" required={true}>
            <b>{contact.city}</b>
          </Input>
          <Input text="PSČ" required={true}>
            <b>{contact.zipCode}</b>
          </Input>
        </div>

        <h1 className="input-header-text">Kontaktní údaje</h1>
        <div className="inputs">
          <Input text="Telefon" required={false}>
            <b>{contact.phone ? contact.phone : "-"}</b>
          </Input>
          <Input text="Webové stránky" required={false}>
            <b>{contact.website ? contact.website : "-"}</b>
          </Input>
          <Input text="E-mail" required={true}>
            <b>{contact.email}</b>
          </Input>
        </div>

        <div className="inputs">
          <Input text="DIČ" required={false}>
            <b>{contact.dic ? contact.dic : "-"}</b>
          </Input>
        </div>

        <div style={{ marginTop: "150px" }}>
          <Buttons>
            <Link to={"/contacts"}><button id="empty">Zpět</button></Link>
          </Buttons>
        </div>
      </Content>
    </>
  );
}
