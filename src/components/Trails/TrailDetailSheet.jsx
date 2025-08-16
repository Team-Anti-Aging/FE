// TrailDetailSheet.jsx
import React from "react";
import BottomSheet from "../common/BottomSheet/BottomSheet";
import styled from "styled-components";

const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
	padding: 0 4px;
`;

const BackButton = styled.button`
	background: none;
	border: none;
	font-size: 18px;
	cursor: pointer;
	padding: 4px 8px;
	border-radius: 4px;

	&:hover {
		background-color: #f5f5f5;
	}
`;

const TitleSection = styled.div`
	text-align: center;
	flex: 1;
`;

const Title = styled.h2`
	margin: 0;
	font-size: 20px;
	font-weight: 700;
	color: #111;
`;

const Meta = styled.div`
	font-size: 14px;
	color: #6b7280;
	margin-top: 4px;
`;

const Section = styled.div`
	margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
	font-size: 16px;
	font-weight: 600;
	color: #111;
	margin: 0 0 8px 0;
`;

const Description = styled.p`
	font-size: 14px;
	color: #374151;
	line-height: 1.6;
	margin: 0;
`;

const CheckpointList = styled.ul`
	list-style: none;
	padding: 0;
	margin: 0;
`;

const CheckpointItem = styled.li`
	display: flex;
	align-items: center;
	padding: 8px 0;
	font-size: 14px;
	color: #374151;
	border-bottom: ${(props) => (props.$isLast ? "none" : "1px solid #f1f3f5")};
`;

const CheckpointIcon = styled.span`
	margin-right: 8px;
`;

const ActionButton = styled.button`
	width: 100%;
	background: #3a7252;
	color: white;
	border: none;
	border-radius: 12px;
	padding: 16px;
	font-size: 16px;
	font-weight: 600;
	cursor: pointer;
	margin-top: 16px;

	&:hover {
		background: #2d5a41;
	}
`;

const Spacer = styled.div`
	width: 36px;
`;

export default function TrailDetailSheet({ trail, onClose, onBackToList }) {
	if (!trail) return null;

	return (
		<BottomSheet
			open={true}
			onClose={onClose}
			height="60vh"
			handleLabel="세부정보 닫기"
		>
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

			{trail.checkpoint && trail.checkpoint.length > 0 && (
				<Section>
					<SectionTitle>주요 지점</SectionTitle>
					<CheckpointList>
						{trail.checkpoint.map((point, index) => (
							<CheckpointItem
								key={index}
								$isLast={index === trail.checkpoint.length - 1}
							>
								<CheckpointIcon>📍</CheckpointIcon>
								{point}
							</CheckpointItem>
						))}
					</CheckpointList>
				</Section>
			)}

			<Section>
				<SectionTitle>코스 정보</SectionTitle>
				<Description>
					총 거리: {trail.distance_km}
					<br />
					예상 소요시간: {trail.duration}
					<br />총 {trail.routes?.length || 0}개의 경유지점
				</Description>
			</Section>

			<ActionButton
				onClick={() => {
					alert(`${trail.name} 산책을 시작합니다!`);
					onClose();
				}}
			>
				🚶‍♀️ 산책 시작하기
			</ActionButton>
		</BottomSheet>
	);
}
