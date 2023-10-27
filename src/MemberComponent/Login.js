import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";

import { AuthContext } from "../AuthContext";

function Login() {
  // useEffect(() => {
  //     const forms = document.querySelectorAll('.needs-validation');

  //     // Loop over them and prevent submission
  //     Array.from(forms).forEach((form) => {
  //         form.addEventListener('submit', (event) => {
  //             if (!form.checkValidity()) {
  //                 event.preventDefault();
  //                 event.stopPropagation();
  //             }

  //             form.classList.add('was-validated');
  //         }, false);
  //     });
  // }, []);

  // 사용자에게 입력필드 유효성 검사로 알리는 역할하는 변수들
  const [idError, setIdError] = useState("");
  const [pwError, setPwError] = useState("");

  const { setIsLogin } = useContext(AuthContext); // 로그인 상태 관리
  const { setUserData } = useContext(AuthContext);
  // const { loggedIn, setLoggedIn } = useContext(AuthContext);

  // const [saveID, setSaveID] = useState(false); // ID 자동 저장 체크박스의 상태 관리
  // const [savedID, setSavedID] = useState(""); // ID 자동 저장 체크박스에 체크했으면, id가 저장될 변수

  // const [autoLogin, setAutoLogin] = useState(false); // 체크박스 상태 관리

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessege, setErrorMessage] = useState([]);
  const navigate = useNavigate();

  function validateId() {
    // id 유효성 검사 - 텍스트로 사용자에게 알림
    if (id === "") {
      setIdError("아이디를 입력해 주세요.");
      return false;
    } else {
      setIdError(""); // No error
      return true;
    }
  }
  function handleIdBlur() {
    validateId();
  }

  function validatePw() {
    // pw 유효성 검사 - 텍스트로 사용자에게 알림
    if (password === "") {
      setPwError("비밀번호를 입력해 주세요.");
      return false;
    } else {
      setPwError(""); // No error
      return true;
    }
  }
  function handlePwBlur() {
    validatePw();
  }

  function onChange(event) {
    // onChange에서 로그인 검증 로직

    const { name, value } = event.target;
    if (name === "id") {
      if (value.length >= 5 || value.length <= 20) {
        // 5~20자
        setId(value);
      }
    } else if (name === "password") {
      if (value.length >= 8 || value.length <= 16) {
        // 8~16자
        setPassword(value);
      }
    }
  }

  async function onSubmit(event) {
    event.preventDefault();

    // 각각의 검증 함수 호출
    const isIdOk = validateId();
    const isPasswordOk = validatePw();

    if (isIdOk && isPasswordOk) {
      try {
        const result = await axios.post(
          // "http://localhost:8080/api/auth/login"
          "http://3.37.43.105:8080/api/auth/login",
          {
            id: id,
            password: password,
          }
        );
        if (result.status === 200) {
          console.log(result.data);
          console.log(result.data.accessToken);

          // 헤더에서 AT 가져와서 localStorage에 저장
          const accessToken = result.data.accessToken;
          window.localStorage.setItem("AccessToken", accessToken);

          // 로그인 성공 상태값 주기
          setIsLogin(true);
          setUserDetails();

          navigate("/main"); // 로그인 성공 후 리다이렉트 할 경로를 지정하세요.
        } else {
          // 아이디가 틀렸는지, 비밀번호가 틀렸는지, 아이디와 비밀번호 모두 틀렸는지 빨간 글씨로 로그인 버튼 위, 비밀번호 입력창 아래에 메시지
          // => 수정 : 보안을 위해 아이디나 비밀번호가 잘못되었습니다 와 같은 일반적인 메시지를 사용하는 것이 권장.
          setErrorMessage(["아이디나 비밀번호가 잘못되었습니다."]);
        }
      } catch (error) {
        console.log(error);
        // 에러 처리 코드를 여기에 추가하세요.
      }
    }
    // else {
    //   alert("입력한 정보를 다시 한번 확인해 주세요.");
    // }
  }

  async function setUserDetails() {
    const accessToken = window.localStorage.getItem("AccessToken");

    try {
      const result = await axios.get(
        // "http://localhost:8080/api/members/profile"
        "http://3.37.43.105:8080/api/members/profile",
        {
          headers: {
            Authorization: accessToken,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(result.data);
      setUserData(result.data);
      console.log(result.data);
    } catch (error) {
      console.error("데이터를 가져오는 동안 오류 발생:", error);
    }
  }

  return (
    <div className="container-sm">
      <div style={{ height: "150px" }}></div>
      {/* <div className="card text-center w-50 mb-3 mx-auto align-items-center"> */}
      <div
        className="card text-center mb-3 mx-auto align-items-center"
        style={{ width: "30rem" }}
      >
        <div className="card-body w-100">
          {/* <form className="row g-3 needs-validation" noValidate>
                        <div className="mb-3">
                            <input type="text" className="form-control" id="validationId" placeholder="아이디를 입력해주세요." required />
                            <div className="invalid-feedback text-start">
                                아이디를 입력해주세요.
                            </div>
                        </div>
                        <div className="mb-3">
                            <input type="password" className="form-control" id="validationPassword" placeholder="비밀번호를 입력해주세요." required />
                            <div className="invalid-feedback text-start">
                                비밀번호를 입력해주세요.
                            </div>
                        </div>
                        <div className="d-grid gap-2">
                            <button className="btn btn-secondary" type="submit">로그인</button>
                        </div>
                    </form> */}
          <form onSubmit={onSubmit}>
            <div className="mb-3 text-start">
              <input
                onBlur={handleIdBlur}
                onChange={onChange}
                value={id}
                placeholder="아이디"
                type="text"
                name="id"
                id="id"
                className="form-control"
              />
              {idError && (
                <div
                  style={{
                    color: "red",
                    fontSize: "12px",
                    marginTop: "5px",
                    paddingLeft: "3px",
                  }}
                >
                  {idError}
                </div>
              )}
            </div>
            <div className="mb-3 text-start">
              <input
                onBlur={handlePwBlur}
                onChange={onChange}
                value={password}
                placeholder="비밀번호"
                type="password"
                name="password"
                id="password"
                className="form-control password-form"
              />
              {pwError && (
                <div
                  style={{
                    color: "red",
                    fontSize: "12px",
                    marginTop: "5px",
                    paddingLeft: "3px",
                  }}
                >
                  {pwError}
                </div>
              )}
            </div>
            <div className="d-grid">
              <button
                className="btn btn-outline-light"
                type="submit"
                style={{ backgroundColor: "#8ec6e6", color: "white" }}
              >
                로그인
              </button>
              {/* <KakaoLogin/> */}
            </div>
            {errorMessege.length > 0 && (
              <div className="alert alert-danger" role="alert">
                {errorMessege.map((message, index) => (
                  <div key={index}>{message}</div>
                ))}
              </div>
            )}

            {/* <div
              style={{
                textAlign: "center",
                marginTop: "2vh",
                marginBottom: "2vh",
                fontSize: "13px",
              }}
            >
              OR
            </div> */}

            {/* <KakaoLogin /> */}
          </form>

          {/* <div className="row g-3 mt-2">
                        <div className="col-md-4">
                            <p><a className="link-secondary link-offset-3-hover link-underline-light link-underline-opacity-0 link-underline-opacity-75-hover" href="/signup">회원가입</a></p>
                        </div>
                        <div className="col-md-4">
                            <p><a className="link-secondary link-offset-3-hover link-underline-light link-underline-opacity-0 link-underline-opacity-75-hover" href="/find/id">아이디 찾기</a></p>
                        </div>
                        <div className="col-md-4">
                            <p><a className="link-secondary link-offset-3-hover link-underline-light link-underline-opacity-0 link-underline-opacity-75-hover" href="#">비밀번호 재설정</a></p>
                        </div>
                    </div> */}

          <div className="hstack mt-2">
            <div className="p-2 mx-auto">
              <a
                className="link-secondary link-offset-3-hover link-underline-light link-underline-opacity-0 link-underline-opacity-75-hover"
                href="/find-id"
              >
                아이디 찾기
              </a>
            </div>
            <div className="vr mt-2 mb-2"></div>
            <div className="p-2 mx-auto">
              <a
                className="link-secondary link-offset-3-hover link-underline-light link-underline-opacity-0 link-underline-opacity-75-hover"
                href="/find-password"
              >
                비밀번호 재설정
              </a>
            </div>
            <div className="vr mt-2 mb-2"></div>
            <div className="p-2 mx-auto">
              <a
                className="link-secondary link-offset-3-hover link-underline-light link-underline-opacity-0 link-underline-opacity-75-hover"
                href="/signup"
              >
                회원가입
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
