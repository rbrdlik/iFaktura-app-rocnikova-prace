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

// Import alert
import { mixinAlert } from "../../utils/sweetAlerts";

export default function CreateItem() {
  const { user } = useAuth();
  const [formData, setFormData] = useState()
  const [info, setInfo] = useState();
  const [amountNumber, setAmountNumber] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Vytvořit položku • iFaktura";
  }, []);

  const sendData = async () => {
    const res = await createProduct(formData);
    if(res.status === 201){
      mixinAlert("success", "Produkt byl vytvořen.")
      return navigate("/products");
    } 
    setInfo(res.message);
  }

  const handleInput = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      amount: amountNumber,
      user_id: user._id
    }));
  }

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

  const calculateTotals = () => {
    const quantity = parseFloat(amountNumber) || 1;
    const pricePerUnit = parseFloat(formData?.price) || 0;
    const dphRate = formData?.dph ? parseFloat(formData.dph) / 100 : 0;
    const isDphIncluded = formData?.dphType === "S DPH";
    const discount = parseFloat(formData?.discount) || 0;
    const discountIsPercentage = formData?.discountType === "%";
  
    let priceWithoutDph = isDphIncluded ? pricePerUnit / (1 + dphRate) : pricePerUnit;
    let totalPriceWithoutDph = priceWithoutDph * quantity;
    let dphAmount = formData?.dph ? totalPriceWithoutDph * dphRate : 0;
    let discountAmount = formData?.discount
      ? discountIsPercentage
        ? (totalPriceWithoutDph * discount) / 100
        : discount
      : 0;
  
    let totalWithDph = totalPriceWithoutDph + dphAmount - discountAmount;
  
    if (totalWithDph < 0) totalWithDph = 0;
  
    return {
      priceWithoutDph: totalPriceWithoutDph.toFixed(2),
      dphAmount: dphAmount > 0 ? dphAmount.toFixed(2) : null,
      discountAmount: discountAmount > 0 ? discountAmount.toFixed(2) : null,
      totalWithDph: totalWithDph.toFixed(2),
    };
  };
  
  const totals = calculateTotals();
  
  const platceDph = user.dph === "Plátce DPH" ? true : false;

  return (
    <>
      <Content
        headtext="Vytvořit položku"
        page="Vytvořit položku"
        box_width="295"
      >
        <h1 className="input-header-text">Základní údaje položky</h1>
        <div className="inputs">
          <NumberInput text={"Množství"} required={true} numberValue={1} changedValue={setAmountNumber} />
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
        <p>{info}</p>

        <h1 className="input-header-text">Cena {platceDph ? "& DPH" : ""}</h1>
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
                  <option selected>Bez DPH</option>
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
            {platceDph ? <p>Celkem bez DPH</p> : ""}
            {totals.dphAmount !== null && <p>DPH {formData?.dph}</p>}
            {totals.discountAmount !== null && <p>Sleva {formData?.discount} {formData?.discountType}</p>}
            <h1>{platceDph ? "Celkem s DPH" : "Cena celkem"}</h1>
          </div>
          <div className="text-right">
            {platceDph ? <p>{totals.priceWithoutDph} Kč</p> : ""}
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
