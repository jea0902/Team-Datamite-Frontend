import { useLocation } from "react-router-dom";

function FindIdSuccess() {
  const location = useLocation();
  const id = location.state ? location.state.id : null;

  return (
    <div
      className="container-lg"
      style={{ paddingTop: "50px", paddingBottom: "50px" }}
    >
      <div style={{ height: "50px" }}></div>
      <div
        className="card w-50 mb-3 mx-auto align-items-center"
        style={{ paddingBottom: "15px", height: "auto", border: 0 }}
      >
        <div className="card-body row w-100 text-center">
          {/* 복잡하네 row가 있어서 배열이 가능하긴 한데, 높이 조정을 막아버렸네 */}
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "80px" }}
              fill="currentColor"
              className="bi bi-person-check"
              viewBox="0 0 16 16"
            >
              <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514ZM11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
              <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z"></path>
            </svg>
          </div>
          <div className="comment-container" style={{ marginTop: "20px" }}>
            <h6>
              본인인증정보와 일치하는 결과입니다. <br /> 로그인 후 이용해
              주세요.
            </h6>
          </div>
          <div
            className="card mb-3"
            style={{
              maxwidth: "18rem",
              marginTop: "35px",
              backgroundColor: "#8EC6E6",
              border: 0,
            }}
          >
            <div className="card-body">
              <h5 className="card-title" style={{ color: "white" }}>
                {String(id)}
              </h5>
              {/* <p class="card-text">With supporting text below as a natural lead-in to additional content.</p> */}
            </div>
          </div>
          <div style={{ height: "15px" }}></div>
          <a
            href="/login"
            className="col btn btn-secondary findId-findPwBtn"
            // mb-6는 어차피 다른 css 때문에 막혀있었고, col 덕분에 그리드시스템 이용 가로로 나열
            style={{
              padding: "10px 5px",
              backgroundColor: "#8EC6E6",
              color: "white",
              marginRight: "20px",
              border: 0,
            }}
          >
            로그인
          </a>
          <a
            href="/find-password/success"
            className="col btn btn-secondary findId-loginBtn"
            style={{
              padding: "10px 5px",
              backgroundColor: "white",
              color: "#8EC6E6",
              borderColor: "#8EC6E6",
            }}
          >
            비밀번호 찾기
          </a>
        </div>
      </div>
    </div>
  );
}

export default FindIdSuccess;
