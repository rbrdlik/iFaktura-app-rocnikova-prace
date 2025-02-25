import { useState } from "react";

// Import assets
import uploadIcon from "../../assets/icons/Upload.svg"

// Import styles
import "../../scss/ImageUpload.scss"

export default function ImageUpload({ header, imgSize, imgId, setImage}){
    const [imageUrl, setImageUrl] = useState("");

    const previewImage = (e) => {
        const file = e.target.files[0];
        if(file){
            setImage(file);
            const imgUrl = URL.createObjectURL(file);
            setImageUrl(imgUrl);
        }
    };

    return(
        <>  
            <div className="input-content">
                <h1 className="input-header-text">{header}</h1>
                <p className="input-text">Doporučená velikost obrázku {imgSize}</p>
                <div className="input-img-content">
                    {imageUrl ? <img src={imageUrl} alt="Nahraný obrázek" /> : <p>Žádný obrázek</p>}
                </div>
                <div className="upload-btn-box">
                    <label htmlFor={`file-upload-${imgId}`} id="file-upload-text">
                        <img src={uploadIcon} alt="" /> Nahrát
                    </label>
                    <input type="file" id={`file-upload-${imgId}`} className="file-upload" accept="image/*" onChange={previewImage} />
                </div>
            </div>
        </>
    )
}