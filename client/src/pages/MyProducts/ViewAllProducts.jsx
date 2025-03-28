import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import Swal from "sweetalert2";

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

// Import model
import { deleteProduct, getAllProducts } from "../../models/product";

// Import alert
import { mixinAlert } from "../../utils/sweetAlerts";

export default function ViewAllItems() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [indexOfFirstItem, setIndexOfFirstItem] = useState();
  const [indexOfLastItem, setIndexOfLastItem] = useState();
  
  useEffect(() => {
    /**
     * Načteme všechny položky, pokud žádný neexistují, nastavíme `setIsLoading` na null, tím uživatele přesměrujeme na `NotFound` stránku. 
     * Pokud ano, uložíme je do `products`
     */
    const load = async () => {
      const res = await getAllProducts();
      if(res.status === 500 || res.status === 404) return setIsLoading(null);
      if(res.status === 200){
        setProducts(res.payload);
        setIsLoading(false);
      }
    }

    load();
    document.title = "Seznam položek • iFaktura";
  }, []);

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
      if(result.isConfirmed){
        const data = await deleteProduct(productId);
        if(data.status === 200){
          mixinAlert("success", "Položka byla smazána.");
          window.location.reload(); // Znovu načteme stránku aby se změny projevily a tabulka se znovu vypsala
          return;
        }
      }
    })
  }

  /**
   * Tento kód provádí filtrování produktů podle hledaného výrazu (`searchValue`).
   * Použije se metoda `.filter()`, která prochází pole products a vybere jen ty produkty, které odpovídají hledání.
   */
  const filteredProducts = searchValue ? products.filter((product) => product.productName.toLowerCase().includes(searchValue.toLowerCase())) : products;

  const platceDph = user.dph === "Plátce DPH" ? true : false; // Zjištujeme zda má uživatel nastaveno že je plátcem DPH

  if(isLoading === null){
    return <NotFound />
  }

  if(isLoading) {
    return <LoadingPage />
  }

  return (
    <>
      <Content headtext="Seznam položek" page="Seznam položek" box_width="295">
        <Table setSearch={setSearchValue} items={filteredProducts} setIndexOfFirstItem={setIndexOfFirstItem} setIndexOfLastItem={setIndexOfLastItem} linkToCreate={"createProduct"} searchBy={"názvu"}>
          <tr>
            <th id="header">Název položky</th>
            <th>Sleva</th>
            <th>Jednotka</th>
            {platceDph ? <th>Cena s DPH</th> : ""}
            {platceDph ? <th>Cena bez DPH</th> : ""}
            {platceDph ? <th>DPH (%)</th> : ""}
            {platceDph ?  "" : <th>Cena</th>}
            <th id="edit-btn"></th>
          </tr>

          {filteredProducts.slice(indexOfFirstItem, indexOfLastItem).map((product) => (
            <tr key={product._id}>
              <td id="header">
                <Link to={`/product/${product._id}`}>{product.productName}</Link>
              </td>
              <td>
                {product.discount ? `${product.discount} ${product.discountType === "%" ? "%" : "Kč"}` : "-"}
              </td>
              <td>{product.unit}</td>
              {platceDph ? <td>{(product.price * ((product.dph ? parseFloat(product.dph) / 100 : 0)+1)).toFixed(2)} Kč</td> : ""}
              {platceDph ? <td>{product.price.toFixed(2)} Kč</td> : ""}
              {platceDph ? <td>{product.dph}</td> : ""}
              {platceDph ? "" : <td>{product.price.toFixed(2)} Kč</td>}
              <td id="edit-btn">
                <Link to={`/updateProduct/${product._id}`}>
                  <img src={fileedit} alt="Upravit" id="img" title="Upravit" />
                </Link>
                <img src={trashcan} alt="" id="img" title="Smazat" onClick={(e) => handleDelete(e, product._id)}
                />
              </td>
            </tr>
          ))}
          {filteredProducts.length === 0 ? <p style={{color: "grey", marginTop: "5px", marginLeft: "20px"}}>Nebyly nalezeny žádné položky...</p> : ""}
        </Table>
      </Content>
    </>
  );
}
