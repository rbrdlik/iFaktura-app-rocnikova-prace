// Import components
import SidebarMenu from "../SidebarMenu";

// Import styles
import "../../scss/Content.scss"

export default function Content({children, headtext, page, box_width, sidebarMenu = true}) {
  let width = {
    width: `${box_width}px`
  }
  return (
    <>
      <section className="section">
      {sidebarMenu ? <SidebarMenu active_page={page}/> : ""}
        <section className="box">
          <span className="header-text-box" style={width}>
            <h1 style={{maxWidth: `${box_width}px`, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{headtext}</h1>
          </span>
          <div className="content-box">
            {children}
          </div>
        </section>
      </section>
    </>
  );
}
