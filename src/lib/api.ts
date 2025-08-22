// src/lib/api.ts
export const API_BASE =
  import.meta.env.VITE_API_BASE ?? "https://dev.antiaging-hufs.store";

// 디버깅을 위한 로그
console.log("API_BASE 환경 변수:", import.meta.env.VITE_API_BASE);
console.log("최종 API_BASE:", API_BASE);

export const apiUrl = (path: string) => {
  const url = `${API_BASE}${path}`;
  console.log("생성된 API URL:", url);
  return url;
};
