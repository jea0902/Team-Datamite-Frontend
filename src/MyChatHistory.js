import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ChatRow from "./ChatRow";

// 회원 질문 기록 전체 조회
export default function MyChatHistory() {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("AccessToken");

    async function getChatHisoty() {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/mypage/chat-history",
          {
            headers: {
              Authorization: accessToken,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setChats(response.data);
          // console.log(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    getChatHisoty();
  }, []);

  const handleRowClick = (chatId) => {
    navigate(`/mychat/chatId=${chatId}`);
  };

  return (
    <div className="container-sm">
      <div
        className="table-responsive d-flex justify-content-center"
        style={{ paddingTop: "1vh" }}
      >
        <table className="table">
          <thead>
            <tr
              className="table-primary"
              style={{ backgroundColor: "#8ec6e6" }}
            >
              <th
                className="text-center"
                scope="col"
                style={{ padding: "10px 20px" }}
              >
                채팅 번호
              </th>
              <th
                className="text-center"
                scope="col"
                style={{ padding: "10px 20px" }}
              >
                멤버 아이디
              </th>
              <th
                className="text-center"
                scope="col"
                style={{ padding: "10px 20px" }}
              >
                채팅한 날짜
              </th>
              <th
                className="text-center"
                scope="col"
                style={{ padding: "10px 20px" }}
              >
                진료과
              </th>
            </tr>
          </thead>
          <tbody>
            {chats.map((chat) => (
              <ChatRow
                key={chat.chatId}
                chat={chat}
                onRowClick={handleRowClick}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
