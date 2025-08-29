// ReportPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomSheet from '../common/BottomSheet/BottomSheet';
import {
    Header,
    BackButton,
    TitleSection,
    Title,
    Meta,
    Spacer,
    Section,
    SectionTitle,
    Description,
    ActionButton,
    ReportSection,
    ReportBTN,
    Whole,
    RemoveButton,
    ICONDIV,
} from './TrailDetailSheet.styled';
import styled from 'styled-components';
import Location from '../../assets/location.png';
import Camera from '../../assets/camera.svg';
import { ALL_TRAILS } from './TrailData.js';
import { getDetailPanelHeight } from '../../utils/screenUtils';

const BASEURL = '/api'; // 프록시를 통해 요청

const MyLocation = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // align-items: center;
    padding: 12px 0;
    font-size: 14px;
    color: #374151;

    span {
        color: #6b7280;
        font-size: 12px;
    }
`;

const ImagePreview = styled.div`
    width: 100%;
    max-width: 150px;
    height: 100px;
    border: 2px dashed #ddd;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px 0;
    overflow: hidden;
    position: relative;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const AIBtn = styled.button`
    background-color: #0068b7;
    color: white;
    border-radius: 50px;
    padding: 12px;
    width: 60%;
    display: flex;
    align-self: center;
    justify-content: center;
    align-items: center;
    height: 40px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
`;
const AiSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    border-radius: 12px;
    border: solid 1px black;
    padding: 0.5rem;
`;
const AiInput = styled.input`
    background-color: white;
    border: solid;
    color: black;
    height: 3rem;
    border-radius: 15px;
    padding-left: 0.5rem;
`;

export default function ReportPage({ trail, onClose, onBackToTrailDetail, cameraPhoto }) {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [currentAddress, setCurrentAddress] = useState('위치 정보 가져오는 중...');
    const [locationError, setLocationError] = useState(false); // 위치 오류 상태
    const [isLoadingLocation, setIsLoadingLocation] = useState(false); // 위치 로딩 상태
    const [showSafariGuide, setShowSafariGuide] = useState(false); // Safari 안내 표시 여부
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [reportText, setReportText] = useState('');
    const [reportType, setReportType] = useState('제안');
    const [reportCategory, setReportCategory] = useState('경관 개선'); // 카테고리
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedTrail, setSelectedTrail] = useState(trail); // 선택된 trail
    const [showTrailSelector, setShowTrailSelector] = useState(false); // trail 선택기 표시 여부
    const [isAiSum, setIsAiSum] = useState(false); // AI요약 여부
    const [aiKeyword, setAiKeyword] = useState({});

    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    // 제보 유형이 변경될 때 카테고리 초기화
    useEffect(() => {
        if (reportType === '불편') {
            setReportCategory('안전');
        } else {
            setReportCategory('경관 개선');
        }
    }, [reportType]);

    // 좌표를 주소로 변환하는 함수
    const getAddressFromCoords = (lat, lng) => {
        if (!window.kakao || !window.kakao.maps) {
            console.error('카카오맵 API가 로드되지 않았습니다.');
            return;
        }

        const geocoder = new window.kakao.maps.services.Geocoder();
        const coord = new window.kakao.maps.LatLng(lat, lng);

        geocoder.coord2Address(coord.getLng(), coord.getLat(), (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const address = result[0].address.address_name;
                setCurrentAddress(address);
            } else {
                console.error('주소 변환에 실패했습니다:', status);
                setCurrentAddress('주소를 가져올 수 없습니다');
            }
        });
    };

    // 웹 브라우저 기본 API 사용
    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            setIsLoadingLocation(true);
            setLocationError(false);
            setCurrentAddress('위치 정보 가져오는 중...');

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    setCurrentLocation(coords);
                    setLocationError(false);
                    setIsLoadingLocation(false);
                    // 좌표를 주소로 변환
                    getAddressFromCoords(coords.latitude, coords.longitude);
                },
                (error) => {
                    console.error('위치 정보를 가져올 수 없습니다:', error);
                    setCurrentLocation(null);
                    setLocationError(true);
                    setIsLoadingLocation(false);

                    // 오류 유형에 따른 메시지 설정
                    let errorMessage = '위치 정보를 가져올 수 없습니다';
                    let showSafariGuide = false;

                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = '위치 접근 권한이 거부되었습니다';
                            // Safari 감지
                            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
                            if (isSafari) {
                                showSafariGuide = true;
                            }
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = '위치 정보를 사용할 수 없습니다';
                            break;
                        case error.TIMEOUT:
                            errorMessage = '위치 정보 요청 시간이 초과되었습니다';
                            break;
                        default:
                            errorMessage = '위치 정보를 가져올 수 없습니다';
                    }
                    setCurrentAddress(errorMessage);

                    // Safari에서 권한 거부 시 안내 표시
                    if (showSafariGuide) {
                        setCurrentAddress('Safari에서 위치 권한이 거부되었습니다. 설정에서 권한을 허용해주세요.');
                        setShowSafariGuide(true);
                    }
                }
            );
        } else {
            setLocationError(true);
            setCurrentAddress('이 브라우저에서는 위치 정보를 지원하지 않습니다');
        }
    };

    // 사진 첨부하기 버튼 클릭
    const handleImageUpload = () => {
        fileInputRef.current.click();
    };

    // 파일 선택 처리
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            // 파일 크기 체크 (5MB 제한)
            if (file.size > 5 * 1024 * 1024) {
                alert('파일 크기는 5MB 이하여야 합니다.');
                return;
            }

            // 이미지 파일인지 체크
            if (!file.type.startsWith('image/')) {
                alert('이미지 파일만 선택할 수 있습니다.');
                return;
            }
            setSelectedImage(file);

            // 미리보기 생성
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // 이미지 제거
    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // AI요약
    const handleAiSum = async () => {
        const SYSTEM = `
당신은 산책로 민원 데이터를 처리하는 공무원입니다.
아래 “민원 원문”을 분석하여, 지정된 JSON 스키마에 맞춰 결과만 반환하세요.
반드시 유효한 JSON만 출력하세요. 불필요한 텍스트는 출력하지 마세요.
그전에, 함께 보낸 이미지를 분석해서 만약 "민원 원문" 과 이미지가 무관하다면 "잘못된 이미지"를 반환해주세요. 조건은 다음과 같습니다.
1. 이미지가 산책로와 명백히 무관할 때: 실내(집/가게/화장실/교실/사무실 등), 음식·영수증·컴퓨터/휴대폰 스크린샷, 메모·낙서·밈, 순수 셀카·반려동물 클로즈업, 하늘만 찍힘, 초점/노출 불량으로 내용 판별 불가(검은 화면/심한 흔들림 등).
2. 이미지–설명 불일치가 심각할 때: 설명이 산책/보행·시설·환경 문제와 무관한 잡담·광고·일상 멘트(예: “오늘 저녁 라면”)이거나, 이미지와 뚜렷이 모순.

[제약]
1. 만약 민원 원문과 이미지가 무관하다면
    - ai_valid : false
2. 만약 민원 원문과 이미지가 연관이 있다면
    - ai_keyword: 한 단어만.
    - ai_situation: 문제 상황을 적어주고, 없으면 null로
    - ai_demand: 요구사항을 적어주고, 없으면 null로
    - ai_importance: "높음" | "중간" | "낮음" (높음: 안전 관련 / 중간: 불편하지만 긴급하진 않음 / 낮음: 개선되면 좋지만 시급하지 않음)
    - ai_expected_duration: "긴급" | "단기" | "중장기" (처리 소요시간)
    - ai_solution: 실행 가능한 조치 1문장만.
`;

        try {
            // 로컬 스토리지에서 토큰 가져오기
            const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

            if (!token) {
                alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
                setIsSubmitting(false);
                navigate('/login');
                return;
            }
            // 이미지가 있으면 멀티모달 형식으로 보냄 (imagePreview는 이미 Data URL)
            const userContent =
                selectedImage && imagePreview
                    ? [
                          { type: 'text', text: reportText || '' },
                          { type: 'image_url', image_url: { url: imagePreview } },
                      ]
                    : reportText;

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${import.meta.env.VITE_APP_GPT_API}`,
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    temperature: 0.1,
                    response_format: { type: 'json_object' },
                    messages: [
                        { role: 'system', content: SYSTEM },
                        { role: 'user', content: userContent },
                    ],
                }),
            });
            console.log(response);
            const data = await response.json();
            const content = data?.choices?.[0]?.message?.content ?? ''; // AI 반환
            const ai = JSON.parse(content); // object
            console.log('ai요약', ai);
            if (!ai.ai_valid) {
                alert('민원 문구와 일치하지 않는 이미지입니다.');
                setAiKeyword({});
                handleRemoveImage();
                setIsAiSum(false);
            } else {
                setAiKeyword(ai);
                setIsAiSum(true);
            }
        } catch (e) {
            console.error(e);
        }
    };

    // 민원 제보하기
    const handleSubmitReport = async () => {
        // 입력 검증
        if (!reportText.trim()) {
            alert('제보 내용을 입력해주세요.');
            return;
        }

        if (!currentLocation) {
            alert("위치 정보가 필요합니다. '위치 허용 다시 요청' 버튼을 눌러 위치 정보를 허용해주세요.");
            return;
        }

        setIsSubmitting(true);

        try {
            // 로컬 스토리지에서 토큰 가져오기
            const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

            console.log('토큰 존재 여부:', !!token);
            console.log('토큰 값:', token ? token.substring(0, 20) + '...' : '없음');

            if (!token) {
                alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
                setIsSubmitting(false);
                navigate('/login');
                return;
            }

            // FormData를 사용하여 이미지 파일과 함께 전송
            const formData = new FormData();
            formData.append('walktrail', selectedTrail.name);
            formData.append('location', currentAddress);
            formData.append('type', reportType);
            formData.append('category', reportCategory);
            formData.append('latitude', currentLocation.latitude);
            formData.append('longitude', currentLocation.longitude);
            formData.append('feedback_content', reportText.trim());
            formData.append('ai_keyword', aiKeyword);

            // 이미지 파일이 있으면 추가
            if (selectedImage) {
                formData.append('feedback_image', selectedImage);
            }

            console.log('전송할 데이터:', {
                walktrail: selectedTrail.name,
                location: currentAddress,
                type: reportType,
                category: reportCategory,
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                feedback_content: reportText.trim(),
                hasImage: !!selectedImage,
                imageName: selectedImage?.name,
            });

            const response = await fetch(`${BASEURL}/feedback/upload/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    // Content-Type은 FormData가 자동으로 설정하므로 제거
                },
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                alert('민원이 성공적으로 제보되었습니다!');
                // 성공 후 초기화
                setReportText('');
                setSelectedImage(null);
                setImagePreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                // Trail 상세정보로 돌아가기
                onBackToTrailDetail();
            } else if (response.status === 401) {
                alert('로그인이 필요합니다. 로그인 후 다시 시도해주세요.');
                navigate('/login');
                console.error('인증 오류:', response.status, response.statusText);
            } else {
                const errorData = await response.json().catch(() => ({}));
                alert(`민원 제보에 실패했습니다: ${errorData.message || '알 수 없는 오류'}`);
                console.error('API 오류:', response.status, errorData);
            }
        } catch (error) {
            console.error('민원 제보 중 오류 발생:', error);
            alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 컴포넌트 마운트 시에만 위치 정보 가져오기
    useEffect(() => {
        getCurrentLocation();
    }, []);

    // 카메라로 찍은 사진이 있으면 자동으로 설정
    useEffect(() => {
        if (cameraPhoto) {
            setSelectedImage(cameraPhoto);

            // 미리보기 생성
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(cameraPhoto);

            // 카메라로 찍은 사진이 있으면 trail 선택기 표시
            setShowTrailSelector(true);
        }
    }, [cameraPhoto]);

    return (
        <BottomSheet
            open={true}
            onClose={onBackToTrailDetail}
            height={getDetailPanelHeight()}
            handleLabel="산책로 상세정보로 돌아가기"
        >
            <Whole>
                <Header>
                    <BackButton onClick={onBackToTrailDetail} aria-label="산책로 상세정보로 돌아가기">
                        ←
                    </BackButton>
                    <TitleSection>
                        <Title>민원 신청하기</Title>
                    </TitleSection>
                    <Spacer />
                </Header>

                <Section>
                    <SectionTitle>
                        {showTrailSelector ? '산책로 선택' : `현재 산책로 - ${selectedTrail.name}`}
                    </SectionTitle>
                    {showTrailSelector && (
                        <div style={{ marginTop: '10px' }}>
                            <div
                                style={{
                                    fontSize: '14px',
                                    color: '#666',
                                    marginBottom: '10px',
                                }}
                            >
                                사진을 찍은 산책로를 선택해주세요:
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {ALL_TRAILS.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => {
                                            setSelectedTrail(t);
                                            setShowTrailSelector(false);
                                        }}
                                        style={{
                                            padding: '12px',
                                            border: '1px solid #ddd',
                                            borderRadius: '8px',
                                            background: selectedTrail.id === t.id ? '#0068B7' : 'white',
                                            color: selectedTrail.id === t.id ? 'white' : '#333',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                        }}
                                    >
                                        <div style={{ fontWeight: 'bold' }}>{t.name}</div>
                                        <div style={{ fontSize: '12px', opacity: 0.8 }}>
                                            {t.duration} · {t.distance_km}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {!showTrailSelector && cameraPhoto && (
                        <button
                            onClick={() => setShowTrailSelector(true)}
                            style={{
                                marginTop: '10px',
                                padding: '8px 16px',
                                border: '1px solid #0068B7',
                                borderRadius: '20px',
                                background: 'white',
                                color: '#0068B7',
                                cursor: 'pointer',
                                fontSize: '14px',
                            }}
                        >
                            산책로 변경하기
                        </button>
                    )}
                </Section>

                <ReportSection>
                    <img src={Location} alt="Location" style={{ width: 'min-content', height: 'min-content' }} />
                    <MyLocation>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'gray' }}>현재 나의 위치</span>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: 'black' }}>
                            {currentAddress.includes('Safari에서 위치 권한이 거부되었습니다') ? (
                                <span style={{ fontSize: '14px', color: '#666' }}>{currentAddress}</span>
                            ) : (
                                currentAddress
                            )}
                        </span>
                        {isLoadingLocation && (
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    marginTop: '5px',
                                    fontSize: '12px',
                                    color: '#666',
                                }}
                            >
                                <div
                                    style={{
                                        width: '12px',
                                        height: '12px',
                                        border: '2px solid #f3f3f3',
                                        borderTop: '2px solid #3498db',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite',
                                    }}
                                ></div>
                                위치 정보 가져오는 중...
                            </div>
                        )}
                        {locationError && (
                            <div style={{ marginTop: '10px' }}>
                                <button
                                    onClick={getCurrentLocation}
                                    style={{
                                        padding: '4px 8px',
                                        border: '1px solid #0068B7',
                                        borderRadius: '20px',
                                        background: '#0068B7',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        marginBottom: '8px',
                                    }}
                                >
                                    📍 위치 허용 다시 요청
                                </button>

                                {/* Safari 안내 */}
                                {showSafariGuide && (
                                    <div
                                        style={{
                                            fontSize: '12px',
                                            color: '#666',
                                            lineHeight: '1.4',
                                            padding: '10px',
                                            background: '#f8f9fa',
                                            borderRadius: '8px',
                                            border: '1px solid #e9ecef',
                                        }}
                                    >
                                        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                            📱 Safari 위치 권한 설정 방법:
                                        </div>
                                        <div style={{ fontSize: '11px' }}>
                                            1. 설정 앱 → Safari → 위치 서비스 → 허용
                                            <br />
                                            2. 또는 설정 앱 → 개인정보 보호 → 위치 서비스 → Safari → 사용 중에 허용
                                        </div>
                                    </div>
                                )}

                                {/* 일반적인 안내 */}
                                <div
                                    style={{
                                        fontSize: '12px',
                                        color: '#666',
                                        marginTop: '5px',
                                        lineHeight: '1.4',
                                    }}
                                >
                                    브라우저에서 위치 접근 권한을 요청합니다. 팝업이 나타나면 "허용"을 선택해주세요.
                                    <br />
                                    계속해서 안된다면 chrome으로 접속해주세요
                                </div>
                            </div>
                        )}
                    </MyLocation>
                </ReportSection>

                <ReportSection
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <SectionTitle style={{ width: '95%', marginTop: '8px' }}>제보 유형</SectionTitle>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                        <button
                            onClick={() => setReportType('제안')}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: '1px solid #ddd',
                                background: reportType === '제안' ? '#0068B7' : 'white',
                                color: reportType === '제안' ? 'white' : '#333',
                                cursor: 'pointer',
                            }}
                        >
                            제안사항
                        </button>
                        <button
                            onClick={() => setReportType('불편')}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: '1px solid #ddd',
                                background: reportType === '불편' ? '#0068B7' : 'white',
                                color: reportType === '불편' ? 'white' : '#333',
                                cursor: 'pointer',
                            }}
                        >
                            불편사항
                        </button>
                    </div>

                    <SectionTitle style={{ width: '95%', marginTop: '8px' }}>카테고리</SectionTitle>
                    <div
                        style={{
                            display: 'flex',
                            gap: '10px',
                            marginBottom: '15px',
                            flexWrap: 'wrap',
                        }}
                    >
                        {reportType === '불편' ? (
                            // 불편 카테고리
                            <>
                                <button
                                    onClick={() => setReportCategory('안전')}
                                    style={{
                                        padding: '5px 18px',
                                        borderRadius: '20px',
                                        fontSize: '14px',
                                        border: '1px solid #ddd',
                                        background: reportCategory === '안전' ? '#0068B7' : 'white',
                                        color: reportCategory === '안전' ? 'white' : '#333',
                                        cursor: 'pointer',
                                    }}
                                >
                                    안전
                                </button>
                                <button
                                    onClick={() => setReportCategory('청결')}
                                    style={{
                                        padding: '5px 18px',
                                        borderRadius: '20px',
                                        fontSize: '14px',
                                        border: '1px solid #ddd',
                                        background: reportCategory === '청결' ? '#0068B7' : 'white',
                                        color: reportCategory === '청결' ? 'white' : '#333',
                                        cursor: 'pointer',
                                    }}
                                >
                                    청결
                                </button>
                                <button
                                    onClick={() => setReportCategory('소음-방해')}
                                    style={{
                                        padding: '5px 18px',
                                        borderRadius: '20px',
                                        fontSize: '14px',
                                        border: '1px solid #ddd',
                                        background: reportCategory === '소음-방해' ? '#0068B7' : 'white',
                                        color: reportCategory === '소음-방해' ? 'white' : '#333',
                                        cursor: 'pointer',
                                    }}
                                >
                                    소음-방해
                                </button>
                                <button
                                    onClick={() => setReportCategory('이동성')}
                                    style={{
                                        padding: '5px 18px',
                                        borderRadius: '20px',
                                        fontSize: '14px',
                                        border: '1px solid #ddd',
                                        background: reportCategory === '이동성' ? '#0068B7' : 'white',
                                        color: reportCategory === '이동성' ? 'white' : '#333',
                                        cursor: 'pointer',
                                    }}
                                >
                                    이동성
                                </button>
                                <button
                                    onClick={() => setReportCategory('기타')}
                                    style={{
                                        padding: '5px 18px',
                                        borderRadius: '20px',
                                        fontSize: '14px',
                                        border: '1px solid #ddd',
                                        background: reportCategory === '기타' ? '#0068B7' : 'white',
                                        color: reportCategory === '기타' ? 'white' : '#333',
                                        cursor: 'pointer',
                                    }}
                                >
                                    기타
                                </button>
                            </>
                        ) : (
                            // 제안 카테고리
                            <>
                                <button
                                    onClick={() => setReportCategory('경관 개선')}
                                    style={{
                                        padding: '5px 18px',
                                        borderRadius: '20px',
                                        fontSize: '14px',
                                        border: '1px solid #ddd',
                                        background: reportCategory === '경관 개선' ? '#0068B7' : 'white',
                                        color: reportCategory === '경관 개선' ? 'white' : '#333',
                                        cursor: 'pointer',
                                    }}
                                >
                                    경관 개선
                                </button>
                                <button
                                    onClick={() => setReportCategory('정보 제공')}
                                    style={{
                                        padding: '5px 18px',
                                        borderRadius: '20px',
                                        fontSize: '14px',
                                        border: '1px solid #ddd',
                                        background: reportCategory === '정보 제공' ? '#0068B7' : 'white',
                                        color: reportCategory === '정보 제공' ? 'white' : '#333',
                                        cursor: 'pointer',
                                    }}
                                >
                                    정보 제공
                                </button>
                                <button
                                    onClick={() => setReportCategory('프로그램/이벤트')}
                                    style={{
                                        padding: '5px 18px',
                                        borderRadius: '20px',
                                        fontSize: '14px',
                                        border: '1px solid #ddd',
                                        background: reportCategory === '프로그램/이벤트' ? '#0068B7' : 'white',
                                        color: reportCategory === '프로그램/이벤트' ? 'white' : '#333',
                                        cursor: 'pointer',
                                    }}
                                >
                                    프로그램/이벤트
                                </button>
                                <button
                                    onClick={() => setReportCategory('편의시설 확충')}
                                    style={{
                                        padding: '5px 18px',
                                        borderRadius: '20px',
                                        fontSize: '14px',
                                        border: '1px solid #ddd',
                                        background: reportCategory === '편의시설 확충' ? '#0068B7' : 'white',
                                        color: reportCategory === '편의시설 확충' ? 'white' : '#333',
                                        cursor: 'pointer',
                                    }}
                                >
                                    편의시설 확충
                                </button>
                                <button
                                    onClick={() => setReportCategory('기타')}
                                    style={{
                                        padding: '5px 18px',
                                        borderRadius: '20px',
                                        fontSize: '14px',
                                        border: '1px solid #ddd',
                                        background: reportCategory === '기타' ? '#0068B7' : 'white',
                                        color: reportCategory === '기타' ? 'white' : '#333',
                                        cursor: 'pointer',
                                    }}
                                >
                                    기타
                                </button>
                            </>
                        )}
                    </div>
                </ReportSection>
                <ReportSection
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <SectionTitle
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            gap: '10px',
                        }}
                    >
                        <ICONDIV>
                            <img src={Camera} alt="Camera" style={{ width: '25px', height: '25px' }} />
                        </ICONDIV>
                        제안 하는 장소의 사진
                    </SectionTitle>

                    {imagePreview ? (
                        <ImagePreview>
                            <img src={imagePreview} alt="미리보기" />
                            <RemoveButton onClick={handleRemoveImage}>×</RemoveButton>
                        </ImagePreview>
                    ) : (
                        <ImagePreview>
                            <div style={{ textAlign: 'center', color: '#999' }}>
                                <div>📷</div>
                                <div style={{ fontSize: '12px', marginTop: '5px' }}>사진을 선택해주세요</div>
                            </div>
                        </ImagePreview>
                    )}

                    <button
                        onClick={handleImageUpload}
                        style={{
                            backgroundColor: '#0068B7',
                            color: 'white',
                            borderRadius: '50px',
                            padding: '12px',
                            width: '60%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex',
                            height: '40px',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        {selectedImage ? '사진 변경하기' : '사진 첨부하기'}
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileSelect}
                    />

                    <SectionTitle style={{ width: '95%', marginTop: '8px' }}>어떠한 점을 제안하시나요?</SectionTitle>
                    <input
                        type="text"
                        placeholder="제보 내용을 입력해주세요"
                        value={reportText}
                        onChange={(e) => setReportText(e.target.value)}
                        style={{
                            width: '90%',
                            height: '40px',
                            padding: '12px',
                            border: '1px solid #8C8C8C',
                            borderRadius: '10px',
                        }}
                    />
                </ReportSection>
                <AIBtn onClick={handleAiSum}>AI 요약</AIBtn>
                {isAiSum ? (
                    <AiSection>
                        <span style={{ color: 'black', fontSize: '1.5rem' }}>AI 요약</span>
                        <br />
                        <span style={{ color: 'black', fontWeight: 'bold' }}>키워드</span>
                        <AiInput value={aiKeyword.ai_keyword ?? ''} onChange={(e) => setAiKeyword(e.target.value)} />
                        <span style={{ color: 'black', fontWeight: 'bold' }}>상황</span>
                        <AiInput value={aiKeyword.ai_situation ?? ''} onChange={(e) => setAiKeyword(e.target.value)} />
                        <span style={{ color: 'black', fontWeight: 'bold' }}>요구사항</span>
                        <AiInput value={aiKeyword.ai_demand ?? ''} onChange={(e) => setAiKeyword(e.target.value)} />
                    </AiSection>
                ) : (
                    <></>
                )}
                {isAiSum && (
                    <ReportBTN
                        onClick={handleSubmitReport}
                        disabled={isSubmitting}
                        style={{
                            opacity: isSubmitting ? 0.6 : 1,
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {isSubmitting ? '제보 중...' : '민원 신청하기'}
                    </ReportBTN>
                )}
            </Whole>
        </BottomSheet>
    );
}
