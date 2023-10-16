import React, { useState } from "react";
import "./css/styles.css";

// 회원 질문 기록 페이지(MyChatHistory)에서 각 채팅의 간략한 정보를 한 행으로 표시하는 컴포넌트
// 이 행을 클릭하면 해당 채팅의 상세페이지로 이동
// 상세 페이지는 ChatDetail 컴포넌트
export default function ChatRow({ chat, onRowClick, index }) {
  const department = chat.messageList[chat.messageList.length - 1].content;
  
  return (
    <tr className="chatRow"
      onClick={() => onRowClick(chat.chatId)}
    >
      <td className="text-center">{index}</td>
      <td className="text-center">{department}</td>
      <td className="text-center">
        {new Date(chat.createDate).toLocaleDateString()}
      </td>

      
    </tr>
  );
}
