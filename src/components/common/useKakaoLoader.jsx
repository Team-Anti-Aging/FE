//useKakaoLoader.jsx
import { useEffect } from 'react';
import { useKakaoLoader as useLoader } from 'react-kakao-maps-sdk';

export default function useKakaoLoader() {
    const [loading, error] = useLoader({
        appkey: import.meta.env.VITE_APP_KAKAO_API,
        libraries: ['services', 'clusterer'],
    });

    useEffect(() => {
        if (error) {
            console.error('Kakao Map 로딩 중 오류:', error);
        }
    }, [error]);

    return loading;
}
