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
import Test from "./Test";
import Mypage from "./Mypage";
import Sidebar from "./Sidebar";
import Myinfo from "./Myinfo";
import NonMemberChat from "./NonMemberChat";
import MemberChat from "./MemberChat";
import AuthContext from "./AuthContext";

import KakaoMap from "./KakaoMap/KakaoMap";
import ImageQuestion from "./ImageQuestion";
import MyChatHistory from "./MyChatHistory";
import ChatDetail from "./ChatDetail";
import QnA from "./QnA";
import "./css/App.css";
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
          <Navbar />
          <div className="main-contents" style={{ paddingTop: "60px" }}>
            {/* <Test/> */}
            {/* <div className='container'> */}
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
              <Route path="/image" element={<ImageQuestion />} />
              <Route path="/mychat" element={<MyChatHistory />} />
              <Route path="/mychat/chatId=:chatId" element={<ChatDetail />} />
              <Route path="/qna" element={<QnA />} />
            </Routes>
          </div>
          <Footer />
          {/* </div> */}
          {/* </div>
          </div> */}
        </BrowserRouter>
      </IsLoginProvider>
    </>
  );
}

export default App;
