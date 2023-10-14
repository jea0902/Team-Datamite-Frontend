import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";

export default function QnA() {
  const { setIsLogin } = useContext(AuthContext);

  const handleLoginTest = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <button onClick={handleLoginTest}>로그인 or 로그아웃 테스트</button>
    </div>
  );
}
