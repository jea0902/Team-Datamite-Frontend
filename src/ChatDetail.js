import axios from "axios";
import React, { useEffect, useState } from "react";

// 채팅 기록 상세페이지
export default function ChatDetail({ chat, chatId }) {
  const [chatData, setChatData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://mypage/chat-history/{chatId}`)
      .then((response) => {
        setChatData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("데이터 가져오는 중 에러", error);
        setLoading(false);

        const mockData = {
          chatId: 10,
          memberId: "나 자신",
          createDate: "202023-09-25T00:37:19.941+00:00",
          messageList: [],
        };

        if (mockData.chatId === chatId) {
          setChatData(mockData);
        }
      });
  }, [chatId]);

  if (loading) return <div>로딩중...</div>;

  if (!chatData) return <div>사용 가능한 채팅 데이터가 없습니다.</div>;

  return (
    <div>
      {chat.messageList.map((message, index) => (
        <div key={index} className="card mb-3">
          <div
            className={`card-body ${
              message.messageType === "SERVER" ? "bg-light" : ""
            }`}
          >
            <h5 className="card-title">{message.messageType}</h5>
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
