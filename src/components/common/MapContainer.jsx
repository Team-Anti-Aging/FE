// MapContainer.jsx
import React, { useEffect, useState } from "react";
import { ALL_TRAILS } from "../Trails/TrailData.js";
import Map from "./Map";
import TrailOverlays from "../Trails/TrailOverlays";
import FeedbackOverlays from "../Trails/FeedbackOverlays";
import TrailListSheet from "../Trails/TrailListSheet";
import TrailDetailSheet from "../Trails/TrailDetailSheet";
import ReportPage from "../Trails/ReportPage";
import MyAccount from "../Trails/MyAccount";

function MapContainer({
  sheetOpen,
  onToggleSheet,
  onCloseSheet,
  feedbackType,
  feedbackData,
  onTrailSelect,
}) {
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [map, setMap] = useState(null);
  const [showDetailSheet, setShowDetailSheet] = useState(false);
  const [currentPanel, setCurrentPanel] = useState("trail-list"); // 'trail-list', 'trail-detail', 'report', 'my-account'
  const [cameraPhoto, setCameraPhoto] = useState(null); // 카메라로 찍은 사진

  // 즐겨찾기 목록 가져오기
  const fetchFavorites = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.log("토큰이 없어서 즐겨찾기 목록을 가져올 수 없습니다.");
      return;
    }

    try {
      const response = await fetch("/api/mypage/favorite/list/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("즐겨찾기 목록:", data);

        // API 응답을 favorites 객체 형태로 변환
        const favoritesObj = {};
        if (Array.isArray(data)) {
          data.forEach((item) => {
            // API 응답 구조에 따라 수정 필요
            const trailName =
              item.walktrail || item.walktrail_name || item.name;
            if (trailName) {
              favoritesObj[trailName] = true;
            }
          });
        }

        setFavorites(favoritesObj);
        console.log("변환된 즐겨찾기 객체:", favoritesObj);
      } else {
        console.error("즐겨찾기 목록 가져오기 실패:", response.status);
      }
    } catch (error) {
      console.error("즐겨찾기 목록 가져오기 중 오류:", error);
    }
  };

  // 컴포넌트 마운트 시 즐겨찾기 목록 가져오기
  useEffect(() => {
    fetchFavorites();
  }, []);

  // 피드백 데이터가 변경될 때마다 로그 출력
  useEffect(() => {
    if (feedbackData && feedbackData.length > 0) {
      console.log(`현재 ${feedbackType} 피드백 데이터:`, feedbackData);
      // 여기서 피드백 데이터를 지도에 표시하는 로직을 추가할 수 있습니다
    }
  }, [feedbackData, feedbackType]);

  const onToggleFavorite = (name) => {
    // 로컬 상태 업데이트
    setFavorites((f) => ({ ...f, [name]: !f[name] }));

    // 즐겨찾기 목록 새로고침 (서버와 동기화)
    setTimeout(() => {
      fetchFavorites();
    }, 500);
  };

  // Trail 선택 시 세부정보 시트 표시
  const handleSelectTrail = (trail) => {
    setSelectedTrail(trail);
    setShowDetailSheet(true);
    setCurrentPanel("trail-detail");

    // 부모 컴포넌트에 선택된 trail 정보 전달
    if (onTrailSelect) {
      onTrailSelect(trail);
    }

    // 즉시 지도 중심 이동 시도
    if (map && trail.routes && trail.routes.length > 0) {
      console.log("🎯 Attempting immediate map center change...");
      try {
        const firstPoint = trail.routes[0];
        const kakaoLatLng = new window.kakao.maps.LatLng(
          firstPoint.lat,
          firstPoint.lng
        );
        map.setCenter(kakaoLatLng);
        map.setLevel(5);
      } catch (error) {
        console.error("❌ Error setting map center immediately:", error);
      }
    }
  };

  // 목록으로 돌아가기
  const handleBackToList = () => {
    setShowDetailSheet(false);
    setCurrentPanel("trail-list");
    // selectedTrail은 유지하여 지도에 경로가 계속 표시됨
  };

  // 세부정보 시트 완전 닫기 (패널만 닫고 경로는 유지)
  const handleCloseDetailSheet = () => {
    setShowDetailSheet(false);
    // selectedTrail은 유지하여 지도에 경로가 계속 표시됨
    // currentPanel은 설정하지 않아서 패널이 완전히 닫힘
    setCurrentPanel(null); // 패널을 완전히 닫기 위해 null로 설정
  };

  // 제보 페이지로 이동
  const handleGoToReport = (trail) => {
    setCurrentPanel("report");
    // 여기서 report panel을 표시하는 로직을 추가할 수 있습니다
    console.log("제보 페이지로 이동:", trail.name);
  };

  // Trail 상세정보로 돌아가기
  const handleBackToTrailDetail = () => {
    setCurrentPanel("trail-detail");
  };

  // 내 계정 페이지로 이동
  const handleOpenMyAccount = () => {
    setCurrentPanel("my-account");
    console.log("내 계정 페이지로 이동");
  };

  // 로그인 페이지로 이동
  const handleOpenLogin = () => {
    window.location.href = "/login";
    console.log("로그인 페이지로 이동");
  };

  // 카메라로 찍은 사진 처리
  const handleCameraPhotoTaken = (photoFile) => {
    setCameraPhoto(photoFile);
    console.log("카메라로 찍은 사진 저장됨:", photoFile.name);

    // 사진을 찍은 후 바로 ReportPage로 이동하도록 안내
    alert("사진이 촬영되었습니다. 민원 신청 페이지로 이동합니다.");

    // 현재 선택된 trail이 없으면 기본 trail 선택 (예: 첫 번째 trail)
    if (!selectedTrail && ALL_TRAILS.length > 0) {
      setSelectedTrail(ALL_TRAILS[0]);
    }

    // ReportPage로 이동
    setCurrentPanel("report");
  };

  // selectedTrail이 바뀔 때마다 지도 영역 맞추기
  useEffect(() => {
    if (!map || !selectedTrail || !window?.kakao?.maps) {
      return;
    }

    const { kakao } = window;

    if (!selectedTrail.routes || selectedTrail.routes.length === 0) {
      return;
    }

    const firstPoint = selectedTrail.routes[0];

    try {
      const center = new kakao.maps.LatLng(firstPoint.lat, firstPoint.lng);
      map.setCenter(center);
      map.setLevel(4);

      setTimeout(() => {
        try {
          const bounds = new kakao.maps.LatLngBounds();

          selectedTrail.routes.forEach((point, index) => {
            if (
              point &&
              typeof point.lat === "number" &&
              typeof point.lng === "number"
            ) {
              bounds.extend(new kakao.maps.LatLng(point.lat, point.lng));
              if (index < 5)
                console.log(`Point ${index}:`, point.lat, point.lng);
            }
          });

          map.setBounds(bounds);
          setTimeout(() => {
            const currentLevel = map.getLevel();
            if (currentLevel > 7) {
              map.setLevel(7);
            }
          }, 200);
        } catch (boundsError) {
          console.error("❌ Error setting bounds:", boundsError);
        }
      }, 500);
    } catch (error) {
      console.error("❌ Error setting map center:", error);
    }
  }, [map, selectedTrail]);

  const handleMapCreate = (mapInstance) => {
    setMap(mapInstance);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Map
        width="100%"
        height="100%"
        center={{ lat: 37.574, lng: 127.04 }}
        level={5}
        onCreate={handleMapCreate}
      >
        {selectedTrail && <TrailOverlays trail={selectedTrail} />}
        <FeedbackOverlays
          feedbackData={feedbackData}
          map={map}
          feedbackType={feedbackType}
        />
      </Map>

      {/* Trail 목록 시트 */}
      <TrailListSheet
        open={sheetOpen && !showDetailSheet && currentPanel !== null}
        trails={ALL_TRAILS}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        onSelectTrail={handleSelectTrail}
        onOpenCamera={() => alert("카메라 열기")}
        onOpenSearch={() => {
          onToggleSheet();
          setCurrentPanel("trail-list"); // 산책하기 버튼 클릭 시 목록 패널로 설정
        }}
        onOpenInfo={() => alert("알림 안내")}
        onClose={() => {
          onCloseSheet();
          // 목록 시트를 닫을 때도 선택된 trail은 유지하여 경로가 계속 표시됨
        }}
        onOpenMyAccount={handleOpenMyAccount}
        onOpenLogin={handleOpenLogin}
        onCameraPhotoTaken={handleCameraPhotoTaken}
      />

      {/* Trail 세부정보 시트 */}
      {showDetailSheet && selectedTrail && (
        <TrailDetailSheet
          trail={selectedTrail}
          onClose={handleCloseDetailSheet}
          onBackToList={handleBackToList}
          onGoToReport={handleGoToReport}
        />
      )}

      {/* 제보 페이지 */}
      {currentPanel === "report" && selectedTrail && (
        <ReportPage
          trail={selectedTrail}
          onBackToTrailDetail={handleBackToTrailDetail}
          cameraPhoto={cameraPhoto}
          onClose={() => {
            setCurrentPanel("trail-list");
            setCameraPhoto(null); // 사진 초기화
          }}
        />
      )}

      {/* 내 계정 페이지 */}
      {currentPanel === "my-account" && (
        <MyAccount
          onClose={() => setCurrentPanel("trail-list")}
          onBackToTrailList={() => setCurrentPanel("trail-list")}
          onOpenSearch={() => setCurrentPanel("trail-list")}
        />
      )}
    </div>
  );
}

export default MapContainer;
