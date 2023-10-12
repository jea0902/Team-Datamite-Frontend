import axios from "axios";
import React, { useState, useRef, useEffect } from 'react';
import moment from "moment";
import "./Chat.css"
import logo from "./datamiteLogo.png"

import KakaoMap from "./KakaoMap/KakaoMap"

import { useUserData } from "./AuthContext";

function MemberChat() {

    // 지도 관련
    const [showMap, setShowMap] = useState(false);
    const [showHospitalReview, setShowHospitalReview] = useState(false);
    const [selectedMarkerInfo, setSelectedMarkerInfo] = useState(null); // 마커를 눌렀을 때의 병원이름 저장 변수
    const [hospitalReview, setHospitalReview] = useState({
        keywords: '',
        negativeReview: 0,
        positiveReview: 0,
        rating: 0.0,
        totalReviews: 0
    });

    // 마커 정보를 받아와 처리하는 함수
    const handleMarkerClick = (hospitalName) => {

        setSelectedMarkerInfo(hospitalName);
    };

    useEffect(() => {
        // console.log("병원이름", selectedMarkerInfo)

        if (selectedMarkerInfo !== '' && selectedMarkerInfo !== null) {
            async function getHospitalReview() {
                const response = await axios.post('http://localhost:8080/api/get/hospital_review', {
                    hospitalName: selectedMarkerInfo
                })

                if (response.status === 200) {
                    console.log(response)
                    setHospitalReview(response.data)
                    if (response.data === '') {
                        setShowHospitalReview(false)
                    } else {
                        setShowHospitalReview(true)
                    }
                }
            }
            getHospitalReview();
        } else {
            setShowHospitalReview(false)
        }
    }, [selectedMarkerInfo])

    // 메세지 관련
    const [messages, setMessages] = useState([]); // 메시지 목록
    const [newMessage, setNewMessage] = useState(''); // 새로운 메시지 입력값
    const [symphtomMessage, setSymphtomMessage] = useState('') // 증상 메시지

    const [isLoading, setIsLoading] = useState(false); // 입력 중인지 여부
    const [userMessageIdCounter, setUserMessageIdCounter] = useState(0); // 사용자 메시지 ID 카운터
    const [serverMessageIdCounter, setServerMessageIdCounter] = useState(0); // 서버 메시지 ID 카운터
    const messagesContainer = useRef(null);

    const userData = useUserData();

    // 서버로 보낼 회원정보 메세지
    const [sendUserInfo, setSendUserInfo] = useState("")

    // 최종 진료과
    const [resultSpeciality, setResultSpeciality] = useState("")

    // 화면을 가장 아래로 스크롤하는 함수
    function scrollToBottom() {
        if (messagesContainer.current) {
            messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight;
        }
    }

    // userData가 설정되면 firstMessage 함수 실행
    useEffect(() => {

        if (userData.name) {
            firstMessage();
        }

    }, [userData]);

    function firstMessage() { // 회원일 경우 초기 메세지

        setMessages([
            {
                id: serverMessageIdCounter,
                content: `${userData.name}님 안녕하세요! 오늘은 어디가 불편해서 저를 찾아오셨나요?`,
                messageType: false,
                timestamp: new Date(),
            },
            {
                id: serverMessageIdCounter + 1,
                content: `증상을 입력해주세요. (상황, 부위, 세부증상)`,
                messageType: false,
                timestamp: new Date(),
            },
            {
                id: serverMessageIdCounter + 2,
                content: `예시) 계단 내려오다 넘어졌는데, 무릎이 붓고 아파요.`,
                messageType: false,
                timestamp: new Date(),
            },
        ]);

        setServerMessageIdCounter(serverMessageIdCounter + 3);
        setSendUserInfo(`${calculateAge()},${userData.gender === 'F' ? '여자' : '남자'}`)

        scrollToBottom();
    }

    function calculateAge() {
        let dateTypeBirth = new Date(userData.birthDate);
        let today = new Date();

        let userAge = today.getFullYear() - dateTypeBirth.getFullYear();

        if (today.getMonth() < dateTypeBirth.getMonth || (today.getMonth() === dateTypeBirth.getMonth() && today.getDate() < dateTypeBirth.getDate())) {
            userAge--;
        }

        return userAge;
    }

    // // 메시지 목록이 업데이트
    // useEffect(() => {
    //     console.log(messages)
    //     console.log("serverID", serverMessageIdCounter)
    //     console.log("userID", userMessageIdCounter)

    //     async function fetchServer() {
    //         let firstProbability = 0;

    //         if (userMessageIdCounter === 1 && serverMessageIdCounter === 3) { // 회원이 증상을 입력했을 때
    //             const firstServerResponse = await callModelServer();
    //             firstProbability = firstServerResponse.top_probability
    //             // console.log(firstProbability)
    //             setIsLoading(true)

    //             if (firstProbability >= 0.8) {
    //                 setTimeout(() =>
    //                     addServerMessage(firstServerResponse.speciality) // 이 함수가 완료되면 userMessageIdCounter = 1 , serverMessageIdCounter = 4
    //                     , 3000);
    //             } else {
    //                 setTimeout(() =>
    //                     addServerMessage("상황, 부위, 세부증상 중 빠진 내용이 없는지 다시 한번 확인 후 질문해주세요. 예시) 일주일 전부터 머리가 아프고 콧물이 나요.")
    //                     , 3000);
    //             }
    //         }

    //         // 회원이 증상을 입력한 후, 서버로 답변을 받았는데 예상치 이상일 때
    //         if (firstProbability >= 0.8 && userMessageIdCounter === 1 && serverMessageIdCounter === 4) {
    //             // chatExit();
    //         }

    //         // 회원이 증상을 입력한 후, 서버로부터 답변을 받았는데 예상치 미만이서, 회원이 다시 증상을 입력했을 때
    //         if (firstProbability < 0.8 && userMessageIdCounter === 2 && serverMessageIdCounter === 4) {

    //             const secondServerResponse = await callModelServer();
    //             let secondProbability = secondServerResponse.top_probability

    //             console.log(secondProbability)

    //             setIsLoading(true)
    //             if (secondProbability >= 0.7) {
    //                 setTimeout(() => addServerMessage(secondServerResponse.speciality), 3000);
    //             } else {
    //                 setTimeout(() => addServerMessage("증상이 구체적이지 않아 판별이 어렵습니다. 근처 병원에 내원해 상담해보세요."), 3000);
    //             }
    //         }

    //         // 회원이 다시 증상을 입력한 후, 서버가 응답한 후 채팅 종료
    //         if (userMessageIdCounter === 2 && serverMessageIdCounter === 5) {
    //             // chatExit();
    //         }
    //     }
    //     fetchServer();

    // }, [messages]);
    

    // 메시지 목록이 업데이트
    useEffect(() => {
        console.log(messages)
        console.log("serverID", serverMessageIdCounter)
        console.log("userID", userMessageIdCounter)

        async function fetchServer() {
            let firstProbability = 0;

            if (userMessageIdCounter === 1 && serverMessageIdCounter === 3) { // 회원이 증상을 입력했을 때
                const firstServerResponse = await callModelServer();
                firstProbability = firstServerResponse.top_probability
                // console.log(firstProbability)
                setIsLoading(true)

                if (firstProbability >= 0.8) {
                    setTimeout(() =>
                        addServerMessage(firstServerResponse.speciality) // 이 함수가 완료되면 userMessageIdCounter = 1 , serverMessageIdCounter = 4
                        , 1000);

                    firstServerResponse.symptoms.forEach(symptom => {
                        setTimeout(() => addServerMessage(symptom), 1000);
                    });

                    setResultSpeciality(firstServerResponse.speciality)

                    setTimeout(() => setShowMap(true), 1000);

                } else {
                    setTimeout(() =>
                        addServerMessage("상황, 부위, 세부증상 중 빠진 내용이 없는지 다시 한번 확인 후 질문해주세요. 예시) 일주일 전부터 머리가 아프고 콧물이 나요.")
                        , 1000);
                }
            }

            // 회원이 증상을 입력한 후, 서버로 답변을 받았는데 예상치 이상일 때 채팅 종료
            if (firstProbability >= 0.8 && userMessageIdCounter === 1 && serverMessageIdCounter === 4) {
                // chatExit();
            }

            // 회원이 증상을 입력한 후, 서버로부터 답변을 받았는데 예상치 미만이서, 회원이 다시 증상을 입력했을 때
            if (firstProbability < 0.8 && userMessageIdCounter === 2 && serverMessageIdCounter === 4) {

                const secondServerResponse = await callModelServer();
                let secondProbability = secondServerResponse.top_probability

                console.log(secondProbability)

                setIsLoading(true)
                if (secondProbability >= 0.7) {
                    setTimeout(() => addServerMessage(secondServerResponse.speciality), 1000);
                    secondServerResponse.symptoms.forEach(symptom => {
                        setTimeout(() => addServerMessage(symptom), 1000);
                    });
                    setResultSpeciality(secondServerResponse.speciality)
                    setTimeout(() => setShowMap(true), 1000);
                } else {
                    setTimeout(() => addServerMessage("증상이 구체적이지 않아 판별이 어렵습니다. 근처 병원에 내원해 상담해보세요."), 1000);
                }
            }

            // 회원이 다시 증상을 입력한 후, 서버가 응답한 후 채팅 종료
            if (userMessageIdCounter === 2 && serverMessageIdCounter === 5) {
                // chatExit();
            }
        }
        fetchServer();

    }, [messages]);


    // async function callModelServer() {
    //     // "입력 중..." 표시 활성화
    //     setIsLoading(true);

    //     try {

    //         const response = await axios.post('http://localhost:8000/process_sympthom', {
    //             input_data: `저는 ${sendUserInfo}, ${symphtomMessage}`,
    //         });

    //         const severResponse = {
    //             speciality: response.data.speciality,
    //             top_probability: response.data.top_probability
    //         };

    //         return severResponse;

    //     } catch (error) {

    //         console.log(error);

    //     }
    // }

    async function callModelServer() {
        // "입력 중..." 표시 활성화
        setIsLoading(true);

        try {

            const response = await axios.post('http://localhost:8000/process_sympthom', {
                input_data: `저는 ${sendUserInfo}, ${symphtomMessage}`,
            });

            const severResponse = {
                speciality: response.data.speciality,
                top_probability: response.data.top_probability,
                symptoms: response.data.symptoms
            };

            return severResponse;

        } catch (error) {

            console.log(error);

        }
    }

    function addServerMessage(arg) {
        setMessages((prevMessages) => [
            ...prevMessages,
            { id: serverMessageIdCounter, content: arg, messageType: false, timestamp: new Date() }, // false = 서버
        ]);

        // 화면을 가장 아래로 스크롤
        scrollToBottom();

        // "입력 중..." 표시 비활성화
        setIsLoading(false);
        // 메시지 ID 카운터 증가
        setServerMessageIdCounter(serverMessageIdCounter + 1);

    }

    // 메시지 전송 함수
    function sendMessage(event) {
        event.preventDefault();

        if (newMessage.trim() === '') return;

        // 사용자의 메시지를 오른쪽에 추가
        setMessages((prevMessages) => [
            ...prevMessages,
            { id: userMessageIdCounter, content: newMessage, messageType: true, timestamp: new Date() }, //true = 사용자
        ]);

        setSymphtomMessage(newMessage)

        // 입력 필드 초기화
        setNewMessage('');
        setUserMessageIdCounter(userMessageIdCounter + 1);
    }


    // async function chatExit() { // 채팅 종료 함수
    //     console.log(messages)
    //     const accessToken = window.localStorage.getItem("AccessToken")

    //     try {
    //         const response = await axios.post(
    //         'http://localhost:8080/api/save/chat', 
    //         messages
    //         ,  
    //         {
    //             headers: {
    //                 Authorization: accessToken,
    //                 'Content-Type': 'application/json'
    //             }
    //         }
    //     )

    //     if (response.status === 200) {
    //         console.log(response.data)
    //     }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    // 입력 필드 값 변경 처리 함수
    function handleInputChange(event) {
        setNewMessage(event.target.value);
    }

    // 엔터 키 눌렀을 때 메시지 전송
    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            sendMessage(event);
        }
    }

    return (
        <div className="container-lg mt-5">
            <div className="row justify-content-center h-100">
                <div className="col-xl-4 chat">
                    {/* <div className="col-md-8 col-xl-6 chat"> */}
                    <div className="card">
                        <div className="card-header">
                            <div className="text-center">
                                진료과 추천봇
                            </div>
                        </div>
                        <div className="card-body msg_card_body" ref={messagesContainer}>
                            <div className="text-center align-items-center" style={{ marginBottom: "16px" }}>
                                <div className="mx-auto" style={{ width: 'fit-content', borderRadius: '12px', padding: '5px 10px', backgroundColor: '#eaeaea' }}>
                                    {moment().format("YYYY-MM-DD")}
                                </div>
                            </div>
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`d-flex justify-content-${message.messageType === false ? 'start' : 'end'} mb-4`}
                                >
                                    {message.messageType === false ? (
                                        <>
                                            <div className="img_cont_msg">
                                                <img src={logo} className="img-fluid" alt="Server" />
                                            </div>
                                            <div className="msg_cotainer ">
                                                {message.content}
                                                <span className="msg_time">
                                                    {/* {message.timestamp.toString()} */}
                                                    {/* {moment(message.timestamp).format("YYYY-MM-DD HH:mm:ss")} */}
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="msg_cotainer_send">
                                                {message.content}
                                                <span className="msg_time_send">
                                                    {/* {moment(message.timestamp).format("YYYY-MM-DD HH:mm:ss")} */}
                                                    {/* {message.timestamp.toString()} */}
                                                </span>
                                            </div>
                                            <div className="img_cont_msg">
                                                <img src={logo} className="rounded-circle user_img_msg" alt="User" />
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                            {isLoading &&
                                <div className="d-flex justify-content-start mb-4">
                                    <div className="img_cont_msg">
                                        <img src={logo} className="img-fluid" />
                                    </div>
                                    <div className="msg_cotainer">
                                        입력 중...
                                    </div>
                                </div>
                            }
                        </div>
                        <div className="card-footer" style={{ height: "60px" }}>
                            <div className="input-group">
                                <textarea name=""
                                    className="form-control type_msg"
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown} // 엔터 키 이벤트 처리
                                ></textarea>
                                <div className="input-group-append">
                                    <span className="input-group-text send_btn" onClick={sendMessage}><i className="bi bi-send-fill"></i></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {showMap && (
                    <div className="col-xl-8 chat">
                        <div class="card" style={{ maxwidth: "540px", height: "695px" }}>
                            <div class="row g-0">
                                <div class={showHospitalReview ? "col-md-8" : "col"}>
                                    <div class="card-body map_body">
                                        <KakaoMap resultSpeciality={resultSpeciality} onMarkerClick={handleMarkerClick} />
                                    </div>
                                </div>
                                {showHospitalReview && (
                                    <div class="col-md-4">
                                        <div className="card-body">
                                            <h5 class="card-title">Card title</h5>
                                            <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                            <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MemberChat;