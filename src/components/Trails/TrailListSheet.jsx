// TrailListSheet.jsx
import React from "react";
import BottomSheet from "../common/BottomSheet/BottomSheet";
import { List, Item, Title, HeartBtn, Meta } from "./Trail.styled";
import {
	MenuCam,
	MenuContainer,
	MenusubInner1,
	MenusubInner2,
	MenuInner,
} from "../common/Menu/Menu.styled";

import Camera from "../../assets/camera.svg";
import Search from "../../assets/Search.svg";
import Alert from "../../assets/Alert circle.svg";

export default function TrailListSheet({
	open = false,
	trails,
	favorites,
	onToggleFavorite,
	onSelectTrail,
	onOpenSearch,
	onOpenInfo,
	onClose,
}) {
	const items = Array.isArray(trails) ? trails.slice() : [];

	return (
		<>
			<BottomSheet
				open={open}
				onClose={onClose}
				height="32rem"
				handleLabel="Trail 목록 닫기"
			>
				<List>
					{items.map((t) => {
						const key = t.id || t.name;
						return (
							<Item
								key={key}
								onClick={() => onSelectTrail(t)}
								style={{ cursor: "pointer" }}
							>
								<div>
									<Title>{t.name}</Title>
									<Meta>
										{t.duration} · {t.distance_km}
									</Meta>
								</div>

								<HeartBtn
									aria-label="즐겨찾기"
									title="즐겨찾기"
									$active={!!favorites?.[t.name]}
									onClick={(e) => {
										e.stopPropagation();
										onToggleFavorite(t.name);
									}}
								>
									♥
								</HeartBtn>
							</Item>
						);
					})}
				</List>
			</BottomSheet>

			{/* 하단 메뉴는 시트와 별개로 항상 표시 */}
			<MenuContainer>
				<MenuInner>
					<MenusubInner1 onClick={onOpenSearch}>
						<img src={Search} alt="돋보기" width={30} height={30} />
						산책하기
					</MenusubInner1>
					<MenuCam>
						<img src={Camera} alt="카메라" width={40} height={40} />
					</MenuCam>
					<MenusubInner2 onClick={onOpenInfo}>
						<img src={Alert} alt="알림" width={30} height={30} />
						바뀐 동대문구
					</MenusubInner2>
				</MenuInner>
			</MenuContainer>
		</>
	);
}
