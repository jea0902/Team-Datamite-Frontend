import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';

function FindPassword() {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [birthday8, setBirthday8] = useState("");
    const [email, setEmail] = useState("");
    const [emailDomain, setEmailDomain] = useState("");

    const [emailError, setEmailError] = useState("");

    const [sendOk, setSendOk] = useState(false)
    const [confirmationNumber, setConfirmationNumber] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(false);

    const [authNum, setAuthNum] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    function onChange(event) {
        // 실제 입력필드 제한 로직

        const { name, value } = event.target;
        if (name === "id") {
            setId(value);
        } else if (name === "name") {
            setName(value);
        } else if (name === "birthday8") {
            if (value.length <= 8) { // 8자리 제한 로직
                setBirthday8(value)
            }
        } else if (name === "email") {
            setEmail(value);
        } else if (name === "emailDomain") {
            setEmailDomain(value);
            // console.log(value);
        } else if (name === "authNum") {
            setAuthNum(value)
        }
    }

    function validateEmail() {
        if (email === "") {
            setEmailError("이메일은 필수 정보입니다!");
            return false;
        } else if (emailDomain === "") {
            setEmailError("올바른 이메일 형식을 선택해 주세요.");
            return false;
        } else {
            setEmailError("");
            setSendOk(true);
            return true;
        }
    }

    function handleEmailBlur() {
        validateEmail();
    }

    async function sendNumber() {
        try {
            const result = await axios.post('http://localhost:8080/api/authenticate/email', {
                email: `${email}@${emailDomain}`
            });

            if (result.status === 200) {
                console.log(result.data)
                alert('인증번호 발송');
                setConfirmationNumber(result.data.authNum);
            }
        } catch (error) {
            console.log(error)
        }
    }

    function confirmNumber() {
        if (authNum === confirmationNumber) {
            alert('인증되었습니다.');
            setMessage('인증되었습니다.');
            setIsConfirmed(true);
        } else {
            alert('번호가 다릅니다.');
            setMessage('번호가 다릅니다.');
        }
    }

    async function onClick(event) {
        event.preventDefault();

        try {
            const result = await axios.post("http://localhost:8080/api/auth/find/password", {
                id: id,
                name: name,
                birthDate: birthday8,
                email: `${email}@${emailDomain}`
            })
            if (result.status === 200) {
                const id = result.data.id
                console.log(id)
                navigate("/find-password/success", { state: { id } });
            }
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <div className="container-sm">
            <div style={{ height: "50px" }}></div>
            <div className="card mb-3 mx-auto align-items-center" style={{ width: "30rem" }}>
                <div className="card-body w-100">
                    <form className="row"
                    // onSubmit={onSubmit} 
                    >
                        {/* 아이디 */}
                        <div className="mb-3">
                            <label htmlFor="id" className="form-label">아이디</label>
                            <input
                                // onBlur={handleNameBlur} 
                                onChange={onChange}
                                value={id}
                                type="text" name="id" id="id" className="form-control input-icon-placeholder3"
                            />
                            {/* {nameError && <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{nameError}</div>} */}
                        </div>

                        {/* 이름 */}
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">이름</label>
                            <input
                                // onBlur={handleNameBlur} 
                                onChange={onChange}
                                value={name}
                                type="text" name="name" id="name" className="form-control input-icon-placeholder3"
                            />
                            {/* {nameError && <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{nameError}</div>} */}
                        </div>
                        {/* 생년월일 */}
                        <div className="mb-3">
                            <label htmlFor="birthday8" className="form-label">생년월일</label>
                            <input
                                // onBlur={handleBirthdayBlur} 
                                onChange={onChange}
                                value={birthday8}
                                placeholder="YYYYMMDD"
                                type="text" name="birthday8" id="birthday8" className="form-control input-icon-placeholder4"
                            />
                            {/* {birthdayError && <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{birthdayError}</div>} */}
                        </div>
                        {/* 이메일 */}
                        {/* </div> */}

                        <div className="mb-3">
                            <label htmlFor="id" className="form-label">이메일</label>
                            <div className="input-group">
                                <input
                                    onBlur={handleEmailBlur} 
                                    onChange={onChange}
                                    value={email}
                                    type="text" name="email" id="email" className="form-control input-icon-placeholder5"
                                />
                                <span className="input-group-text">@</span>
                                {/* <input type="text" class="form-control" placeholder="Server" aria-label="Server" /> */}
                                <select className="form-select"
                                    onBlur={handleEmailBlur} 
                                    onChange={onChange}
                                    id="emailDomain" name="emailDomain">
                                    <option value="">Choose...</option>
                                    <option value="naver.com">naver.com</option>
                                    <option value="gmail.com">gmail.com</option>
                                    <option value="daum.net">daum.net</option>
                                </select>
                                <button
                                    className="btn btn-secondary"
                                    type="button"
                                    onClick={sendNumber}
                                    
                                >인증번호 전송</button>
                            </div>
                            {emailError && <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{emailError}
                            </div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="id" className="form-label">인증번호</label>
                            <div className="input-group">
                                <input
                                    // onBlur={handleEmailBlur}
                                    onChange={onChange} value={authNum}
                                    placeholder="인증번호 6자리"
                                    type="text" name="authNum" id="authNum" className="form-control input-icon-placeholder5"
                                />
                                <button
                                    className="btn btn-secondary"
                                    type="button"
                                    onClick={confirmNumber}
                                    disabled={!confirmationNumber}>
                                    인증번호 확인</button>
                            </div>
                            <div>
                                {/* {idError && <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{idError}</div>}
                                {idMessage && <div style={{ color: 'blue', fontSize: '12px', marginTop: '5px' }}>{idMessage}</div>} */}
                            </div>
                        </div>
                        <div className="d-grid gap-2">
                            <button className="btn btn-secondary" type="submit" onClick={onClick} disabled={!isConfirmed}>확인</button>
                        </div>
                    </form>
                </div>
            </div >
        </div >
    );
}
export default FindPassword;