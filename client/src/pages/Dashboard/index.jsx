import { useEffect } from "react";

// Import components
import Content from "../../components/Content";

// Import styles
import "../../scss/styles.scss";

export default function Dashboard() {
    useEffect(() => {
       document.title = "Přehled • iFaktura"
    }, []);

  return (
    <>
        <Content headtext="Přehled" page="Přehled" box_width="185">

        </Content>
    </>
  );
}
