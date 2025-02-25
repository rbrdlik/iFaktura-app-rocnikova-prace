import { useState, useEffect } from "react"

// Import components
import Content from "../../components/Content"
import Input from "../../components/Input"
import Buttons from "../../components/Buttons"
import ImageUpload from "../../components/ImageUpload"

// Import styles
import "../../scss/styles.scss"

export default function CreateDetails(){
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);

    useEffect(() => {
       document.title = "Moje údaje • iFaktura"
    }, []);

    console.log("Image1 "+image1)
    console.log("Image2 "+image2)

    return(
        <>
            <Content headtext="Moje údaje" page="Moje údaje" box_width="225">
                <h1 className="input-header-text">Základní údaje</h1>
                <div className="inputs">
                    <Input text="Jméno a příjmení / Název firmy" required={true}>
                        <input type="text" />
                    </Input>
                    <Input text="IČO" required={false}>
                        <input type="text" />
                        <div className="switch-text">
                            <label class="switch">
                              <input type="checkbox"/>
                              <span class="slider round"></span>
                            </label>
                            <p>Nemám IČO</p>
                        </div>
                    </Input>
                </div>
                <div className="inputs">
                    <Input text="Ulice a číslo popisné" required={true}>
                        <input type="text" disabled/>
                    </Input>
                    <Input text="Město" required={true}>
                        <input type="text" />
                    </Input>
                    <Input text="PSČ" required={true}>
                        <input type="text" />
                    </Input>
                </div>

                <h1 className="input-header-text">Kontaktní údaje</h1>
                <div className="inputs">
                    <Input text="Telefon" required={false}>
                        <input type="text" />
                    </Input>
                    <Input text="Webové stránky" required={false}>
                        <input type="text" />
                    </Input>
                    <Input text="E-mail" required={true}>
                        <div className="email-input">
                            <h3>nejakyemail@email.cz</h3>
                            <button>Změnit email</button>
                        </div>
                    </Input>
                </div>

                <h1 className="input-header-text">Daňové údaje</h1>
                <div className="inputs">
                    <Input text="DPH" required={true}>
                        <div className="select-container">
                            <select name="cars" id="cars">
                              <option>Neplátce DPH</option>
                              <option>Plátce DPH</option>
                            </select>
                        </div>
                    </Input>
                    <Input text="DIČ" required={false}>
                        <input type="text" />
                    </Input>
                </div>

                <h1 id="header-text2">Personalizace faktury</h1>
                <div className="input-img-content-box">
                    <ImageUpload header={"Logo na faktuře"} imgSize={"200x200"} imgId={"1"} setImage={setImage1} />
                    <ImageUpload header={"Logo na faktuře"} imgSize={"200x200"} imgId={"2"} setImage={setImage2} />
                </div>

                <Buttons>
                    <button id="fill">Uložit</button>
                </Buttons>
            </Content>
        </>
    )
}