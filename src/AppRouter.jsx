import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import TrailDetail from "./components/Trails/DetailTrails/TrailDetail";

function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/trail/:id" element={<TrailDetail />} />
			</Routes>
		</BrowserRouter>
	);
}

export default AppRouter;
