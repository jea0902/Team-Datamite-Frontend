import { useContext } from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AuthContext from "./AuthContext";
import Myinfo from "./Myinfo";
import Sidebar from "./Sidebar";
import MyChatHistory from "./MyChatHistory";

function Mypage() {
    // const { loggedIn, setLoggedIn } = useContext(AuthContext);
    return (
        <div className="container-xl">
            <div className="d-flex align-items-start mt-3">
                <div className="nav flex-column nav-pills p-2 me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                    <button className="nav-link active text-nowrap" id="v-pills-home-tab" data-bs-toggle="pill" data-bs-target="#v-pills-home" type="button" role="tab" aria-controls="v-pills-home" aria-selected="true">회원정보</button>
                    <button className="nav-link text-nowrap" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profile" type="button" role="tab" aria-controls="v-pills-profile" aria-selected="false">나의 건강관리</button>
                    <button className="nav-link text-nowrap" id="v-pills-messages-tab" data-bs-toggle="pill" data-bs-target="#v-pills-messages" type="button" role="tab" aria-controls="v-pills-messages" aria-selected="false">나의 질문보기</button>
                    <button className="nav-link text-nowrap" id="v-pills-settings-tab" data-bs-toggle="pill" data-bs-target="#v-pills-settings" type="button" role="tab" aria-controls="v-pills-settings" aria-selected="false" >회원탈퇴</button>
                </div>
                <div className="tab-content p-2 flex-grow-1" id="v-pills-tabContent">
                    <div className="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab" tabIndex="0">
                        <Myinfo />
                    </div>
                    <div className="tab-pane fade" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab" tabIndex="0">
                        This is some placeholder content the Home tab's associated content. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling. You can use it with tabs, pills, and any other .nav-powered navigation.
                    </div>
                    <div className="tab-pane fade" id="v-pills-messages" role="tabpanel" aria-labelledby="v-pills-messages-tab" tabIndex="0">
                        <MyChatHistory />
                    </div>
                    <div className="tab-pane fade" id="v-pills-settings" role="tabpanel" aria-labelledby="v-pills-settings-tab" tabIndex="0">...</div>
                </div>
            </div>
        </div>


        // <div className="container-lg">
        //     <div className="d-flex align-items-start mt-3">
        //         <div className="nav flex-column nav-pills p-2 me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
        //             <Link to="/myinfo" className="nav-link active text-nowrap">회원정보</Link>
        //             <Link to="/health" className="nav-link text-nowrap">나의 건강관리</Link>
        //             <Link to="/questions" className="nav-link text-nowrap">나의 질문보기</Link>
        //             <Link to="/withdraw" className="nav-link text-nowrap">회원탈퇴</Link>
        //         </div>
        //         <div className="tab-content p-2 flex-grow-1" id="v-pills-tabContent">
        //             <Routes>
        //                 <Route path="/myinfo" element={<Myinfo />} />
        //                 {/* <Route path="/health" element={<YourHealthComponent />} />
        //                 <Route path="/questions" element={<YourQuestionsComponent />} />
        //                 <Route path="/withdraw" element={<WithdrawComponent />} /> */}
        //             </Routes>
        //         </div>
        //     </div>
        // </div>

        // <div className="container-lg">
        //     <div className="d-flex align-items-start mt-3">
        //         <div className="nav flex-column nav-pills p-2 me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
        //             <Link to="/myinfo" className="nav-link active text-nowrap">회원정보</Link>
        //             <Link to="/health" className="nav-link text-nowrap">나의 건강관리</Link>
        //             <Link to="/questions" className="nav-link text-nowrap">나의 질문보기</Link>
        //             <Link to="/withdraw" className="nav-link text-nowrap">회원탈퇴</Link>
        //         </div>
        //         <div className="tab-content p-2 flex-grow-1" id="v-pills-tabContent">
        //             <Routes>
        //                 <Route path="/myinfo" element={<Myinfo />} />
        //                 {/* 다른 페이지에 대한 Route 설정도 추가해야 합니다. */}
        //             </Routes>
        //         </div>
        //     </div>
        // </div>
    );
}
export default Mypage;



// import React from 'react';
// import { Routes, Route, Link } from 'react-router-dom';

// function MyInfo() {
//   return (
//     <div>
//       <h2>회원 정보</h2>
//       {/* 회원 정보 내용 */}
//     </div>
//   );
// }

// function YourHealthComponent() {
//   return (
//     <div>
//       <h2>나의 건강 관리</h2>
//       {/* 건강 관리 내용 */}
//     </div>
//   );
// }

// function YourQuestionsComponent() {
//   return (
//     <div>
//       <h2>나의 질문 보기</h2>
//       {/* 질문 보기 내용 */}
//     </div>
//   );
// }

// function WithdrawComponent() {
//   return (
//     <div>
//       <h2>회원 탈퇴</h2>
//       {/* 회원 탈퇴 내용 */}
//     </div>
//   );
// }

// function Mypage() {
//   return (
//     <div className="container-lg">
//       <div className="d-flex align-items-start mt-3">
//         <div className="nav flex-column nav-pills p-2 me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
//           <Link to="/myinfo" className="nav-link active text-nowrap">회원정보</Link>
//           <Link to="/health" className="nav-link text-nowrap">나의 건강관리</Link>
//           <Link to="/questions" className="nav-link text-nowrap">나의 질문보기</Link>
//           <Link to="/withdraw" className="nav-link text-nowrap">회원탈퇴</Link>
//         </div>
//         <div className="tab-content p-2 flex-grow-1" id="v-pills-tabContent">
//           <Routes>
//             <Route path="/myinfo" element={<MyInfo />} />
//             <Route path="/health" element={<YourHealthComponent />} />
//             <Route path="/questions" element={<YourQuestionsComponent />} />
//             <Route path="/withdraw" element={<WithdrawComponent />} />
//           </Routes>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Mypage;
