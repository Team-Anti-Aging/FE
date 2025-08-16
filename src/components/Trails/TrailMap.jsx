// TrailMap.jsx
import React, { useMemo, useCallback, useEffect, useState } from "react";
import { Map as KakaoMap, Polyline, MapMarker } from "react-kakao-maps-sdk";

const Trailone = {
	name: "홍릉두물길",
	duration: "2시간 10분",
	distance_km: "6.2km",
	description: "성북천, 청계천, 정릉천과 연계되어 있는 물길입니다.",
	checkpoint: [
		"성북천",
		"청계천",
		"전릉천",
		"세종대왕기념관",
		"홍릉근린공원",
		"영휘원-승인원",
	],
	routes: [
		{ lat: 37.579204, lng: 127.024514 },
		{ lat: 37.57901, lng: 127.025763 },
		{ lat: 37.578367, lng: 127.026959 },
		{ lat: 37.577844, lng: 127.027478 },
		{ lat: 37.577519, lng: 127.027673 },
		{ lat: 37.577055, lng: 127.027775 },
		{ lat: 37.574014, lng: 127.028144 },
		{ lat: 37.57061, lng: 127.027875 },
		{ lat: 37.570262, lng: 127.027895 },
		{ lat: 37.569965, lng: 127.028918 },
		{ lat: 37.569657, lng: 127.030142 },
		{ lat: 37.569676, lng: 127.031337 },
		{ lat: 37.56999, lng: 127.032366 },
		{ lat: 37.570267, lng: 127.03235 },
		{ lat: 37.571968, lng: 127.035012 },
		{ lat: 37.572418, lng: 127.036247 },
		{ lat: 37.573249, lng: 127.035045 },
		{ lat: 37.573172, lng: 127.034527 },
		{ lat: 37.573891, lng: 127.034352 },
		{ lat: 37.578056, lng: 127.034392 },
		{ lat: 37.578696, lng: 127.034446 },
		{ lat: 37.58277, lng: 127.035229 },
		{ lat: 37.58494, lng: 127.035523 },
		{ lat: 37.58648, lng: 127.036227 },
		{ lat: 37.591226, lng: 127.038551 },
		{ lat: 37.591262, lng: 127.042112 },
		{ lat: 37.591613, lng: 127.04354 },
		{ lat: 37.591657, lng: 127.044521 },
		{ lat: 37.591599, lng: 127.046114 },
		{ lat: 37.590531, lng: 127.04604 },
		{ lat: 37.590172, lng: 127.047523 },
		{ lat: 37.589746, lng: 127.04752 },
		{ lat: 37.589504, lng: 127.047459 },
		{ lat: 37.589258, lng: 127.047212 },
		{ lat: 37.589109, lng: 127.047121 },
		{ lat: 37.588691, lng: 127.047031 },
		{ lat: 37.588249, lng: 127.045523 },
		{ lat: 37.588164, lng: 127.045436 },
		{ lat: 37.588049, lng: 127.044998 },
		{ lat: 37.587943, lng: 127.042853 },
		{ lat: 37.590319, lng: 127.042416 },
		{ lat: 37.591011, lng: 127.042488 },
		{ lat: 37.591487, lng: 127.042991 },
	],
};

export default function TrailMap() {
	const [kakaoReady, setKakaoReady] = useState(false);

	// SDK 로드 완료 감지
	useEffect(() => {
		if (typeof window === "undefined") return;
		if (window.kakao && window.kakao.maps) {
			setKakaoReady(true);
			return;
		}
		// 혹시 로드가 느릴 때를 대비한 폴링
		const id = setInterval(() => {
			if (window.kakao && window.kakao.maps) {
				setKakaoReady(true);
				clearInterval(id);
			}
		}, 50);
		return () => clearInterval(id);
	}, []);

	const path = useMemo(
		() => Trailone.routes.map((p) => ({ lat: p.lat, lng: p.lng })),
		[]
	);
	const start = path[0] || { lat: 37.58, lng: 127.03 };
	const end = path[path.length - 1];

	// 지도 생성시 전체 경로가 화면에 들어오게
	const onCreateMap = useCallback(
		(map) => {
			if (!kakaoReady || !path.length) return;
			const bounds = new window.kakao.maps.LatLngBounds();
			path.forEach((p) =>
				bounds.extend(new window.kakao.maps.LatLng(p.lat, p.lng))
			);
			// (좌,우,상,하) 패딩
			if (typeof map.setBounds === "function") {
				map.setBounds(bounds, 48, 48, 48, 48);
			} else {
				// 구버전 호환
				map.setBounds(bounds);
			}
		},
		[kakaoReady, path]
	);

	if (!kakaoReady) {
		return (
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "grid",
					placeItems: "center",
				}}
			>
				지도 불러오는 중...
			</div>
		);
	}

	return (
		<div
			style={{
				width: "100%",
				height: "70vh",
				borderRadius: 12,
				overflow: "hidden",
			}}
		>
			<KakaoMap
				center={start}
				level={5}
				onCreate={onCreateMap}
				style={{ width: "100%", height: "100%" }}
			>
				<Polyline
					path={[path]}
					strokeWeight={6}
					strokeColor={"#1A73E8"}
					strokeOpacity={0.9}
					strokeStyle={"solid"}
				/>
				<MapMarker position={start} title={`${Trailone.name} 시작`} />
				{end && <MapMarker position={end} title={`${Trailone.name} 종료`} />}
			</KakaoMap>
		</div>
	);
}
