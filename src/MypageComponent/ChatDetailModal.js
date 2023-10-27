import React, { useEffect, useState } from "react";
import { useUserData } from "../AuthContext";
import moment from "moment"
import logo from "../assets/image/datamiteLogo.png"
import "../css/Chat.css"
import "../css/styles.css"

function ChatDetailModal({ chat, chatId }) {
    const [isOpenModal, setIsOpenModal] = useState(false);

    const [chatDetail, setChatDetail] = useState({
        "chatId": chatId,
        "memberId": "",
        "createDate": "",
        "messageList": [
            {
                "messageId": "",
                "content": "",
                "messageType": "",
                "timestamp": "",
                "chat_id": chatId
            },
        ]
    });

    const userData = useUserData();

    const [messages, setMessages] = useState([]);

    console.log(messages)

    useEffect(() => {

        setMessages([]);

        if (userData.name) {
            setMessages([{
                id: 1,
                content: `${userData.name}님 안녕하세요! 오늘은 어디가 불편해서 저를 찾아오셨나요?`,
                messageType: 'server',
            },
            {
                id: 2,
                content: `증상을 입력해주세요. (상황, 부위, 세부증상)`,
                messageType: 'server',
            },
            {
                id: 3,
                content: `예시) 계단 내려오다 넘어졌는데, 무릎이 붓고 아파요.`,
                messageType: 'server',
            }])
        }

    }, [userData, chatId]);

    useEffect(() => {
        if (chat !== null && messages.length > 0) {
            setChatDetail(chat)

            let newMessages = [...messages]; // 기존 메시지를 복사

            chat.messageList.forEach((message, index) => {
                // 현재 메시지를 추가
                newMessages.push({
                    id: newMessages[newMessages.length - 1].id + 1,
                    content: message.content,
                    messageType: message.messageType === 'SYMPTOM' ? 'user' : 'server',
                });

                if (chat.messageList.length > 3) {
                    if (index === 0) {
                        // 첫 번째 메시지 뒤에 추가 (처음 증상을 입력했는데 정확도가 0.8이 넘지 않았던 경우)
                        newMessages.push({
                            id: newMessages[newMessages.length - 1].id + 1, // 다음 메시지의 id
                            content: "상황, 부위, 세부증상 중 빠진 내용이 없는지 다시 한번 확인 후 질문해주세요. 예시) 일주일 전부터 머리가 아프고 콧물이 나요.",
                            messageType: "server", // 예시로 "user"로 추가
                        });
                    }
                }
            });

            // chat 메시지를 추가
            setMessages([...newMessages]);
        }
    }, [chat]);


    useEffect(() => {
        console.log(messages)
        if (messages.length > 3) {
            setIsOpenModal(true);
        }
    }, [messages])

    return (
        <div className="modal fade"
            id={`chat${chatId}`}
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">
                            채팅 기록 조회
                        </h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    {isOpenModal && (
                        <div className="modal-body">
                            <div className="card-body msg_card_body"
                            >
                                <div className="text-center align-items-center" style={{ marginBottom: "16px" }}>
                                    <div className="mx-auto" style={{ width: 'fit-content', borderRadius: '12px', padding: '5px 10px', backgroundColor: '#eaeaea' }}>
                                        {moment(chatDetail.createDate).format("YYYY-MM-DD")}
                                    </div>
                                </div>
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`d-flex justify-content-${message.messageType === 'server' ? 'start' : 'end'} mb-4`}
                                    >
                                        {message.messageType === 'server' ? (
                                            <>
                                                <div className="img_cont_msg">
                                                    <img src={logo} className="img-fluid" alt="Server" />
                                                </div>
                                                <div className="msg_cotainer ">
                                                    {message.content}
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="msg_cotainer_send">
                                                    {message.content}
                                                </div>
                                                <div className="img_cont_msg">
                                                    <img src={logo} className="rounded-circle user_img_msg" alt="User" />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                            Close
                        </button>
                        {/* <button type="button" className="btn btn-primary">
                            Understood
                        </button> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ChatDetailModal;