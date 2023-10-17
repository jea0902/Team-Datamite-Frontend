import { Button } from "@mui/material";
import 배경 from "../src/assets/image/background.jpg";
import 태블로 from "../src/assets/image/tableau.png";
import "./css/styles.css";
import { Link } from "react-router-dom";

function Main() {
  return (
    <div
      className="container-fluid"
      style={{ padding: 0, overflowX: "hidden" }}
    >
      <div
        style={{
          position: "relative",
          height: "80vh",
          width: "100vw",
          background: `url(${배경}) no-repeat center/cover`,
        }}
      />
      <p
        style={{
          position: "absolute",
          top: "30vh",
          left: "10vw",
          fontSize: "1.2rem",
        }}
      >
        챗봇에 증상 한 줄만 입력하면, <br />
        <br />
        <strong style={{ fontSize: "2rem" }}>
          진료과, 맞춤 병원, 진단명을 <br />
          한번에 알려드립니다.
        </strong>
      </p>
      <Button
        component={Link}
        to="/chat"
        style={{
          position: "absolute",
          top: "55vh",
          left: "13vw",
          backgroundColor: "#36454F",
          color: "white",
          padding: "12px",
          fontSize: "1rem",
        }}
      >
        챗봇 바로 시작
      </Button>
      <img
        src={태블로}
        alt="picture"
        style={{
          position: "absolute",
          top: "30vh",
          left: "60vw",
          width: "500px",
          height: "280px",
          borderRadius: "25px",
          zIndex: 2,
        }}
      />
    </div>
  );
}

export default Main;
