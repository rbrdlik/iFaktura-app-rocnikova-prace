import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

// Import components
import Content from "../../components/Content";
import Input from "../../components/Input";
import Buttons from "../../components/Buttons";
import NumberInput from "../../components/NumberInput";
import NotFound from "../../components/NotFound";
import LoadingPage from "../../components/LoadingPage";

// Import styles
import "../../scss/styles.scss";

// Import models
import { getProductById, updateProduct } from "../../models/product";

// Import utils
import { mixinAlert } from "../../utils/sweetAlerts";
import { calculateTotals } from "../../utils/calculateTotals";

export default function UpdateItem() {
  const { id } = useParams();
  const { user } = useAuth()
  const [product, setProduct] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState();
  const [amountNumber, setAmountNumber] = useState(1);
  const navigate = useNavigate();

  const totals = calculateTotals(formData, amountNumber, user);
  const platceDph = user.dph === "Plátce DPH";

  useEffect(() => {
    const load = async () => {
      const data = await getProductById(id);
      if (data.status === 500 || data.status === 404) return setIsLoading(null);
      if (data.status === 200) {
        setProduct(data.payload);
        setAmountNumber(data.payload.amount);
        setFormData({
          ...data.payload,
        });
        setIsLoading(false);
      }
    };
    load();
    document.title = "Upravit položku • iFaktura";
  }, []);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      amount: amountNumber,
    }));
  }, [amountNumber]);

  const sendData = async () => {
    const res = await updateProduct(id, formData);
    if(res.status === 200){
      mixinAlert("success", "Změny byly uloženy.")
      return navigate(`/product/${res.payload._id}`);
    }
    if(res.status === 500){
      mixinAlert("error", `${res.message}`)
    }
  }

  const handleInput = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
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
  }

  if(isLoading === null){
    return <NotFound />
  }

  if(isLoading){
    return <LoadingPage />
  }

  return (
    <>
      <Content
        headtext="Upravit položku"
        page="Seznam položek"
        box_width="295"
      >
        <h1 className="input-header-text">Základní údaje položky</h1>
        <div className="inputs">
          <NumberInput text={"Množství"} required={true} numberValue={product.amount} changedValue={setAmountNumber} />
          <Input text="Jednotka" required={true} width={180} >
            <div className="select-container">
              <select name="unit" onChange={handleInput} defaultValue={product.unit} required>
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
            <input name="productName" type="text" onChange={handleInput} defaultValue={product.productName} required/>
          </Input>
        </div>

        <h1 className="input-header-text">Cena {platceDph && "& DPH"}</h1>
        <div className="inputs">
          <Input text="Cena položky" required={true} width={350}>
            <input type="text" name="price" onChange={handleInput} defaultValue={product.price} required/>
          </Input>
          {platceDph ? (
            <Input text="Sazba DPH" required={true} width={170}>
              <div className="select-container">
                <select name="dph" onChange={handleInput} defaultValue={product.dph} required>
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
                <select name="dphType" onChange={handleInput} defaultValue={product.dphType} required> 
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
            <input type="text" name="discount" onChange={handleInput} defaultValue={product.discount}/>
          </Input>
          <Input text="Typ slevy" required={false} width={160}>
            <div className="select-container">
              <select name="discountType" onChange={handleInput} defaultValue={product.discountType}>
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
            {totals.dphAmount !== null && platceDph && <p>DPH {formData?.dph}</p>}
            {totals.discountAmount !== null && <p>Sleva {formData?.discount} {formData?.discountType}</p>}
            <h1>{platceDph ? "Celkem s DPH" : "Cena celkem"}</h1>
          </div>
          <div className="text-right">
            {platceDph && <p>{totals.priceWithoutDph} Kč</p>}
            {totals.dphAmount !== null && platceDph && <p>+{totals.dphAmount} Kč</p>}
            {totals.discountAmount !== null && <p>-{totals.discountAmount} Kč</p>}
            <h1>{totals.totalWithDph} Kč</h1>
          </div>
        </div>

        <div style={{ marginTop: "230px" }}>
          <Buttons>
            <Link to={"/products"}><button id="empty">Zrušit</button></Link>
            <button id="fill" onClick={handleButton}>Upravit</button>
          </Buttons>
        </div>
      </Content>
    </>
  );
}
