import axios from "axios";

export const fetchHospitalsFromKakao = async (
  query,
  lat,
  lon,
  radius = 3000
) => {
  // 이 위에 있는 인자는 이 함수 내에서 사용되는 변수여야 함.
  const API_KEY = process.env.REACT_APP_KAKAOMAP_API_KEY;
  // .env파일에 api키 숨긴거 수정.

  const ENDPOINT = `https://dapi.kakao.com/v2/local/search/keyword.json`;
  // const QUERY = "주변 병원";

  const headers = {
    Authorization: `KakaoAK ${API_KEY}`,
  };

  let allHospitals = [];
  let page = 1;
  const MAX_PAGES = 3;

  while (page <= MAX_PAGES) {
    const params = {
      x: lon,
      y: lat,
      query: query ? `주변 ${query}` : "주변 병원",
      // 10-04 query부터 챗봇 완전히 끝낼 수 있게 확실하게 마무리 잘 짓고,
      // query : "주변"+query, 여기 qeury는 백엔드로부터 받은 진료과
      radius: radius, // 디폴트 값 3km로 위에 있음.
      page: page,
    };
    console.log(params.query);

    try {
      const response = await axios.get(ENDPOINT, { params, headers });
      if (response.data.documents.length === 0) {
        break;
      }
      const filteredHospitals = response.data.documents.filter(
        (hospital) => !hospital.place_name.includes("코로나19")
      );

      allHospitals = allHospitals.concat(filteredHospitals);
      // allHospitals = allHospitals.concat(response.data.documents);
      page += 1;
    } catch (error) {
      console.error("카카오 API 호출 오류 :", error);
      break;
    }
  }
  return allHospitals;
};
