import Myinfo from "./Myinfo";
import MyChatHistory from "./MyChatHistory";

import "../css/styles.css";

function Mypage() {
  return (
    <div className="container-xl mt-5">
      <div class="row">
        <div class="col-lg-12 col-md-12 col-12">
          <div class="border-bottom pb-4 mb-4 ">
            <h3 class="mb-0 fw-bold">마이페이지</h3>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-4">
          {/* 회원정보수정 */}
          <div className="col-md-12 mb-4">
            <div class="card">
              <div class="card-header">
                <ul
                  class="nav nav-tabs card-header-tabs"
                  id="myTab"
                  role="tablist"
                >
                  <li class="nav-item" role="presentation">
                    <button
                      class="nav-link active"
                      id="home-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#home-tab-pane"
                      type="button"
                      role="tab"
                      aria-controls="home-tab-pane"
                      aria-selected="true"
                    >
                      <i class="bi bi-person-circle"></i> 회원정보
                    </button>
                  </li>
                </ul>
              </div>
              <div class="card-body" style={{ height: "365px" }}>
                <Myinfo />
              </div>
            </div>
          </div>
        </div>
        {/* 채팅내역조회 */}
        <div className="col-md-6 mb-4">
          <div class="card text-center">
            <div class="card-header">
              <ul
                class="nav nav-tabs card-header-tabs"
                id="myTab"
                role="tablist"
              >
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link active"
                    id="home-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#home-tab-pane"
                    type="button"
                    role="tab"
                    aria-controls="home-tab-pane"
                    aria-selected="true"
                  >
                    <i class="bi bi-chat-dots"></i> 채팅 내역 조회
                  </button>
                </li>
              </ul>
            </div>
            <div class="card-body" style={{ height: "365px" }}>
              <MyChatHistory />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 mb-4">
          {/* 대시보드 */}
          <div class="card text-center">
            <div class="card-header">
              <ul
                class="nav nav-tabs card-header-tabs"
                id="myTab"
                role="tablist"
              >
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link active"
                    id="home-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#home-tab-pane"
                    type="button"
                    role="tab"
                    aria-controls="home-tab-pane"
                    aria-selected="true"
                  >
                    <i class="bi bi-graph-up"></i> 대시보드
                  </button>
                </li>
              </ul>
            </div>
            <div class="card-body">
              <iframe
                src="https://prod-apnortheast-a.online.tableau.com/t/xn3j1ba317uba/views/Dashboard/1?:origin=card_share_link&:&showVizHome=no&:embed=true"
                width="100%"
                height="850"
                title="토닥토닥 대시보드"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Mypage;
