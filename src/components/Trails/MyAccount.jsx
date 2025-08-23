// MyAccount.jsx
import React, { useState, useEffect } from "react";
import BottomSheet from "../common/BottomSheet/BottomSheet";
import {
  Header,
  BackButton,
  TitleSection,
  Title,
  Meta,
  Spacer,
  Section,
  SectionTitle,
  Whole,
} from "./TrailDetailSheet.styled";
import styled from "styled-components";
import {
  MenuCam,
  MenuContainer,
  MenusubInner1,
  MenusubInner2,
  MenuInner,
} from "../common/Menu/Menu.styled";
import Search from "../../assets/Search.svg";
import Camera from "../../assets/camera.svg";
import Person from "../../assets/person.png";
import { ALL_TRAILS } from "./TrailData.js";

const AccountInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0.5rem 0;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f1f3f5;
  font-size: 13px;

  &:last-child {
    border-bottom: none;
  }
`;

const LogoutButton = styled.button`
  width: 60%;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 16px;
  display: flex;
  align-self: center;
  justify-content: center;
  align-items: center;

  &:hover {
    background: #c82333;
  }
`;

const DetailButton = styled.button`
  background: none;
  border: none;
  color: #0068b7;
  cursor: pointer;
  font-size: 12px;
  text-decoration: underline;
  padding: 0;
  margin: 0;

  &:hover {
    color: #0056a3;
  }
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f1f3f5;
  font-size: 13px;

  &:last-child {
    border-bottom: none;
  }
`;

export default function MyAccount({
  onClose,
  onBackToTrailList,
  onOpenSearch,
}) {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activityCounts, setActivityCounts] = useState({
    feedbackCount: 0,
    favoriteCount: 0,
  });
  const [feedbackList, setFeedbackList] = useState([]);
  const [favoriteList, setFavoriteList] = useState([]);
  const [showFeedbackDetail, setShowFeedbackDetail] = useState(false);
  const [showFavoriteDetail, setShowFavoriteDetail] = useState(false);

  // 로그인 상태 확인
  const isLoggedIn = !!localStorage.getItem("accessToken");

  // 산책로 ID를 이름으로 변환하는 함수
  const getTrailNameById = (trailId) => {
    const trail = ALL_TRAILS.find((t) => t.id === trailId);
    return trail ? trail.name : `산책로 ID: ${trailId}`;
  };

  // 내 활동 데이터 가져오기
  const fetchActivityCounts = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.log("토큰이 없어서 활동 데이터를 가져올 수 없습니다.");
      return;
    }

    try {
      const response = await fetch("/api/mypage/count/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("활동 데이터:", data);

        // API 응답 구조에 따라 데이터 설정
        // 실제 API 응답 구조에 맞게 수정 필요
        // API 응답 구조에 따라 데이터 설정
        // 다양한 응답 구조에 대응
        let feedbackCount = 0;
        let favoriteCount = 0;

        // 응답이 객체인 경우
        if (typeof data === "object" && data !== null) {
          feedbackCount =
            data.feedback_count || data.feedbackCount || data.feedback || 0;
          favoriteCount =
            data.favorite_count || data.favoriteCount || data.favorite || 0;
        }
        // 응답이 숫자인 경우 (단일 값)
        else if (typeof data === "number") {
          feedbackCount = data;
        }

        console.log("파싱된 데이터:", { feedbackCount, favoriteCount });

        setActivityCounts({
          feedbackCount,
          favoriteCount,
        });
      } else {
        console.error("활동 데이터 가져오기 실패:", response.status);
        // 실패 시 기본값 유지
      }
    } catch (error) {
      console.error("활동 데이터 가져오기 중 오류:", error);
      // 오류 시 기본값 유지
    }
  };

  // 제보한 민원 목록 가져오기
  const fetchFeedbackList = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.log("토큰이 없어서 제보 목록을 가져올 수 없습니다.");
      return;
    }

    try {
      console.log("제보 목록 API 호출 시작...");
      const response = await fetch("/api/mypage/feedback/list/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("API 응답 상태:", response.status);
      console.log("API 응답 헤더:", response.headers);

      if (response.ok) {
        const data = await response.json();
        console.log("제보 목록 원본 데이터:", data);
        console.log("데이터 타입:", typeof data);
        console.log("배열인가?", Array.isArray(data));
        console.log(
          "데이터 길이:",
          Array.isArray(data) ? data.length : "배열 아님"
        );

        if (Array.isArray(data)) {
          console.log(
            "각 항목 구조:",
            data.map((item) => ({
              id: item.id,
              walktrail: item.walktrail,
              walktrailName: getTrailNameById(item.walktrail),
              type: item.type,
              category: item.category,
              content: item.feedback_content,
              status: item.status,
              created_at: item.created_at,
            }))
          );
        }

        setFeedbackList(Array.isArray(data) ? data : []);
      } else {
        console.error(
          "제보 목록 가져오기 실패:",
          response.status,
          response.statusText
        );
        const errorText = await response.text();
        console.error("에러 응답:", errorText);
        setFeedbackList([]);
      }
    } catch (error) {
      console.error("제보 목록 가져오기 중 오류:", error);
      setFeedbackList([]);
    }
  };

  // 즐겨찾기 목록 가져오기
  const fetchFavoriteList = async () => {
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
        setFavoriteList(Array.isArray(data) ? data : []);
      } else {
        console.error("즐겨찾기 목록 가져오기 실패:", response.status);
        setFavoriteList([]);
      }
    } catch (error) {
      console.error("즐겨찾기 목록 가져오기 중 오류:", error);
      setFavoriteList([]);
    }
  };

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보 가져오기
    const token = localStorage.getItem("accessToken");
    const userInfoStr = localStorage.getItem("userInfo");

    if (token && userInfoStr) {
      try {
        const userData = JSON.parse(userInfoStr);
        setUserInfo(userData);

        // 사용자 정보가 있으면 활동 데이터도 가져오기
        fetchActivityCounts();
        fetchFeedbackList();
        fetchFavoriteList();
      } catch (error) {
        console.error("사용자 정보 파싱 오류:", error);
        setUserInfo(null);
      }
    } else {
      setUserInfo(null);
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userInfo"); // 사용자 정보도 삭제
    alert("로그아웃되었습니다.");
    onBackToTrailList();
  };

  // 제보한 민원 상세보기 컴포넌트
  const FeedbackDetailView = () => (
    <BottomSheet
      open={showFeedbackDetail}
      onClose={() => setShowFeedbackDetail(false)}
      height="80vh"
      handleLabel="제보한 민원 상세보기 닫기"
    >
      <Whole>
        <Header>
          <BackButton
            onClick={() => setShowFeedbackDetail(false)}
            aria-label="내 계정으로 돌아가기"
          >
            ←
          </BackButton>
          <TitleSection>
            <Title>제보한 민원 목록</Title>
          </TitleSection>
          <Spacer />
        </Header>

        <Section>
          <AccountInfo>
            {feedbackList.length > 0 ? (
              feedbackList.map((feedback, index) => (
                <DetailItem key={index}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                        {getTrailNameById(feedback.walktrail)}
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          color: "#fff",
                          background:
                            feedback.status === "in_progress"
                              ? "#ffc107"
                              : "#28a745",
                          padding: "2px 6px",
                          borderRadius: "10px",
                        }}
                      >
                        {feedback.status === "in_progress" ? "처리중" : "완료"}
                      </span>
                    </div>
                    <span style={{ fontSize: "12px", color: "#666" }}>
                      {feedback.feedback_content || "내용 없음"}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        fontSize: "10px",
                        color: "#999",
                      }}
                    >
                      <span>{feedback.type || "제안"}</span>
                      <span>·</span>
                      <span>{feedback.category || "기타"}</span>
                      <span>·</span>
                      <span>{feedback.location || "위치 정보 없음"}</span>
                    </div>
                    <span style={{ fontSize: "10px", color: "#ccc" }}>
                      {new Date(feedback.created_at).toLocaleDateString(
                        "ko-KR"
                      )}
                    </span>
                  </div>
                </DetailItem>
              ))
            ) : (
              <div
                style={{ textAlign: "center", padding: "2rem", color: "#666" }}
              >
                제보한 민원이 없습니다.
              </div>
            )}
          </AccountInfo>
        </Section>
      </Whole>
    </BottomSheet>
  );

  // 즐겨찾기 상세보기 컴포넌트
  const FavoriteDetailView = () => (
    <BottomSheet
      open={showFavoriteDetail}
      onClose={() => setShowFavoriteDetail(false)}
      height="80vh"
      handleLabel="즐겨찾기 상세보기 닫기"
    >
      <Whole>
        <Header>
          <BackButton
            onClick={() => setShowFavoriteDetail(false)}
            aria-label="내 계정으로 돌아가기"
          >
            ←
          </BackButton>
          <TitleSection>
            <Title>즐겨찾기 목록</Title>
          </TitleSection>
          <Spacer />
        </Header>

        <Section>
          <AccountInfo>
            {favoriteList.length > 0 ? (
              favoriteList.map((favorite, index) => (
                <DetailItem key={index}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      flex: 1,
                    }}
                  >
                    <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                      {favorite.name || "알 수 없는 산책로"}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        fontSize: "12px",
                        color: "#666",
                      }}
                    >
                      <span>{favorite.duration || "시간 정보 없음"}</span>
                      <span>·</span>
                      <span>{favorite.distance_km || "거리 정보 없음"}</span>
                    </div>
                  </div>
                </DetailItem>
              ))
            ) : (
              <div
                style={{ textAlign: "center", padding: "2rem", color: "#666" }}
              >
                즐겨찾기한 산책로가 없습니다.
              </div>
            )}
          </AccountInfo>
        </Section>
      </Whole>
    </BottomSheet>
  );

  if (isLoading) {
    return (
      <BottomSheet
        open={true}
        onClose={onClose}
        height="min-content"
        handleLabel="내 계정 닫기"
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>로딩 중...</div>
      </BottomSheet>
    );
  }

  return (
    <>
      <BottomSheet
        open={true}
        onClose={onClose}
        height="60vh"
        handleLabel="내 계정 닫기"
      >
        <Whole>
          <Header>
            <BackButton
              onClick={onBackToTrailList}
              aria-label="목록으로 돌아가기"
            >
              ←
            </BackButton>
            <TitleSection>
              <Title>내 계정</Title>
            </TitleSection>
            <Spacer />
          </Header>

          <Section style={{ fontSize: "13px" }}>
            <SectionTitle $gap="10px">계정 정보</SectionTitle>
            <AccountInfo>
              <InfoItem>
                <span>아이디</span>
                <span style={{ color: "#666" }}>
                  {userInfo?.username || "정보 없음"}
                </span>
              </InfoItem>
              <InfoItem>
                <span>이메일</span>
                <span style={{ color: "#666" }}>
                  {userInfo?.email || "정보 없음"}
                </span>
              </InfoItem>
              <InfoItem>
                <span>닉네임</span>
                <span style={{ color: "#666" }}>
                  {userInfo?.nickname || "정보 없음"}
                </span>
              </InfoItem>
            </AccountInfo>
          </Section>

          <Section>
            <SectionTitle>내 활동</SectionTitle>
            <AccountInfo>
              <InfoItem
                style={{ cursor: "pointer" }}
                onClick={() => setShowFeedbackDetail(true)}
              >
                <span>제보한 민원</span>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span style={{ color: "#666" }}>
                    {activityCounts.feedbackCount}건
                  </span>
                  <DetailButton>상세보기</DetailButton>
                </div>
              </InfoItem>
              <InfoItem
                style={{ cursor: "pointer" }}
                onClick={() => setShowFavoriteDetail(true)}
              >
                <span>즐겨찾기</span>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span style={{ color: "#666" }}>
                    {activityCounts.favoriteCount}개
                  </span>
                  <DetailButton>상세보기</DetailButton>
                </div>
              </InfoItem>
            </AccountInfo>
          </Section>

          <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
        </Whole>
      </BottomSheet>

      {/* 상세보기 컴포넌트들 */}
      <FeedbackDetailView />
      <FavoriteDetailView />

      {/* 하단 메뉴는 시트와 별개로 항상 표시 */}
      <MenuContainer>
        <MenuInner>
          <MenusubInner1
            onClick={() => {
              console.log("산책하기 버튼 클릭됨");
              onOpenSearch();
            }}
          >
            <img src={Search} alt="돋보기" width={30} height={30} />
            산책하기
          </MenusubInner1>
          <MenuCam>
            <img src={Camera} alt="카메라" width={40} height={40} />
          </MenuCam>
          <MenusubInner2 onClick={onBackToTrailList}>
            <img src={Person} alt="계정" width={40} height={40} />내 계정
          </MenusubInner2>
        </MenuInner>
      </MenuContainer>
    </>
  );
}
