// BottomSheet.jsx
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const SheetWrap = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  width: min(100vw, 520px);
  z-index: 1000;
  padding-bottom: 30px;
  pointer-events: ${(props) => (props.$open ? "auto" : "none")};
`;
const Sheet = styled.div`
  background: #fff;
  height: ${(props) => props.height || "32rem"};
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.15);
  padding: 8px 12px calc(12px + env(safe-area-inset-bottom, 0));
  transform: translateY(
    ${(props) => {
      if (props.$isDragging) return `${props.$dragOffset}px`;
      return props.$open ? "0%" : "100%";
    }}
  );
  transition: ${(props) =>
    props.$isDragging ? "none" : "transform 0.25s ease"};
  overflow-y: auto;
  user-select: none;
  touch-action: pan-y;
`;
const Handle = styled.button`
  width: 42px;
  height: 4px;
  border-radius: 2px;
  background: #e5e7eb;
  margin: 6px auto 8px;
  display: block;
  border: 0;
  cursor: grab;
  transition: background-color 0.2s ease;
  touch-action: none;

  &:hover {
    background: #d1d5db;
  }

  &:active {
    background: #9ca3af;
    cursor: grabbing;
  }

  &:focus {
    outline: none;
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
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [startY, setStartY] = useState(0);
  const sheetRef = useRef(null);

  const handleHandleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClose) {
      onClose();
    }
  };

  // 터치/마우스 이벤트 핸들러
  const handlePointerDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setStartY(e.clientY || e.touches?.[0]?.clientY || 0);
    setDragOffset(0);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;

    e.preventDefault();
    const currentY = e.clientY || e.touches?.[0]?.clientY || 0;
    const deltaY = currentY - startY;

    // 아래로 드래그만 허용 (양수 값)
    if (deltaY > 0) {
      setDragOffset(deltaY);
    }
  };

  const handlePointerUp = () => {
    if (!isDragging) return;

    setIsDragging(false);

    // 드래그 거리가 충분하면 시트 닫기
    if (dragOffset > 100) {
      if (onClose) {
        onClose();
      }
    }

    setDragOffset(0);
  };

  // 전역 이벤트 리스너 추가/제거
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("pointermove", handlePointerMove, {
        passive: false,
      });
      document.addEventListener("pointerup", handlePointerUp);
      document.addEventListener("pointercancel", handlePointerUp);

      return () => {
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
        document.removeEventListener("pointercancel", handlePointerUp);
      };
    }
  }, [isDragging, dragOffset, startY]);

  // 시트가 닫힐 때 드래그 상태 초기화
  useEffect(() => {
    if (!open) {
      setIsDragging(false);
      setDragOffset(0);
    }
  }, [open]);

  return (
    <SheetWrap aria-hidden={!open} $open={open}>
      <Sheet
        ref={sheetRef}
        $open={open}
        $isDragging={isDragging}
        $dragOffset={dragOffset}
        height={height}
      >
        <Handle
          aria-label={open ? handleLabel : "열기"}
          onClick={handleHandleClick}
          onPointerDown={handlePointerDown}
          title={open ? handleLabel : "열기"}
        />
        <Content>{children}</Content>
      </Sheet>
    </SheetWrap>
  );
}
