import { useEffect, useState } from "react";

// Import components
import Content from "../../components/Content";
import StatsBox from "../../components/StatsBox";
import Graph from "../../components/Graph";

// Import models
import { getAllInvoicesStats } from "../../models/invoice";

// Import styles
import "../../scss/styles.scss";

export default function Dashboard() {
  const [period, setPeriod] = useState("month");
  const [stats, setStats] = useState({});

  const loadStats = async () => {
    const res = await getAllInvoicesStats(period);
    if(res.status === 200) setStats(res.payload);
    console.log(res.payload)
  }

  useEffect(() => {
    document.title = "Přehled • iFaktura";

    loadStats();
  }, []);

  const handlePeriod = async (value) => {
    setPeriod(value);
    await loadStats();
  }

  return (
    <>
      <Content headtext="Přehled" page="Přehled" box_width="185">
        <div className="header">
          <div className="part" id="l">
            <h1 className="dashboardH1">Faktury</h1>
          </div>
          <div className="part" id="r">
            <p style={{marginRight: "15px"}}>Období: </p>
            <div className="part-btns">
              <button className={period === "month" && "active"} onClick={() => handlePeriod("month")}>Měsíc</button>
              <button className={period === "quarter" && "active"} onClick={() => handlePeriod("quarter")}>Kvartál</button>
              <button className={period === "year" && "active"} onClick={() => handlePeriod("year")}>Rok</button>
            </div>
          </div>
        </div>
        <div className="flex">
          <StatsBox count={stats.paidInvoices?.length + stats.unpaidInvoices?.length + stats.overdueInvoices?.length} status={"a"} text={"Celkem"} />
          <StatsBox count={stats.paidInvoices?.length} status={"p"} text={"Uhrazené"} />
          <StatsBox count={stats.unpaidInvoices?.length} status={"u"} text={"Neuhrazené"}/>
          <StatsBox count={stats.overdueInvoices?.length} status={"o"} text={"Po splatnosti"}/>
        </div>
        <h1 className="dashboardH1" style={{marginTop: "50px"}}>
          Roční zisk z faktur ({new Date().getFullYear()})
        </h1>
        <Graph graphStats={[100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200]}/>
      </Content>
    </>
  );
}
