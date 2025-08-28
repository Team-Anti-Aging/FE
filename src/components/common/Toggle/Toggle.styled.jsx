import styled from 'styled-components';

export const ToggleWrap = styled.div`
    position: absolute;
    display: flex;
    top: 3rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    overflow: hidden;
`;

export const ToggleBtn = styled.button`
    width: 5.5rem;
    height: 2.5rem;
    border: none;
    cursor: pointer;
    background-color: ${({ $active, $left }) => ($active ? ($left ? '#4789f7' : '#e07373') : '#f0f0f0')};
    color: ${({ $active }) => ($active ? '#fff' : '#333')};

    &:first-child {
        border-radius: 10px 0 0 10px;
    }
    &:last-child {
        border-radius: 0 10px 10px 0;
    }
`;
