import { useState } from "react";
import { Button, Input, Chip } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import 토닥 from "../src/assets/image/todak.png";

function ImageQuestion() {
  // const {setLoggedIn} = useContext(AuthContext); // 전역 상태관리
  const [imagePreview, setImagePreview] = useState(null); // 이미지 미리보기 상태
  const [selectedFile, setSelectedFile] = useState(null); // 실제 업로드한 파일
  const accessToken = window.localStorage.getItem("AccessToken"); // 액세스 토큰 가져오기
  const [diagnosisResult, setDiagnosisResult] = useState(null); // 서버로부터 받은 진단 결과를 저장하기 위한 상태

  const [flipped, setFlipped] = useState(false); // 카드가 뒤집혔는지 상태변수
  const [isBtnStarted, setIsBtnStarted] = useState(false); // 버튼 클릭 상태값 - 추가 

  const diagnosisCases = {
    "전염성 피부질환": "뭐냐 이건 카테고리 아니냐?",
    습진: "여러 가지 자극물로 인하여 피부에 일어나는 염증. 벌겋게 붓거나 우툴두툴하게 부르트고, 물집이나 딱지가 생기거나 피부가 꺼칠해지는 것과 같은 여러 가지 증상이 나타나며 가려움을 동반하는 것이 특징입니다.",
    여드름:
      "털 피지선 샘 단위의 만성 염증질환으로 면포(모낭 속에 고여 딱딱해진 피지), 구진(1cm 미만 크기의 솟아 오른 피부병변), 고름물집, 결절, 거짓낭 등 다양한 피부 변화가 나타나며, 이에 따른 후유증으로 오목한 흉터 또는 확대된 흉터를 남기기도 합니다. 피지선이 모여 있는 얼굴, 목, 가슴 등에 많이 발생하며 털을 만드는 모낭에 붙어있는 피지선에 염증이 생기는 질환을 말합니다. 보통 여드름은 주로 사춘기에 발생하며, 사춘기 청소년의 85%에서 관찰됩니다. 남자는 15세와 19세 사이에, 여자는 14세와 16세 사이에 발생 빈도가 높습니다.",
    색소침착:
      "피부 또는 체내에 색소가 병적으로 나타나는 상태, 색소변성이라고도 합니다. 생리적으로 원래 있는 멜라닌 · 헤모지데린 등의 색소가 병적으로 증가하면 색소 출현 장소가 이상하거나 생리적으로 존재하지 않는 색소가 생기는 예 등이 있고, 색소침착에는 선천적인 것과 후천적인 것이 있습니다.",
    양성종양:
      "발육 속도가 완만하여 성장에 한계가 있고 침윤이나 전이를 일으키지 아니하는 종양. 섬유종이나 지방종 따위가 전형적인 예입니다.",
    악성종양:
      "증식력이 강하고 주위 조직에 대하여 침윤성과 파괴성이 있으며 온몸에 전이하여 치명적인 해를 주는 종양. 암종(癌腫)이나 육종(肉腫) 따위가 대표적입니다.",
  };

  const diagnosis = "여드름"; // 프론트 테스트용

  const diagnosisName = diagnosisResult?.diagnosisName || diagnosis; // diagnosis는 프론트 테스트용

  const definition = diagnosisCases[diagnosisName] || diagnosisCases[diagnosis]; // 진단명 정의에 들어갈 변수

  const [displayText, setDisplayText] = useState(""); // 현재 화면에 표시할 텍스트를 저장하는 상태
  const [currentIndex, setCurrentIndex] = useState(0); // definition 문자열에서 현재 어디까지 읽었는지 인덱스를 저장하는 상태

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
  async function sendImageToFastAPi(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("imagefile", selectedFile); // image는 백엔드에서 받을 키

    try {
      const response = await axios.post(
        // "http://localhost:8000/api/auth/image_question"
        "http://3.37.43.105:8000/image_question",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        setDiagnosisResult(response.data.imageResult); // 서버로부터 받은 응답(진단결과)을 상태에 저장
        setFlipped(true); // API 호출이 성공적으로 완료되면 카드를 뒤집는다.
      }
      
    } catch (error) {
      console.error("이미지 업로드 중 에러", error);
    }
  };

  async function handleResultClick(event) {

    event.preventDefault();

    const formData = new FormData();
    formData.append("imagefile", selectedFile); // image는 백엔드에서 받을 키

    try {
      const response = await axios.post(
        // "http://localhost:8000/api/auth/image_question"
        "http://3.37.43.105:8000/image_question",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        setDiagnosisResult(response.data.imageResult); // 서버로부터 받은 응답(진단결과)을 상태에 저장
        setFlipped(true); // API 호출이 성공적으로 완료되면 카드를 뒤집는다.
      }
      
    } catch (error) {
      console.error("이미지 업로드 중 에러", error);
    }

    setIsBtnStarted(true);

  };

  useEffect(() => {
    if (isBtnStarted && currentIndex < definition.length) {
      // definition의 모든 글자가 화면에 출력될 때까지 반복
      const timer = setTimeout(() => {
        // 일정 시간 후에 다음 글자를 화면에 추가하는 함수
        setDisplayText((prevText) => prevText + definition[currentIndex]); // 이전 텍스트에 새 글자 추가
        setCurrentIndex((prevIndex) => prevIndex + 1); // 다음 글자를 읽기 위해 인덱스 증가
      }, [50]); // 50ms마다 한 글자씩 추가

      return () => clearTimeout(timer); // 컴포넌트가 언마운트되거나 currentIndex가 변경되기 전에 setTimeout을 정리
    }
  }, [currentIndex, definition, isBtnStarted]);

  return (
    <div
      className="image-page-container"
      style={{
        display: "flex",
        width: "70vw",
        margin: "auto",
        height: "90vh",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "50px",
        marginBottom: "300px",
        marginTop: "50px",
      }}
    >
      <div
        className="card"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          perspective: "1500px",
          width: "100%",
          height: "100%",
          position: "relative",
          border: "none",
          transformStyle: "preserve-3d",
          transition: "transform 0.5s",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
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
            transition: "opacity 0.5s, transform 0.6s",
            transform: "rotateY(0deg)",
            zIndex: flipped ? 10 : 1, // 이거 없으면 뒷면 카드가 위로 온다.
            opacity: flipped ? 0 : 1,
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
              fontSize: "1.3rem",
              marginTop: "2vh",
            }}
          >
            아래 파일선택을 클릭하셔서 사진을 올려주시면 분석해서
            진단해보겠습니다.
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
              <div className="input-group mb-3">
                <input
                  type="file"
                  className="form-control form-control-lg"
                  id="inputGroupFile"
                  onChange={handleFileUpload}
                />
              </div>
            </div>
          </div>

          <div
            className="dragOrPreview"
            onDragOver={onDragOver}
            onDrop={onDrop}
            style={{
              width: "80%",
              height: "20vh",
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
            <br />
            <br />
            {!imagePreview && "이곳에 드래그 하셔도 파일 업로드가 가능해요!"}
          </div>

          <div className="resultButton" style={{ paddingBottom: "20px" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleResultClick} // 실제 파일 객체를 전달
              style={{ marginTop: "20px", backgroundColor: "#8EC6E6", fontFamily: "BMJUA" }}
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
            justifyContent: "flex-start",
            padding: "0 16px",
            textAlign: "center",
            width: "100%",
            height: "100%",
            position: "absolute",
            backfaceVisibility: "hidden",
            opacity: flipped ? 1 : 0, // flipped 상태에 따른 투명도 변경
            transition: "opacity 0.5s",
            transform: "rotateY(180deg)",
            zIndex: flipped ? 10 : 5,
          }}
        >
          <div style={{ paddingTop: "20px" }}>
            <h3>진단 결과</h3>
          </div>
          <div
            style={{
              marginTop: "30px",
              width: "80%",
              margin: "0 auto 16px auto",
            }}
          >
            <img src={토닥} style={{ width: "15vw" }} />
            <h5>진단명 : {diagnosisResult?.diagnosisName || diagnosis}</h5>
            {/* diagnoistName이라는 필드명을 사용했다는 가정 */}
          </div>
          <div
            className="diagnosisResult"
            style={{
              width: "80%",
              margin: "0 auto 16px auto",
              padding: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              backgroundColor: "#f5f5f5",
              fontSize: "1.2rem",
              marginTop: "2vh",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {diagnosisResult?.description || diagnosis}이란? :{displayText}
          </div>

          <div
            style={{
              width: "80%",
              margin: "0 auto 16px auto",
              padding: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              backgroundColor: "#f5f5f5",
              fontSize: "1.2rem",
              marginTop: "2vh",
              wordWrap: "break-word",
            }}
          >
            ✔️치료는 안전하게 피부과의 전문의와 상담하세요! <br /> 그게 치료의
            가장 빠른 지름길입니다.
          </div>
        </div>
      </div>
    </div>
  );
}
export default ImageQuestion;
