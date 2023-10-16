import axios from "axios";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useIsLoginState } from "./AuthContext";
import { AuthContext } from "./AuthContext";

function Navbar() {
  const isLogin = useIsLoginState();
  const { setIsLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleLogout(event) {
    event.preventDefault();

    const accessToken = window.localStorage.getItem("AccessToken");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/logout",

        null,
        {
          headers: {
            Authorization: accessToken,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setIsLogin(false);
        window.localStorage.removeItem("AccessToken");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      className="container-fluid"
      style={{
        padding: 0,
        position: "fixed", // 고정된 위치 Top : 0 - 스크롤을 내려도 상단에 고정되게 만드려고
        top: 0,
        left: 0,
        right: 0,
        zIndex: "10", // 겹치면 Navbar를 젤 위로
      }}
    >
      <nav
        className="navbar navbar-expand-lg"
        style={{ backgroundColor: "#fff", opacity: "1" }}
      >
        <div className="container-fluid">
          <a
            className="navbar-brand"
            href="/"
            style={{ color: "#8EC6E6", marginLeft: "13vw", fontSize: "25px" }}
          >
            토닥토닥
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul
              className="navbar-nav mb-2 mb-lg-0"
              style={{ marginLeft: "10vw" }}
            >
              <li className="nav-item" style={{ marginRight: "7vw" }}>
                <a className="nav-link" aria-current="page" href="/chat">
                  챗봇
                </a>
              </li>
              <li className="nav-item" style={{ marginRight: "7vw" }}>
                <a className="nav-link" href="/image">
                  사진으로 물어보기
                </a>
              </li>
              <li className="nav-item" style={{ marginRight: "15vw" }}>
                <a className="nav-link" href="/qna">
                  문의하기
                </a>
              </li>

              {isLogin ? (
                <li className="nav-item dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="userMenu"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="currentColor"
                      className="bi bi-person-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
                    </svg>
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="userMenu">
                    <li>
                      <a className="dropdown-item" href="/mypage">
                        마이페이지
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <a className="dropdown-item" onClick={handleLogout}>
                        로그아웃
                      </a>
                    </li>
                  </ul>
                </li>
              ) : (
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    로그인
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
