import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatRow from "./ChatRow";
import 로딩중 from "../src/assets/image/Loading.gif";

// 회원 질문 기록 전체 조회
export default function MyChatHistory() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

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
          setLoading(false);
          // console.log(response.data);
        }
      } catch (error) {
        console.log(error);
        setChats(mockData); // 프론트 테스트용
        setLoading(false);
      }
    }

    getChatHisoty();
  }, []);

  if (loading)
    return (
      <div
        style={{
          position: "fixed",
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
              <ChatRow key={chat.chatId} chat={chat} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// MockData 프론트 테스트용
export const mockData = [
  {
    chatId: 1,
    memberId: "동일한 아이디",
    createDate: "2023-10-12T07:33:59.153+00:00",
    messageList: [
      {
        messageId: 46,
        content: "A님 안녕하세요! 오늘은 어디가 불편해서 저를 찾아오셨나요?",
        messageType: "SERVER",
        timestamp: "2023-09-25T00:37:01.569+00:00",
        chat_id: 10,
      },
      {
        messageId: 47,
        content: "증상을 입력해주세요. (상황, 부위, 세부증상)",
        messageType: "SERVER",
        timestamp: "2023-09-25T00:37:01.569+00:00",
        chat_id: 10,
      },
      {
        messageId: 48,
        content: "예시) 계단 내려오다 넘어졌는데, 무릎이 붓고 아파요.",
        messageType: "SERVER",
        timestamp: "2023-09-25T00:37:01.569+00:00",
        chat_id: 10,
      },
      {
        messageId: 49,
        content: "배가 아파요",
        messageType: "USER",
        timestamp: "2023-09-25T00:37:19.941+00:00",
        chat_id: 10,
      },
      {
        messageId: 50,
        content: "내과",
        messageType: "SERVER",
        timestamp: "2023-09-25T00:37:23.255+00:00",
        chat_id: 10,
      },
    ],
  },
  {
    chatId: 2,
    memberId: "동일한 아이디",
    createDate: "2023-10-12T07:33:59.153+00:01",
    messageList: [
      {
        messageId: 46,
        content: "A님 안녕하세요! 오늘은 어디가 불편해서 저를 찾아오셨나요?",
        messageType: "SERVER",
        timestamp: "2023-09-25T00:37:01.569+00:00",
        chat_id: 10,
      },
      {
        messageId: 47,
        content: "증상을 입력해주세요. (상황, 부위, 세부증상)",
        messageType: "SERVER",
        timestamp: "2023-09-25T00:37:01.569+00:00",
        chat_id: 10,
      },
      {
        messageId: 48,
        content: "예시) 계단 내려오다 넘어졌는데, 무릎이 붓고 아파요.",
        messageType: "SERVER",
        timestamp: "2023-09-25T00:37:01.569+00:00",
        chat_id: 10,
      },
      {
        messageId: 49,
        content: "배가 아파요",
        messageType: "USER",
        timestamp: "2023-09-25T00:37:19.941+00:00",
        chat_id: 10,
      },
      {
        messageId: 50,
        content: "외과",
        messageType: "SERVER",
        timestamp: "2023-09-25T00:37:23.255+00:00",
        chat_id: 10,
      },
    ],
  },
  {
    chatId: 3,
    memberId: "동일한 아이디",
    createDate: "2023-10-13T07:33:59.153+00:01",
    messageList: [
      {
        messageId: 46,
        content: "A님 안녕하세요! 오늘은 어디가 불편해서 저를 찾아오셨나요?",
        messageType: "SERVER",
        timestamp: "2023-09-25T00:37:01.569+00:00",
        chat_id: 10,
      },
      {
        messageId: 47,
        content: "증상을 입력해주세요. (상황, 부위, 세부증상)",
        messageType: "SERVER",
        timestamp: "2023-09-25T00:37:01.569+00:00",
        chat_id: 10,
      },
      {
        messageId: 48,
        content: "예시) 계단 내려오다 넘어졌는데, 무릎이 붓고 아파요.",
        messageType: "SERVER",
        timestamp: "2023-09-25T00:37:01.569+00:00",
        chat_id: 10,
      },
      {
        messageId: 49,
        content: "배가 아파요",
        messageType: "USER",
        timestamp: "2023-09-25T00:37:19.941+00:00",
        chat_id: 10,
      },
      {
        messageId: 50,
        content: "정신건강의학과",
        messageType: "SERVER",
        timestamp: "2023-09-25T00:37:23.255+00:00",
        chat_id: 10,
      },
    ],
  },
  {
    chatId: 4,
    memberId: "동일한 아이디",
    createDate: "2023-10-17T07:33:59.153+00:11",
    messageList: [
      {
        messageId: 46,
        content: "A님 안녕하세요! 오늘은 어디가 불편해서 저를 찾아오셨나요?",
        messageType: "SERVER",
        timestamp: "2023-09-25T00:37:01.569+00:00",
        chat_id: 10,
      },
      {
        messageId: 47,
        content: "증상을 입력해주세요. (상황, 부위, 세부증상)",
        messageType: "SERVER",
        timestamp: "2023-09-25T00:37:01.569+00:00",
        chat_id: 10,
      },
      {
        messageId: 48,
        content: "예시) 계단 내려오다 넘어졌는데, 무릎이 붓고 아파요.",
        messageType: "SERVER",
        timestamp: "2023-09-25T00:37:01.569+00:00",
        chat_id: 10,
      },
      {
        messageId: 49,
        content: "배가 아파요",
        messageType: "USER",
        timestamp: "2023-09-25T00:37:19.941+00:00",
        chat_id: 10,
      },
      {
        messageId: 50,
        content: "치과",
        messageType: "SERVER",
        timestamp: "2023-09-25T00:37:23.255+00:00",
        chat_id: 10,
      },
    ],
  },
  // ... 추가적인 가짜 데이터
];
