import styled from "styled-components";
export const SheetWrap = styled.div`
	position: fixed;
	left: 50%;
	transform: translateX(-50%);
	bottom: 0;
	width: min(100vw, 520px);
	z-index: 1000;
`;

export const Sheet = styled.div`
	background: #fff;
	height: 32rem;
	border-radius: 16px 16px 0 0;
	box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.15);
	padding: 8px 12px calc(12px + env(safe-area-inset-bottom, 0));
	transform: translateY(${(p) => (p.$open ? "0%" : "85%")});
	transition: transform 0.25s ease;
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
`;

export const List = styled.ul`
	list-style: none;
	margin: 0;
	padding: 0;
`;
export const Item = styled.li`
	display: grid;
	grid-template-columns: 1fr auto;
	align-items: center;
	gap: 8px;
	padding: 12px 8px;
	border-bottom: 1px solid #f1f3f5;
`;
export const Title = styled.button`
	text-align: left;
	border: 0;
	background: none;
	padding: 0;
	font-size: 15px;
	font-weight: 600;
	color: #111;
	cursor: pointer;
`;
export const Meta = styled.div`
	font-size: 12px;
	color: #6b7280;
	margin-top: 4px;
`;
export const HeartBtn = styled.button`
	border: 0;
	background: transparent;
	cursor: pointer;
	font-size: 18px;
	line-height: 1;
	color: ${(p) => (p.$active ? "#ef4444" : "#cbd5e1")};
`;

export const BottomBar = styled.div`
	position: fixed;
	left: 50%;
	transform: translateX(-50%);
	bottom: 12px;
	width: min(100vw - 24px, 520px);
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 12px;
	z-index: 1001;
	pointer-events: none;
`;
export const BarBtn = styled.button`
	pointer-events: auto;
	background: #fff;
	border: 1px solid #e5e7eb;
	border-radius: 12px;
	padding: 10px 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 6px;
	font-size: 13px;
	color: #374151;
	box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
`;
