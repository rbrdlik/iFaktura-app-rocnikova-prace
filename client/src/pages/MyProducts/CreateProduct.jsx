import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";

// Import model
import { createProduct } from "../../models/product";

// Import components
import Content from "../../components/Content";
import Input from "../../components/Input";
import Buttons from "../../components/Buttons";
import NumberInput from "../../components/NumberInput";

// Import styles
import "../../scss/styles.scss";

// Import utils
import { mixinAlert } from "../../utils/sweetAlerts";
import { calculateTotals } from "../../utils/calculateTotals";

export default function CreateItem() {
  const { user } = useAuth();
  const [formData, setFormData] = useState()
  const [amountNumber, setAmountNumber] = useState(1);
  const navigate = useNavigate();

  const totals = calculateTotals(formData, amountNumber, user);
  const platceDph = user.dph === "Plátce DPH";

  useEffect(() => {
    document.title = "Vytvořit položku • iFaktura";
  }, []);

  const sendData = async () => {
    const res = await createProduct(formData);
    if(res.status === 201){
      mixinAlert("success", "Produkt byl vytvořen.")
      return navigate("/products");
    } 
    if(res.status === 500){
      mixinAlert("error", "Někde nastala chyba.")
    }
  }

  const handleInput = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      amount: amountNumber,
      user_id: user._id
    }));
  }

  /**
   * Po kliknutí na button, kontrolujeme zda mají všechny povinné inputy nějakou `value`, pokud ano, zavoláme `sendData()`. 
   * Pokud ne, odešleme error alert
   */
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
  };

  return (
    <>
      <Content
        headtext="Vytvořit položku"
        page="Vytvořit položku"
        box_width="295"
      >
        <h1 className="input-header-text">Základní údaje položky</h1>
        <div className="inputs">
          <NumberInput text={"Množství"} required={true} numberValue={1} changedValue={setAmountNumber} onChange={handleInput} />
          <Input text="Jednotka" required={true} width={180}>
            <div className="select-container">
              <select name="unit" onChange={handleInput} required>
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
          </Input>
          <Input text="Název položky" required={true}>
            <input type="text" name="productName" onChange={handleInput} required/>
          </Input>
        </div>

        <h1 className="input-header-text">Cena {platceDph && "& DPH"}</h1>
        <div className="inputs">
          <Input text="Cena položky za množství" required={true} width={350}>
            <input type="number" name="price" onChange={handleInput} min={1} required/>
          </Input>
          {platceDph ? (
            <Input text="Sazba DPH" required={true} width={170}>
              <div className="select-container">
                <select name="dph" onChange={handleInput} required>
                  <option value="" disabled selected>
                    Vybrat...
                  </option>
                  <option>0 %</option>
                  <option>11 %</option>
                  <option>21 %</option>
                </select>
              </div>
            </Input>
          ) : (
            ""
          )}
          {platceDph ? (
            <Input text="Zadaná cena je:" required={true} width={180}>
              <div className="select-container">
                <select name="dphType" onChange={handleInput} required>
                  <option value="" disabled selected>
                    Vybrat...
                  </option>
                  <option>Bez DPH</option>
                  <option>S DPH</option>
                </select>
              </div>
            </Input>
          ) : (
            ""
          )}
        </div>

        <h1 className="input-header-text">Sleva</h1>
        <div className="inputs">
          <Input text="Výše slevy" required={false} width={350}>
            <input type="number"  name="discount" onChange={handleInput} min={1}/>
          </Input>
          <Input text="Typ slevy" required={false} width={160}>
            <div className="select-container">
              <select name="discountType" onChange={handleInput}>
                <option value="" disabled selected>
                  Vybrat...
                </option>
                <option>Kč</option>
                <option>%</option>
              </select>
            </div>
          </Input>
        </div>

        <div className="info-box">
          <div className="text-left">
            {platceDph && <p>Celkem bez DPH</p>}
            {totals.dphAmount !== null && <p>DPH {formData?.dph}</p>}
            {totals.discountAmount !== null && <p>Sleva {formData?.discount} {formData?.discountType}</p>}
            <h1>{platceDph ? "Celkem s DPH" : "Cena celkem"}</h1>
          </div>
          <div className="text-right">
            {platceDph && <p>{totals.priceWithoutDph} Kč</p>}
            {totals.dphAmount !== null && <p>+{totals.dphAmount} Kč</p>}
            {totals.discountAmount !== null && <p>-{totals.discountAmount} Kč</p>}
            <h1>{totals.totalWithDph} Kč</h1>
          </div>
        </div>

        <div style={{ marginTop: "230px" }}>
          <Buttons>
            <Link to={"/dashboard"}><button id="empty">Zrušit</button></Link>
            <button id="fill" onClick={handleButton}>Vytvořit</button>
          </Buttons>
        </div>
      </Content>
    </>
  );
}
