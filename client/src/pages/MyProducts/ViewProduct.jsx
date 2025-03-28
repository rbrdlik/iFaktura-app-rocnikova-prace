import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import { getProductById, deleteProduct } from "../../models/product";

// Import alert
import { mixinAlert } from "../../utils/sweetAlerts";

export default function ViewItem() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * Načteme specifickou položku, pokud neexistuje, nastavíme `setIsLoading` na null, tím uživatele přesměrujeme na `NotFound` stránku.
     * Pokud ano, uložíme její data do proměnné
     */
    const load = async () => {
      const data = await getProductById(id);
      if (data.status === 500 || data.status === 404) return setIsLoading(null);
      if (data.status === 200) {
        setProduct(data.payload);
        setIsLoading(false);
      }
    };
    load();
    document.title = `Položka • iFaktura`;
  }, []);

  /**
   * Tato funkce slouží k výpočtu celkových cenových částek, včetně a bez DPH, s ohledem na množství, cenu za jednotku, slevu a typ DPH (včetně nebo bez DPH).
   * Funkce vrací objekt, který obsahuje cenu bez DPH, částku DPH, částku slevy a celkovou cenu s DPH.
   */
  const calculateTotals = () => {
    const quantity = parseFloat(product.amount) || 1;
    const pricePerUnit = parseFloat(product.price) || 0;
    const dphRate = product.dph ? parseFloat(product.dph) / 100 : 0;
    const isDphIncluded = product.dphType === "S DPH";
    const discount = parseFloat(product.discount) || 0;
    const discountIsPercentage = product.discountType === "%";

    let priceWithoutDph = isDphIncluded
      ? pricePerUnit / (1 + dphRate)
      : pricePerUnit;
    let totalPriceWithoutDph = priceWithoutDph * quantity;
    let dphAmount = product.dph ? totalPriceWithoutDph * dphRate : 0;
    let discountAmount = product.discount
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

  /**
   * Tato funkce odešle modal, kde se zeptáme uživatele zda chce smazat položku, pokud odsouhlasí, zavoláme funkci `deleteProduct()`
   * @param {*} productId - id polžky
   */
  const handleDelete = async (e, productId) => {
    e.preventDefault();

    const Alert = Swal.mixin({
      buttonsStyling: true,
    });
    Alert.fire({
      title: "Opravdu chcete smazat tuto položku?",
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
        const data = await deleteProduct(productId);
        if (data.status === 200) {
          mixinAlert("success", "Položka byla smazána.");
          navigate("/products")
          return;
        }
      }
    });
  };

  const totals = calculateTotals();

  const platceDph = user.dph === "Plátce DPH" ? true : false;

  if (isLoading === null) {
    return <NotFound />;
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <>
      <Content
        headtext={product.productName}
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
              title="Upravit položku"
              onClick={() => navigate(`/updateProduct/${product._id}`)}
            />
            <img
              src={trashcan}
              alt=""
              title="Smazat položku"
              onClick={(e) => handleDelete(e, product._id)}
            />
            <hr class="vertical-line"></hr>
          </div>
        </header>
        <h1 className="input-header-text">Základní údaje položky</h1>
        <div className="inputs">
          <Input text="Množství" required={true} width={180}>
            <b>{product.amount}</b>
          </Input>
          <Input text="Jednotka" required={true} width={180}>
            <b>{product.unit}</b>
          </Input>
          <Input text="Název položky" required={true}>
            <b>{product.productName}</b>
          </Input>
        </div>

        <h1 className="input-header-text">Cena {platceDph ? "& DPH" : ""}</h1>
        <div className="inputs">
          <Input text="Cena položky za množství" required={true} width={350}>
            <b>{product.price} Kč</b>
          </Input>
          {platceDph ? (
            <Input text="Sazba DPH" required={true} width={170}>
              <b>{product.dph}</b>
            </Input>
          ) : (
            ""
          )}
          {platceDph ? (
            <Input text="Zadaná cena je:" required={true} width={180}>
              <b>{product.dphType}</b>
            </Input>
          ) : (
            ""
          )}
        </div>

        <h1 className="input-header-text">Sleva</h1>
        <div className="inputs">
          <Input text="Výše slevy" required={false} width={350}>
            <b>{product.discount === null ? "-" : product.discount}</b>
          </Input>
          <Input text="Typ slevy" required={false} width={160}>
            <b>{product.discountType === null ? "-" : product.discountType}</b>
          </Input>
        </div>

        <div className="info-box">
          <div className="text-left">
            {platceDph ? <p>Celkem bez DPH</p> : ""}
            {totals.dphAmount !== null && platceDph && <p>DPH {product.dph}</p>}
            {totals.discountAmount !== null && (
              <p>
                Sleva {product.discount} {product.discountType}
              </p>
            )}
            <h1>{platceDph ? "Celkem s DPH" : "Cena celkem"}</h1>
          </div>
          <div className="text-right">
            {platceDph ? <p>{totals.priceWithoutDph} Kč</p> : ""}
            {totals.dphAmount !== null && platceDph && (
              <p>+{totals.dphAmount} Kč</p>
            )}
            {totals.discountAmount !== null && (
              <p>-{totals.discountAmount} Kč</p>
            )}
            <h1>{totals.totalWithDph} Kč</h1>
          </div>
        </div>

        <div style={{ marginTop: "230px" }}>
          <Buttons>
            <Link to={"/products"}>
              <button id="empty">Zpět</button>
            </Link>
          </Buttons>
        </div>
      </Content>
    </>
  );
}
