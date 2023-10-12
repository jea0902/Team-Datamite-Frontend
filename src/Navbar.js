import axios from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="mx-2 mx-auto position-relative z-2 px-3 py-0 shadow-5 ">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            Navbar
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
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="/chat">
                  챗봇
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  사진으로 물어보기
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  문의하기
                </a>
              </li>
              {/* <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false">
                                Dropdown
                            </a>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#">Action</a></li>
                                <li><a className="dropdown-item" href="#">Another action</a></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><a className="dropdown-item" href="#">Something else here</a></li>
                            </ul>
                        </li> */}
            </ul>
            {/* {loggedIn ? (<a className="btn btn-secondary" href="/logout" role="button">로그아웃</a>) : (<a className="btn btn-secondary" href="/login" role="button">Log in</a>)} */}

            {/* {loggedIn ?
                        (<button type="button" class="btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
                            </svg>
                        </button>) :
                        (<a className="btn btn-secondary" href="/login" role="button">Log in</a>)} */}
            {isLogin ? (
              <div className="btn-group">
                <button
                  type="button"
                  className="btn dropdown-toggle"
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
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <a className="dropdown-item" href="/mypage">
                      My page
                    </a>
                  </li>
                  {/* <li><a class="dropdown-item" href="#">Another action</a></li>
                                        <li><a class="dropdown-item" href="#">Something else here</a></li> */}
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a className="dropdown-item" onClick={handleLogout}>
                      Log out
                    </a>
                  </li>
                </ul>
              </div>
            ) : (
              <a className="btn btn-secondary" href="/login" role="button">
                Log in
              </a>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
