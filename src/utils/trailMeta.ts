export function buildTrailMeta(trails) {
	return trails.map((t) => {
		const routes = t.routes.filter(
			(p) => Number.isFinite(p.lat) && Number.isFinite(p.lng)
		);
		const lats = routes.map((p) => p.lat);
		const lngs = routes.map((p) => p.lng);
		const minLat = Math.min(...lats),
			maxLat = Math.max(...lats);
		const minLng = Math.min(...lngs),
			maxLng = Math.max(...lngs);

		// ① 중심값(바운즈 센터)
		const center = { lat: (minLat + maxLat) / 2, lng: (minLng + maxLng) / 2 };

		// ② 코스 크기 -> 권장 줌(level) 추정 (대략값, 필요시 조정)
		const latSpan = maxLat - minLat;
		const lngSpan = maxLng - minLng;
		// 서울 위도 기준: 1도 ≈ 111.3km, 경도는 cos(lat) 보정
		const metersLat = latSpan * 111_320;
		const metersLng =
			lngSpan * 111_320 * Math.cos((center.lat * Math.PI) / 180);
		const span = Math.max(metersLat, metersLng);

		let level; // 숫자 작을수록 더 확대
		if (span < 600) level = 4;
		else if (span < 1_200) level = 5;
		else if (span < 2_500) level = 6;
		else if (span < 5_000) level = 7;
		else level = 8;

		return { ...t, _view: { center, level } };
	});
}
