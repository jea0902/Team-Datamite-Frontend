import React from "react";

export default function Footer() {
  return (
    <div className="footer" style={{ display: "flex"}}>
      <div style={{ ...styles.footerContainer, flex: 7 }}>
        <p style={{ fontSize: "15px" }}>
          <strong>데이터마이트 주식회사</strong>
        </p>
        <p>
          <strong>본사</strong> : 서울특별시 금천구 가산디지털1로 25 18층
          플레이데이터
        </p>
        <p>
          <strong>이메일</strong> : jea002@naver.com |{" "}
          <strong>사업자등록번호</strong> : 229-81-30104 | FAX : 02-3465-6277
        </p>
        <p>
          <strong>전화번호</strong> : 010-2534-1382 |{" "}
          <strong>상담가능시간</strong> 오전 9시 ~ 오후 5시 (주말 및 공휴일
          제외)
        </p>
        <p>Copyright 2023 데이터마이트 All rights reserved. </p>
        {/* 기타 필요한 정보를 추가로 넣을 수 있습니다. */}
      </div>
      <div style={{ ...styles.footerContainer, flex: 3 }}>
        <p>
          <strong>개인정보 처리방침</strong>
        </p>
        <p>
          <strong>이용약관</strong>
        </p>
        {/* 기타 필요한 정보를 추가로 넣을 수 있습니다. */}
      </div>
    </div>
  );
}

const styles = {
  footerContainer: {
    backgroundColor: "#463c3c",
    padding: "8px 0 0",
    textAlign: "left", // 텍스트 중앙 정렬
    color: "white",
    fontSize: "12px",
    paddingLeft: "100px",
    position: "relative", // 상위 엘리먼트를 기준으로 위치 설정
    bottom: 0, // 하단에 고정
    width: "100%",
  },
};
