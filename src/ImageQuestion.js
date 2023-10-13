import React from "react";
import AuthContext from "./AuthContext";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ImageQuestion() {
  // const {setLoggedIn} = useContext(AuthContext); // 전역 상태관리
  const [imagePreview, setImagePreview] = useState(null); // 이미지 미리보기 상태

  const diagnosis = "00병";

  // const TestLoggedIn = () => {
  //     setLoggedIn(prevLoggedIn => !prevLoggedIn);
  // }

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

  return (
    <div></div>
    // <div style={{ height: "80vh" }}>
    //   <div
    //     style={{
    //       display: "grid",
    //       gridTemplateColumns: "1fr 1fr",
    //       gap: "16px",
    //       alignItems: "center",
    //       height: "100%",
    //     }}
    //   >
    //     {/* 왼쪽 그리드 */}
    //     <div
    //       style={{
    //         display: "flex",
    //         flexDirection: "column",
    //         justifyContent: "center",
    //         borderRight: "1px solid #ccc",
    //         padding: "0 16px",
    //         textAlign: "center",
    //         height: "100%",
    //       }}
    //     >
    //       <div>
    //         <h3>이미지 업로드</h3>
    //         <Chip
    //           label="Beta"
    //           size="small"
    //           variant="outlined"
    //           style={{ width: "50px" }}
    //         />
    //       </div>

    //       <div
    //         style={{
    //           width: "80%",
    //           margin: "0 auto 16px auto",
    //           padding: "16px",
    //           border: "1px solid #ccc",
    //           borderRadius: "4px",
    //           backgroundColor: "#f5f5f5",
    //           fontSize: "0.rem",
    //           marginTop: "2vh",
    //         }}
    //       >
    //         아직은 학습용 데이터가 부족하지만, 아래 파일선택을 클릭하셔서 사진을
    //         올려주시면 분석해서 진단명과 병원 추천을 해드리겠습니다.
    //       </div>

    //       <div
    //         style={{
    //           display: "flex",
    //           alignItems: "center",
    //           justifyContent: "center",
    //           marginBottom: "16px",
    //         }}
    //       >
    //         <Input
    //           type="file"
    //           onChange={handleFileUpload}
    //           style={{ width: "80%", margin: "16px 0", display: "block" }}
    //         />
    //       </div>

    //       <div
    //         onDragOver={onDragOver}
    //         onDrop={onDrop}
    //         style={{
    //           width: "80%",
    //           height: "30vh",
    //           margin: "0 auto 16px auto",
    //           marginBottom: "16px",
    //           background: imagePreview
    //             ? `url(${imagePreview}) no-repeat center/cover`
    //             : "#ffffff",
    //           border: "1px solid #ccc",
    //           boxSizing: "border-box",
    //         }}
    //       ></div>

    //       <div>
    //         <Button
    //           variant="contained"
    //           color="primary"
    //           style={{ marginTop: "20px" }}
    //         >
    //           결과보기
    //         </Button>
    //       </div>
    //     </div>

    //     {/* 오른쪽 그리드*/}
    //     <div
    //       style={{
    //         display: "flex",
    //         flexDirection: "column",
    //         justifyContent: "center",
    //         borderRight: "1px solid #ccc",
    //         padding: "0 16px",
    //         textAlign: "center",
    //         height: "100%",
    //       }}
    //     >
    //       <h3>진단 결과</h3>

    //       <div style={{ marginTop: "3vh", marginRight: "30vw" }}>
    //         <h5>진단명 : {diagnosis}</h5>
    //       </div>
    //       <div
    //         style={{
    //           width: "80%",
    //           margin: "0 auto 16px auto",
    //           padding: "16px",
    //           border: "1px solid #ccc",
    //           borderRadius: "4px",
    //           backgroundColor: "#f5f5f5",
    //           fontSize: "0.rem",
    //           marginTop: "2vh",
    //         }}
    //       >
    //         {diagnosis} :
    //       </div>

    //       <div
    //         style={{
    //           width: "80%",
    //           margin: "0 auto 16px auto",
    //           padding: "16px",
    //           border: "1px solid #ccc",
    //           borderRadius: "4px",
    //           backgroundColor: "#f5f5f5",
    //           fontSize: "0.rem",
    //           marginTop: "2vh",
    //         }}
    //       >
    //         치료방법 및 주의사항 :
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
