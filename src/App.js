import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import {
  IsLoginProvider,
  useIsLoginState,
  useUserData,
} from "../src/AuthContext";

import Navbar from "./Navbar";

import Main from "./Main";
import Signup from "../src/MemberComponent/Signup";
import Login from "../src/MemberComponent/Login";
import FindId from "../src/MemberComponent/FindId";
import FindIdSuccess from "../src/MemberComponent/FindIdSuccess";
import FindPassword from "../src/MemberComponent/FindPassword";
import FindPasswordSuccess from "../src/MemberComponent/FindPasswordSuccess";

import Mypage from "../src/MypageComponent/Mypage";

import MemberChat from "./Chatbot/MemberChat";
import NonMemberChat from "./Chatbot/NonMemberChat";
import ImageQuestion from "./ImageQuestion";

import Footer from "./Footer";
import QnA from "./QnA";

function App() {
  const isLogin = useIsLoginState();

  return (
    <>
      <IsLoginProvider>
        <BrowserRouter>
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
            <div
              className="Main-Contents"
              style={{
                flex: 1,
                // 컨텐츠들이 최대한 이 공간을 차지
                display: "flex",
                flexDirection: "column",
                paddingTop: "50px", // 패딩은 실제 크기를 증가시킴. 마진은 내부를 조절하는 것.
                height: "80%",
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
                {/* 챗봇 */}
                {isLogin ? (
                  <Route path="/chat" element={<MemberChat />} />
                ) : (
                  <Route path="/chat" element={<NonMemberChat />} />
                )}
                {/* 이미지로 물어보기 */}
                <Route path="/ask-image" element={<ImageQuestion />} />
                {/* 마이페이지 */}
                <Route path="/mypage" element={<Mypage />} />
                <Route path="/qna" element={<QnA />} />
              </Routes>
            </div>
            <div className="Footer-Container" style={{ flexShrink: 0 }}>
              {/* flexShrink는 Footer 높이가 메인컨텐츠에 따라 유연하게 조절되도록 */}
              <Footer />
            </div>
          </div>
        </BrowserRouter>
      </IsLoginProvider>
    </>
  );
}

export default App;
