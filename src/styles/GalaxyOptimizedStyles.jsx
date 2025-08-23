import styled from "styled-components";

// 갤럭시 기기 감지 함수
const isGalaxyDevice = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isAndroid = userAgent.includes("android");
  const isSamsung = userAgent.includes("samsung") || userAgent.includes("sm-");

  return (
    isAndroid &&
    (isSamsung || userAgent.includes("chrome") || userAgent.includes("safari"))
  );
};

// 갤럭시 기기용 최적화된 컨테이너
export const GalaxyOptimizedContainer = styled.div`
  padding: ${() => (isGalaxyDevice() ? "12px 16px" : "16px 20px")};
  gap: ${() => (isGalaxyDevice() ? "12px" : "16px")};
  font-size: ${() => (isGalaxyDevice() ? "13px" : "14px")};
`;

// 갤럭시 기기용 최적화된 아이템
export const GalaxyOptimizedItem = styled.div`
  padding: ${() => (isGalaxyDevice() ? "10px 12px" : "12px 16px")};
  margin-bottom: ${() => (isGalaxyDevice() ? "8px" : "12px")};
  font-size: ${() => (isGalaxyDevice() ? "13px" : "14px")};
  line-height: ${() => (isGalaxyDevice() ? "1.4" : "1.5")};
`;

// 갤럭시 기기용 최적화된 버튼
export const GalaxyOptimizedButton = styled.button`
  padding: ${() => (isGalaxyDevice() ? "8px 12px" : "10px 16px")};
  font-size: ${() => (isGalaxyDevice() ? "13px" : "14px")};
  border-radius: ${() => (isGalaxyDevice() ? "8px" : "10px")};
`;

// 갤럭시 기기용 최적화된 제목
export const GalaxyOptimizedTitle = styled.h2`
  font-size: ${() => (isGalaxyDevice() ? "16px" : "18px")};
  margin-bottom: ${() => (isGalaxyDevice() ? "12px" : "16px")};
  line-height: ${() => (isGalaxyDevice() ? "1.3" : "1.4")};
`;

// 갤럭시 기기용 최적화된 텍스트
export const GalaxyOptimizedText = styled.span`
  font-size: ${() => (isGalaxyDevice() ? "12px" : "13px")};
  line-height: ${() => (isGalaxyDevice() ? "1.3" : "1.4")};
`;
