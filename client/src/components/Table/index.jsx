import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Import assets
import angleLeft from "../../assets/icons/AngleLeft.svg";
import angleRight from "../../assets/icons/AngleRight.svg";
import search from "../../assets/icons/Search.svg";
import fileplus from "../../assets/icons/FileCirclePlus.svg";

// Import styles
import "../../scss/Table.scss";

export default function Table({ children, setSearch, products, setIndexOfLastItem, setIndexOfFirstItem }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const navigate = useNavigate();

  const navigateToCreate = () => {
    return navigate("/createProduct");
  }

  const handleSearch = (e) => {
    setSearch(e.target.value);
  }

  const handleOption = (e) => {
    setItemsPerPage(e.target.value); 
    setCurrentPage(1);
  }

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  setIndexOfLastItem(indexOfLastItem)
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  setIndexOfFirstItem(indexOfFirstItem)

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <>
      <header className="table-navbar">
        <div className="searchBar-box">
          <div className="searchBar">
            <img src={search} alt="" />
            <input type="text" placeholder="Hledat podle názvu..." onChange={handleSearch}/>
          </div>
        </div>
        <div className="table-navbar-icons">
          <img src={fileplus} alt="" title="Vytvořit nové" onClick={navigateToCreate}/>
          <hr class="vertical-line"></hr>
        </div>
      </header>
      <section className="table-container">
        <table className="table">
          {children}
        </table>
      </section>

      <section className="table-action">
        <div id="table-action-left">
          <p id="table-action-text">Strana {currentPage} z {totalPages}</p>
        </div>
        <div id="table-action-middle">
          <button onClick={prevPage} id={currentPage === 1 ? "disabledButton" : ""}>
            <img src={angleLeft} alt="" />
          </button>
          <p>{currentPage}</p>
          <button onClick={nextPage} id={currentPage === totalPages ? "disabledButton" : ""}>
            <img src={angleRight} alt="" />
          </button>
        </div>
        <div id="table-action-right">
          <p id="table-action-text">Počet položek na stránku: </p>
          <div className="select-container" style={{ width: "85px" }}>
            <select value={itemsPerPage} onChange={handleOption}>
              <option>25</option>
              <option>50</option>
              <option>75</option>
              <option>100</option>
            </select>
          </div>
        </div>
      </section>
    </>
  );
}
