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

  const [flipped, setFlipped] = useState(false); // 카드가 뒤집혔는지 상태변수

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

      // API 호출이 성공저긍로 완료되면 카드를 뒤집는다.
      setFlipped(true);
    } catch (error) {
      setFlipped(true); // 이 부분은 프론트엔드 테스트용으로 추가한 부분이므로 복붙받으면 지우자
      console.error("이미지 업로드 중 에러", error);
    }
  };

  return (
    <div
      className="image-page-container"
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        paddingTop: "60px",
        paddingBottom: "300px",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="heightFixed" style={{ height: "80vh" }}>
        <div
          className="card"
          // onClick={() => setFlipped(!flipped)}
          // 테스트용 온클릭
          style={{
            perspective: "1500px",
            width: "600px",
            height: "600px",
            position: "relative",
          }}
        >
          {/* 카드 앞면 */}
          <div
            className="card-front"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 16px",
              textAlign: "center",
              width: "100%",
              height: "100%",
              position: "absolute", // 카드 앞면과 뒷면 겹치려고 absolute 사용
              backfaceVisibility: "hidden",
              opacity: flipped ? 0 : 1, // flipped 상태에 따른 투명도 변경
              transition: "opacity 0.5s, transform 0.4s",
              transform: flipped ? "translate(-30%,-30%)" : "translate(0,0)", // 왼쪽 상단으로 이동
              zIndex: "10", // 이거 없으면 뒷면 카드가 위로 온다.
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
              <div style={{ width: "80%", margin: "16px 0" }}>
                {/* Input은 세련된 디자인을 제공하지 않아서 숨겨진 Input + Label 트릭 사용 */}
                <Input
                  type="file"
                  id="file-input"
                  // 여기 있는 id와 아래에 있는 label의 htmlFor가 같은 게 핵심.
                  onChange={handleFileUpload}
                  style={{ width: "80%", margin: "16px 0", display: "none" }}
                />
                {/* 사용자에게 보여줄 label */}
                <label htmlFor="file-input">
                  <Button variant="outlined" component="span">
                    파일 업로드 버튼 클릭해주세요!
                  </Button>
                </label>
              </div>
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
            >
              <br />
              이곳에 드래그 하셔도 파일 업로드가 가능합니다
            </div>

            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  // 버튼을 클릭하면 이미지를 전송하고
                  // 결과를 받아오면 자동으로 카드가 페이드 아웃.
                  sendImageToFastAPi(selectedFile);
                }} // 실제 파일 객체를 전달
                style={{ marginTop: "20px", backgroundColor: "#8EC6E6" }}
              >
                결과보기
              </Button>
            </div>
          </div>

          {/* 카드 뒷면*/}
          <div
            className="card-back"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 16px",
              textAlign: "center",
              width: "100%",
              height: "100%",
              position: "absolute",
              backfaceVisibility: "hidden",
              opacity: flipped ? 1 : 0, // flipped 상태에 따른 투명도 변경
              transition: "opacity 0.5s",
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
              {diagnosisResult?.description || diagnosis}이란? : 이 부분 그냥
              네이버 크롤링
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
              치료방법 및 주의사항 : 네이버 크롤링해서 가져올 것
              데이터받아야함.~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ImageQuestion;
