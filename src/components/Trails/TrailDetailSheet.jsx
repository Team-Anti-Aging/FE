// TrailDetailSheet.jsx
import React from "react";
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
  Description,
  ActionButton,
} from "./TrailDetailSheet.styled";

export default function TrailDetailSheet({
  trail,
  onClose,
  onBackToList,
  onGoToReport,
}) {
  if (!trail) return null;

  const handleClick = () => {
    // 제보 페이지로 panel 변경
    onGoToReport(trail);
  };

  return (
    <BottomSheet open={true} onClose={onClose} handleLabel="세부정보 닫기">
      <Header>
        <BackButton onClick={onBackToList} aria-label="목록으로 돌아가기">
          ←
        </BackButton>
        <TitleSection>
          <Title>{trail.name}</Title>
          <Meta>
            {trail.duration} · {trail.distance_km}
          </Meta>
        </TitleSection>
        <Spacer />
      </Header>

      <Section>
        <SectionTitle>코스 소개</SectionTitle>
        <Description>{trail.description}</Description>
      </Section>

      <Section>
        <SectionTitle>코스 정보</SectionTitle>
        <Description>
          총 거리: {trail.distance_km}
          <br />
          예상 소요시간: {trail.duration}
          <br />총 {trail.routes?.length || 0}개의 경유지점
        </Description>
      </Section>

      <ActionButton onClick={handleClick}>제보하기</ActionButton>
    </BottomSheet>
  );
}
