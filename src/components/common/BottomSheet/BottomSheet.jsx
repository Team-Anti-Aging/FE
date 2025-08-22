// BottomSheet.jsx
import React from "react";
import styled from "styled-components";

const SheetWrap = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  width: min(100vw, 520px);
  z-index: 1000;
  pointer-events: ${(props) => (props.$open ? "auto" : "none")};
`;
const Sheet = styled.div`
  background: #fff;
  height: ${(props) => props.height || "32rem"};
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.15);
  padding: 8px 12px calc(12px + env(safe-area-inset-bottom, 0));
  transform: translateY(${(props) => (props.$open ? "0%" : "100%")});
  transition: transform 0.25s ease;
  overflow-y: auto;
`;
const Handle = styled.button`
  width: 42px;
  height: 2px;
  border-radius: 2px;
  background: #e5e7eb;
  margin: 6px auto 8px;
  display: block;
  border: 0;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #d1d5db;
  }

  &:active {
    background: #9ca3af;
  }
`;

const Content = styled.div`
  height: calc(100% - 24px);
  overflow-y: auto;
`;

export default function BottomSheet({
  open = false,
  onClose,
  children,
  height,
  handleLabel = "닫기",
}) {
  const handleHandleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClose) {
      onClose();
    }
  };

  return (
    <SheetWrap aria-hidden={!open} $open={open}>
      <Sheet $open={open} height={height}>
        <Handle
          aria-label={open ? handleLabel : "열기"}
          onClick={handleHandleClick}
          title={open ? handleLabel : "열기"}
        />
        <Content>{children}</Content>
      </Sheet>
    </SheetWrap>
  );
}
