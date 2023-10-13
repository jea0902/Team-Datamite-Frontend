import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ChatRow from "./ChatRow";

// 회원 질문 기록 전체 조회
export default function MyChatHistory({ accessToken }) {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/mypage/chat-history", {
        headers: {
          Authorization: accessToken,
          //
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setChats(response.data);
      })
      .catch((error) => {
        console.error("데이터 fetching error:", error);
        setChats(mockData); // 테스트용으로 mockData 사용
      });
  }, [accessToken]);

  const handleRowClick = (chatId) => {
    navigate(`/mychat/chatId=${chatId}`);
  };

  // MockData
  const mockData = [
    {
      chatId: 1,
      memberId: "동일한 아이디",
      createDate: "2023-10-12T07:33:59.153+00:00",
      messageList: [
        {
          content: "치과",
        },
      ],
    },
    {
      chatId: 2,
      memberId: "동일한 아이디",
      createDate: "2023-10-12T07:33:59.153+00:01",
      messageList: [
        {
          content: "내과",
        },
      ],
    },
    {
      chatId: 3,
      memberId: "동일한 아이디",
      createDate: "2023-10-13T07:33:59.153+00:01",
      messageList: [
        {
          content: "이비인후과",
        },
      ],
    },
    {
      chatId: 4,
      memberId: "동일한 아이디",
      createDate: "2023-10-17T07:33:59.153+00:11",
      messageList: [
        {
          content: "신경외과",
        },
      ],
    },
    // ... 추가적인 가짜 데이터
  ];

  return (
    <div
      className="table-responsive d-flex justify-content-center"
      style={{ paddingTop: "10vh" }}
    >
      <table className="table">
        <thead>
          <tr className="table-primary" style={{ backgroundColor: "#34b4fc" }}>
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
  );
}
