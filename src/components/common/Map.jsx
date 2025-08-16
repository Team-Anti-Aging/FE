import React from "react";
import { Map as KakaoMap } from "react-kakao-maps-sdk";
import useKakaoLoader from "./useKakaoLoader";

function Map({
	width = "100%",
	height = "100%",
	center,
	level = 5,
	onCreate,
	children,
}) {
	useKakaoLoader();
	return (
		<KakaoMap
			center={center}
			level={level}
			onCreate={onCreate}
			style={{ width, height }}
		>
			{children}
		</KakaoMap>
	);
}

export default Map;
