// Toggle.jsx
import React, { useState } from 'react';
import { ToggleWrap, ToggleBtn } from './Toggle.styled';

const Toggle = ({ toggle1, toggle2, onToggleChange }) => {
    const [leftActive, setLeftActive] = useState(true);

    const handleToggle = (isLeft) => {
        setLeftActive(isLeft);
        if (onToggleChange) {
            onToggleChange(isLeft ? toggle1 : toggle2);
        }
    };

    return (
        <ToggleWrap role="tablist" aria-label="toggle">
            <ToggleBtn
                $left
                $active={leftActive}
                onClick={() => handleToggle(true)}
                role="tab"
                aria-selected={leftActive}
            >
                {toggle1}
            </ToggleBtn>

            <ToggleBtn $active={!leftActive} onClick={() => handleToggle(false)} role="tab" aria-selected={!leftActive}>
                {toggle2}
            </ToggleBtn>
        </ToggleWrap>
    );
};

export default Toggle;
