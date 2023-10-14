import axios from "axios";
import React, { useEffect, useState } from "react";
import { mockData } from "./MyChatHistory"; // MockData 테스트용
import 로딩중 from "../src/assets/image/Loading.gif";

// 채팅 기록 상세페이지
export default function ChatDetail({ chat, chatId }) {
  const [chatData, setChatData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getChatDetail() {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/mypage/chat-histort/${chatId}}`
        );
        setChatData(response.data);
        setLoading(false);
      } catch (error) {
        console.log("데이터 가져오는 중 에러", error);
        setChatData(mockData);
        setLoading(false);
      }
    }
    getChatDetail();
  }, [chatId]);

  if (loading)
    return (
      <div
        style={{
          position: "absolute", // 절대 위치 지정
          top: "50%", // 상위 엘리먼트의 중앙으로부터 50% 아래로 이동
          left: "50%", // 상위 엘리먼트의 중앙으로부터 50% 오른쪽으로 이동
          transform: "translate(-50%, -50%)", // 자신의 크기의 절반만큼 올리고 왼쪽으로 이동하여 정중앙 배치
          padding: "20px",
          backgroundColor: "white",
          borderRadius: "8px",
        }}
      >
        <img src={로딩중} alt="Loading" />
      </div>
    );

  if (!chatData)
    return (
      <div
        style={{
          position: "absolute", // 절대 위치 지정
          top: "50%", // 상위 엘리먼트의 중앙으로부터 50% 아래로 이동
          left: "50%", // 상위 엘리먼트의 중앙으로부터 50% 오른쪽으로 이동
          transform: "translate(-50%, -50%)", // 자신의 크기의 절반만큼 올리고 왼쪽으로 이동하여 정중앙 배치
          padding: "20px",
          backgroundColor: "white",
          borderRadius: "8px",
        }}
      >
        사용 가능한 채팅 데이터가 없습니다.
      </div>
    );

  return (
    <div>
      {chat.messageList.map((message, index) => (
        <div
          key={index}
          className="card mb-3"
          style={{ marginTop: "15px", overflow: "hidden" }}
        >
          <div
            className="card-body"
            style={{
              backgroundColor:
                message.messageType === "SERVER" ? "#e9f0f2" : "#f0f8e5",
            }}
          >
            <h5 className="card-title">
              {convertMessageType(message.messageType)}
            </h5>
            <p className="card-text">{message.content}</p>
            <p className="card-text">
              <small className="text-muted">
                {new Date(message.timestamp).toLocaleString()}
              </small>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function convertMessageType(type) {
  switch (type) {
    case "SERVER":
      return "챗봇";
    case "USER":
      return "나";
    default:
      return type;
  }
}
