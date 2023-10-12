import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useState } from 'react';

function FindPasswordSuccess() {

    const location = useLocation();
    const id = location.state ? location.state.id : null;

    // 사용자에게 입력필드 유효성 검사로 알리는 역할하는 변수들
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState("");
    const [isValid, setIsValid] = useState(false);
    const [isCheck, setIsCheck] = useState(false);

    const navigate = useNavigate();

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/;

    function validatePw() {
        if (passwordRegex.test(password)) {
            return true;
        } else {
            return false;
        }
    }

    function validatePw2() {
        if (password === password2) {
            return true;
        } else {
            return false;
        }
    }

    function onChange(event) {
        // 실제 입력필드 제한 로직

        const { name, value } = event.target;

        if (name === "password") {
            if (passwordRegex.test(value)) {
                setIsValid(true);
            } else {
                setIsValid(false);
            }
            setPassword(value)
        } else if (name === "password2") {
            if (value === password) {
                setIsCheck(true)
            } else {
                setIsCheck(false)
            }
            setPassword2(value)
        }
    }

    async function onSubmit(event) {
        event.preventDefault();

        // 각각의 검증 함수 호출
        const isPasswordOk = validatePw();
        const isPassword2Ok = validatePw2();

        // 모든 필드가 유효한지 확인
        if (isPasswordOk && isPassword2Ok) {

            try {
                const result = await axios.put("http://localhost:8080/api/update/password", {
                    id: String(id),
                    password: password
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
            <div className="card w-50 mb-3 mx-auto align-items-center">
                <div className="card-body w-100">
                    <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '80px' }} fill="currentColor" className="bi bi-person-check" viewBox="0 0 16 16">
                            <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514ZM11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
                            <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z"></path>
                        </svg>
                    </div>
                    <div className="text-center mb-3 mt-3">
                        <h6>본인인증정보와 일치하는 결과입니다. <br /> 로그인 후 이용해 주세요.</h6>
                    </div>
                    <hr/>
                    <form className="row"
                        onSubmit={onSubmit}
                    >
                        {/* 비밀번호 */}
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">새 비밀번호</label>
                            <input
                                onChange={onChange} value={password} placeholder="새 비밀번호를 입력해주세요."
                                type="password" name="password" id="password" className="form-control input-icon-placeholder2"
                            />
                            <div style={{ fontSize: '12px', color: isValid ? 'green' : 'grey' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
                                </svg>
                                영문, 숫자, 특수문자 3가지 조합 8자리 이상
                            </div>

                        </div>
                        {/* 비밀번호 확인 */}
                        <div className="mb-3">
                            <label htmlFor="password2" className="form-label">새 비밀번호 확인</label>
                            <input
                                onChange={onChange} value={password2} placeholder="새 비밀번호를 한번 더 입력해주세요."
                                type="password" name="password2" id="password2" className="form-control input-icon-placeholder2"
                                style={{ border: isCheck ? "1px solid green" : null }}
                            />
                        </div>
                        <div className="d-grid gap-2">
                            <button className="btn btn-secondary" type="submit">확인</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>



    );
}

export default FindPasswordSuccess;