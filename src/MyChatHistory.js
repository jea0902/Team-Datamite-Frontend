import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/styles.css";
import moment from "moment"
import ChatDetailModal from "./ChatDetailModal";

// 회원 질문 기록 전체 조회
function MyChatHistory() {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("AccessToken");

    async function getChatHisoty() {
      try {
        const response = await axios.get('http://localhost:8080/api/mypage/chat-history', {
          headers: {
            Authorization: accessToken,
            'Content-Type': 'application/json'
          }
        })

        if (response.status === 200) {

          // timestamp 기준으로 배열 정렬

          const sortedChats = response.data.sort((a, b) => new Date(a.messageList[0].timestamp) - new Date(b.messageList[0].timestamp));
          setChats(sortedChats)
          // setChats(response.data);
          console.log(response.data);
        }
      } catch (error) {
        console.log(error)
      }
    }

    getChatHisoty();

  }, [])

  const [currentChatId, setCurrentChatId] = useState(null);
  const [currentChat, setCurrentChat] = useState();
  // function handleRowClick(chatId) {
  //   // navigate(`/mychat/chatId=${chatId}`);
  // };

  function handleLinkClick(event, id) {
    event.preventDefault();
    setCurrentChatId(id);
  }

  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {

    if (currentChatId !== null) {
      // chats 배열에서 currentChatId와 일치하는 chat 객체를 찾음
      const chat = chats.find(chat => chat.chatId === currentChatId);
      if (chat) {
        // chat이 존재하면 currentChat 상태를 업데이트
        setCurrentChat(chat);
      }
    } else {
      // currentChatId가 null인 경우, currentChat을 초기화
      setCurrentChat(null);
    }

    setIsOpenModal(true);

  }, [currentChatId])

  return (
    <div className="container-sm">
      <div
        className="table-responsive d-flex justify-content-center"
        style={{ paddingTop: "1vh" }}
      >
        <table className="table">
          <thead>
            <tr>
              <th
                className="text-center"
                scope="col"
                style={{ padding: "10px 20px", backgroundColor: "#bbddf0" }}
              >
                채팅 번호
              </th>
              <th
                className="text-center"
                scope="col"
                style={{ padding: "10px 20px", backgroundColor: "#bbddf0" }}
              >
                진료과
              </th>
              <th
                className="text-center"
                scope="col"
                style={{ padding: "10px 20px", backgroundColor: "#bbddf0" }}
              >
                채팅한 날짜
              </th>
            </tr>
          </thead>
          <tbody>
            {chats.map((chat, index) => {
              // 'SPECIALITY' MessageType을 가진 메시지 찾기
              let specialityMessage = chat.messageList.find(message => message.messageType === 'SPECIALITY');

              // 찾은 메시지의 내용을 변수에 저장
              let specialityMessageContent = specialityMessage ? specialityMessage.content : '';

              return (
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td className="text-center">
                    <a
                      href="#"
                      className="link-dark link-underline-light"
                      onClick={(event) => handleLinkClick(event, chat.chatId)}
                      data-bs-toggle="modal"
                      data-bs-target={`#chat${currentChatId}`}
                    >
                      {specialityMessageContent}
                    </a>
                  </td>
                  <td className="text-center">{moment(chat.createDate).format("YYYY-MM-DD HH:mm:ss")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {isOpenModal && (
        <ChatDetailModal
          chatId={currentChatId}
          chat={currentChat}
        >
        </ChatDetailModal>
      )}

    </div>
  );
}
export default MyChatHistory;