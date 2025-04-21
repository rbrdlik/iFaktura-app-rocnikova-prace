import CountUp from 'react-countup';

// Import assets
import CircleCheck from "../../assets/icons/CircleCheck.svg"
import CircleClock from "../../assets/icons/CircleClock.svg"
import CircleInfo from "../../assets/icons/CircleInfo.svg"
import CircleXMark from "../../assets/icons/CircleXMark.svg"

// Import styles
import "../../scss/StatsBox.scss"

export default function StatsBox({count, status, text}){
    return(
        <>
            <div className="stats-box">
                <div className="stats-box-img">
                    <img src={status === "p" ? CircleCheck : status === "u" ? CircleXMark : status === "o" ? CircleClock : CircleInfo} alt="" id={status}/>
                </div>
                <h1><CountUp start={0} end={count} duration={3}/></h1>
                <b>{text}</b>
            </div>
        </>
    )
}