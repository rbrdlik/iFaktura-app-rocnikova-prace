// Import styles
import "../../scss/Input.scss";

export default function Input({ children, text, required, width, mwidth }) {
  let wStyle;

  if (width) {
    wStyle = {
      width: `${width}px`,
    };
  }

  if (mwidth) {
    wStyle = {
      maxWidth: `${mwidth}px`,
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
