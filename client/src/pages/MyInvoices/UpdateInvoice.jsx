import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

// Import components
import Content from "../../components/Content";
import Input from "../../components/Input";
import Buttons from "../../components/Buttons";
import NotFound from "../../components/NotFound";
import LoadingPage from "../../components/LoadingPage";

// Import assets
import trashcan from "../../assets/icons/TrashCan.svg";
import plus from "../../assets/icons/Plus.svg";

// Import style
import "../../scss/styles.scss";
import InvoiceProductTable from "../../components/InvoiceProductTable";
import { mixinAlert } from "../../utils/sweetAlerts";

// Import models
import { getAllProducts } from "../../models/product";
import { getAllContacts } from "../../models/contact"
import { updateInvoice, getInvoiceById } from "../../models/invoice";

// Import utils
import { calculateTotals } from "../../utils/calculateTotals";

const defaultItem = {amount: "", unit: "", productName: "", price: "", dph: null, dphType: null, discount: null, discountType: null};

export default function UpdateInvoice() {
  const { id } = useParams();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({});
  const [items, setItems] = useState([defaultItem]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const platceDph = user.dph === "Plátce DPH";

  useEffect(() => {
    const loadProducts = async () => {
      const res = await getAllProducts();
      if (res.status === 200) setProducts(res.payload);
    };
    const loadContacts = async () => {
      const res = await getAllContacts();
      if (res.status === 200) setContacts(res.payload)
    }
    const loadInvoice = async () => {
      const res = await getInvoiceById(id)
      if(res.status === 500 || res.status === 404) return setIsLoading(null);
      if(res.status === 200){
        setFormData(res.payload);
        setItems(res.payload.products);
        setIsLoading(false);
      }
    }

    loadProducts();
    loadContacts();
    loadInvoice();
    document.title = "Upravit fakturu • iFaktura";
  }, []);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      products: items,
    }));
  }, [items]);

  const sendData = async () => {
    const res = await updateInvoice(id, formData);
    if(res.status === 200){
      mixinAlert("success", "Faktura byla upravena.")
      return navigate("/invoices")
    }
    if(res.status === 500){
      mixinAlert("error", `${res.message}.`)
    }
  }

  /**
   * Tato funkce upravuje `items` po upravení hodnoty jakéhokoliv item inputu.
   * Kopíruje aktuální seznam položek, aktualizuje konkrétní část položky podle indexu
   * @param {*} index - index části položky
   */
  const handleItemInput = (e, index) => {
    const updated = [...items];
    updated[index][e.target.name] = e.target.value;
    setItems(updated);
  };

  /**
  * Funkce pro přidání nové položky do seznamu položek `items`.
  * Vytvoří novou prázdnou položku a přidá ji na konec seznamu.
  */
  const addItem = () => {
    setItems([
      ...items,
      { ...defaultItem }
    ]);
  };

  /**
  * Funkce pro odstranění položky z pole `items` pomocí indexu.
  * Upraví stav `items` odstraněním položky na zadaném indexu.
  * 
  * @param index - index položky.
  */
  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  /**
  * Funkce pro výběr položky ze seznamu produktů a přidání do seznamu položek na faktuře.
  * Při výběru položky se nastaví její informace do nové položky a přidá se na konec seznamu všech položek na faktuře.
  */
  const handleSelectItem = (e) => {
    const selectedItem = products.find((product) => product.productName === e.target.value)

    const newItem = {
      amount: selectedItem.amount,
      unit:  selectedItem.unit,
      productName:  selectedItem.productName,
      price:  selectedItem.price,
      dph:  selectedItem.dph ? selectedItem.dph : null,
      dphType:  selectedItem.dphType ? selectedItem.dphType : null,
      discount:  selectedItem.discount ? selectedItem.discount : null,
      discountType:  selectedItem.discountType ? selectedItem.discountType : null,
    }

    setItems([...items, newItem]);

    e.target.selectedIndex = 0;
  }

  /**
   * Funkce pro výběr kontaktu a aktualizaci `formData` s Id vybraného kontaktu.
   */
  const handleSelectContact = (e) => {
    const selectedContact = contacts.find((contact) => contact.detailsName === e.target.value)
    setFormData((prev) => ({
      ...prev,
      contact_id: selectedContact._id
    }))
  }

  const handleInput = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      products: items,
      user_id: user._id
    }));
  }

  /**
   * Aktualizuje stav podle checkboxu
   */
  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      paid: e.target.checked,
    }));
  };

  const handleButton = (e) => {
    e.preventDefault();

    const requiredInputs = document.querySelectorAll("input[required], select[required]");
    const emptyFields = Array.from(requiredInputs).filter(
      (input) => !input.value.trim()
    );

    if (emptyFields.length > 0) {
      mixinAlert("error", "Vyplňte všechna povinná pole.");
      return;
    }

    sendData();
  }

  if(isLoading === null){
    return <NotFound />
  }
  
  if(isLoading){
    return <LoadingPage />
  }

  return (
    <>
      <Content headtext="Vydané faktury" page="Vydané faktury" box_width="280">
        <h1 className="input-header-text">Základní informace</h1>
        <div className="inputs">
          <Input text="Odběratel" required={true} width={450}>
            <div className="select-container">
              <select name="unit" required onChange={handleSelectContact} defaultValue={contacts.find((c) => c._id === formData.contact_id)?.detailsName || ""}>
                <option value="" disabled selected>
                  Vybrat...
                </option>
                {contacts.map((contact) => (
                  <option key={contact._id} value={contact.detailsName}>
                    {contact.detailsName}
                  </option>
                ))}
              </select>
            </div>
          </Input>
        </div>

        <div className="inputs">
          <Input text="Číslo objednávky" required={true}>
            <input
              type="text"
              name="orderNumber"
              onChange={handleInput}
              defaultValue={formData.orderNumber}
              required
            />
          </Input>
          <Input text="Popis" required={true}>
            <input
              type="text"
              name="description"
              onChange={handleInput}
              defaultValue={formData.description}
              required
            />
          </Input>
        </div>

        <h1 className="input-header-text">Datum</h1>
        <div className="inputs">
          <Input text="Datum vystavení" required={true}>
            <input
              type="date"
              name="dateOfIssuing"
              onChange={handleInput}
              defaultValue={formData.dateOfIssuing.slice(0, 10)}
              required
            />
          </Input>
          <Input text="Datum splatnosti" required={true}>
            <input type="date" name="dueDate" onChange={handleInput} defaultValue={formData.dueDate.slice(0, 10)} required />
          </Input>
          {platceDph && (
            <Input text="Datum zdaněného plnění (DUZP)" required={true}>
              <input type="date" name="duzp" onChange={handleInput} defaultValue={formData.duzp.slice(0, 10)} required />
            </Input>
          )}
        </div>

        <h1 className="input-header-text">Platební údaje</h1>
        <div className="inputs">
          <Input text="Způsob úhrady" required={true}>
            <div className="select-container">
              <select name="paymentMethod" required onChange={handleInput} defaultValue={formData.paymentMethod}>
                <option value="" disabled selected>
                  Vybrat...
                </option>
                <option>Bankovní převod</option>
                <option>Dobírkou</option>
                <option>PayPal</option>
              </select>
            </div>
            <div className="switch-text">
              <label class="switch">
                {formData.paid ? (
                  <input type="checkbox" onChange={handleCheckboxChange} defaultChecked/>
                ) : (
                  <input type="checkbox" onChange={handleCheckboxChange} />
                )}
                <span class="slider round"></span>
              </label>
              <p>Uhrazeno</p>
            </div>
          </Input>
          <Input text="Bankovní účet" required={false}>
            <div className="bankText">
              <p>
                <b>Číslo účtu:</b> {user.accountNumber}
              </p>
              <p>
                <b>IBAN:</b> {user.iban}
              </p>
              <p>
                <b>SWIFT:</b> {user.swift}
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
            <InvoiceProductTable>
              {items.map((item, index) => (
                <tr key={index}>
                  <td style={{ width: "9%" }}>
                    <input
                      type="number"
                      id="invoiceProductInput"
                      min={1}
                      onChange={(e) => handleItemInput(e, index)}
                      name="amount"
                      required
                      value={item.amount}
                    />
                  </td>
                  <td style={{ width: "9%" }}>
                    <div className="select-container" id="selectTableOption">
                      <select
                        name="unit"
                        required
                        onChange={(e) => handleItemInput(e, index)}
                        value={item.unit}
                      >
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
                    <input
                      type="text"
                      id="invoiceProductInput"
                      onChange={(e) => handleItemInput(e, index)}
                      name="productName"
                      required
                      value={item.productName}
                    />
                  </td>
                  <td style={{ width: "9%" }}>
                    <input
                      type="number"
                      id="invoiceProductInput"
                      min={1}
                      onChange={(e) => handleItemInput(e, index)}
                      name="price"
                      required
                      value={item.price}
                    />
                  </td>
                  {platceDph && (
                    <td style={{ width: "13%" }}>
                      <div className="select-container" id="selectTableOption">
                        <select
                          name="dphType"
                          required
                          onChange={(e) => handleItemInput(e, index)}
                          value={item.dphType}
                        >
                          <option value="" disabled selected>
                            Vybrat...
                          </option>
                          <option>Bez DPH</option>
                          <option>S DPH</option>
                        </select>
                      </div>
                    </td>
                  )}
                  {platceDph && (
                    <td style={{ width: "13%" }}>
                      <div className="select-container" id="selectTableOption">
                        <select
                          name="dph"
                          required
                          onChange={(e) => handleItemInput(e, index)}
                          value={item.dph}
                        >
                          <option value="" disabled selected>
                            Vybrat...
                          </option>
                          <option>0 %</option>
                          <option>11 %</option>
                          <option>21 %</option>
                        </select>
                      </div>
                    </td>
                  )}
                  <td style={{ width: "9%" }}>
                    <input
                      type="number"
                      id="invoiceProductInput"
                      min={1}
                      onChange={(e) => handleItemInput(e, index)}
                      name="discount"
                      value={item.discount}
                    />
                  </td>
                  <td style={{ width: "13%" }}>
                    <div className="select-container" id="selectTableOption">
                      <select
                        name="discountType"
                        onChange={(e) => handleItemInput(e, index)}
                        value={item.discountType}
                      >
                        <option value="" disabled selected>
                          Vybrat...
                        </option>
                        <option>Kč</option>
                        <option>%</option>
                      </select>
                    </div>
                  </td>
                  <td style={{ width: "20%" }}>
                    <p>{calculateTotals(item, undefined, user).totalWithDph}Kč</p>
                  </td>
                  <td style={{ width: "10%" }}>
                    {items.length > 1 && (
                      <img
                        src={trashcan}
                        alt=""
                        id="img"
                        style={{ marginLeft: "15px" }}
                        onClick={() => removeItem(index)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </InvoiceProductTable>
          </section>
          <div className="btns">
            <button onClick={addItem}>
              <img src={plus} alt="" />
              Další řádek
            </button>
            <div>
              <select id="select-product" onChange={handleSelectItem}>
                <option value="" disabled selected>
                  Vybrat položku ze seznamu...
                </option>
                {products.map((product) => (
                  <option key={product._id} value={product.productName}>
                    {product.productName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "50px" }}>
          <Buttons>
            <button id="empty" onClick={() => navigate("/invoices")}>
              Zrušit
            </button>
            <button id="fill" onClick={handleButton}>
              Upravit
            </button>
          </Buttons>
        </div>
      </Content>
    </>
  );
}
