import React, { useEffect, useState } from "react";
import "../src/css/App.css";
import SatisfactionSurvey from "./SatisfactionSurvey";

export default function QnA() {
  const [showMap, setShowMap] = useState(true); // 테스팅용
  const [showSurveyBox, setShowSurveyBox] = useState(false);

  useEffect(() => {
    if (showMap) {
      setShowSurveyBox(true);
    }
  }, [showMap]);

  const surveyBoxStyle = {
    width: "300px",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    textAlign: "center",
  };

  const textStyle = {
    marginBottom: "20px",
    fontSize: "18px",
  };

  const starStyle = {
    cursor: "pointer",
    color: "gray",
    transition: "color 0.3s",
  };

  const starHoverStyle = {
    color: "gold",
  };

  const handleRatingSubmission = (rating) => {
    // 별점 제출
    console.log("Final Rating:", rating);

    setShowSurveyBox(false);
    // surveyBox 숨기기
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
      {/* 테스트용 */}
      {/* {showSurveyBox && ( */}
      <div className="surveyBox" style={surveyBoxStyle}>
        <p style={textStyle}>
          진단 결과에 대해서 <br /> 만족하시는만큼 별점을 주세요!
        </p>
        <SatisfactionSurvey
          starStyle={starStyle}
          starHoverStyle={starHoverStyle}
          onRating={(rate) => {
            console.log("User rated:", rate);
            // 추가적인 로직 (예: 서버에 평점 전송)
          }}
          onSubmitRating={handleRatingSubmission}
        />
      </div>
      {/* )} */}

      <div
        className="QnA-Box"
        style={{
          padding: "20px",
          width: "60%",
          magin: "0 auto",
          textAlign: "center",
          color: "white",
          fontSize: "22px",
        }} // 0은 상하 마진, auto는 좌우 마진 -> 수평 중앙에 배치>
      >
        <span style={{ fontSize: "25px" }}>토닥토닥</span>에 궁금한 점이
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
    </div>
  );
}
