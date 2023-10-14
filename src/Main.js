import 배경 from "../src/assets/image/background.jpg";
import "./css/styles.css";

function Main() {
  return (
    <div
      className="container-fluid"
      style={{ padding: 0, overflowX: "hidden" }}
    >
      <div style={{ position: "relative" }}>
        <img
          src={배경}
          alt="background"
          style={{ height: "80vh", width: "100vw" }}
        />
      </div>
    </div>
  );
}

export default Main;
