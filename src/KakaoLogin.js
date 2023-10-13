import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import 카카오로고 from "./assets/image/kakao.png";

import { AuthContext } from "./AuthContext";

// Kakao SDK를 이용하여 로그인을 수행하고, 로그인이 성공하면 토큰을 화면에 표시하는 로직.
// 카카오 로그인 버튼 만들 필요 없었음.

function KakaoLogin() {
  const [kakaoToken, setKakaoToken] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Kakao SDK 딱 한번만 초기화되도록 - 자주 초기화되면 Already initialized 라는 에러가 나옴.

    // 카카오 SDK가 초기화되지 않았다면 초기화 - 초기화 과정으로 SDK는 카카오 서버와의 통신 준비 등 여러 내부 설정을 완료. / 초기화 하지 않고, API를 호출하려고 시도하면 SDK는 제대로 동작X
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init("71eb4c99656818b53b7557c13c716e16");
      // init 메서드에 전달되는 값은 REST API 키 - 카카오 개발자 콘솔에서 애플리케이션을 생성할 때 부여받은 값. 애플리케이션을 식별하는 중요한 정보.
    }

    // 1. 인가 코드 추출
    const url = new URL(window.location.href);
    const authCode = url.searchParams.get("code");

    // 2. 인가 코드가 존재하면 백엔드로 전송
    if (authCode) {
      // 백엔드로 인가 코드 전송하는 로직을 여기에 추가
      // 예: sendAuthCodeToBackend(authCode);
      sendAuthCodeToBackend(authCode);

      // 이 토큰은 카카오 로그인 후, 카카오 서버에서 발급받는 것.
      const localStorageToken = localStorage.getItem("authorize-access-token");
      if (localStorageToken) {
        window.Kakao.Auth.setAccessToken(localStorageToken); // 토큰이 로컬스토리지에 있으면, 이 토큰을 카카오 SDK에 설정 -> SDK가 토큰을 기억하게 되어 추가적인 API 호출을 할 때 해당 토큰을 사용할 수 있음.
        window.Kakao.Auth.getStatusInfo()
          .then((res) => {
            if (res.status === "connected") {
              const token = window.Kakao.Auth.getAccessToken();
              setKakaoToken(token); // 상태 업데이트
              localStorage.setItem("authorize-access-token", token); // 로컬 스토리지에 토큰 저장
              // 로그인 성공 시 해당 토큰을 상태에 저장하도록
              // - ** 이 토큰을 사용해 백엔드 서버와의 추가적인 인증 및 사용자 정보 요청 등의 작업을 수행할 수 있음.
            }
          })
          .catch((err) => {
            console.error("카카오 상태 fetching 에러", err);
            window.Kakao.Auth.setAccessToken(null); // 에러가 발생한 경우 Kakao SDK의 토큰을 null로 설정.
            localStorage.removeItem("authorize-access-token");
            setKakaoToken(null);
          });
      }
    }
  }, []);

  const sendAuthCodeToBackend = (authCode) => {
    axios
      .post("백엔드 주소", { authCode: authCode })
      .then((response) => {
        const data = response.data;

        if (data.success) {
          // 백엔드에서 인가 코드를 이용하여 카카오로부터 액세스 토큰을 받고
          // 로그인 또는 회원가입 처리가 성공했을 때의 로직

          const jwtToken = data.jwtToken;
          localStorage.setItem("jwt-token", jwtToken);
          navigate("/main");
        } else {
          // 실패했을 때의 로직
          alert(data.errorMessage || "인가 코드 처리 중 에러 발생");
          console.error("인가 코드 처리 중 에러 발생");
        }
      })
      .catch((error) => {
        // 네트워크 오류 또는 예상치 못한 오류
        if (!error.response) {
          alert("네트워크 오류가 발생했습니다.");
        } else {
          // 서버에서 오류 코드에 따른 처리
          switch (error.response.status) {
            case 400:
              alert("잘못된 요청입니다.");
              break;
            case 401:
              alert("인증되지 않은 요청입니다.");
              break;
            case 500:
              alert("서버에서 오류가 발생했습니다.");
              break;
            default:
              alert("알 수 없는 오류가 발생했습니다.");
          }
        }
      });
  };

  const sendTokenToBackend = (token) => {
    // 토큰이 있다면 백엔드에 토큰 전송 및 사용자 정보 요청
    // 백엔드에서는 전송된 토큰을 사용해 '카카오 서버'에서 사용자 정보를 받아와야 함.
    // 받아온 사용자 정보를 통해 데이터 베이스에서 회원 여부를 확인하고, 없다면 회원가입 처리, 있다면 로그인 처리
    // 이 부분은 프론트 엔드 코드가 아닌 백엔드에서 처리되어야 하는 로직.
    axios
      .post("백엔드 주소", { token: token })
      .then((response) => {
        const data = response.data;

        if (data.success) {
          // 백엔드에서 로그인 또는 회원가입 처리가 성공했을 때 결과를 프론트엔드로 반환받아야 함.
          // ex) 사용자 정보 저장, 리다이렉트 등
          console.log("로그인/ 회원가입 성공!");

          // // 사용자 정보 처리
          // const userInfo = data.user;
          // console.log("사용자 정보:",userInfo);

          // JWT 토큰 저장
          const jwtToken = data.jwtToken;
          localStorage.setItem("jwt-token", jwtToken);

          // 이후 메인 페이지로 리다이렉트 (회원가입/ 로그인 이후니까)
          navigate("/main");
        } else {
          // 실패했을 때의 로직, 토큰이 만료되었거나 유효하지 않을 떄
          console.error("토큰이 유효하지 않거나 만료됐어");
          localStorage.removeItem("authorize-access-token");
          setKakaoToken(null);
        }
      })
      .catch((error) => {
        console.error("백엔드로 토큰 보내는 데 오류가 생겼습니다.", error);
        if (error.response && error.response.data) {
          console.error(
            "서버로부터 에러 메시지 :",
            error.response.data.message
          );
        }
      });
  };

  // 카카오 SDK에서 로그인 요청을 처리하기 위한 함수
  // - 호출하면 카카오 로그인 화면 나타나고, 사용자가 로그인 완료하면 redirectUri로 리다이렉트
  const loginWithKakao = () => {
    const REST_API_KEY = "71eb4c99656818b53b7557c13c716e16";
    const REDIRECT_URI = "http://localhost:3000/main";
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  };

  return (
    <div>
      <button
        type="submit"
        className="btn btn-light btn-lg"
        style={{
          display: "flex",
          width: "100%",
          marginBottom: "2vh",
          backgroundColor: "#f9e000",
          color: "black",
          fontSize: "16px",
        }}
        onClick={loginWithKakao}
      >
        <img
          src={카카오로고}
          alt="logo"
          className="kakao-image"
          style={{ width: "30px", height: "30px" }}
        />
        <div
          style={{
            alignItems: "center",
            marginLeft: "120px",
          }}
        >
          카카오 간편 로그인
        </div>
      </button>
      {kakaoToken && (
        <p id="token-result">login success, token: {kakaoToken}</p>
      )}
    </div>
  );
}

export default KakaoLogin;
