import axios from "axios";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useIsLoginState, useUserData, AuthContext } from "./AuthContext";

function Navbar() {
  const isLogin = useIsLoginState();
  const { setIsLogin } = useContext(AuthContext);
  const userData = useUserData();
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
        <div className="container-sm">
          <a
            className="navbar-brand"
            href="/"
            style={{ color: "#8EC6E6", fontSize: "25px" }}
          >
            토닥토닥
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
            <div class="offcanvas-header">
              <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Offcanvas</h5>
              <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
              <ul class="navbar-nav justify-content-sm-evenly flex-grow-1 pe-3">
                <li class="nav-item">
                  <a class="nav-link" aria-current="page" href="/chat">챗봇</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="/ask/image"
                  // style={{marginRight:"100px", marginLeft:"100px"}}
                  >사진으로 물어보기</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="/ask/image">문의하기</a>
                </li>
              </ul>

              {isLogin && userData.name !== '' ? (
                <ul class="navbar-nav">
                  <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <i class="bi bi-person-fill"></i> {userData.name}
                    </a>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item" href="#"><i class="bi bi-person-circle"></i>  Profile</a></li>
                      <li><a class="dropdown-item" href="#"><i class="bi bi-chat-dots"></i>  Chat History</a></li>
                      <li><a class="dropdown-item" href="#"><i class="bi bi-graph-up"></i>  Dashboard</a></li>
                      <li>
                        <hr class="dropdown-divider" />
                      </li>
                      <li><a class="dropdown-item" onClick={handleLogout}><i class="bi bi-power" style={{fontWeight: 'bold'}}></i> Log out</a></li>
                    </ul>
                  </li>
                </ul>
              ) : (
                <div class="d-flex">
                  <div class="p-2 text-center">
                    <a class="dropdown-item" href="/login">로그인</a></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
