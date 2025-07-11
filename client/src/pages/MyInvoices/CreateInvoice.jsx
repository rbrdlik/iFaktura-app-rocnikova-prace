import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

// Import components
import Content from "../../components/Content";
import Input from "../../components/Input";
import Buttons from "../../components/Buttons";

// Import assets
import trashcan from "../../assets/icons/TrashCan.svg";
import plus from "../../assets/icons/Plus.svg";

// Import style
import "../../scss/styles.scss";
import InvoiceProductTable from "../../components/InvoiceProductTable";
import { mixinAlert } from "../../utils/sweetAlerts";

// Import models
import { getAllProducts } from "../../models/product";
import { getAllContacts } from "../../models/contact";
import { createInvoice } from "../../models/invoice";

// Import utils
import { calculateTotals } from "../../utils/calculateTotals";

const defaultItem = {
  amount: "",
  unit: "",
  productName: "",
  price: "",
  dph: null,
  dphType: null,
  discount: null,
  discountType: null,
};

export default function CreateInvoice() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({ paid: false });
  const [items, setItems] = useState([defaultItem]);
  const navigate = useNavigate();

  const platceDph = user.dph === "Plátce DPH";

  useEffect(() => {
    const loadData = async () => {
      const [productRes, contactRes] = await Promise.all([
        getAllProducts(),
        getAllContacts(),
      ]);
      if (productRes.status === 200) setProducts(productRes.payload);
      if (contactRes.status === 200) setContacts(contactRes.payload);
    };

    loadData();
    document.title = "Vydat fakturu • iFaktura";
  }, []);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      products: items,
    }));
  }, [items]);

  const sendData = async () => {
    console.log(formData);
    if (
      formData.paymentMethod === "Bankovní převod" &&
      [user.accountNumber, user.iban, user.swift].some((val) => !val)
    ) {
      mixinAlert(
        "error",
        "Pro platbu bankovním převodem musíte mít nastavené bankovní údaje."
      );
    } else {
      const res = await createInvoice(formData);
      if (res.status === 201) {
        mixinAlert("success", "Faktura byla vystavena");
        return navigate("/invoices");
      }
      if (res.status === 500) {
        mixinAlert("error", `${res.message}.`);
      }
    }
  };

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
    setItems([...items, { ...defaultItem }]);
  };

  /**
   * Funkce pro odstranění položky z pole `items` pomocí indexu.
   * Upraví stav `items` odstraněním položky na zadaném indexu.
   *
   * @param index - indx položky.
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
    const selectedItem = products.find(
      (product) => product.productName === e.target.value
    );

    const newItem = {
      amount: selectedItem.amount,
      unit: selectedItem.unit,
      productName: selectedItem.productName,
      price: selectedItem.price,
      dph: selectedItem.dph ? selectedItem.dph : null,
      dphType: selectedItem.dphType ? selectedItem.dphType : null,
      discount: selectedItem.discount ? selectedItem.discount : null,
      discountType: selectedItem.discountType
        ? selectedItem.discountType
        : null,
    };

    setItems([...items, newItem]);

    e.target.selectedIndex = 0;
  };

  /**
   * Funkce pro výběr kontaktu a aktualizaci `formData` s Id vybraného kontaktu.
   */
  const handleSelectContact = (e) => {
    const selectedContact = contacts.find(
      (contact) => contact.detailsName === e.target.value
    );
    setFormData((prev) => ({
      ...prev,
      contact_id: selectedContact._id,
    }));
  };

  const handleInput = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      products: items,
      user_id: user._id,
    }));
  };

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

    const requiredInputs = document.querySelectorAll(
      "input[required], select[required]"
    );
    const emptyFields = Array.from(requiredInputs).filter(
      (input) => !input.value.trim()
    );

    if (emptyFields.length > 0) {
      mixinAlert("error", "Vyplňte všechna povinná pole.");
      return;
    }

    sendData();
  };

  return (
    <>
      <Content headtext="Vydat fakturu" page="Vydat fakturu" box_width="280">
        <h1 className="input-header-text">Základní informace</h1>
        <div className="inputs">
          <Input text="Odběratel" required={true} width={450}>
            <div className="select-container">
              <select name="unit" required onChange={handleSelectContact}>
                <option value="" disabled selected>
                  Vybrat...
                </option>
                {contacts.length > 0 ? (
                  contacts.map((contact) => (
                    <option key={contact._id} value={contact.detailsName}>
                      {contact.detailsName}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Nejsou vytvořeny žádné kontakty
                  </option>
                )}
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
              required
            />
          </Input>
          <Input text="Popis" required={true}>
            <input
              type="text"
              name="description"
              onChange={handleInput}
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
              required
            />
          </Input>
          <Input text="Datum splatnosti" required={true}>
            <input type="date" name="dueDate" onChange={handleInput} required />
          </Input>
          {platceDph && (
            <Input text="Datum zdaněného plnění (DUZP)" required={true}>
              <input type="date" name="duzp" onChange={handleInput} required />
            </Input>
          )}
        </div>

        <h1 className="input-header-text">Platební údaje</h1>
        <div className="inputs">
          <Input text="Způsob úhrady" required={true} mwidth={540}>
            <div className="select-container">
              <select name="paymentMethod" required onChange={handleInput}>
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
                <input type="checkbox" onChange={handleCheckboxChange} />
                <span class="slider round"></span>
              </label>
              <p>Uhrazeno</p>
            </div>
          </Input>
          {formData.paymentMethod === "Bankovní převod" ? (
            <>
              <Input text="Bankovní účet" required={false}>
                <div className="bankText">
                  {user.accountNumber ? (
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
                    <p style={{ color: "red" }}>
                      Bankovní údaje nejsou nastaveny
                    </p>
                  )}
                  <Link to={"/details"}>Upravit bankovní údaje</Link>
                </div>
              </Input>
            </>
          ) : (
            ""
          )}
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
                    <p>
                      {calculateTotals(item, undefined, user).totalWithDph ===
                      "NaN"
                        ? "0.00"
                        : calculateTotals(item, undefined, user).totalWithDph}
                      Kč
                    </p>
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
                {products.length > 0 ? (
                  products.map((product) => (
                    <option key={product._id} value={product.productName}>
                      {product.productName}
                    </option>
                  ))
                ) : (
                  <option value="" disabled style={{ color: "grey" }}>
                    Nejsou vytvořeny žádné položky
                  </option>
                )}
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
              Vydat
            </button>
          </Buttons>
        </div>
      </Content>
    </>
  );
}
