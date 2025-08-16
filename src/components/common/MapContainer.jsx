// MapContainer.jsx
import React, { useEffect, useState } from "react";
import { ALL_TRAILS } from "../Trails/TrailData.js";
import Map from "./Map";
import TrailOverlays from "../Trails/TrailOverlays";
import TrailListSheet from "../Trails/TrailListSheet";
import TrailDetailSheet from "../Trails/TrailDetailSheet";

function MapContainer({ sheetOpen, onToggleSheet, onCloseSheet }) {
	const [selectedTrail, setSelectedTrail] = useState(null);
	const [favorites, setFavorites] = useState({});
	const [map, setMap] = useState(null);
	const [showDetailSheet, setShowDetailSheet] = useState(false);

	const onToggleFavorite = (name) =>
		setFavorites((f) => ({ ...f, [name]: !f[name] }));

	// Trail 선택 시 세부정보 시트 표시
	const handleSelectTrail = (trail) => {
		//console.log("🚀 Trail selected:", trail.name);
		//console.log("🗺️ Map object exists:", !!map);
		//console.log("🧭 Trail routes length:", trail.routes?.length);
		//console.log("📍 First few coordinates:", trail.routes?.slice(0, 3));

		setSelectedTrail(trail);
		setShowDetailSheet(true);

		// 즉시 지도 중심 이동 시도
		if (map && trail.routes && trail.routes.length > 0) {
			console.log("🎯 Attempting immediate map center change...");
			try {
				const firstPoint = trail.routes[0];
				const kakaoLatLng = new window.kakao.maps.LatLng(
					firstPoint.lat,
					firstPoint.lng
				);
				map.setCenter(kakaoLatLng);
				map.setLevel(5);
				//console.log("✅ Map center set to:", firstPoint.lat, firstPoint.lng);
			} catch (error) {
				console.error("❌ Error setting map center immediately:", error);
			}
		}
	};

	// 목록으로 돌아가기
	const handleBackToList = () => {
		setShowDetailSheet(false);
	};

	// 세부정보 시트 닫기
	const handleCloseDetailSheet = () => {
		setShowDetailSheet(false);
		setSelectedTrail(null);
	};

	// selectedTrail이 바뀔 때마다 지도 영역 맞추기
	useEffect(() => {
		//console.log("🔄 useEffect triggered");
		//console.log("- map exists:", !!map);
		//console.log("- selectedTrail exists:", !!selectedTrail);
		//console.log("- window.kakao.maps exists:", !!window?.kakao?.maps);

		if (!map || !selectedTrail || !window?.kakao?.maps) {
			return;
		}

		const { kakao } = window;

		if (!selectedTrail.routes || selectedTrail.routes.length === 0) {
			return;
		}

		const firstPoint = selectedTrail.routes[0];

		try {
			const center = new kakao.maps.LatLng(firstPoint.lat, firstPoint.lng);
			map.setCenter(center);
			map.setLevel(4);

			setTimeout(() => {
				try {
					const bounds = new kakao.maps.LatLngBounds();

					selectedTrail.routes.forEach((point, index) => {
						if (
							point &&
							typeof point.lat === "number" &&
							typeof point.lng === "number"
						) {
							bounds.extend(new kakao.maps.LatLng(point.lat, point.lng));
							if (index < 5)
								console.log(`Point ${index}:`, point.lat, point.lng);
						}
					});

					map.setBounds(bounds);
					setTimeout(() => {
						const currentLevel = map.getLevel();
						if (currentLevel > 7) {
							map.setLevel(7);
						}
					}, 200);
				} catch (boundsError) {
					console.error("❌ Error setting bounds:", boundsError);
				}
			}, 500);
		} catch (error) {
			console.error("❌ Error setting map center:", error);
		}
	}, [map, selectedTrail]);

	const handleMapCreate = (mapInstance) => {
		setMap(mapInstance);
	};

	return (
		<div style={{ width: "100vw", height: "100vh", position: "relative" }}>
			<Map
				width="100%"
				height="100%"
				center={{ lat: 37.574, lng: 127.04 }}
				level={5}
				onCreate={handleMapCreate}
			>
				{selectedTrail && <TrailOverlays trail={selectedTrail} />}
			</Map>

			{/* Trail 목록 시트 */}
			<TrailListSheet
				open={sheetOpen && !showDetailSheet}
				trails={ALL_TRAILS}
				favorites={favorites}
				onToggleFavorite={onToggleFavorite}
				onSelectTrail={handleSelectTrail}
				onOpenCamera={() => alert("카메라 열기")}
				onOpenSearch={onToggleSheet}
				onOpenInfo={() => alert("알림 안내")}
				onClose={onCloseSheet}
			/>

			{/* Trail 세부정보 시트 */}
			{showDetailSheet && selectedTrail && (
				<TrailDetailSheet
					trail={selectedTrail}
					onClose={handleCloseDetailSheet}
					onBackToList={handleBackToList}
				/>
			)}
		</div>
	);
}

export default MapContainer;
