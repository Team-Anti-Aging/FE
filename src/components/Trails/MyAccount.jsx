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

const AccountInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem 0;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f1f3f5;

  &:last-child {
    border-bottom: none;
  }
`;

const LogoutButton = styled.button`
  width: 100%;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 16px;

  &:hover {
    background: #c82333;
  }
`;

export default function MyAccount({
  onClose,
  onBackToTrailList,
  onOpenSearch,
}) {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 로그인 상태 확인
  const isLoggedIn = !!localStorage.getItem("accessToken");

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보 가져오기
    const token = localStorage.getItem("accessToken");
    const userInfoStr = localStorage.getItem("userInfo");

    if (token && userInfoStr) {
      try {
        const userData = JSON.parse(userInfoStr);
        setUserInfo(userData);
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

          <Section>
            <SectionTitle>계정 정보</SectionTitle>
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
              <InfoItem>
                <span>제보한 민원</span>
                <span style={{ color: "#666" }}>0건</span>
              </InfoItem>
              <InfoItem>
                <span>즐겨찾기</span>
                <span style={{ color: "#666" }}>0개</span>
              </InfoItem>
            </AccountInfo>
          </Section>

          <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
        </Whole>
      </BottomSheet>

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
