// TrailMap.jsx
import React, { useMemo, useCallback, useEffect, useState } from "react";
import { Map as KakaoMap, Polyline, MapMarker } from "react-kakao-maps-sdk";

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
