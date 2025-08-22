import styled from "styled-components";

export const MenuContainer = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0px;
  width: 100%;
  max-width: 500px; /* 최대 너비 제한 */
  background: white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-radius: 14px;
  padding: 16px 20px;
  z-index: 2000;
`;

export const MenuInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; /* space-around에서 변경 */
  gap: 16px; /* 요소 간 간격 추가 */
`;

export const MenuCam = styled.div`
  background-color: #3a7252;
  width: 50px;
  height: 50px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; /* 크기 고정 */
  cursor: pointer;

  &:hover {
    background-color: #2d5a41;
  }
`;

/* 공통 메뉴 버튼 스타일 */
const MenuButton = styled.button`
  background-color: transparent;
  border: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 1rem;
  gap: 8px;
  padding: 0.8rem 1rem;
  width: 8rem;
  cursor: pointer;
  border-radius: 12px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
  }
`;

export const MenusubInner1 = styled(MenuButton)`
  /* 왼쪽 버튼 */
`;

export const MenusubInner2 = styled(MenuButton)`
  /* 오른쪽 버튼 */
`;
