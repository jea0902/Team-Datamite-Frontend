import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import moment from "moment";
import "./Chat.css";
import logo from "./datamiteLogo.png";

import KakaoMap from "./KakaoMap/KakaoMap";

function NonMemberChat() {

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

    // 서버로 보낼 사용자정보 메세지
    const [sendUserInfo, setSendUserInfo] = useState("")

    // 최종 진료과
    const [resultSpeciality, setResultSpeciality] = useState("")

    // 화면을 가장 아래로 스크롤하는 함수
    function scrollToBottom() {
        if (messagesContainer.current) {
            messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight;
        }
    }

    // 처음 렌더링 시에만 실행
    useEffect(() => {
        firstMessage()
    }, []);


    function firstMessage() { // 비회원일 경우 초기 메세지

        setMessages([
            {
                id: serverMessageIdCounter,
                content: '환자 분의 나이와 성별을 입력해주세요.',
                messageType: false,
                timestamp: new Date(),
            },
        ]);
        setServerMessageIdCounter(serverMessageIdCounter + 1);
        scrollToBottom();
    }


    // 메시지 목록이 업데이트될 때마다 화면을 가장 아래로 스크롤
    useEffect(() => {
        console.log(messages)
        console.log("serverID", serverMessageIdCounter)
        console.log("userID", userMessageIdCounter)

        async function fetchServer() {
            let firstProbability = 0;

            if (userMessageIdCounter === 1 && serverMessageIdCounter === 1) { // 비회원이 나이와 성별 입력한 경우
                secondMessage()
            }
            if (userMessageIdCounter === 2 && serverMessageIdCounter === 3) { // 비회원이 나이와 성별 입력한 후, 증상 입력했을 때
                const firstServerResponse = await callModelServer();
                firstProbability = firstServerResponse.top_probability
                console.log(firstProbability)
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
                        , 3000);
                }
            }

            // 비회원이 증상을 입력한 후, 서버로부터 답변을 받았는데 예상치 이상치 이상일 때 
            if (firstProbability >= 0.8 && userMessageIdCounter === 2 && serverMessageIdCounter === 4) { // 비회원이 증상 입력한 후, 서버로부터 답변 받았을 때
                // chatExit();
            }

            // 비회원이 증상을 입력한 후, 서버로부터 답변을 받았는데 예상치 미만이어서, 회원이 다시 증상을 입력했을 때
            if (firstProbability < 0.8 && userMessageIdCounter === 3 && serverMessageIdCounter === 4) { // 비회원이 증상 입력한 후, 서버로부터 답변 받았을 때
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

            if (userMessageIdCounter === 3 && serverMessageIdCounter === 5) {
                // chatExit();
            }
        }
        fetchServer();

    }, [messages]);


    function secondMessage() { // 비회원이 나이와 성별을 입력한 후 실행됨
        setMessages((prevMessages) => [
            ...prevMessages,
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
            }, // false = 서버
        ]);
        setServerMessageIdCounter(serverMessageIdCounter + 2);
    }

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

        if (serverMessageIdCounter === 1) { // 비회원이 나이와 성별을 입력했을 경우 
            setSendUserInfo(newMessage)
        } else {
            setSymphtomMessage(newMessage)
        }

        // 입력 필드 초기화
        setNewMessage('');
        setUserMessageIdCounter(userMessageIdCounter + 1);
    }

    // async function chatExit() { // 채팅 종료 함수
    //     console.log(messages)
    //     // const accessToken = window.localStorage.getItem("AccessToken")

    //     try {
    //         const response = await axios.post(
    //             'http://localhost:8080/api/chat',
    //             messages
    //             ,
    //             {
    //                 headers: {
    //                     Authorization: "",
    //                     'Content-Type': 'application/json'
    //                 }
    //             }
    //         )

    //         if (response.status === 200) {
    //             console.log(response.data)
    //         }
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
                        <div className="card" style={{ maxwidth: "540px", height: "695px" }}>
                            <div className="row g-0">
                                <div className={showHospitalReview ? "col-md-8" : "col"}>
                                    <div className="card-body map_body">
                                        <KakaoMap resultSpeciality={resultSpeciality} onMarkerClick={handleMarkerClick} />
                                    </div>
                                </div>
                                {showHospitalReview && (
                                    <div className="col-md-4">
                                        <div className="card-body text-center">
                                            {/* <h5> 리뷰 <span>200</span> </h5>
                                        <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                        <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p> */}
                                            <div className="card" style={{ backgroundColor: "#F5F5F7" }}>
                                                <div className="card-header">
                                                    <div className="position-relative d-inline-block">
                                                        <strong style={{ fontSize: "1.4rem" }}>리뷰</strong>
                                                        <span className="ms-2 align-baseline badge rounded-pill bg-primary" style={{ fontSize: "0.8rem" }}>
                                                            {hospitalReview.totalReviews}
                                                        </span>
                                                    </div>
                                                </div>
                                                <ul className="list-group list-group-flush" >
                                                    <li className="list-group-item"
                                                    >
                                                        별점 평균 <br></br><span style={{ fontSize: '1.2em', fontWeight: 'bold', color: 'orange' }}>{hospitalReview.rating}</span> / 10
                                                        <div>
                                                            {[...Array(5)].map((star, index) => {
                                                                // 별점 평가 로직:
                                                                // 1. 별점은 0부터 10까지의 값으로, 이를 0~200의 범위로 스케일링한다. (완전히 채워진 별은 100의 값을 가진다.)
                                                                // 2. 각 별의 기준점에 따라 별 아이콘의 색을 결정한다. (예: 3.5 별점은 첫 3개의 별은 전체 채워짐, 4번째 별은 반쪽만 채워짐, 마지막 별은 비어있음.)
                                                                const starFullness = (hospitalReview.rating - index * 2) * 100; // 0 to 200 scale (100 being a full star)
                                                                const starColor = starFullness > 100 ? 'bi-star-fill text-warning' : starFullness > 0 ? 'bi-star-half text-warning' : 'bi-star text-muted';
                                                                return <i className={`bi ${starColor}`} key={index}></i>
                                                            })}
                                                        </div>
                                                    </li>
                                                    <li class="list-group-item d-flex align-items-center justify-content-between"
                                                    >
                                                        <div className="d-flex align-items-center flex-grow-1 justify-content-end">
                                                            <div>
                                                                <i className="bi bi-emoji-laughing"></i>
                                                            </div>
                                                            <span className="ms-2">{hospitalReview.positiveReview}</span>
                                                        </div>

                                                        {/* 회색 세로 줄 */}
                                                        <div className="border-start mx-3" style={{ height: '24px' }}></div>

                                                        <div className="d-flex align-items-center flex-grow-1">
                                                            <div>
                                                                <i className="bi bi-emoji-frown"></i>
                                                            </div>
                                                            <span className="ms-2">{hospitalReview.negativeReview}</span>
                                                        </div>

                                                    </li>
                                                </ul>
                                                <div className="card-footer">
                                                    {hospitalReview.keywords.split(',').map((keyword, index) => (
                                                        <span className="badge bg-light text-dark rounded-pill ms-2" style={{ padding: "0.8rem 1.2em" }} key={index}>
                                                            {keyword.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
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

export default NonMemberChat;