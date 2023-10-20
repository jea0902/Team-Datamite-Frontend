import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState, useRef } from "react";
import { Modal, Button } from "react-bootstrap";

import { useUserData, AuthContext } from "../AuthContext";

function Myinfo() {
  const navigate = useNavigate();

  ////////////////////////////////////////////////////////////////////////////////////////////
  // 마이페이지 <회원정보>
  const userData = useUserData();
  const [target, setTarget] = useState(null);

  function handleUpdateInfo() {
    setTarget("수정");
    handleShowFirstModal();
  }

  function handleWithdrawal() {
    setTarget("탈퇴");
    handleShowFirstModal();
  }
  ////////////////////////////////////////////////////////////////////////////////////////////
  // 마이페이지 <비밀번호 확인>

  const [nowPassword, setNowPassword] = useState("");

  function onChangePassword(event) {
    if (event.target.name === "currentPassword") {
      setNowPassword(event.target.value);
    }
  }

  const [showFirstModal, setShowFirstModal] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false);

  function handleShowFirstModal() {
    setShowFirstModal(true);
  }

  function handleCloseFirstModal() {
    setShowFirstModal(false);
  }

  function handleOpenSecondModal() {
    setShowSecondModal(true);
  }

  function handleCloseSecondModal() {
    setShowSecondModal(false);
  }

  async function handleVerifyPasswordCheck(event) {
    event.preventDefault();

    const accessToken = window.localStorage.getItem("AccessToken");

    try {
      const result = await axios.post(
        // "http://localhost:8080/api/members/verify/password"
        "http://3.37.43.105:8080/api/members/verify/password",
        {
          password: nowPassword,
        },
        {
          headers: {
            Authorization: accessToken,
            "Content-Type": "application/json",
          },
        }
      );
      if (result.status === 200) {
        handleCloseFirstModal();
        if (target === "수정") {
          handleOpenSecondModal();
        } else if (target === "탈퇴") {
          handleCloseFirstModal();
          withdrawal();
        }
      }
    } catch (error) {
      console.error("비밀번호 확인 중 오류 발생:", error);
    }
  }

  const { setIsLogin } = useContext(AuthContext);

  async function withdrawal() {
    console.log("ddddd");
    const shouldDeleteAccount = window.confirm("정말 탈퇴하시겠습니까?");
    if (shouldDeleteAccount) {
      const accessToken = window.localStorage.getItem("AccessToken");

      try {
        const result = await axios.delete(
          //   "http://localhost:8080/api/members/delete/account"
          "https://3.37.43.105:8080/api/members/delete/account",
          {
            headers: {
              Authorization: accessToken,
              "Content-Type": "application/json",
            },
          }
        );

        if (result.status === 200) {
          alert("탈퇴되었습니다.");
          localStorage.removeItem("AccessToken");
          setIsLogin(false);
          navigate("/");
        }
      } catch (error) {
        alert("서버 문제로 탈퇴하지 못하였습니다.");
      }
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // 회원정보수정

  // 사용자에게 입력필드 유효성 검사로 알리는 역할하는 변수들
  const [birthdayError, setBirthdayError] = useState("");
  const [emailError, setEmailError] = useState("");

  // 입력되는 필드들
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [birthday8, setBirthday8] = useState(userData.birthday8);
  const [gender, setGender] = useState(userData.gender);
  const [email, setEmail] = useState(userData.email);

  const [isValid, setIsValid] = useState(false);
  const [isCheck, setIsCheck] = useState(false);

  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/;

  useEffect(() => {
    setBirthday8(userData.birthDate.split("-").join(""));
    setGender(userData.gender);
    setEmail(userData.email);
  }, [userData]);

  function validatePw() {
    if (passwordRegex.test(newPassword)) {
      return true;
    } else {
      return false;
    }
  }

  function validatePw2() {
    if (newPassword === newPassword2) {
      return true;
    } else {
      return false;
    }
  }

  function validateBirthday() {
    if (birthday8 === "") {
      setBirthdayError("생년월일은 필수 정보입니다!");
      return false;
    } else if (birthday8.length !== 8) {
      setBirthdayError("생년월일은 8자리여야 합니다.");
      return false;
    } else {
      setBirthdayError(""); // No error
      return true;
    }
  }
  function handleBirthdayBlur() {
    validateBirthday();
  }

  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  // 이메일 형식

  function validateEmail() {
    if (email === "") {
      setEmailError("이메일은 필수 정보입니다!");
      return false;
    } else if (!emailPattern.test(email)) {
      // 이메일 형식이 올바르지 않음
      setEmailError("올바른 이메일 형식을 작성해 주세요.");
      return false;
    } else {
      setEmailError(""); // No error
      return true;
    }
  }

  function handleEmailBlur() {
    validateEmail();
  }

  function onChange(event) {
    // 실제 입력필드 제한 로직

    const { name, value } = event.target;

    if (name === "newPassword") {
      if (passwordRegex.test(value)) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
      setNewPassword(value);
    } else if (name === "newPassword2") {
      if (value === newPassword) {
        setIsCheck(true);
      } else {
        setIsCheck(false);
      }
      setNewPassword2(value);
    } else if (name === "birthday8") {
      setBirthday8(value);
    } else if (name === "gender") {
      setGender(value);
    } else if (name === "email") {
      setEmail(value);
    }
  }

  async function onSubmit(event) {
    event.preventDefault();

    // 각각의 검증 함수 호출
    const isPasswordOk = validatePw();
    const isPassword2Ok = validatePw2();

    // 모든 필드가 유효한지 확인
    if (isPasswordOk && isPassword2Ok) {
      const accessToken = window.localStorage.getItem("AccessToken");

      try {
        const result = await axios.put(
          // "http://localhost:8080/api/members/update/profile"
          "http://3.37.43.105:8080/api/members/update/profile",
          {
            id: userData.memberId,
            password: newPassword,
            name: userData.name,
            birthDate: birthday8,
            gender: gender,
            email: email,
          },
          {
            headers: {
              Authorization: accessToken,
              "Content-Type": "application/json",
            },
          }
        );
        if (result.status === 200) {
          console.log("회원정보수정 완료");
          // setUserData({
          //     memberId: userData.memberId,
          //     name: userData.name,
          //     birthDate: birthday8,
          //     gender: gender,
          //     email: email,
          // })
          handleCloseSecondModal();
          navigate("/mypage");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("입력한 정보를 다시 한번 확인해 주세요.");
    }
  }

  return (
    <div>
      {/* 회원정보 */}
      <form className="mt-2">
        <div className="row mb-3">
          <label htmlFor="id" className="col-sm-2 col-form-label">
            아이디
          </label>
          <label htmlFor="id" className="col-sm-10 col-form-label">
            {userData.memberId}
          </label>
        </div>
        <div className="row mb-3">
          <label htmlFor="name" className="col-sm-2 col-form-label">
            이름
          </label>
          <label htmlFor="name" className="col-sm-10 col-form-label">
            {userData.name}
          </label>
        </div>
        <div className="row mb-3">
          <label htmlFor="birthdate" className="col-sm-2 col-form-label">
            생년월일
          </label>
          <label htmlFor="birthdate" className="col-sm-10 col-form-label">
            {userData.birthDate.split("-").join("")}
          </label>
        </div>
        <div className="row mb-3">
          <label htmlFor="gender" className="col-sm-2 col-form-label">
            성별
          </label>
          <label htmlFor="gemder" className="col-sm-10 col-form-label">
            {userData.gender}
          </label>
        </div>
        <div className="row mb-3">
          <label htmlFor="email" className="col-sm-2 col-form-label">
            이메일
          </label>
          <label htmlFor="email" className="col-sm-10 col-form-label">
            {userData.email}
          </label>
        </div>
        <hr />
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          <a
            id="testbutton"
            class="btn member_btn"
            onClick={handleUpdateInfo}
            // onClick={handleShowFirstModal}
          >
            회원정보수정
          </a>
          <a
            id="testbutton"
            href="#"
            class="btn btn-outline-danger"
            // onClick={handleShowFirstModal}
            onClick={handleWithdrawal}
          >
            회원탈퇴
          </a>
        </div>
      </form>
      {/* 비밀번호 확인 */}
      <Modal show={showFirstModal} onHide={handleCloseFirstModal}>
        <Modal.Header closeButton>
          <Modal.Title>현재 비밀번호 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="mb-3">
            <input
              type="password"
              class="form-control"
              id="currentPassword"
              name="currentPassword"
              onChange={onChangePassword}
              value={nowPassword}
              placeholder="현재 비밀번호"
              style={{ color: "black" }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="modal_btn" onClick={handleVerifyPasswordCheck}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 회원정보수정 */}
      <Modal show={showSecondModal} onHide={handleCloseSecondModal}>
        <form id="updateInfoForm" onSubmit={onSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>회원 정보 수정</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* 아이디 (수정불가) */}
            <div className="row mb-3">
              <label htmlFor="id" className="col-sm-4 col-form-label">
                아이디
              </label>
              <label htmlFor="id" className="col-sm-8 col-form-label">
                {userData.memberId}
              </label>
            </div>
            {/* 비밀번호 */}
            <div className="row mb-3">
              <label htmlFor="newPassword" className="col-sm-4 form-label">
                새 비밀번호
              </label>
              <div className="col-sm-8">
                <input
                  onChange={onChange}
                  value={newPassword}
                  placeholder="새 비밀번호를 입력해주세요."
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  className="form-control"
                />
                <div
                  style={{
                    fontSize: "12px",
                    color: isValid ? "green" : "grey",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-check-lg"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
                  </svg>
                  영문, 숫자, 특수문자 3가지 조합 8자리 이상
                </div>
              </div>
            </div>
            {/* 비밀번호 확인 */}
            <div className="row mb-3">
              <label htmlFor="password2" className="col-sm-4 form-label">
                새 비밀번호 확인
              </label>
              <div className="col-sm-8">
                <input
                  onChange={onChange}
                  value={newPassword2}
                  placeholder="새 비밀번호를 한번 더 입력해주세요."
                  type="password"
                  name="newPassword2"
                  id="newPassword2"
                  className="form-control"
                  style={{ border: isCheck ? "1px solid green" : null }}
                />
              </div>
            </div>

            {/* 이름 (수정불가) */}
            <div className="row mb-3">
              <label htmlFor="name" className="col-sm-4 col-form-label">
                이름
              </label>
              <label htmlFor="name" className="col-sm-8 col-form-label">
                {userData.name}
              </label>
            </div>
            {/* 생년월일 */}
            <div className="row mb-3">
              <label htmlFor="birthday8" className="col-sm-4 col-form-label">
                생년월일
              </label>
              <div className="col-sm-8">
                <input
                  onBlur={handleBirthdayBlur}
                  onChange={onChange}
                  value={birthday8}
                  type="text"
                  name="birthday8"
                  id="birthday8"
                  className="form-control"
                />
                {birthdayError && (
                  <div
                    style={{ color: "red", fontSize: "12px", marginTop: "5px" }}
                  >
                    {birthdayError}
                  </div>
                )}
              </div>
            </div>
            {/* 성별 */}
            <fieldset className="row mb-3">
              <legend className="col-form-label col-sm-4 pt-0">성별</legend>
              <div className="col-sm-8">
                <div className="form-check form-check-inline">
                  <input
                    onChange={onChange}
                    type="radio"
                    name="gender"
                    id="male"
                    value="M"
                    className="form-check-input"
                    checked={gender === "M"}
                  />
                  <label htmlFor="male" className="form-check-label">
                    남성
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    onChange={onChange}
                    type="radio"
                    name="gender"
                    id="female"
                    value="F"
                    className="form-check-input"
                    checked={gender === "F"}
                  />
                  <label htmlFor="female" className="form-check-label">
                    여성
                  </label>
                </div>
              </div>
            </fieldset>
            {/* 이메일 */}
            <div className="row mb-3">
              <label htmlFor="email" className="col-sm-4 col-form-label">
                이메일
              </label>
              <div className="col-sm-8">
                <input
                  onBlur={handleEmailBlur}
                  onChange={onChange}
                  value={email}
                  placeholder="이메일"
                  type="email"
                  name="email"
                  id="email"
                  className="col-sm-2 form-control"
                  style={{
                    border: emailError ? "1px solid red" : "1px solid #ced4da",
                  }}
                />
                {emailError && (
                  <div
                    style={{ color: "red", fontSize: "12px", marginTop: "5px" }}
                  >
                    {emailError}
                  </div>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="modal_btn" type="submit">
              확인
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}
export default Myinfo;
