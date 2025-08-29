import styled from 'styled-components';

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 0 4px;
`;

export const BackButton = styled.button`
    background: none;

    font-size: 18px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    color: black;

    &:hover {
        background-color: #f5f5f5;
    }
`;

export const TitleSection = styled.div`
    text-align: center;
    flex: 1;
`;

export const Title = styled.h2`
    margin: 0;
    font-size: 1.2rem;
    font-weight: 700;
    color: #111;
`;

export const Meta = styled.div`
    font-size: 14px;
    color: #6b7280;
    margin-top: 4px;
`;

export const Section = styled.div`
    padding-bottom: 1rem;
`;

export const ReportSection = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    border-radius: 12px;
    border: solid 1px black;
    padding: 0.5rem;
`;

export const SectionTitle = styled.h3`
    font-size: 16px;
    font-weight: 600;
    color: #111;
    margin: 0 0;
`;

export const Description = styled.p`
    font-size: 14px;
    color: #374151;
    line-height: 2rem;
    margin: 0;
`;

export const CheckpointList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

export const CheckpointItem = styled.li`
    display: flex;
    align-items: center;
    padding: 8px 0;
    font-size: 14px;
    color: #374151;
    border-bottom: ${(props) => (props.$isLast ? 'none' : '1px solid #f1f3f5')};
`;

export const CheckpointIcon = styled.span`
    margin-right: 8px;
`;

export const ActionButton = styled.button`
    width: 100%;
    background: #3a7252;
    color: white;
    border: none;
    border-radius: 12px;
    padding: 16px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 16px;

    &:hover {
        background: #2d5a41;
    }
`;

export const Spacer = styled.div`
    width: 36px;
`;
export const ReportBTN = styled.button`
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

    &:hover {
        background: #2d5a41;
    }
`;
export const Whole = styled.div`
    display: flex;
    padding-left: 1rem;
    padding-right: 1rem;
    flex-direction: column;
    gap: 1rem;
    overflow-y: scroll;
    padding-bottom: 10rem;
`;

export const RemoveButton = styled.button`
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const ICONDIV = styled.div`
    background-color: #0068b7;
    border-radius: 50px;
    padding: 12px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
`;
