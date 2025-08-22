import styled, { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
 a {
  text-decoration: none;
 }

 * {
  box-sizing :border-box;
 }
 html,body {
  height: 100%;
  
 }

 input:focus {
  outline:none;
 }

 @keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
 }
`;

export default GlobalStyles;

export const AppWrapper = styled.div`
  width: 100%;
  max-width: 530px;
  min-height: 100vh;
  margin: 0 auto;
  background-color: #fff;
  display: flex;
  flex-direction: column;
`;
