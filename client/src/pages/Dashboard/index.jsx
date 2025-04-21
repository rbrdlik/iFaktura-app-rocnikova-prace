import { useEffect, useState } from "react";

// Import components
import Content from "../../components/Content";
import StatsBox from "../../components/StatsBox";
import Graph from "../../components/Graph";

// Import models
import {
  getAllInvoicesStats,
  getAllInvoicesAnnual,
} from "../../models/invoice";

// Import utils
import { calculateInvoiceTotalWithoutDph } from "../../utils/calculateTotals";

// Import styles
import "../../scss/styles.scss";

export default function Dashboard() {
  const [period, setPeriod] = useState("month");
  const [stats, setStats] = useState({});
  const [monthlyIncome, setMonthlyIncome] = useState([]);

  const loadStats = async () => {
    const res = await getAllInvoicesStats(period);
    if (res.status === 200) setStats(res.payload);
  };

  const loadInvoices = async () => {
    const res = await getAllInvoicesAnnual();
    if (res.status === 200) calculateAnnualIncome(res.payload);
  };

  useEffect(() => {
    document.title = "Přehled • iFaktura";
    loadStats();
    loadInvoices();
  }, [period]);

  const handlePeriod = async (value) => {
    setPeriod(value);
  };

  const calculateAnnualIncome = (allInvoices) => {
    const months = [
      "leden",
      "únor",
      "březen",
      "duben",
      "květen",
      "červen",
      "červenec",
      "srpen",
      "září",
      "říjen",
      "listopad",
      "prosinec",
    ];

    const results = months.map((month) => {
      const monthInvoices = allInvoices[month];
      let totalPrice = 0.00;

      monthInvoices.forEach((invoice) => {
        totalPrice += parseFloat(
          calculateInvoiceTotalWithoutDph(invoice.products)
        );
      });

      return totalPrice.toFixed(2);
    });

    setMonthlyIncome(results);
  };

  return (
    <>
      <Content headtext="Přehled" page="Přehled" box_width="185">
        <div className="header">
          <div className="part" id="l">
            <h1 className="dashboardH1">Faktury</h1>
          </div>
          <div className="part" id="r">
            <p style={{ marginRight: "15px" }}>Období: </p>
            <div className="part-btns">
              <button
                className={period === "month" && "active"}
                onClick={() => handlePeriod("month")}
              >
                Měsíc
              </button>
              <button
                className={period === "quarter" && "active"}
                onClick={() => handlePeriod("quarter")}
              >
                Kvartál
              </button>
              <button
                className={period === "year" && "active"}
                onClick={() => handlePeriod("year")}
              >
                Rok
              </button>
            </div>
          </div>
        </div>
        <div className="flex">
          <StatsBox
            count={
              stats.paidInvoices?.length +
              stats.unpaidInvoices?.length +
              stats.overdueInvoices?.length
            }
            status={"a"}
            text={"Celkem"}
          />
          <StatsBox
            count={stats.paidInvoices?.length}
            status={"p"}
            text={"Uhrazené"}
          />
          <StatsBox
            count={stats.unpaidInvoices?.length}
            status={"u"}
            text={"Neuhrazené"}
          />
          <StatsBox
            count={stats.overdueInvoices?.length}
            status={"o"}
            text={"Po splatnosti"}
          />
        </div>
        <h1 className="dashboardH1" style={{ marginTop: "50px" }}>
          Roční zisk z faktur ({new Date().getFullYear()})
        </h1>
        <Graph graphStats={monthlyIncome} />
      </Content>
    </>
  );
}
