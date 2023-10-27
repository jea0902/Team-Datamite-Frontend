import { Button } from "@mui/material";
import 배경 from "../src/assets/image/background.jpg";
import 대시보드페이지 from "../src/assets/image/DashboardPage.png";
import 챗봇페이지 from "../src/assets/image/chatPageBackground.png";
import "./css/styles.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Main() {
  const [activeImage, setActiveImage] = useState(null);

  const handleImageClick = (imgId) => {
    setActiveImage(imgId);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prevState) => (prevState === "img1" ? "img2" : "img1"));
    }, 3000); // 3초마다 애니메이션 상태 변경

    // 컴포넌트 언마운트 시 정리
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="container-fluid"
      style={{ padding: 0, overflowX: "hidden" }}
    >
      <div
        className="main-background"
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
          fontSize: "1.7rem",
        }}
      >
        챗봇에 증상 한 줄만 입력하면, <br />
        <br />
        <strong style={{ fontSize: "2.6rem" }}>
          진료과, 맞춤 병원, 진단명을 <br />
          한번에 알려드립니다.
        </strong>
      </p>
      <Button
        component={Link}
        to="/chat"
        style={{
          position: "absolute",
          top: "62vh",
          left: "15vw",
          backgroundColor: "rgb(255, 223, 86)",
          color: "#36454F",
          padding: "10px 20px",
          fontSize: "1rem",
          borderRadius: "25px",
        }}
      >
        <strong>챗봇 바로 시작</strong>
      </Button>

      <img
        src={챗봇페이지}
        alt="picture"
        onClick={() => handleImageClick("img1")}
        style={{
          position: "absolute",
          top: "20vh",
          left: "45vw",
          width: "40vw",
          height: "350px",
          borderRadius: "25px",
          zIndex: activeImage === "img2" ? 3 : 2,
          transform: activeImage === "img2" ? "scale(1.05)" : "scale(1)",
          transition: "transform 0.3s, z-index 0.3s",
        }}
      />
      <img
        src={대시보드페이지}
        alt="picture"
        onClick={() => handleImageClick("img2")}
        style={{
          position: "absolute",
          top: "25vh",
          left: "55vw",
          width: "35vw",
          height: "400px",
          borderRadius: "25px",
          zIndex: activeImage === "img1" ? 3 : 2,
          transform: activeImage === "img1" ? "scale(1.05)" : "scale(1)",
          transition: "transform 0.3s, z-index 0.3s",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "77vh", // 위치는 조절하여 이미지 바로 아래에 오도록 설정
          left: "60vw", // 위치는 조절하여 이미지 중간에 오도록 설정
          display: "flex",
        }}
      >
        <Button
          onClick={() => handleImageClick("img2")}
          style={{
            backgroundColor: activeImage === "img2" ? "#36454F" : "transparent",
            color: "white",
            width: "100px",
            height: "40px",
            borderRadius: "20px",
            padding: "10px 20px",
            margin: "10px",
          }}
        >
          <strong>챗봇</strong>
        </Button>
        <Button
          onClick={() => handleImageClick("img1")}
          style={{
            backgroundColor: activeImage === "img1" ? "#36454F" : "transparent",
            color: "white",
            width: "130px",
            height: "40px",
            borderRadius: "20px",
            padding: "10px 20px",
            margin: "10px",
          }}
        >
          <strong>사용자 분석</strong>
        </Button>
      </div>
    </div>
  );
}

export default Main;
