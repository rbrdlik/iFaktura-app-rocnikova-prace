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
      <section>
      {sidebarMenu ? <SidebarMenu active_page={page}/> : ""}
        <section className="box">
          <span className="header-text-box" style={width}>
            <h1>{headtext}</h1>
          </span>
          <div className="content-box">
            {children}
          </div>
        </section>
      </section>
    </>
  );
}
