// TrailDetail.jsx
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ALL_TRAILS } from '../TrailData';

export default function TrailDetail() {
    const { id } = useParams();
    const { state } = useLocation();
    const trailFromState = state?.trail;

    const trail = trailFromState || ALL_TRAILS.find((t) => String(t.id) === String(id)) || null;

    if (!trail) return <div style={{ padding: 16 }}>코스를 불러오는 중…</div>;

    return (
        <div
            style={{
                padding: 16,
                maxWidth: 600,
                margin: '0 auto',
            }}
        >
            <header
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div>
                    <h1 style={{ margin: 0 }}>{trail.name}</h1>
                    <div style={{ color: '#666', marginTop: 6 }}>
                        ⏱ {trail.duration} · {trail.distance_km}
                    </div>
                </div>
            </header>

            <section style={{ marginTop: 20 }}>
                <h3 style={{ margin: '16px 0 8px' }}>설명</h3>
                <p style={{ color: '#444', lineHeight: 1.5 }}>{trail.description || '설명이 없습니다.'}</p>
            </section>

            <section style={{ marginTop: 16 }}>
                <h3 style={{ margin: '16px 0 8px' }}>루트</h3>
                <p style={{ color: '#444' }}>
                    {(trail.routes ?? [])
                        .map((p) => p.name ?? '')
                        .filter(Boolean)
                        .join(' > ')}
                </p>
            </section>
        </div>
    );
}
