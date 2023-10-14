import React, { useState } from "react";
import "./css/styles.css";
import ChatDetail from "./ChatDetail";

// 회원 질문 기록 페이지(MyChatHistory)에서 각 채팅의 간략한 정보를 한 행으로 표시하는 컴포넌트
// 이 행을 클릭하면 해당 채팅의 상세페이지로 이동
// 모달까지 포함
// 상세 페이지는 ChatDetail 컴포넌트
export default function ChatRow({ chat }) {
  const department = chat.messageList[chat.messageList.length - 1].content;

  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <tr
        className="chatRow"
        onClick={() => setShowModal(true)}
        style={{ cursor: "pointer" }}
      >
        <td className="text-center">{chat.chatId}</td>
        <td className="text-center">{chat.memberId}</td>
        <td className="text-center">
          {new Date(chat.createDate).toLocaleDateString()}
        </td>
        <td className="text-center">{department}</td>
      </tr>

      {showModal && (
        <div
          className="modal"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            className="modal-content"
            style={{
              position: "relative",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              width: "100%",
              height: "100%",
              maxWidth: "600px",
              maxHeight: "80vh",
              overflowY: "auto", // 내용이 길어지면 스크롤 생기게
            }}
          >
            <div
              className="modal-header"
              style={{
                backgroundColor: "white",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                borderBottom: "1px solid #e1e1e1",
              }}
            >
              채팅 내역
            </div>

            <span
              className="close-button"
              onClick={() => setShowModal(false)}
              style={{
                cursor: "pointer",
                position: "absolute",
                top: "20px",
                right: "20px",
              }}
            >
              ❌
            </span>
            <div className="chatDetail">
              <ChatDetail chat={chat} chatId={chat.chatId} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
