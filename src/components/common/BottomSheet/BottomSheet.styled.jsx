// BottomSheet.styled.jsx
import styled from "styled-components";

export const SheetWrap = styled.div`
	position: fixed;
	left: 50%;
	transform: translateX(-50%);
	bottom: 0;
	width: min(100vw, 520px);
	z-index: 1000;
	pointer-events: ${(props) => (props.$open ? "auto" : "none")};
`;

export const Sheet = styled.div`
	background: #fff;
	height: ${(props) => props.height || "32rem"};
	border-radius: 16px 16px 0 0;
	box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.15);
	padding: 8px 12px calc(12px + env(safe-area-inset-bottom, 0));
	transform: translateY(${(props) => (props.$open ? "0%" : "100%")});
	transition: transform 0.25s ease;
	overflow-y: auto;
`;

export const Handle = styled.button`
	width: 42px;
	height: 4px;
	border-radius: 2px;
	background: #e5e7eb;
	margin: 6px auto 8px;
	display: block;
	border: 0;
	cursor: pointer;

	&:hover {
		background: #d1d5db;
	}
`;

export const Content = styled.div`
	height: calc(100% - 24px);
	overflow-y: auto;
`;
