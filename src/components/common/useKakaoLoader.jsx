//useKakaoLoader.jsx
import { useEffect } from "react";
import { useKakaoLoader as useLoader } from "react-kakao-maps-sdk";

export default function useKakaoLoader() {
	const [loading, error] = useLoader({
		appkey: "4fe1d11f5db696151b1987bee6b5d4c2",
		libraries: ["services", "clusterer"],
	});

	useEffect(() => {
		if (error) {
			console.error("Kakao Map 로딩 중 오류:", error);
		}
	}, [error]);

	return loading;
}
