// TrailOverlays.jsx
import { Polyline } from "react-kakao-maps-sdk";
export default function TrailOverlays({ trail }) {
	const path = (trail?.routes || []).map((p) => ({ lat: +p.lat, lng: +p.lng }));
	if (path.length === 0) return null;
	return (
		<Polyline
			path={path}
			strokeWeight={5}
			strokeOpacity={1}
			strokeStyle="solid"
			strokeColor="#3A7252"
		/>
	);
}
