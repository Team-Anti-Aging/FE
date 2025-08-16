// utils/fitTrail.js
export function fitTrail(map, routes) {
	if (!map || !Array.isArray(routes)) return;

	// 1) 유효 좌표만 추출 (한국 범위 대략 필터링: lat 33~39, lng 124~132)
	const pts = routes.filter(
		(p) =>
			p &&
			Number.isFinite(p.lat) &&
			Number.isFinite(p.lng) &&
			p.lat > 33 &&
			p.lat < 39 &&
			p.lng > 124 &&
			p.lng < 132
	);

	if (pts.length === 0) return;

	// 2) 시트 열림 등으로 사이즈 바뀐 뒤에는 먼저 relayout
	if (typeof map.relayout === "function") {
		map.relayout();
	}

	const { kakao } = window;

	// 3) 좌표가 1~2개면 setBounds 대신 "센터/레벨" 직접 지정
	if (pts.length <= 2) {
		const center =
			pts.length === 1
				? new kakao.maps.LatLng(pts[0].lat, pts[0].lng)
				: new kakao.maps.LatLng(
						(pts[0].lat + pts[1].lat) / 2,
						(pts[0].lng + pts[1].lng) / 2
				  );

		// 두 점 사이 거리로 레벨 추정
		const distM = pts.length === 1 ? 0 : haversine(pts[0], pts[1]);
		const level = distanceToLevel(distM);
		map.setCenter(center);
		map.setLevel(level);
		return;
	}

	// 4) 3개 이상이면 bounds 계산
	const bounds = new kakao.maps.LatLngBounds();
	pts.forEach(({ lat, lng }) => bounds.extend(new kakao.maps.LatLng(lat, lng)));

	// setBounds가 과도 줌아웃될 때가 있어 후처리로 보정
	map.setBounds(bounds);

	// 5) 보정: 중심/레벨 재세팅 (최대 변 위주로 적정 레벨 추정)
	const center = bounds.getCenter();
	const maxDist = maxPairwiseDistance(pts); // 미터
	const level = distanceToLevel(maxDist);
	// 약간의 틱 이후 실행하면 레이아웃 반영 후 안정적으로 동작
	setTimeout(() => {
		map.setCenter(new kakao.maps.LatLng(center.getLat(), center.getLng()));
		map.setLevel(level);
	}, 0);
}

// --- 유틸들 ---

function haversine(a, b) {
	const R = 6371000; // m
	const dLat = toRad(b.lat - a.lat);
	const dLng = toRad(b.lng - a.lng);
	const lat1 = toRad(a.lat);
	const lat2 = toRad(b.lat);
	const h =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
	return 2 * R * Math.asin(Math.sqrt(h));
}

function toRad(d) {
	return (d * Math.PI) / 180;
}

function maxPairwiseDistance(points) {
	let max = 0;
	for (let i = 0; i < points.length; i++) {
		for (let j = i + 1; j < points.length; j++) {
			const d = haversine(points[i], points[j]);
			if (d > max) max = d;
		}
	}
	return max;
}

// 간단 맵핑: (원하는 스타일에 맞게 조절해도 됨)
function distanceToLevel(m) {
	if (m > 15000) return 8; // 구 단위 이상
	if (m > 8000) return 7;
	if (m > 4000) return 6;
	if (m > 2000) return 5;
	if (m > 1000) return 4;
	if (m > 500) return 3;
	return 2; // 가깝다면 더 깊게
}
