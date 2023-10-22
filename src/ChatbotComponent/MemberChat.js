import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import moment from "moment";

import "../css/Chat.css";
import logo from "../assets/image/datamiteLogo.png";
import person from "../assets/image/person-fill.svg";

import KakaoMap from "./KakaoMap/KakaoMap";
import { useUserData } from "../AuthContext";

function MemberChat() {
  // 지도 관련
  const [showMap, setShowMap] = useState(false);
  const [showHospitalReview, setShowHospitalReview] = useState(false);
  const [selectedMarkerInfo, setSelectedMarkerInfo] = useState(null); // 마커를 눌렀을 때의 병원이름 저장 변수
  const [hospitalReview, setHospitalReview] = useState({
    keywords: "",
    negativeReview: 0,
    positiveReview: 0,
    rating: 0.0,
    totalReviews: 0,
  });

  // 마커 정보를 받아와 처리하는 함수
  const handleMarkerClick = (hospitalName) => {
    setSelectedMarkerInfo(hospitalName);
  };

  useEffect(() => {
    // console.log("병원이름", selectedMarkerInfo)

    if (selectedMarkerInfo !== "" && selectedMarkerInfo !== null) {
      async function getHospitalReview() {
        const getResponse = await axios.post(
          // 'http://localhost:8080/api/get/hospital_review'
          "http://3.37.43.105:8080/api/get/hospital_review",
          {
            hospitalName: selectedMarkerInfo,
          }
        );

        if (getResponse.status === 200) {
          console.log(getResponse);
          setHospitalReview(getResponse.data);
          if (getResponse.data === "") {
            setShowHospitalReview(false);
          } else {
            setShowHospitalReview(true);
          }
        }
      }
      getHospitalReview();
    } else {
      setShowHospitalReview(false);
    }
  }, [selectedMarkerInfo]);

  // 메세지 관련
  const [messages, setMessages] = useState([]); // 메시지 목록
  const [newMessage, setNewMessage] = useState(""); // 새로운 메시지 입력값
  const [symphtomMessage, setSymphtomMessage] = useState(""); // 증상 메시지

  const [saveMessages, setSaveMessages] = useState([]); // db에 저장할 메시지 목록 (증상, 진료과)
  const [callAddSaveMessage, setCallAddSaveMessage] = useState(false);
  const [callExit, setCallExit] = useState(false);

  const [isLoading, setIsLoading] = useState(false); // 입력 중인지 여부
  const [userMessageIdCounter, setUserMessageIdCounter] = useState(0); // 사용자 메시지 ID 카운터
  const [serverMessageIdCounter, setServerMessageIdCounter] = useState(0); // 서버 메시지 ID 카운터
  const messagesContainer = useRef(null);

  const userData = useUserData();

  // 서버로 보낼 회원정보 메세지
  const [sendUserInfo, setSendUserInfo] = useState("");

  // 최종 진료과
  const [resultSpeciality, setResultSpeciality] = useState("");

  // 화면을 가장 아래로 스크롤하는 함수
  function scrollToBottom() {
    if (messagesContainer.current) {
      messagesContainer.current.scrollTop =
        messagesContainer.current.scrollHeight;
    }
  }

  // userData가 설정되면 firstMessage 함수 실행
  useEffect(() => {
    if (userData.name) {
      firstMessage();
    }
  }, [userData]);

  function firstMessage() {
    // 회원일 경우 초기 메세지

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
    setSendUserInfo(
      `${calculateAge()},${userData.gender === "F" ? "여자" : "남자"}`
    );

    scrollToBottom();
  }

  function calculateAge() {
    let dateTypeBirth = new Date(userData.birthDate);
    let today = new Date();

    let userAge = today.getFullYear() - dateTypeBirth.getFullYear();

    if (
      today.getMonth() < dateTypeBirth.getMonth ||
      (today.getMonth() === dateTypeBirth.getMonth() &&
        today.getDate() < dateTypeBirth.getDate())
    ) {
      userAge--;
    }

    return userAge;
  }

  // 메시지 목록이 업데이트
  useEffect(() => {
    console.log(messages);
    // console.log("serverID", serverMessageIdCounter)
    // console.log("userID", userMessageIdCounter)

    async function fetchServer() {
      let firstProbability = 0;

      if (userMessageIdCounter === 1 && serverMessageIdCounter === 3) {
        // 회원이 증상을 입력했을 때
        const firstServerResponse = await callModelServer();
        firstProbability = firstServerResponse.top_probability;
        // console.log(firstProbability)

        setIsLoading(true);
        if (firstProbability >= 0.8) {
          addServerMessage(`이런 증상일 경우에는 ${firstServerResponse.speciality}을(를) 추천드려요.`); // 이 함수가 완료되면 userMessageIdCounter = 1 , serverMessageIdCounter = 4

          setIsLoading(true);

          if (firstServerResponse.diseases.length > 0) {
            let disease_top3 = firstServerResponse.diseases.join(", "); // 배열의 항목을 쉼표로 구분한 문자열로 결합
            addServerMessage(`예상 질환명으로는 ${disease_top3} 등이 있어요. 해당 결과가 정확하지 않을 수도 있으니 반드시 의료기관에 방문하여 의사와 상담하시길 바랍니다.`);
          }

          setResultSpeciality(firstServerResponse.speciality);

          setCallExit(true); // 채팅 종료 함수 (chatExit함수를 작동시킬때 save 완료된 다음에 하기 위해서)

          setTimeout(() => setShowMap(true), 5000);
        } else {
          setTimeout(
            () =>
              addServerMessage(
                "상황, 부위, 세부증상 중 빠진 내용이 없는지 다시 한번 확인 후 질문해주세요. 예시) 일주일 전부터 머리가 아프고 콧물이 나요."
              ),
            1000
          );
        }
      }

      // // 회원이 증상을 입력한 후, 서버로 답변을 받았는데 예상치 이상일 때 채팅 종료
      // if (firstProbability >= 0.8 && userMessageIdCounter === 1 && serverMessageIdCounter === 5) {
      //     chatExit();
      // }

      // 회원이 증상을 입력한 후, 서버로부터 답변을 받았는데 예상치 미만이서, 회원이 다시 증상을 입력했을 때
      if (
        firstProbability < 0.8 &&
        userMessageIdCounter === 2 &&
        serverMessageIdCounter === 4
      ) {
        const secondServerResponse = await callModelServer();
        let secondProbability = secondServerResponse.top_probability;

        console.log(secondProbability);

        setIsLoading(true);
        if (secondProbability >= 0.8) {
          setTimeout(
            () => 
            // addServerMessage(secondServerResponse.speciality),
            addServerMessage(`이런 증상일 경우에는 ${secondServerResponse.speciality}을(를) 추천드려요.`),
            1000
          );

          if (secondServerResponse.diseases.length > 0) {
            let disease_top3 = secondServerResponse.diseases.join(", "); // 배열의 항목을 쉼표로 구분한 문자열로 결합
            // addServerMessage(disease_top3);
            addServerMessage(`예상 질환명으로는 ${disease_top3} 등이 있어요. 해당 결과가 정확하지 않을 수도 있으니 반드시 의료기관에 방문하여 의사와 상담하시길 바랍니다.`);
          }

          // secondServerResponse.symptoms.forEach(symptom => {
          //     setTimeout(() => addServerMessage(symptom), 3000);
          // });

          setResultSpeciality(secondServerResponse.speciality);

          setCallExit(true); // 채팅 종료 함수

          setTimeout(() => setShowMap(true), 1000);
        } else {
          setTimeout(
            () =>
              addServerMessage(
                "증상이 구체적이지 않아 판별이 어렵습니다. 근처 병원에 내원해 상담해보세요."
              ),
            1000
          );
          setCallExit(true); // 채팅 종료 함수
        }
      }

      // // 회원이 다시 증상을 입력한 후, 서버가 응답한 후 채팅 종료
      // if (userMessageIdCounter === 2 && serverMessageIdCounter === 5) {
      //     chatExit();
      // }
    }

    fetchServer();
  }, [messages]);

  useEffect(() => {
    if (callExit === true) {
      chatExit();
      setCallExit(false);
    }
  }, [saveMessages]);

  async function callModelServer() {
    // "입력 중..." 표시 활성화
    setIsLoading(true);

    try {
      const response = await axios.post(
        // "http://localhost:8000/process_sympthom"
        "http://3.37.43.105:8000/process_sympthom",
        {
          // input_data: `저는 ${sendUserInfo}, ${symphtomMessage}`,
          userInfo: sendUserInfo,
          input_data: symphtomMessage,
        }
      );

      if (response.data.top_probability >= 0.8) {
        console.log(response.data.top_probability);
        addSaveMessage(symphtomMessage, "symptom");
        addSaveMessage(response.data.speciality, "speciality");

        if (response.data.diseases.length > 0) {
          let diseases = response.data.diseases.join(", ");
          addSaveMessage(diseases, "diseases");
        }
      } else {
        addSaveMessage(symphtomMessage, "symptom");
      }

      const severResponse = {
        speciality: response.data.speciality,
        top_probability: response.data.top_probability,
        diseases: response.data.diseases,
      };

      return severResponse;
    } catch (error) {
      console.log(error);
    }
  }

  function addSaveMessage(content_arg, type_arg) {
    console.log(content_arg, type_arg);
    setSaveMessages((prevMessages) => [
      ...prevMessages,
      {
        id:
          prevMessages.length > 0
            ? prevMessages[prevMessages.length - 1].id + 1
            : 0,
        content: content_arg,
        messageType: type_arg,
        timestamp: new Date(),
      },
    ]);
  }

  function addServerMessage(arg) {
    console.log(serverMessageIdCounter);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id:
          prevMessages.length > 0
            ? prevMessages[prevMessages.length - 1].id + 1
            : 0,
        content: arg,
        messageType: false,
        timestamp: new Date(),
      }, // false = 서버
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

    if (newMessage.trim() === "") return;

    // 사용자의 메시지를 오른쪽에 추가
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id:
          prevMessages.length > 0
            ? prevMessages[prevMessages.length - 1].id + 1
            : 0,
        content: newMessage,
        messageType: true,
        timestamp: new Date(),
      }, //true = 사용자
    ]);

    setSymphtomMessage(newMessage);

    // 입력 필드 초기화
    setNewMessage("");
    setUserMessageIdCounter(userMessageIdCounter + 1);
  }

  async function chatExit() {
    // 채팅 종료 함수
    console.log(saveMessages);
    const accessToken = window.localStorage.getItem("AccessToken");

    try {
        const response = await axios.post(
            'http://localhost:8080/api/save/chat',
            saveMessages
            ,
            {
                headers: {
                    Authorization: accessToken,
                    'Content-Type': 'application/json'
                }
            }
        )

        if (response.status === 200) {
            console.log(response.data)
        }
    } catch (error) {
        console.log(error)
    }

  }

  // 입력 필드 값 변경 처리 함수
  function handleInputChange(event) {
    setNewMessage(event.target.value);
  }

  // 엔터 키 눌렀을 때 메시지 전송
  function handleKeyDown(event) {
    if (event.key === "Enter") {
      sendMessage(event);
    }
  }

  return (
    <div className="container-lg mt-5 mb-5">
      <div className="row justify-content-center h-100">
        <div className="col-xl-4 chat">
          <div className="card chat-card">
            <div className="card-header">
              <div className="text-center">진료과 추천봇</div>
            </div>
            <div className="card-body msg_card_body" ref={messagesContainer}>
              <div
                className="text-center align-items-center"
                style={{ marginBottom: "16px" }}
              >
                <div
                  className="mx-auto"
                  style={{
                    width: "fit-content",
                    borderRadius: "12px",
                    padding: "5px 10px",
                    backgroundColor: "#eaeaea",
                  }}
                >
                  {moment().format("YYYY-MM-DD")}
                </div>
              </div>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`d-flex justify-content-${
                    message.messageType === false ? "start" : "end"
                  } mb-4`}
                >
                  {message.messageType === false ? (
                    <>
                      <div className="img_cont_msg">
                        <img src={logo} className="img-fluid" alt="Server" />
                      </div>
                      <div className="msg_cotainer ">{message.content}</div>
                    </>
                  ) : (
                    <>
                      <div className="msg_cotainer_send">{message.content}</div>
                      <div className="img_cont_msg">
                        <img
                          src={person}
                          className="rounded-circle user_img_msg"
                          alt="User"
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="d-flex justify-content-start mb-4">
                  <div className="img_cont_msg">
                    <img src={logo} className="img-fluid" />
                  </div>
                  <div className="msg_cotainer">입력 중...</div>
                </div>
              )}
            </div>
            <div className="card-footer" style={{ height: "60px" }}>
              <div className="input-group">
                <textarea
                  name=""
                  className="form-control type_msg"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown} // 엔터 키 이벤트 처리
                ></textarea>
                <div className="input-group-append">
                  <span
                    className="input-group-text send_btn"
                    onClick={sendMessage}
                  >
                    <i className="bi bi-send-fill"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showMap && (
          <div className="col-xl-8 chat">
            <div
              className="card"
              style={{ maxwidth: "540px", height: "695px" }}
            >
              <div className="row g-0">
                <div className={showHospitalReview ? "col-md-8" : "col"}>
                  <div className="card-body map_body">
                    <KakaoMap
                      resultSpeciality={resultSpeciality}
                      onMarkerClick={handleMarkerClick}
                    />
                  </div>
                </div>
                {showHospitalReview && (
                  <div className="col-md-4">
                    <div className="card-body text-center">
                      <div
                        className="card"
                        style={{ backgroundColor: "#F5F5F7" }}
                      >
                        <div className="card-header">
                          <div className="position-relative d-inline-block">
                            <strong style={{ fontSize: "1.4rem" }}>리뷰</strong>
                            <span
                              className="ms-2 align-baseline badge rounded-pill bg-primary"
                              style={{ fontSize: "0.8rem" }}
                            >
                              {hospitalReview.totalReviews}
                            </span>
                          </div>
                        </div>
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item">
                            별점 평균 <br></br>
                            <span
                              style={{
                                fontSize: "1.2em",
                                fontWeight: "bold",
                                color: "orange",
                              }}
                            >
                              {hospitalReview.rating}
                            </span>{" "}
                            / 10
                            <div>
                              {[...Array(5)].map((star, index) => {
                                // 별점 평가 로직:
                                // 1. 별점은 0부터 10까지의 값으로, 이를 0~200의 범위로 스케일링한다. (완전히 채워진 별은 100의 값을 가진다.)
                                // 2. 각 별의 기준점에 따라 별 아이콘의 색을 결정한다. (예: 3.5 별점은 첫 3개의 별은 전체 채워짐, 4번째 별은 반쪽만 채워짐, 마지막 별은 비어있음.)
                                const starFullness =
                                  (hospitalReview.rating - index * 2) * 100; // 0 to 200 scale (100 being a full star)
                                const starColor =
                                  starFullness > 100
                                    ? "bi-star-fill text-warning"
                                    : starFullness > 0
                                    ? "bi-star-half text-warning"
                                    : "bi-star text-muted";
                                return (
                                  <i
                                    className={`bi ${starColor}`}
                                    key={index}
                                  ></i>
                                );
                              })}
                            </div>
                          </li>
                          <li className="list-group-item d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center flex-grow-1 justify-content-end">
                              <div>
                                <i className="bi bi-emoji-laughing"></i>
                              </div>
                              <span className="ms-2">
                                {hospitalReview.positiveReview}
                              </span>
                            </div>

                            {/* 회색 세로 줄 */}
                            <div
                              className="border-start mx-3"
                              style={{ height: "24px" }}
                            ></div>

                            <div className="d-flex align-items-center flex-grow-1">
                              <div>
                                <i className="bi bi-emoji-frown"></i>
                              </div>
                              <span className="ms-2">
                                {hospitalReview.negativeReview}
                              </span>
                            </div>
                          </li>
                        </ul>
                        <div className="card-footer">
                          {hospitalReview.keywords
                            .split(",")
                            .map((keyword, index) => (
                              <span
                                className="badge bg-light text-dark rounded-pill ms-2"
                                style={{ padding: "0.8rem 1.2em" }}
                                key={index}
                              >
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

export default MemberChat;
