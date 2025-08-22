// pages/Home.jsx
import React, { useState, useEffect } from "react";
import MapContainer from "../components/common/MapContainer";
import Toggle from "../components/common/Toggle/Toggle";
import Menu from "../components/common/Menu/Menu";
import { AppWrapper } from "../styles/Globalstyles";

const BASEURL = "/api";

function Home() {
  const [sheetOpen, setSheetOpen] = useState(true); // 로그인 후 panel이 열려있도록 true로 설정
  const [feedbackType, setFeedbackType] = useState("제안"); // 기본값은 "제안"
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTrail, setSelectedTrail] = useState(null);

  // 토글 상태가 변경될 때 호출되는 함수
  const handleToggleChange = (type) => {
    setFeedbackType(type);
    console.log("토글 변경:", type);
  };

  // Trail이 선택될 때 호출되는 함수
  const handleTrailSelect = (trail) => {
    setSelectedTrail(trail);
    console.log("선택된 trail:", trail.name);
  };

  // 피드백 데이터를 가져오는 함수
  const fetchFeedbackData = async (type) => {
    setLoading(true);
    try {
      // 선택된 trail이 없으면 API 호출하지 않음
      if (!selectedTrail) {
        console.log("선택된 trail이 없어서 피드백 데이터를 가져오지 않습니다.");
        setFeedbackData([]);
        setLoading(false);
        return;
      }

      const trailName = selectedTrail.name;
      console.log(`${trailName}의 ${type} 피드백 데이터를 가져오는 중...`);

      const response = await fetch(
        `${BASEURL}/walktrails/feedback/${trailName}/${type}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // 인증이 필요한 경우 토큰 추가
            // "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFeedbackData(data);
        console.log(`${type} 피드백 데이터:`, data);
      } else {
        console.error("피드백 데이터 가져오기 실패:", response.status);
        setFeedbackData([]);
      }
    } catch (error) {
      console.error("피드백 데이터 가져오기 중 오류:", error);
      setFeedbackData([]);
    } finally {
      setLoading(false);
    }
  };

  // feedbackType이 변경될 때마다 API 호출
  useEffect(() => {
    fetchFeedbackData(feedbackType);
  }, [feedbackType, selectedTrail]);

  return (
    <AppWrapper>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px",
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          background: "rgba(255, 255, 255, 0.9)",
          borderRadius: "20px",
          backdropFilter: "blur(10px)",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <Toggle
          toggle1="제안"
          toggle2="불편"
          onToggleChange={handleToggleChange}
        />
        {loading && (
          <div
            style={{
              fontSize: "12px",
              color: "#666",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                border: "2px solid #f3f3f3",
                borderTop: "2px solid #3498db",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            ></div>
            로딩 중...
          </div>
        )}
        {selectedTrail && !loading && (
          <div
            style={{
              fontSize: "12px",
              color: "#4CAF50",
              fontWeight: "bold",
            }}
          >
            {selectedTrail.name} - {feedbackData.length}개 {feedbackType} 민원
          </div>
        )}
      </div>
      <MapContainer
        sheetOpen={sheetOpen}
        onToggleSheet={() => setSheetOpen((v) => !v)}
        onCloseSheet={() => setSheetOpen(false)}
        feedbackType={feedbackType}
        feedbackData={feedbackData}
        loading={loading}
        onTrailSelect={handleTrailSelect}
      />
    </AppWrapper>
  );
}

export default Home;
