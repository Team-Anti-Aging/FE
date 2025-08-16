// pages/Home.jsx
import React, { useState } from "react";
import MapContainer from "../components/common/MapContainer";
import Toggle from "../components/common/Toggle/Toggle";
import Menu from "../components/common/Menu/Menu";
import { AppWrapper } from "../styles/Globalstyles";

function Home() {
	const [sheetOpen, setSheetOpen] = useState(false);

	return (
		<AppWrapper>
			<Toggle toggle1="제안" toggle2="불편" />
			<MapContainer
				sheetOpen={sheetOpen}
				onToggleSheet={() => setSheetOpen((v) => !v)}
				onCloseSheet={() => setSheetOpen(false)}
			/>
		</AppWrapper>
	);
}

export default Home;
