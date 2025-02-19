import SidebarMenu from "../SidebarMenu";

export default function Content({children, headtext}) {
  return (
    <>
      <section>
        <SidebarMenu />
        <section className="box">
          <span className="header-text-box">
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
