// Import styles 
import "../../scss/Buttons.scss"

export default function Buttons({children}){
    return(
        <>
            <div className="action-box">
                <div className="action-buttons">
                    {children}
                </div>
            </div>
        </>
    )
}