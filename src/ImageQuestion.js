import React from "react";
import AuthContext from "./AuthContext";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Chip } from "@mui/material";
import axios from "axios";

function ImageQuestion() {
  // const {setLoggedIn} = useContext(AuthContext); // 전역 상태관리
  const [imagePreview, setImagePreview] = useState(null); // 이미지 미리보기 상태
  const [selectedFile, setSelectedFile] = useState(null); // 실제 업로드한 파일
  const accessToken = window.localStorage.getItem("AccessToken"); // 액세스 토큰 가져오기
  const [diagnosisResult, setDiagnosisResult] = useState(null); // 서버로부터 받은 진단 결과를 저장하기 위한 상태

  const diagnosis = "00병"; // 테스트용

  // 파일 업로드 핸들러
  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    // 이미지 미리보기 설정
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
      setSelectedFile(file); // 실제 파일 객체를 상태에 저장
    }

    console.log(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload({ target: { files } });
    }
  };

  // FAST API로 이미지 파일을 보내고 결과를 받는 로직.
  // 이미지와 같은 파일을 업로드할 때 multipart/form-data 형식을 사용하는 것이 일반적. FormData 객체 사용해서 파일 추가
  const sendImageToFastAPi = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file); // image는 백엔드에서 받을 키

      const response = await axios.post(
        "http://localhost:8000/api/auth/image_question",
        formData,
        {
          headers: {
            Authorization: accessToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      setDiagnosisResult(response.data); // 서버로부터 받은 응답(진단결과)을 상태에 저장
    } catch (error) {
      console.error("이미지 업로드 중 에러", error);
    }
  };

  return (
    <div
      className="image-page-container"
      style={{ width: "100%", paddingTop: "60px" }}
    >
      <div style={{ height: "80vh" }}>
        <div
          className="grid"
          style={{
            display: "grid",
            gridTemplateColumns: "50% 50%",
            // 그리드에서 fr은 사용 가능한 공간을 기반으로 크기 조절, %는 정확히 절반 차지하도록 강제
            gap: "16px",
            alignItems: "center",
            height: "100%",
          }}
        >
          {/* 왼쪽 그리드 */}
          <div
            className="leftGrid"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              borderRight: "1px solid #ccc",
              padding: "0 16px",
              textAlign: "center",
              height: "100%",
            }}
          >
            <div>
              <h3>이미지 업로드</h3>
              <Chip
                label="Beta"
                size="small"
                variant="outlined"
                style={{ width: "50px" }}
              />
            </div>

            <div
              style={{
                width: "80%",
                margin: "0 auto 16px auto",
                padding: "16px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "#f5f5f5",
                fontSize: "1rem",
                marginTop: "2vh",
              }}
            >
              아직은 학습용 데이터가 부족하지만, 아래 파일선택을 클릭하셔서
              사진을 올려주시면 분석해서 진단해보겠습니다.
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <Input
                type="file"
                onChange={handleFileUpload}
                style={{ width: "80%", margin: "16px 0", display: "block" }}
              />
            </div>

            <div
              onDragOver={onDragOver}
              onDrop={onDrop}
              style={{
                width: "80%",
                height: "30vh",
                margin: "0 auto 16px auto",
                marginBottom: "16px",
                background: imagePreview
                  ? `url(${imagePreview}) no-repeat center/cover`
                  : "#ffffff",
                border: "1px solid #ccc",
                boxSizing: "border-box",
              }}
            ></div>

            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={() => sendImageToFastAPi(selectedFile)} // 실제 파일 객체를 전달
                style={{ marginTop: "20px", backgroundColor: "#8EC6E6" }}
              >
                결과보기
              </Button>
            </div>
          </div>

          {/* 오른쪽 그리드*/}
          <div
            className="rightGrid"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 16px",
              textAlign: "center",
              height: "100%",
            }}
          >
            <h3>진단 결과</h3>

            <div
              style={{
                marginTop: "4vh",
                width: "80%",
                margin: "0 auto 16px auto",
              }}
            >
              <h5>진단명 : {diagnosisResult?.diagnosisName || diagnosis}</h5>
              {/* diagnoistName이라는 필드명을 사용했다는 가정 */}
            </div>
            <div
              style={{
                width: "80%",
                margin: "0 auto 16px auto",
                padding: "16px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "#f5f5f5",
                fontSize: "1rem",
                marginTop: "2vh",
                wordWrap: "break-word",
              }}
            >
              {diagnosisResult?.description || diagnosis}이란? : 이 부분 데이터
              받아야 함
              wqewqwewqeqwe~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
              {/* description이라는 필드명을 사용했다는 가정 */}
            </div>

            <div
              style={{
                width: "80%",
                margin: "0 auto 16px auto",
                padding: "16px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "#f5f5f5",
                fontSize: "1rem",
                marginTop: "2vh",
                wordWrap: "break-word",
              }}
            >
              치료방법 및 주의사항 :마찬가지로
              데이터받아야함.~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ImageQuestion;
