import KakaoMap from "./KakaoMap/KakaoMap";
import "./Chat.css"

function Main() {

    return (
        <div className="container-lg mt-5">
            <div class="input-group mb-3">
                <select class="form-select" id="inputGroupSelect02">
                    <option selected>Choose...</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                </select>
                <label class="input-group-text" for="inputGroupSelect02">Options</label>
            </div>
            <div className="row justify-content-center h-100">
                <div className="col-xl-4 chat">
                    {/* <div className="card">
                        <div className="card-header" style={{ height: "40px" }}>
                            <div className="text-center">
                                현재 위치 기반 Map
                            </div>
                        </div>
                        <div className="card-body contacts_body">
                            <KakaoMap />
                        </div>
                        <div className="card-footer" style={{ height: "55px" }}>
                        </div>
                    </div> */}
                </div>
                <div className="col-xl-8 chat">
                    <div class="card" style={{ maxwidth: "540px", height: "695px" }}>
                        <div class="row g-0">

                            <div class="col-md-8">
                                <div class="card-body map_body">
                                    <KakaoMap />
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div className="card-body text-center">
                                    {/* <h5> 리뷰 <span>200</span> </h5>
                                    <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                    <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p> */}
                                    <div class="card" style={{backgroundColor:"#F5F5F7"}}>
                                        <div class="card-body">
                                            {/* <div class="position-relative py-2 px-4 text-bg-secondary border border-secondary rounded-pill">
                                                Marker <svg width="1em" height="1em" viewBox="0 0 10 16" class="position-absolute top-100 start-50 translate-middle mt-1" fill="var(--bs-secondary)" xmlns="http://www.w3.org/2000/svg"><path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" /></svg>
                                            </div> */}
                                            <h5 class="position-relative">
                                                리뷰
                                                <span class="position-absolute top-50 end-0 translate-middle badge rounded-pill bg-primary" style={{transform:"(-100%, -50%)"}}>
                                                    200
                                                </span>
                                            </h5>

                                            {/* <h5 class="card-title">리뷰 200</h5> */}
                                            {/* <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                                        </div>
                                        <ul class="list-group list-group-flush" >
                                            <li class="list-group-item" style={{backgroundColor:"#F5F5F7"}}>An item</li>
                                            <li class="list-group-item">A second item<i class="bi bi-emoji-smile"></i></li>
                                            <li class="list-group-item">A third item</li>
                                        </ul>
                                        <div class="card-body">
                                            <a href="#" class="card-link">Card link</a>
                                            <a href="#" class="card-link">Another link</a>
                                        </div>
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

export default Main;