import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.min.js"
import "bootstrap-icons/font/bootstrap-icons.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState, createContext } from "react";
import Navbar from "./Navbar";

import { IsLoginProvider } from "./AuthContext";
import { useIsLoginState } from "./AuthContext";
import { useUserData } from "./AuthContext";

import Main from "./Main";
import Login from "./Login";
import Signup from "./Signup";
import FindId from "./FindId";
import FindIdSuccess from "./FindIdSuccess";
import FindPassword from "./FindPassword";
import FindPasswordSuccess from "./FindPasswordSuccess";
import Mypage from "./Mypage";
import NonMemberChat from "./NonMemberChat";
import MemberChat from "./MemberChat";

import KakaoMap from "./KakaoMap/KakaoMap";
import ImageQuestion from "./ImageQuestion";
import MyChatHistory from "./MyChatHistory";
import Withdrawal from "./Withdrawal";
import QnA from "./QnA";

import Footer from "./Footer";

function App() {
  const isLogin = useIsLoginState();
  const userData = useUserData();

  // console.log(isLogin);
  // console.log(userData);

  return (
    <>
      <IsLoginProvider>
        <BrowserRouter>
          {/* <div className="p-1 p-lg-2">
            <div className="overflow-x-hidden rounded-top-4 pt-2"> */}
          <div
            className="page-Container"
            style={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh", // 브라우저 높이와 같게 설정
            }}
          >
            <div className="Navbar-Container" style={{ flexShrink: 0 }}>
              {/* flexShrink는 Navbar 높이가 메인컨텐츠에 따라 유연하게 조절되도록 */}
              <Navbar />
            </div>
            {/* <Test/> */}
            {/* <div className='container'> */}
            <div
              className="Main-Contents"
              style={{
                flex: 1,
                // 컨텐츠들이 최대한 이 공간을 차지
                display: "flex",
                flexDirection: "column",
                paddingTop: "50px", // 패딩은 실제 크기를 증가시킴. 마진은 내부를 조절하는 것.
              }}
            >
              <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/main" element={<Main />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/find-id" element={<FindId />} />
                <Route path="/find-id/success" element={<FindIdSuccess />} />
                <Route path="/find-password" element={<FindPassword />} />
                <Route
                  path="/find-password/success"
                  element={<FindPasswordSuccess />}
                />
                <Route path="/mypage" element={<Mypage />} />
                {isLogin ? (
                  <Route path="/chat" element={<MemberChat />} />
                ) : (
                  <Route path="/chat" element={<NonMemberChat />} />
                )}
                <Route path="/kakaomap" element={<KakaoMap />} />
                <Route path="/ask-image" element={<ImageQuestion />} />
                <Route path="/mychat" element={<MyChatHistory />} />

                <Route path="/qna" element={<QnA />} />
                <Route path="/withdrawal" element={<Withdrawal />} />
              </Routes>
            </div>
            <div
              className="Footer-Container"
              style={{ flexShrink: 0, paddingTop: "50px" }}
            >
              {/* flexShrink는 Footer 높이가 내용에 따라 유연하게 조절되도록 */}
              <Footer />
            </div>
          </div>
          {/* </div> */}
          {/* </div>
          </div> */}
        </BrowserRouter>
      </IsLoginProvider>
    </>
  );
}

export default App;
