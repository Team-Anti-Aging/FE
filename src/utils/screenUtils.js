// 화면 크기와 기기 타입 감지 유틸리티

// 갤럭시 기기 감지 (Android + Samsung)
export const isGalaxyDevice = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isAndroid = userAgent.includes("android");
  const isSamsung = userAgent.includes("samsung") || userAgent.includes("sm-");

  // 갤럭시 기기 감지 (Android + Samsung 브라우저 또는 Samsung 기기)
  return (
    isAndroid &&
    (isSamsung || userAgent.includes("chrome") || userAgent.includes("safari"))
  );
};

// 갤럭시 기기 감지 (더 정확한 방법)
export const isGalaxyDeviceV2 = () => {
  const userAgent = navigator.userAgent.toLowerCase();

  // Samsung 기기 모델명 패턴
  const samsungModels = [
    "sm-",
    "samsung",
    "galaxy",
    "gt-",
    "sch-",
    "sph-",
    "shv-",
    "sgh-",
  ];

  const isSamsungModel = samsungModels.some((model) =>
    userAgent.includes(model)
  );
  const isAndroid = userAgent.includes("android");

  return isAndroid && isSamsungModel;
};

// 세로가 긴 화면인지 확인 (18:9 이상)
export const isTallScreen = () => {
  const aspectRatio = window.screen.height / window.screen.width;
  return aspectRatio >= 1.8;
};

// 갤럭시 기기용 패널 높이 설정 (더 여유로운 레이아웃)
export const getGalaxyOptimizedHeight = () => {
  if (isGalaxyDevice()) {
    return "45vh"; // 갤럭시용 더 작은 높이로 지도 공간 확보
  }
  return "32rem"; // 기본 높이
};

// 내 계정 패널 높이 (갤럭시용 더 여유로운 레이아웃)
export const getAccountPanelHeight = () => {
  if (isGalaxyDevice()) {
    return "45vh"; // 갤럭시용 적당한 높이
  }
  if (isTallScreen()) {
    return "55vh"; // 세로 긴 화면용
  }
  return "60vh"; // 기본
};

// 상세보기 패널 높이 (갤럭시용 더 여유로운 레이아웃)
export const getDetailPanelHeight = () => {
  if (isGalaxyDevice()) {
    return "70vh"; // 갤럭시용 적당한 높이
  }
  if (isTallScreen()) {
    return "75vh"; // 세로 긴 화면용
  }
  return "80vh"; // 기본
};

// 갤럭시 기기용 여백 설정
export const getGalaxySpacing = () => {
  if (isGalaxyDevice()) {
    return {
      padding: "14px 18px", // 더 작은 패딩
      gap: "12px", // 더 작은 간격
      fontSize: "13px", // 더 작은 폰트
    };
  }
  return {
    padding: "16px 20px",
    gap: "16px",
    fontSize: "14px",
  };
};
