// components/Trails/TrailListPanel.jsx
"use client";
import React from "react";
import { List, Item, Title, Meta, HeartBtn } from "./Trail.styled";
// 필요시 기존 TrailListSheet의 스타일/구조 재활용

export default function TrailListPanel({
	trails,
	favorites,
	onToggleFavorite,
	onSelect,
}) {
	const items = Array.isArray(trails) ? trails : [];
	return (
		<div>
			<h3 style={{ margin: "0 0 8px" }}>산책로</h3>
			<List>
				{items.map((t) => {
					const key = t.name || t.id;
					const liked = favorites?.has?.(key);
					return (
						<Item key={key} onClick={() => onSelect?.(t)}>
							<Title>{t.name}</Title>
							<Meta>
								{t.distance_km} · {t.duration}
							</Meta>
							<HeartBtn
								aria-pressed={!!liked}
								onClick={(e) => {
									e.stopPropagation();
									onToggleFavorite?.(t);
								}}
							>
								{liked ? "♥" : "♡"}
							</HeartBtn>
						</Item>
					);
				})}
			</List>
		</div>
	);
}
