import React, { useContext, useEffect, useRef, useState } from "react";
import { fetchHospitalsFromKakao } from "./fetchHospitalsFromKakao";
import 임시로고 from "../../assets/image/logo1.png";
import 마커로고 from "../../assets/image/markerLogo.png";
// 마커로고 쓸건지 임시로고 쓸건지 정해야함.
// import AuthContext from '../AuthContext';

// 사용자의 현재 위치 얻기 -> 해당 위치를 중심으로 지도 생성 -> 반경 5km 내의 병원 데이터 얻기 -> 해당 데이터를 바탕으로 지도에 마커 표시
// 병원 데이터를 얻기 위해선 외부 API를 사용해야 함(공공 데이터 포털의 병원 정보 API)

function KakaoMap({ resultSpeciality, onMarkerClick }) {
  console.log(resultSpeciality);

  // const [hospitalName, setHospitalName] = useState('');

  const mapRef = useRef(null); // useRef 훅을 사용하여 지도를 표시할 DOM 요소에 대한 참조를 생성하기 위해 div 엘리먼트에 대한 참조를 생성
  const [radius, setRadius] = useState(1500); // 반경 상태 설정. 기본값 3km
  const clustererRef = useRef(null); // 혹은 클러스터러를 참조로 관리하도록 변경해 - 이렇게 하면 상태 업데이트의 비동기 특성에 영향을 받지 않게 됨.
  const markers = []; // 마커 배열 생성
  const [searchLocation, setSearchLocation] = useState(""); // 위치 검색 상태변수

  const [currentLocation, setCurrentLocation] = useState(null); // 현재 또는 검색된 위치
  const mapInstanceRef = useRef(null); // 지도 객체 레퍼런스용
  const loadHospitalsRef = useRef(null); // 함수를 저장할 useRef - loadHospitals 함수를 useEffect 내부에 둔 채로 유지하되, handleSearch 함수에서도 해당 함수를 사용하려면 useRef를 활용해 loadHospitals 함수를 저장하고 참조할 수 있게
  const createMarkerWithInfoWindowRef = useRef(null); // useRef는 내부 함수를 외부에서 참조하려면 사용. -> createMarkerWithInfoWindow 함수를 useRef를 사용해 저장하고 handleSearch 함수에서 그 참조를 사용하여 호출하려 함.

  // const { selectedDepartment } = useContext(AuthContext); // 이 컴포넌트에서도 사용하려면 정의해줘야 함.
  // const resultSpeciality = resultSpeciality;

  //지도의 zoom level을 변경하는 함수
  const updateZoomLevel = (radius) => {
    if (radius <= 1500) {
      return 5;
    } else if (radius <= 3000) {
      return 6;
    } else {
      return 7;
    }
  };

  const handleSearch = async () => {
    const places = new window.kakao.maps.services.Places();

    places.keywordSearch(searchLocation, (result) => {
      if (result.length > 0) {
        const lat = result[0].y;
        const lon = result[0].x;

        setCurrentLocation({ lat, lon }); // 검색된 위치를 currentLocation 상태에 저장

        // const newPosition = new window.kakao.maps.LatLng(lat, lon);
        const newPosition = new window.kakao.maps.LatLng(lat, lon);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setCenter(newPosition); // useRef로부터 지도 객체 접근
        }

        if (createMarkerWithInfoWindowRef.current) {
          createMarkerWithInfoWindowRef.current(newPosition, "검색된 위치");
        }
      } else {
        alert("검색 결과가 없습니다! 다시 확인해서 검색해주세요.");
      }
    });
  };

  // 컴포넌트가 마운트될 때 한 번만 실행될 로직을 useEffect 내부에 작성합니다.
  useEffect(() => {
    // 브라우저의 위치 기능을 지원하는지 확인
    if (navigator.geolocation) {
      // 현재 사용자의 위치를 얻는다.
      navigator.geolocation.getCurrentPosition(
        async function (position) {
          // navigator.geolocation.getCurrentPosition 함수 내부에서 사용하는 콜백 함수를 async로 선언해야 함
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const locPosition = new window.kakao.maps.LatLng(lat, lon);

          setCurrentLocation({ lat, lon }); //사용자의 현재 위치를 설정

          // 현재 위치를 중심으로 지도 옵션을 설정
          const mapOption = {
            center: locPosition,
            level: 3,
            draggable: true, // 지도 드래그 가능 옵션 활성화
          };

          // 해당 옵션으로 지도 생성.
          const map = new window.kakao.maps.Map(mapRef.current, mapOption);
          mapInstanceRef.current = map; // useRef의 current 프로퍼티에 지도 객체 저장

          // 현재 위치에만 라벨
          const currentPositionLabel = new window.kakao.maps.CustomOverlay({
            position: locPosition,
            content: `
          <div style="padding:5px; background-color: white; border-radius: 5px; border:1px solid #ccc; font-size: 11px; color:#34b4fc; font-weight:bold;">
            현재 내 위치
          </div>
          `,
            yAnchor: 0.3,
          });
          currentPositionLabel.setMap(map);

          let currentInfoWindow = null; // 현재 열려 있는 인포 윈도우 추적용

          // 마커랑 인포윈도우 생성 함수.
          const createMarkerWithInfoWindow = (
            position,
            content,
            hospital = null
          ) => {
            let markerImageSrc; // 마커 이미지 경로를 저장할 변수

            if (hospital) {
              markerImageSrc = 마커로고; // 병원일 때 마커 로고
            } else {
              markerImageSrc = 임시로고; // 현재 위치일 때 마커 로고
            }

            const markerImage = new window.kakao.maps.MarkerImage(
              markerImageSrc,
              new window.kakao.maps.Size(60, 55)
            );

            const marker = new window.kakao.maps.Marker({
              position,
              image: markerImage,
            });

            marker.setMap(map); // 이 부분 클러스터러에 반영이 안될 때가 있어서 요주의

            if (content === "검색된 위치") {
              const searchedPositionLabel = new window.kakao.maps.CustomOverlay(
                {
                  position: position,
                  content: `
              <div style="padding:5px; background-color: white; border-radius: 5px; border:1px solid #ccc; font-size: 11px; color:#34b4fc; font-weight:bold;">
                                  검색된 위치
                                </div>
              `,
                  yAnchor: 0.3,
                }
              );
              searchedPositionLabel.setMap(map);
            }

            if (hospital) {
              markers.push(marker);
              const categoryName = hospital.category_name
                .split(">")
                .pop()
                .trim();
              const labelContent = `<div style="padding:5px; background-color: white; border-radius: 5px; border:1px solid #ccc; font-size: 11px;">
                                  ${hospital.place_name} - ${categoryName}
                                </div>`;

              const customInfoWindow = new window.kakao.maps.CustomOverlay({
                position,
                content: `
              <div style="max-width:400px; overflow-wrap:break-word; padding:8px; background-color:white; border-radius: 5px; border: 1px solid #ccc; font-size: 12px;">
                <div style = "margin-right : 25px;">
                  <strong>${hospital.place_name}</strong><br /><br />
                  (구) ${hospital.address_name}<br />
                  (도로명) ${hospital.road_address_name}<br />
                  현재 위치로부터 ${hospital.distance}m 거리<br />
                  <span style="color:green;">${
                    hospital.phone || "전화번호 정보 없음"
                  }</span><br />
                  <a href="${hospital.place_url}">상세 보기</a>
                </div>
                <div class = "closeInfoWindow" style = "position:absolute; top:8px; right:6px; background:none; cursor:pointer; border: 0.5px solid #ccc; font-size: 10px;">❌</div>
              </div>`,
                yAnchor: 1.5,
              });

              const label = new window.kakao.maps.CustomOverlay({
                position,
                content: labelContent,
                yAnchor: 0,
                xAnchor: 0.5,
                zIndex: 10,
              });

              window.kakao.maps.event.addListener(
                marker,
                "mouseover",
                function () {
                  label.setMap(map);
                }
              );

              window.kakao.maps.event.addListener(
                marker,
                "mouseout",
                function () {
                  label.setMap(null);
                }
              );

              window.kakao.maps.event.addListener(marker, "click", function () {
                if (currentInfoWindow) {
                  currentInfoWindow.setMap(null); // 이전에 표시되고 있던 커스텀 오버레이 숨기기
                }
                // 마커의 위치를 지도의 중심으로 설정
                map.setCenter(position);

                customInfoWindow.setMap(map);
                currentInfoWindow = customInfoWindow;
              });

              document.addEventListener("click", function (event) {
                if (event.target.classList.contains("closeInfoWindow")) {
                  if (currentInfoWindow) {
                    currentInfoWindow.setMap(null);
                    handleMarkerClick("");
                  }
                }
              });

              window.kakao.maps.event.addListener(marker, "click", function () {
                if (currentInfoWindow) {
                  currentInfoWindow.setMap(null); // 이전에 표시되고 있던 CustomOverlay 숨기기
                }
                customInfoWindow.setMap(map);
                currentInfoWindow = customInfoWindow;

                // Chat으로 병원 이름 보내주기 위한 코드
                const hospitalName = hospital.place_name;
                // setHospitalName(temp)
                handleMarkerClick(hospitalName);
                console.log(hospitalName);
              });
            }
            return marker;
          };

          const handleMarkerClick = (hospitalName) => {
            // 마커 클릭 시 ~Chat.js 컴포넌트로 정보 전달
            onMarkerClick(hospitalName);
          };

          createMarkerWithInfoWindowRef.current = createMarkerWithInfoWindow; // 함수 참조 저장

          // 현재 위치는 따로 표시해줘야 하니까
          createMarkerWithInfoWindow(locPosition, "현재 위치");

          // *주변 병원 위치 마커 생성 함수 스타트
          const loadHospitals = async (lat, lon) => {
            // 인자로 전달받은 lat과 lon을 사용하도록 변경 - 함수 내에서 직접적으로 lat,lon 받게 하지 말고

            // 기존의 마커 제거 (<= 반경 변경될 떄마다 초기화 시켜줘야 다시 불러왔을 때 불러와지기에)
            markers.forEach((marker) => marker.setMap(null));
            markers.length = 0; // 마커 배열 초기화

            if (clustererRef.current) {
              // 기존의 클러스터 제거 (<= 반경 변경될 떄마다 초기화 시켜줘야 다시 불러왔을 때 불러와지기에)

              clustererRef.current.clear(); // 클러스터만 제거해도 안되길래 클러스터에 연결된 모든 마커를 지도에서 제거
              clustererRef.current = null; // 클러스터러 참조 초기화
            }

            // 마커 배열을 기반으로 클러스터를 생성하고 지도에 표시.
            clustererRef.current = new window.kakao.maps.MarkerClusterer({
              // clusterer 객체에 저장해야 나중에 초기화 가능.
              map: map, // 지도 객체
              markers: markers, // 마커 배열
              gridSize: 100, // 기본값은 100
              averageCenter: true, // 클러스터 중심으로 마커의 평균 위치를 사용
              minLevel: 7, // 클러스터 할 최소 지도 레벨
              texts: getTexts,
            });

            function getTexts(count) {
              return count + "개";
            }

            // const hospitals = await fetchHospitalsFromKakao(selectedDepartment, lat, lon, radius);
            const hospitals = await fetchHospitalsFromKakao(
              resultSpeciality,
              lat,
              lon,
              radius
            );
            // console.log(`radius : ${radius}, 병원 수 : ${hospitals.length}`) // 반경이랑 병원 수 제대로 업데이트 되는지 로그 출력
            // console.log( "챗봇에서 증상을 입력받아, 모델에서 제대로 된 진료과를 도출해준다면 나올 진료과 :", selectedDepartment);

            hospitals.forEach((hospital) => {
              const hospitalPosition = new window.kakao.maps.LatLng(
                hospital.y,
                hospital.x
              );
              const createMarker = createMarkerWithInfoWindow(
                hospitalPosition,
                hospital.place_name,
                hospital
              );
              clustererRef.current.addMarker(createMarker); // 새로운 클러스터러에 마커 추가도 넣음.
            });

            // 클러스터러를 다시 그리도록 - 클러스터러에 모든 마커가 추가된 후에 호출해 현재 지도 상태에 기반하여 다시 그려지도록.. 지도의 초기화와 관련된 모든 비동기작업이 완료된 후에 클러스터러를 추가하도록 하기 위함.
            clustererRef.current.redraw();
          };

          loadHospitalsRef.current = loadHospitals; // useRef에 함수 저장

          // 반경에 따른 줌레벨 변화되게
          const currentZoomLevel = updateZoomLevel(radius);
          map.setLevel(currentZoomLevel);

          loadHospitals();
        },
        (error) => {
          console.error("Error", error);
        }
      );
    } else {
      alert("geolocation을 지원하지 않습니다.");
    }
  }, [radius]);

  useEffect(() => {
    if (currentLocation) {
      const { lat, lon } = currentLocation;
      loadHospitalsRef.current(lat, lon);
    }
  }, [currentLocation]);

  useEffect(() => {
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout); // 기존 타임아웃 클리어
      resizeTimeout = setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.relayout(); // 지도 크기 재조정
          // 지도의 중심을 현재 위치나 특정 위치로 다시 설정.
          const center = mapInstanceRef.current.getCenter();
          mapInstanceRef.current.setCenter(center);
        }
      }, 100);
    };

    window.addEventListener("resize", handleResize); // resize 이벤트에 핸들러 추가

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize); // 컴포넌트 언마운트 시 이벤트 리스너 제거
    };
  }, []);

  // useEffect(() => {
  //   const adjustMapHeight = () => {
  //     // Navbar의 높이를 가져옵니다. - 미친 전체화면 만들기 위함.
  //     const navbarHeight = document.querySelector('.container-fixed').offsetHeight;

  //     // map container 페이지에 접근
  //     const mapContainer = document.querySelector('.map-container');

  //     // KakaoMap의 container의 높이를 설정합니다.
  //     // 전체 화면 높이에서 Navbar의 높이를 빼줍니다.
  //     mapContainer.style.height = `calc(100vh - ${navbarHeight}px)`;
  //   }

  //   // 위에서 정의한 adjustMapHeight 함수를 호출하여 초기 높이를 설정합니다.
  //   adjustMapHeight();

  //   // 윈도우 크기가 변경될 때마다 adjustMapHeight 함수를 호출하여 높이를 조정합니다.
  //   window.addEventListener('resize', adjustMapHeight);

  //   // 컴포넌트가 unmount될 때 이벤트 리스너를 제거합니다.
  //   return () => window.removeEventListener('resize', adjustMapHeight);
  // }, []);

  // 지도를 표시할 div 엘리먼트를 반환합니다.
  return (
    <div
      className="map-container"
      style={{ position: "relative", height: "calc(72vh)" }}
    >
      <div ref={mapRef} style={{ width: "100%", height: "100%" }}></div>
      <select
        className="form-select"
        value={radius}
        onChange={(e) => setRadius(Number(e.target.value))}
        style={{
          position: "absolute",
          top: "40px",
          left: "0px",
          width: "300px",
          minWidth: "130px",
          height: "40px",
          bottom: "5px",
          zIndex: 3,
        }}
      >
        <option value="1500">반경 1.5km</option>
        <option value="3000">반경 3km</option>
        <option value="5000">반경 5km</option>
        <option value="10000">반경 10km</option>
      </select>

      <div
        className="input-group mb-3"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 3,
          width: "300px",
        }}
      >
        <input
          className="form-control"
          type="text"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder="새 위치는 여기에 검색"
          aria-label="새 위치는 여기에 검색!"
          aria-describedby="button-addon2"
        />
        <button
          className="btn btn-primary"
          type="button"
          id="button-addon2"
          onClick={handleSearch}
        >
          검색
        </button>
      </div>
    </div>
  );
}

// 외부에서 KakaoMap 컴포넌트를 사용할 수 있도록 내보냅니다.
export default KakaoMap;
