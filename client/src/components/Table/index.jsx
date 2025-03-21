import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Import assets
import angleLeft from "../../assets/icons/AngleLeft.svg";
import angleRight from "../../assets/icons/AngleRight.svg";
import search from "../../assets/icons/Search.svg";
import trashcan from "../../assets/icons/TrashCan.svg";
import fileplus from "../../assets/icons/FileCirclePlus.svg";

// Import styles
import "../../scss/Table.scss";

export default function Table({ children }) {
  const navigate = useNavigate();

  const navigateToCreate = () => {
    return navigate("/createProduct");
  }
  return (
    <>
      <header className="table-navbar">
        <div className="searchBar-box">
          <div className="searchBar">
            <img src={search} alt="" />
            <input type="text" placeholder="Hledat podle názvu..." />
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
          <p id="table-action-text">1 z 1 položek</p>
        </div>
        <div id="table-action-middle">
          <button>
            <img src={angleLeft} alt="" />
          </button>
          <p>1</p>
          <button>
            <img src={angleRight} alt="" />
          </button>
        </div>
        <div id="table-action-right">
          <p id="table-action-text">Počet položek na stránku: </p>
          <div className="select-container" style={{ width: "85px" }}>
            <select>
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
