// Menu.jsx
import React from "react";
import Camera from "../../../assets/camera.svg";
import Search from "../../../assets/Search.svg";
import Alert from "../../../assets/Alert circle.svg";
import {
	MenuCam,
	MenuContainer,
	MenuInner,
	MenusubInner1,
	MenusubInner2,
} from "./Menu.styled";

function Menu() {
	return (
		<MenuContainer>
			<MenuInner>
				<MenusubInner1>
					<img src={Search} alt="돋보기" width={30} height={30} />
					산책하기
				</MenusubInner1>
				<MenuCam>
					<img src={Camera} alt="카메라" width={40} height={40} />
				</MenuCam>
				<MenusubInner2>
					<img src={Alert} alt="알림" width={30} height={30} />
					바뀐 동대문구
				</MenusubInner2>
			</MenuInner>
		</MenuContainer>
	);
}

export default Menu;
