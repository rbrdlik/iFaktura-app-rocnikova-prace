import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";

// Import assets
import uploadIcon from "../../assets/icons/Upload.svg";

// Import styles
import "../../scss/ImageUpload.scss";

// Import alert
import { mixinAlert } from "../../utils/sweetAlerts";


export default function ImageUpload({ header, imgSize, imgId, setImage }) {
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [savedImage, setSavedImage] = useState(user.invoiceLogo);

  /**
   * Touto funkcí nejprve ověříme zda nahraný soubor je opravdu obrázek a jeho velikost je menší než 5MB
   * Poté uloží obrázek pomocí setImage do proměnné v CreateDetails.jsx
   * Vytvoří URL adresu obrázku pro zobrazení náhledu
   */
  const handleFile = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSize = 5 * 1024 * 1024;

    if (file && allowedTypes.includes(file.type)) {
      if(file.size > maxSize){
        mixinAlert("error", "Soubor je příliš velký. (Max. 5MB)")
      } else{
        setImage(file);
        const imgUrl = URL.createObjectURL(file);
        setImageUrl(imgUrl);
      }
    } else {
      mixinAlert("error", "Nepovolený formát souboru.");
    }
  };

  /**
   * Zpracuje obrázek nahraný přes input a zavolá funkci handleFile
   */
  const previewImage = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  /**
   * Funguje podobně jako previewImage, akorát zpracovává obrázek který jsme do divu "dropnuli" přesunuli
   */
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  /**
   * Tyto dvě funkce nejsou nutné, pouze si zde hraju s designem => když přesouvám obrázek do divu tak se změní jeho border a background color pro lepší přehledost
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemoveImage = (e) => {
    e.preventDefault();
    setSavedImage(null);
    setImageUrl("");
    setImage("null")
  }

  return (
    <>
      <div className="input-content">
        <h1 className="input-header-text">{header}</h1>
        <p className="input-text">
          Povolené formáty: JPEG, JPG & PNG
          <br />
          Doporučená velikost loga {imgSize}
        </p>{" "}
        {/* Pomocí isDragging přidávám styl divu aby při přetahování souboru změnil svojí barvu*/}
        <div
          className={`input-img-content ${isDragging ? "dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {imageUrl ? (
            <img src={imageUrl} alt="Nahraný obrázek" />
          ) : savedImage ? (
            <img
              src={`/uploads/${savedImage}`}
              alt="Nahraný obrázek"
            />
          ) : (
            <p>
              Přetáhněte sem obrázek <br />
              nebo klikněte na nahrát
            </p>
          )}
        </div>
        <div id="flex">
          <div className="upload-btn-box">
            <label htmlFor={`file-upload-${imgId}`} id="file-upload-text">
              <img src={uploadIcon} alt="" /> Nahrát
            </label>
            <input
              type="file"
              id={`file-upload-${imgId}`}
              className="file-upload"
              onChange={previewImage}
            />
          </div>
          {savedImage || imageUrl ? (
            <div className="upload-btn-box">
              <button id="deleteImage" onClick={handleRemoveImage}>
                Smazat obrázek
              </button>
            </div>
          ) : ""}
        </div>
      </div>
    </>
  );
}
