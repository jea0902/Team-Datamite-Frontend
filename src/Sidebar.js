import Myinfo from "./Myinfo";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Sidebar() {
    return (
        <div className="container-lg">
            <div className="d-flex align-items-start mt-3">
                <div className="nav flex-column nav-pills p-2 me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                    <ul class="nav flex-column">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="#">Active</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Link</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Link</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link disabled" aria-disabled="true">Disabled</a>
                        </li>
                    </ul>
                    {/* <Link to="/myinfo" className="nav-link active text-nowrap">회원정보</Link>
                    <Link to="/health" className="nav-link text-nowrap">나의 건강관리</Link>
                    <Link to="/questions" className="nav-link text-nowrap">나의 질문보기</Link>
                    <Link to="/withdraw" className="nav-link text-nowrap">회원탈퇴</Link> */}
                </div>
                
            </div>
        </div>
    );
}
export default Sidebar;