// Toggle.jsx
import React, { useState } from "react";
import { ToggleWrap, ToggleBtn } from "./Toggle.styled";

const Toggle = ({ toggle1, toggle2 }) => {
	const [leftActive, setLeftActive] = useState(true);

	return (
		<ToggleWrap role="tablist" aria-label="toggle">
			<ToggleBtn
				$active={leftActive}
				onClick={() => setLeftActive(true)}
				role="tab"
				aria-selected={leftActive}
			>
				{toggle1}
			</ToggleBtn>

			<ToggleBtn
				$active={!leftActive}
				onClick={() => setLeftActive(false)}
				role="tab"
				aria-selected={!leftActive}
			>
				{toggle2}
			</ToggleBtn>
		</ToggleWrap>
	);
};

export default Toggle;
