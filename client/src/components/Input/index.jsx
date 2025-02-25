import "../../scss/Input.scss"

export default function Input({children, text, required}) {
  return (
    <>
      <div className="input-box">
        <h4>
          {text} {required ? <span className="required">*</span> : ""}
        </h4>
        {children}
      </div>
    </>
  );
}
