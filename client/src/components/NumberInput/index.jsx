import { useState } from "react";

// Import assets
import minus from "../../assets/icons/Minus.svg";
import plus from "../../assets/icons/Plus.svg";

// Import styles
import "../../scss/NumberInput.scss";

export default function NumberInput({text, required, numberValue, changedValue}) {
  const [value, setValue] = useState(numberValue);

  /**
   * Aktualizujeme hodnotu a voláme "onChange", aby se hodnota dostala ven
   */
  const updateValue = (newValue) => {
    setValue(newValue);
    if (changedValue) {
      onChange(newValue);
    }
  };

  /**
   * Zvyšujeme aktuální hodnotu (value) po kliknutí na Plus
   */
  const increaseNumber = () => {
    setValue(value + 1);
  };

  /**
   * Snižujeme aktuální hodnotu (value) po kliknutí na Minus
   */
  const decreaseNumber = () => {
    if (value > 0) {
      setValue(value - 1);
    }
  };

  /**
   * Ruční měnění hodnoty přes input (pro případ zadávání nějakého většího čísla).
   * Kontrola zda je zadaný input číslo pomocí regulárního výrazu "/^\d*$/" (/^ = začátek řetězce; \d* = libovolné číslo 0-9 a může se opakovat nekonečno krát; $/ = konec řetězce)
   * Poté převádí input na číslo, aby se s tím dalo dále pracovat
   */
  const handleChange = (e) => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue)) {
      updateValue(newValue === "" ? 0 : parseInt(newValue, 10));
    }
  };

  return (
    <>
      <div className="number-input-box">
        <h4>{text} {required ? <span className="required">*</span> : ""}</h4>
        <div className="number-input">
        <img src={minus} alt="" onClick={decreaseNumber} />
          <input type="text" value={value} onChange={handleChange} />
          <img src={plus} alt="" onClick={increaseNumber} />
        </div>
      </div>
    </>
  );
}
