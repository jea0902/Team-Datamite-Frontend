function Dashboard() {
    return (
        <div className="container-xl mt-5">
            <div className="row">
                <div className="col-lg-12 col-md-12 col-12">
                    <div className="border-bottom pb-4 mb-4 ">
                        <h3 className="mb-0 fw-bold">마이페이지 <span style={{ fontSize: "80%" }}>&gt; 대시보드</span></h3>
                    </div>
                </div>
            </div>
            <div className="d-flex align-items-start">
                <div className="flex-column text-nowrap">
                    <div className="list-group" id="list-tab" role="tablist">
                        <a className="list-group-item list-group-item-action"
                            id="list-home-list"
                            href="/profile"
                        >
                            <i className="bi bi-person-circle"></i> 회원정보
                        </a>
                        <a className="list-group-item list-group-item-action"
                            id="list-profile-list"
                            href="/chat-history"
                        >
                            <i className="bi bi-chat-dots"></i> 채팅 내역 조회
                        </a>
                        <a className="list-group-item list-group-item-action active"
                            id="list-messages-list"
                            href="/dashboard"
                        >
                            <i className="bi bi-graph-up"></i> 대시보드
                        </a>
                    </div>
                </div>
                <div className="flex-grow-1 ms-3">
                    <div className="row">
                        <div className="col-md-12 mb-4">
                            {/* 대시보드 */}
                            <div className="card text-center">
                                <div className="card-header">
                                    <ul
                                        className="nav nav-tabs card-header-tabs"
                                        id="myTab"
                                        role="tablist"
                                    >
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className="nav-link active"
                                                id="home-tab"
                                                aria-selected="true"
                                            >
                                                <i className="bi bi-graph-up"></i> 대시보드
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                                <div className="card-body" style={{minHeight: "365px"}}>
                                    <div>
                                        <iframe
                                            src="https://prod-apnortheast-a.online.tableau.com/t/xn3j1ba317uba/views/Dashboard/1?:origin=card_share_link&:&showVizHome=no&:embed=true"
                                            width="90%"
                                            height="500"
                                            // height="850"
                                            title="토닥토닥 대시보드"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}
export default Dashboard;