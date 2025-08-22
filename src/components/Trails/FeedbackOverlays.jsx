// FeedbackOverlays.jsx
import React, { useEffect, useRef } from "react";
import ICONpurpose from "../../assets/ICONpurpose.svg";
import ICONproblem from "../../assets/ICONinconvenience.svg";

const FeedbackOverlays = ({ feedbackData, map, feedbackType }) => {
  const markersRef = useRef([]);
  const infowindowsRef = useRef([]);

  useEffect(() => {
    if (!map || !feedbackData || feedbackData.length === 0) {
      return;
    }

    // 기존 마커들과 인포윈도우들 제거
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    markersRef.current = [];

    infowindowsRef.current.forEach((infowindow) => {
      infowindow.close();
    });
    infowindowsRef.current = [];

    // 현재 선택된 토글 타입에 맞는 피드백만 필터링
    const filteredFeedback = feedbackData.filter(
      (feedback) => feedback.type === feedbackType
    );

    console.log(`표시할 ${feedbackType} 피드백:`, filteredFeedback);

    // 필터링된 피드백 데이터로 마커 생성
    filteredFeedback.forEach((feedback) => {
      if (feedback.latitude && feedback.longitude) {
        const position = new window.kakao.maps.LatLng(
          feedback.latitude,
          feedback.longitude
        );

        // 마커 이미지 설정 (제안/불편에 따라 다른 이미지 사용)
        const markerImageSrc =
          feedback.type === "제안" ? ICONpurpose : ICONproblem;

        const markerImage = new window.kakao.maps.MarkerImage(
          markerImageSrc,
          new window.kakao.maps.Size(31, 35)
        );

        const marker = new window.kakao.maps.Marker({
          position: position,
          map: map,
          image: markerImage,
        });

        // 인포윈도우 생성
        const getStatusText = (status) => {
          switch (status) {
            case "in_progress":
              return "처리 중";
            case "completed":
              return "완료";
            case "pending":
              return "대기 중";
            default:
              return status;
          }
        };

        const getStatusColor = (status) => {
          switch (status) {
            case "in_progress":
              return "#FF9800"; // 주황색
            case "completed":
              return "#4CAF50"; // 초록색
            case "pending":
              return "#2196F3"; // 파란색
            default:
              return "#666"; // 회색
          }
        };

        const infowindow = new window.kakao.maps.InfoWindow({
          content: `
            <div style="padding:10px;min-width:200px;position:relative;">
              <div style="
                position:absolute;
                top:5px;
                right:5px;
                background:#f44336;
                color:white;
                border-radius:50%;
                width:20px;
                height:20px;
                font-size:14px;
                cursor:pointer;
                display:flex;
                align-items:center;
                justify-content:center;
                line-height:1;
                user-select:none;
              " id="closeBtn">
                ×
              </div>
              <h4 style="margin:0 0 5px 0;color:${
                feedback.type === "제안" ? "#4CAF50" : "#F44336"
              }">
                ${feedback.type}
              </h4>
              <p style="margin:5px 0;font-size:12px;">
                <strong>카테고리:</strong> ${feedback.category}
              </p>
              <p style="margin:5px 0;font-size:12px;">
                <strong>내용:</strong> ${feedback.feedback_content}
              </p>
              <p style="margin:5px 0;font-size:12px;">
                <strong>상태:</strong> 
                <span style="color:${getStatusColor(
                  feedback.status
                )};font-weight:bold;">
                  ${getStatusText(feedback.status)}
                </span>
              </p>
              <p style="margin:5px 0;font-size:10px;color:#666;">
                ${new Date(feedback.created_at).toLocaleDateString()}
              </p>
            </div>
          `,
        });

        // 마커 클릭 시 인포윈도우 표시
        window.kakao.maps.event.addListener(marker, "click", function () {
          // 다른 모든 인포윈도우 닫기
          infowindowsRef.current.forEach((iw) => {
            if (iw !== infowindow) {
              iw.close();
            }
          });

          infowindow.open(map, marker);

          // 인포윈도우가 열린 후 닫기 버튼에 이벤트 리스너 추가
          setTimeout(() => {
            const closeBtn = document.getElementById("closeBtn");
            if (closeBtn) {
              closeBtn.addEventListener("click", () => {
                infowindow.close();
              });
            }
          }, 100);
        });

        // 지도 클릭 시 인포윈도우 닫기
        window.kakao.maps.event.addListener(map, "click", function () {
          infowindow.close();
        });

        markersRef.current.push(marker);
        infowindowsRef.current.push(infowindow);
      }
    });

    // 컴포넌트 언마운트 시 마커들과 인포윈도우들 제거
    return () => {
      markersRef.current.forEach((marker) => {
        marker.setMap(null);
      });
      markersRef.current = [];

      infowindowsRef.current.forEach((infowindow) => {
        infowindow.close();
      });
      infowindowsRef.current = [];
    };
  }, [map, feedbackData, feedbackType]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않고 마커만 관리
};

export default FeedbackOverlays;
