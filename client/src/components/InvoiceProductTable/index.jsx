import "../../scss/styles.scss"
import { useAuth } from "../../context/AuthProvider";


export default function InvoiceProductTable({children}) {
  const { user } = useAuth();

  const platceDph = user.dph === "Plátce DPH" ? true : false;

  return (
    <>
      <table className="table">
        <tr style={{ marginBottom: "5px" }}>
          <th style={{ width: "9%", textAlign: "center" }}>
            Množství <span className="red">*</span>
          </th>
          <th style={{ width: "13%", textAlign: "center" }}>
            Jednotka <span className="red">*</span>
          </th>
          <th style={{ width: "20%", textAlign: "center" }}>
            Název položky <span className="red">*</span>
          </th>
          <th style={{ width: "9%", textAlign: "center" }}>
            Cena <span className="red">*</span>
          </th>
          {platceDph ? (
            <th style={{ width: "13%", textAlign: "center" }}>
              Cena je <span className="red">*</span>
            </th>
          ) : (
            ""
          )}
          {platceDph ? (
            <th style={{ width: "13%", textAlign: "center" }}>
              DPH (%) <span className="red">*</span>
            </th>
          ) : (
            ""
          )}
          <th style={{ width: "9%", textAlign: "center" }}>Sleva</th>
          <th style={{ width: "13%", textAlign: "center" }}>Typ slevy</th>
          <th style={{ width: "20%", textAlign: "right" }}>Celkem</th>
          <th style={{ width: "10%", textAlign: "center" }}></th>
        </tr>
        {children}
      </table>
    </>
  );
}
