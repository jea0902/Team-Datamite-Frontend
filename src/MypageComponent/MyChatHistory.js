import axios from "axios";
import React, { useEffect, useState } from "react";
import moment from "moment"
import ChatDetailModal from "./ChatDetailModal";
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

                    const sortedChats = response.data.sort((a, b) => new Date(b.messageList[0].timestamp) - new Date(a.messageList[0].timestamp));
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

    // const [filterSpeciality, setFilterSpeciality] = useState(""); // 진료과 필터 상태
    // const filterBySpeciality = (chat) => {
    //   if (filterSpeciality === "") {
    //     return true; // 필터가 선택되지 않은 경우 모든 항목 표시
    //   }

    //   return chat.messageList.some(
    //     (message) =>
    //       message.messageType === "SPECIALITY" &&
    //       message.content.includes(filterSpeciality)
    //   );
    // };




    // const [filteredChats, setFilteredChats] = useState([]); // 필터링된 채팅 목록
    // const [filterSpeciality, setFilterSpeciality] = useState("");

    // useEffect(() => {
    //   // 필터링된 채팅을 설정
    //   let filteredChats = chats.filter((chat) => {
    //     if (!filterSpeciality) {
    //       return true; // 필터링할 진료과가 없으면 모두 표시
    //     }
    //     const specialityMessage = chat.messageList.find(
    //       (message) => message.messageType === "SPECIALITY"
    //     );
    //     const specialityMessageContent = specialityMessage
    //       ? specialityMessage.content.toLowerCase()
    //       : "";
    //     // return specialityMessageContent.includes(filterSpeciality);
    //     return specialityMessageContent === filterSpeciality;
    //   });
    //   setFilteredChats(filteredChats);
    // }, [chats, filterSpeciality]);


    const [paginatedItems, setPaginatedItems] = useState([]);
    useEffect(() => {
        if (chats.length != 0) {
            // if(chats.length % 5 != 0) {
            //   for (let i = 0; i < (chats.length%5); i++) {
            //     chats.push({chatId: null, memberId: '', createDate: null, messageList: []})
            //   }
            // }
            // console.log("chat", chats);
            const arr = [];

            for (let i = 0; i < chats.length; i += itemsPerPage) {
                const pageItems = chats.slice(i, i + itemsPerPage);
                arr.push(pageItems);
            }
            setPaginatedItems(arr);
            setTotalPages(arr.length)
        }
    }, [chats])




    /////////////////////////////////////////////////////////////////////////
    // 페이지 네이션
    const [currentPage, setCurrentPage] = useState(null); // 현재 페이지
    const itemsPerPage = 5; // 한 페이지당 보여질 아이템 수
    const [totalPages, setTotalPages] = useState(0);

    // useEffect(() => {

    //   if (filteredChats.length !== 0) {
    //     setTotalPages(Math.ceil(filteredChats.length / itemsPerPage))
    //   }

    // }, [currentPage, paginatedItems])

    function handlePageChange(newPage) {
        setCurrentPage(newPage);
    };

    const [pageNumbers, setPageNumbers] = useState([]);
    const [showPagenation, setShowPagenation] = useState(false);
    useEffect(() => {
        if (totalPages != 0) {
            let arr = []
            for (let i = 1; i <= totalPages; i++) {
                arr.push(i)
            }
            setPageNumbers(arr);
            setCurrentPage(1);
        }

    }, [totalPages])

    const [currentItems, setCurrentItems] = useState([]);
    const [showList, setShowList] = useState(false);
    useEffect(() => {
        if (currentPage !== null) {
            setCurrentItems(paginatedItems[currentPage - 1])
            setShowList(true)
            console.log(currentItems);
        }
    }, [currentPage])


    // useEffect(()=>{
    //   if (currentItems.length == 3 ) {
    //     currentItems.push([])
    //     setCurrentItems(currentItems)
    //   }
    // },[currentItems])

    useEffect(() => {
        if (pageNumbers.length === totalPages) {
            console.log(pageNumbers)
            setShowPagenation(true);
        }
    }, [pageNumbers])


    //////////////////////////////////////////////////////////////////////////
    // 채팅 삭제
    async function onDelete(chatId) {
        alert("삭제하시겠습니까?.");
        console.log(chatId)
        // try {
        //   const result = await axios.delete(`http://localhost:8080/chat-delete/${chatId}`);
        //   if (result.status === 200) {
        //     alert("삭제되었습니다.");
        //     // navigate("/board")
        //     let updatedFilteredChats = filteredChats.filter((chat) => chat.chatId !== chatId);
        //     setFilteredChats(updatedFilteredChats);
        //   }
        // } catch (error) {
        //   alert("서버 문제로 삭제할 수 없습니다.");
        // }
    }


    //////////////////////////////////////////////////////////////////////////
    // 각각의 채팅에 대한 모달 관련 코드
    const [currentChatId, setCurrentChatId] = useState(null);
    const [currentChat, setCurrentChat] = useState();

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
    ////////////////////////////////////////////////////////////////////////////

    return (
        <div>
            <div className="row">
                <div class="col-8">
                    {/* <input type="search" class="form-control form-control-sm" placeholder="Search" aria-label="Search" /> */}
                </div>
                <div className="col-4 mb-3">
                    <select
                        className="form-select form-select-sm"
                    // value={filterSpeciality}
                    // onChange={(e) => setFilterSpeciality(e.target.value)}
                    >
                        <option value="">전체 진료과</option>
                        <option value="내과" style={{ paddingRight: "10px" }}>내과</option>
                        <option value="이비인후과">이비인후과</option>
                        <option value="소아청소년과">소아청소년과</option>
                        <option value="신경과">신경과</option>
                        <option value="안과">안과</option>
                        <option value="외과">외과</option>
                        <option value="정신건강의학과">정신건강의학과</option>
                        <option value="정형외과">정형외과</option>
                        <option value="치과">치과</option>
                        <option value="산부인과">산부인과</option>
                        <option value="비뇨의학과">비뇨의학과</option>
                    </select>
                </div>
            </div>
            {showList && <div className="table-responsive d-flex justify-content-center">
                <table className="table table-sm">
                    <thead style={{fontWeight:'normal'}}>
                        <tr className="table-hover-effect">
                            <th className="text-center align-middle"
                                scope="col">
                                채팅 번호
                            </th>
                            <th className="text-center align-middle"
                                scope="col">
                                진료과
                            </th>
                            <th className="text-center align-middle"
                                scope="col">
                                채팅한 날짜
                            </th>
                            <th className="text-center align-middle"
                                scope="col">

                            </th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {currentItems.map((chat, index) => {
                            // 'SPECIALITY' MessageType을 가진 메시지 찾기
                            let specialityMessage = chat.messageList.find(
                                (message) => message.messageType === "SPECIALITY"
                            );

                            // 찾은 메시지의 내용을 변수에 저장
                            let specialityMessageContent = specialityMessage
                                ? specialityMessage.content
                                : "";

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
                                    <td className="text-center">
                                        {moment(chat.createDate).format("YYYY-MM-DD")}
                                        {/* {moment(chat.createDate).format("YYYY-MM-DD HH:mm:ss")} */}
                                    </td>
                                    <td>
                                        <button className="btn btn-link link-danger pt-0 pb-0" onClick={() => onDelete(chat.chatId)}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            );

                        })}
                    </tbody>
                </table>
            </div>}

            {/* 페이지네이션 */}
            {showPagenation && (
                <nav aria-label="Page navigation example">
                    <ul class="pagination justify-content-center">
                        {pageNumbers.map((page) => (
                            <li key={page} class={`page-item ${page === currentPage ? "active" : ""}`} >
                                <a class="page-link" onClick={() => handlePageChange(page)}>
                                    {page}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}

            {isOpenModal && (
                <ChatDetailModal chatId={currentChatId} chat={currentChat} />
            )}
        </div>
    );
}
export default MyChatHistory;