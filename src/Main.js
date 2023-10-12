import KakaoMap from "./KakaoMap/KakaoMap";
import "./Chat.css";
import { useState } from "react";

function Main() {
  const [hospitalReview, setHospitalReview] = useState({
    keywords: "친절함, 쁘띠",
    negativeReview: 30,
    positiveReview: 217,
    rating: 8.7,
    totalReviews: 300,
  });

  return (
    <div className="container-lg mt-5">
      <div className="input-group mb-3">
        <select className="form-select" id="inputGroupSelect02">
          <option selected>Choose...</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </select>
        <label className="input-group-text" for="inputGroupSelect02">
          Options
        </label>
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
          <div className="card" style={{ maxwidth: "540px", height: "695px" }}>
            <div className="row g-0">
              <div className="col-md-8">
                <div class="card-body map_body">
                  <KakaoMap />
                </div>
              </div>
              <div className="col-md-4">
                <div className="card-body text-center">
                  {/* <h5> 리뷰 <span>200</span> </h5>
                                    <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                    <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p> */}
                  <div className="card" style={{ backgroundColor: "#F5F5F7" }}>
                    <div className="card-body">
                      {/* <div class="position-relative py-2 px-4 text-bg-secondary border border-secondary rounded-pill">
                                                Marker <svg width="1em" height="1em" viewBox="0 0 10 16" class="position-absolute top-100 start-50 translate-middle mt-1" fill="var(--bs-secondary)" xmlns="http://www.w3.org/2000/svg"><path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" /></svg>
                                            </div> */}
                      <div className="position-relative d-inline-block">
                        <strong style={{ fontSize: "1.4rem" }}>리뷰</strong>
                        <span
                          className="ms-2 badge rounded-pill bg-primary"
                          style={{ fontSize: "0.8rem" }}
                        >
                          {hospitalReview.totalReviews}
                        </span>
                      </div>

                      {/* <h5 class="card-title">리뷰 200</h5> */}
                      {/* <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                    </div>
                    <ul className="list-group list-group-flush">
                      <li
                        className="list-group-item"
                        style={{ backgroundColor: "#F5F5F7" }}
                      >
                        별점 평균
                        <br />
                        <span
                          style={{
                            fontSize: "1.2em",
                            fontWeight: "bold",
                            color: "orange",
                          }}
                        >
                          {hospitalReview.rating}
                        </span>{" "}
                        / 10
                        <div>
                          {[...Array(5)].map((star, index) => {
                            // 별점 평가 로직:
                            // 1. 별점은 0부터 10까지의 값으로, 이를 0~200의 범위로 스케일링한다. (완전히 채워진 별은 100의 값을 가진다.)
                            // 2. 각 별의 기준점에 따라 별 아이콘의 색을 결정한다. (예: 3.5 별점은 첫 3개의 별은 전체 채워짐, 4번째 별은 반쪽만 채워짐, 마지막 별은 비어있음.)
                            const starFullness =
                              (hospitalReview.rating - index * 2) * 100; // 0 to 200 scale (100 being a full star)
                            const starColor =
                              starFullness > 100
                                ? "bi-star-fill text-warning"
                                : starFullness > 0
                                ? "bi-star-half text-warning"
                                : "bi-star text-muted";
                            return (
                              <i className={`bi ${starColor}`} key={index}></i>
                            );
                          })}
                        </div>
                      </li>
                      <li class="list-group-item d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center flex-grow-1 justify-content-end">
                          <div>
                            <i className="bi bi-emoji-laughing"></i>
                          </div>
                          <span className="ms-2">
                            {hospitalReview.positiveReview}
                          </span>
                        </div>

                        {/* 회색 세로 줄 */}
                        <div
                          className="border-start mx-3"
                          style={{ height: "24px" }}
                        ></div>

                        <div className="d-flex align-items-center flex-grow-1">
                          <div>
                            <i className="bi bi-emoji-frown"></i>
                          </div>
                          <span className="ms-2">
                            {hospitalReview.negativeReview}
                          </span>
                        </div>
                      </li>
                    </ul>
                    <div className="card-body">
                      {hospitalReview.keywords.split(",").map((keyword) => (
                        <span
                          className="badge bg-light text-dark rounded-pill ms-2"
                          style={{ padding: "0.8rem 1.2em" }}
                        >
                          {keyword.trim()}
                        </span>
                      ))}
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
