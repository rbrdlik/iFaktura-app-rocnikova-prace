// Import styles
import "../../scss/Input.scss";

export default function Input({ children, text, required, width }) {
  let wStyle;

  if (width) {
    wStyle = {
      width: `${width}px`,
    };
  }

  return (
    <>
      <div className="input-box" style={wStyle}>
        <h4>
          {text} {required ? <span className="required">*</span> : ""}
        </h4>
        {children}
      </div>
    </>
  );
}
