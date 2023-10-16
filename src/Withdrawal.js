import axios from "axios";
import React, { useState } from "react";

export default function Withdrawal() {
  const [isChecked, setChecked] = useState(false);

  const handleWithdraw = async () => {
    try {
      const accessToken = "AccessToken";

      const response = await axios.delete(
        "http://localhost:8080/api/members/delete/account",
        {
          headers: {
            Authorization: accessToken,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        //탈퇴 성공
        alert("회원 탈퇴가 완료되었습니다.");
      } else {
        alert("회원탈퇴에 실패하였습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      alert("오류가 발생했습니다: " + error.message);
    }
  };

  return (
    <>
      <div
        className="container-fluid"
        style={{
          display: "flex",
          flexDirection: "column",
          paddingTop: "100px",
          alignItems: "flex-start", // 텍스트들 왼쪽부터 정렬
          justifyContent: "center",
        }}
      >
        <div className="not-container-fluid" style={{ marginLeft: "30%" }}>
          <h4 style={{ color: "red", marginLeft: "15px" }}>탈퇴 안내</h4>

          <p style={{ fontSize: "12px", marginLeft: "15px" }}>
            회원탈퇴를 신청하기 전에 안내 사항을 꼭 확인해주세요.
          </p>

          <p style={{ color: "red", paddingTop: "20px", fontSize: "14px" }}>
            <i
              className="bi bi-check"
              style={{ color: "green", fontSize: "15px" }}
            ></i>
            사용하고 계신 아이디(아이디)는 탈퇴할 경우 재사용 및 복구가
            불가능합니다. <br />
            <i
              className="bi bi-check"
              style={{ color: "green", fontSize: "15px" }}
            ></i>
            탈퇴한 아이디는 본인과 타인 모두 재사용 및 복구가 불가능하오니
            신중하게 선택하시기 바랍니다.
          </p>

          <p style={{ paddingTop: "20px", fontSize: "14px" }}>
            <i
              className="bi bi-check"
              style={{ color: "green", fontSize: "15px" }}
            ></i>
            탈퇴 후 회원 정보 및 개인형 서비스 이용기록은 모두 삭제됩니다.
          </p>

          <div
            className="checkbox-container"
            style={{ paddingTop: "30px", marginLeft: "30px" }}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => setChecked(!isChecked)}
            />
            <span style={{ fontSize: "14px" }}>
              {" "}
              안내 사항을 모두 확인하였으며, 이에 동의합니다.
            </span>
          </div>
          <button
            className="btn btn-danger"
            disabled={!isChecked}
            onClick={handleWithdraw}
            style={{
              width: "200px",
              marginLeft: "70px",
              marginTop: "2vh",
              fontSize: "12px",
            }}
          >
            회원탈퇴
          </button>
        </div>
      </div>
    </>
  );
}
