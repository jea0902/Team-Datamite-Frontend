import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';

function Signup() {
    const [idMessage, setIdMessage] = useState(""); // id 중복확인 메시지

    // 사용자에게 입력필드 유효성 검사로 알리는 역할하는 변수들
    const [idError, setIdError] = useState("");
    const [pwError, setPwError] = useState("");
    const [pwError2, setPwError2] = useState("");
    const [nameError, setNameError] = useState("");
    const [birthdayError, setBirthdayError] = useState("");
    const [genderError, setGenderError] = useState("");
    const [emailError, setEmailError] = useState("");

    // 입력되는 필드들
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [name, setName] = useState("");

    const [birthday8, setBirthday8] = useState("");

    const [gender, setGender] = useState("");
    const [email, setEmail] = useState("");
    const [emailDomain, setEmailDomain] = useState("");
    const [errorMessege, setErrorMessage] = useState([]);
    const navigate = useNavigate();

    // 남,여,선택안함 버튼 클릭 상태변수
    const [selected, setSelected] = useState({ btn1: false, btn2: false, btn3: false });


    const handleClick = (btnId, value) => {
        // 맨처음 모든 성별 버튼을 비활성화
        const newState = { btn1: false, btn2: false, btn3: false };
        newState[btnId] = !selected[btnId];
        setSelected(newState);
        setGender(value); // 여기서 gender 상태를 업데이트 하기로

        // // 선택된 버튼만 활성화
        // setSelected({ ...reset, [btnId]: true });
    };

    async function checkId() {

        try {
            const response = await axios.get(`http://localhost:8080/api/auth/checkId?id=${id}`)
            console.log(response.data)

            if (response.data === "Available") {
                setIdMessage("사용 가능한 아이디입니다.")
                return true; // 사용 가능한 아이디 확인
            } else {
                // setIdMessage("이미 사용 중인 아이디입니다.")
                setIdError("이미 사용 중인 아이디입니다.")
                return false; // 중복된 아이디
            }

        } catch (error) {
            console.log("fetch 진행에 뭔가 문제가 있다:", error.message);
            return false;
        }
    }

    // 아이디가 알파벳으로 시작하며, 5~20자의 알파벳과 숫자의 조합으로만 구성
    const idPattern = /^[A-Za-z][A-Za-z0-9]{5,20}$/;

    function validateId() { // id 유효성 검사 - 텍스트로 사용자에게 알림
        if (id === "") {
            setIdError("아이디는 필수 정보입니다!");
            setIdMessage("");
            return false;
        } else if (!idPattern.test(id)) {
            setIdError("아이디는 5자~20자 영문으로 시작하며, 영문/ 숫자의 조합으로만 사용 가능합니다.");
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
        if (password === "") {
            setPwError("비밀번호는 필수 정보입니다!");
            return false;
        } else if (password.length <= 8 || password.length >= 16) {
            setPwError("비밀번호는 8자~16자의 영문 대/소문자, 숫자, 특수문자를 사용해 주세요.");
            return false;
        } else {
            setPwError(""); // No error
            return true;
        }
    }

    function handlePwBlur() {
        validatePw();
        // Blur를 사용하는 이유 : 유효성 검사 - 사용자가 입력을 완료하고 다른 요소로 이동했을 때 입력값을 검사하는 것이 일반적인데, blur 이벤트를 사용하면 사용자가 입력필드를 벗어났을 때 유효성 검사를 시행가능.
    }

    function validatePw2() {
        if (password2 === "") {
            setPwError2("비밀번호 확인도 해주세요.");
            return false;
        } else if (password2 !== password) {
            setPwError2("비밀번호와 같아야 합니다.");
            return false;
        } else {
            setPwError2(""); // No error
            return true;
        }
    }

    function handlePw2Blur() {
        validatePw2();
    }

    // 이름 역시, 정규표현식으로 검사
    // 자음만으로 이루어진 경우 - 9월 24일 수정
    const consonantRegex = /^[ㄱ-ㅎ]+$/;
    // 모음만으로 이루어진 경우
    const vowelRegex = /^[ㅏ-ㅣ]+$/;


    function validateName() {

        if (name === "") {
            setNameError("이름은 필수 정보입니다.");
            return false;
        } else if (consonantRegex.test(name) || vowelRegex.test(name)) {
            setNameError("자음,모음으로만 이루어져있는 이름은 유효하지 않습니다")
            return false; // 유효하지 않은 이름
        } else {
            setNameError(""); // No error
            return true;
        }
    }

    function handleNameBlur() {
        validateName();
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

    function validateGender() {
        if (!selected.btn1 && !selected.btn2 && !selected.btn3) {
            setGenderError("성별을 선택해주세요!");
            return false;
        } else {
            setGenderError(""); // No error
            return true;
        }
    }

    function handleGenderBlur() {
        validateGender();
    }

    // const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    // // 이메일 형식

    // function validateEmail() {
    //     if (email === "") {
    //         setEmailError("이메일은 필수 정보입니다!");
    //         return false;
    //     } else if (!emailPattern.test(email)) {
    //         // 이메일 형식이 올바르지 않음
    //         setEmailError("올바른 이메일 형식을 작성해 주세요.");
    //         return false;
    //     } else {
    //         setEmailError(""); // No error
    //         return true;
    //     }
    // }

    function validateEmail() {
        if (email === "") {
            setEmailError("이메일은 필수 정보입니다!");
            return false;
        } else if (emailDomain === "") {
            setEmailError("올바른 이메일 형식을 선택해 주세요.");
            return false;
        } else {
            setEmailError("");
            return true;
        }
    }

    function handleEmailBlur() {
        validateEmail();
    }


    function onChange(event) {
        // 실제 입력필드 제한 로직

        const { name, value } = event.target;
        if (name === "id") {
            if (value.length >= 5 || value.length <= 20) { // 5~20자
                setId(value);
            }
        } else if (name === "password") {
            if (value.length >= 8 || value.length <= 16) { // 8~16자
                setPassword(value)
            }
        } else if (name === "password2") {
            setPassword2(value)
        } else if (name === "name") {
            setName(value);
        }

        else if (name === "birthday8") {
            if (value.length <= 8) { // 8자리 제한 로직
                setBirthday8(value)
            }
        } else if (name === "gender") {
            if (!value) { // 8자리 제한 로직
                setGender(value)
            }
        } else if (name === "email") {
            setEmail(value);

        } else if (name === "emailDomain") {
            setEmailDomain(value);
            console.log(value);
        }
    }

    async function onSubmit(event) {
        // onSubmit 함수에서 유효성 검사 후 해당 상태를 업데이트 한다.

        event.preventDefault();

        // 에러 메시지 리셋
        setErrorMessage([]);

        // 아이디 중복 체크
        const isIdAvailable = await checkId();
        if (!isIdAvailable) {
            alert("아이디가 중복되었거나 사용할 수 없는 아이디입니다.")
            return; // 아이디가 중복되면 함수 종료 - 함수 종료면 가입안되는 것.
        }

        // 각각의 검증 함수 호출
        const isIdOk = validateId();
        const isPasswordOk = validatePw();
        const isPassword2Ok = validatePw2();
        const isNameOk = validateName();
        const isBirthdayOk = validateBirthday();
        const isGenderOk = validateGender();
        const isEmailOk = validateEmail();

        // 모든 필드가 유효한지 확인
        if (isIdOk && isPasswordOk && isPassword2Ok && isNameOk && isBirthdayOk && isGenderOk && isEmailOk) {
            // if (isIdOk && isPasswordOk && isPassword2Ok && isNameOk && isBirthdayOk && isGenderOk) {
            // 회원가입 로직 수행
            console.log(id, password, password2, name, birthday8, gender, email)

            try {
                const result = await axios.post("http://localhost:8080/api/auth/signup", {
                    id: id,
                    password: password,
                    name: name,
                    birthDate: birthday8,
                    gender: gender,
                    email: `${email}@${emailDomain}`
                })
                if (result.status === 200) {
                    navigate("/login")
                }
            } catch (error) {
                console.log(error);
            }

        } else {
            alert("입력한 정보를 다시 한번 확인해 주세요.");
        }

    }

    return (
        <div className="container-sm">
            <div style={{ height: "50px" }}></div>
            <div className="card mb-3 mx-auto align-items-center" style={{width:"30rem"}}>
                <div className="card-body w-100">
                    <form className="row" onSubmit={onSubmit} >
                        {/* 개인정보처리방침에 동의합니다 */}
                        {/* <div class="mb-3">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="gridCheck"/>
                                    <label class="form-check-label" for="gridCheck">
                                        개인정보처리방침에 동의합니다. (필수)
                                    </label>
                            </div>
                        </div> */}
                        {/* 아이디 */}
                        <div className="mb-3">
                            <label htmlFor="id" className="form-label">아이디</label>
                            <div className="input-group">
                                <input
                                    onBlur={handleIdBlur} onChange={onChange} value={id} placeholder="아이디"
                                    type="text" name="id" id="id" className="form-control input-icon-placeholder1"
                                />
                                <button className="btn btn-outline-secondary" type="button" onClick={checkId}>중복체크</button>
                            </div>
                            <div>
                                {idError && <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{idError}</div>}
                                {idMessage && <div style={{ color: 'blue', fontSize: '12px', marginTop: '5px' }}>{idMessage}</div>}
                            </div>
                        </div>
                        {/* 비밀번호 */}
                        {/* <div className="mb-3">
                            <label htmlFor="password" className="form-label">비밀번호</label>
                            <input
                                onBlur={handlePwBlur} onChange={onChange} value={password} placeholder="비밀번호"
                                type="password" name="password" id="password" className="form-control input-icon-placeholder2"
                            />
                            {pwError && <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{pwError}</div>}
                        </div> */}
                        {/* 비밀번호 확인 */}
                        {/* <div className="mb-3">
                            <label htmlFor="password2" className="form-label">비밀번호 확인</label>
                            <input
                                onBlur={handlePw2Blur} onChange={onChange} value={password2} placeholder="비밀번호 확인"
                                type="password" name="password2" id="password2" className="form-control input-icon-placeholder2"
                            />
                            {pwError2 && <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{pwError2}</div>}
                        </div> */}

                        {/* 비밀번호, 비밀번호 확인 */}
                        <div className="col-md-6 mb-3">
                            <label htmlFor="password" className="form-label">비밀번호</label>
                            <input
                                onBlur={handlePwBlur} onChange={onChange} value={password} placeholder="비밀번호"
                                type="password" name="password" id="password" className="form-control input-icon-placeholder2"
                            />
                            {pwError && <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{pwError}</div>}
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="password2" className="form-label">비밀번호 확인</label>
                            <input
                                onBlur={handlePw2Blur} onChange={onChange} value={password2} placeholder="비밀번호 확인"
                                type="password" name="password2" id="password2" className="form-control input-icon-placeholder2"
                            />
                            {pwError2 && <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{pwError2}</div>}
                        </div>

                        {/* 이름 */}
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">이름</label>
                            <input
                                onBlur={handleNameBlur} onChange={onChange} value={name} placeholder="이름"
                                type="text" name="name" id="name" className="form-control input-icon-placeholder3"
                            />
                            {nameError && <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{nameError}</div>}
                        </div>
                        {/* 생년월일 */}
                        <div className="mb-3">
                            <label htmlFor="birthday8" className="form-label">생년월일</label>
                            <input
                                onBlur={handleBirthdayBlur} onChange={onChange} value={birthday8} placeholder="생년월일 8자리 YYYYMMDD"
                                type="text" name="birthday8" id="birthday8" className="form-control input-icon-placeholder4"
                            />
                            {birthdayError && <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{birthdayError}</div>}
                        </div>
                        {/* 성별 */}
                        <div className="mb-3" display="flex" justifycontent="center" alignitems="center">
                            <label htmlFor="" className="form-label">성별</label>
                            <div className="btn-group" role="group" aria-label="Basic checkbox toggle button group" style={{ width: "100%" }}>
                                <input onBlur={handleGenderBlur} type="checkbox" className="btn-check" value="M" name="gender" id="btncheck1" autoComplete="off" checked={selected.btn1} onChange={() => handleClick('btn1', 'M')} />
                                <label className="btn btn-outline-secondary" htmlFor="btncheck1" style={{ color: selected.btn1 ? 'white' : 'gray', borderColor: "gray" }}>남자</label>

                                <input onBlur={handleGenderBlur} type="checkbox" className="btn-check" value="F" name="gender" id="btncheck2" autoComplete="off" checked={selected.btn2} onChange={() => handleClick('btn2', 'F')} />
                                <label className="btn btn-outline-secondary" htmlFor="btncheck2" style={{ color: selected.btn2 ? 'white' : 'gray', borderColor: "gray" }}>여자</label>
                            </div>
                            {genderError && <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{genderError}</div>}
                        </div>
                        {/* 이메일 */}
                        {/* <div className="mb-3">

                            <input
                                onBlur={handleEmailBlur}
                                onChange={onChange} value={email} placeholder="이메일"
                                type="email" name="email" id="email" className="form-control input-icon-placeholder5"
                                style={{ border: emailError ? "1px solid red" : "1px solid #ced4da" }}
                            />
                            {emailError && <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{emailError}</div>}
                        </div> */}
                        <div className="mb-3">
                            <label htmlFor="" className="form-label">이메일</label>
                            <div className="input-group">
                                <input
                                    onBlur={handleEmailBlur}
                                    onChange={onChange} value={email} placeholder="이메일"
                                    type="text" name="email" id="email" className="form-control input-icon-placeholder5"
                                />
                                <span className="input-group-text">@</span>
                                {/* <input type="text" class="form-control" placeholder="Server" aria-label="Server" /> */}
                                <select className="form-select" onChange={onChange} onBlur={handleEmailBlur} id="emailDomain" name="emailDomain">
                                    <option value="">Choose...</option>
                                    <option value="naver.com">naver.com</option>
                                    <option value="gmail.com">gmail.com</option>
                                    <option value="daum.net">daum.net</option>
                                </select>
                            </div>
                            {emailError && <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{emailError}
                            </div>}
                        </div>

                        {/* 에러 메세지 */}
                        {errorMessege.length > 0 &&
                            (<div className="alert alert-danger" role="alert">
                                {errorMessege.map((message, index) => (<div key={index}>{message}</div>))}
                            </div>)
                        }
                        <div className="d-grid gap-2">
                            <button className="btn btn-secondary" type="submit">회원가입</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;