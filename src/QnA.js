import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Paper } from "@mui/material";
import "../src/css/App.css";

export default function QnA() {
  const { setIsLogin } = useContext(AuthContext);

  const handleLoginTest = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <div
      className="QnA-Container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // alignItems 개별 아이템의 정렬렬 : flex 컨테이너 안의 아이템들에 대해 ~에 수직 정렬
        // alignContent 여러 행의 라인들의 정렬 : flex 컨테이너 안의 여러 행의 라인들에 대한 수직 정렬을 결정
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#8EC6E6",
      }}
    >
      <div
        className="QnA-Box"
        style={{
          padding: "20px",
          width: "60%",
          magin: "0 auto",
          textAlign: "center",
          color: "white",
          fontSize: "25px",
        }} // 0은 상하 마진, auto는 좌우 마진 -> 수평 중앙에 배치>
      >
        <span style={{ fontSize: "28px" }}>토닥토닥</span>에 궁금한 점이
        있으신가요?
        <br />
        <br />
        010-2534-1382로 전화주시거나,
        <br />
        jea0902@naver.com으로 메일을 보내주시면,
        <br />
        <br />
        24시간 대기하고 있으니,
        <br />
        정성스레 답변을 도와드리겠습니다!
      </div>

      <button
        onClick={handleLoginTest}
        style={{ width: "250px", marginBottom: "50px" }}
      >
        프론트 테스트용 버튼
      </button>
    </div>
  );
}
