import styled from "styled-components";

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: center;
  background-color: #f1ebdf;
  position: relative;
`;
export const IDInput = styled.input`
  width: 361px;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0 10px;

  @media (max-width: 768px) {
    width: 70vw;
  }
`;

export const PWInput = styled.input`
  width: 361px;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0 10px;
  @media (max-width: 768px) {
    width: 70vw;
  }
`;

export const LoginButton = styled.button`
  width: 100px;
  height: 40px;
  border: 1px solid #3a7252;
  background-color: #3a7252;
  color: white;
  border-radius: 10px;
  font-weight: 600;
  font-size: 16px;
`;

export const SignupButton = styled.button`
  font-weight: 600;
  border: none;
  background-color: transparent;
`;

export const ButtonsDiv = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
`;
