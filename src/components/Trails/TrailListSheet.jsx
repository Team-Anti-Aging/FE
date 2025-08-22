// TrailListSheet.jsx
import React, { useRef } from "react";
import BottomSheet from "../common/BottomSheet/BottomSheet";
import { List, Item, Title, HeartBtn, Meta } from "./Trail.styled";
import {
  MenuCam,
  MenuContainer,
  MenusubInner1,
  MenusubInner2,
  MenuInner,
} from "../common/Menu/Menu.styled";

import Camera from "../../assets/camera.svg";
import Search from "../../assets/Search.svg";
import Person from "../../assets/person.png";

export default function TrailListSheet({
  open = false,
  trails,
  favorites,
  onToggleFavorite,
  onSelectTrail,
  onOpenSearch,
  onOpenMyAccount,
  onOpenLogin,
  onClose,
  onCameraPhotoTaken,
}) {
  const items = Array.isArray(trails) ? trails.slice() : [];
  const fileInputRef = useRef(null);

  // 로그인 상태 확인
  const isLoggedIn = !!localStorage.getItem("accessToken");

  // 카메라 버튼 클릭 핸들러
  const handleCameraClick = async () => {
    console.log("하단 카메라 버튼 클릭됨");

    // 사용자에게 안내
    alert(
      "민원 신청을 위한 사진을 촬영합니다. 사진 촬영 후 자동으로 민원 신청 페이지로 이동합니다."
    );

    // 먼저 파일 선택 다이얼로그를 열어보기
    try {
      console.log("파일 선택 다이얼로그 열기 시도");
      if (fileInputRef.current) {
        fileInputRef.current.click();
      } else {
        console.error("fileInputRef가 null입니다");
      }
    } catch (error) {
      console.error("파일 선택 다이얼로그 열기 실패:", error);
    }

    // 추가로 카메라 권한 요청 시도 (선택적)
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log("getUserMedia 지원됨, 카메라 권한 요청 시도");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });
        console.log("카메라 권한 획득 성공");
        stream.getTracks().forEach((track) => track.stop());
      } catch (error) {
        console.log("카메라 권한 요청 실패:", error);
      }
    } else {
      console.log("getUserMedia 지원되지 않음");
    }
  };

  // 파일 선택 처리
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("선택된 파일:", file.name);

      // 파일 크기 체크 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        alert("파일 크기는 5MB 이하여야 합니다.");
        return;
      }

      // 이미지 파일인지 체크
      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 선택할 수 있습니다.");
        return;
      }

      // 부모 컴포넌트에 사진 데이터 전달
      if (onCameraPhotoTaken) {
        onCameraPhotoTaken(file);
      }
    }
  };

  return (
    <>
      <BottomSheet
        open={open}
        onClose={onClose}
        height="32rem"
        handleLabel="Trail 목록 닫기"
      >
        <List>
          {items.map((t) => {
            const key = t.id || t.name;
            return (
              <Item
                key={key}
                onClick={() => onSelectTrail(t)}
                style={{ cursor: "pointer" }}
              >
                <div>
                  <Title>{t.name}</Title>
                  <Meta>
                    {t.duration} · {t.distance_km}
                  </Meta>
                </div>

                <HeartBtn
                  aria-label="즐겨찾기"
                  title="즐겨찾기"
                  $active={!!favorites?.[t.name]}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(t.name);
                  }}
                >
                  ♥
                </HeartBtn>
              </Item>
            );
          })}
        </List>
      </BottomSheet>

      {/* 하단 메뉴는 시트와 별개로 항상 표시 */}
      <MenuContainer>
        <MenuInner>
          <MenusubInner1 onClick={onOpenSearch}>
            <img src={Search} alt="돋보기" width={30} height={30} />
            산책하기
          </MenusubInner1>
          <MenuCam onClick={handleCameraClick} style={{ cursor: "pointer" }}>
            <img src={Camera} alt="카메라" width={40} height={40} />
          </MenuCam>
          <MenusubInner2 onClick={isLoggedIn ? onOpenMyAccount : onOpenLogin}>
            <img src={Person} alt="계정" width={40} height={40} />
            {isLoggedIn ? "내 계정" : "로그인"}
          </MenusubInner2>
        </MenuInner>
      </MenuContainer>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />
    </>
  );
}
