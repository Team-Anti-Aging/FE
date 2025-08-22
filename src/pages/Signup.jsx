import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginImage from "../assets/LOGO.png";
import {
  IDInput,
  PWInput,
  LoginButton,
  LoginContainer,
  SignupButton,
  ButtonsDiv,
} from "../styles/Login.style";
import styled from "styled-components";

const BASEURL = "/api";

const EmailInput = styled(IDInput)``;
const NicknameInput = styled(IDInput)``;
const ConfirmPasswordInput = styled(PWInput)``;

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
    nickname: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = async () => {
    // 입력 검증
    if (
      !formData.username ||
      !formData.email ||
      !formData.password1 ||
      !formData.password2 ||
      !formData.nickname
    ) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    if (formData.password1 !== formData.password2) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (formData.password1.length < 8) {
      alert("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${BASEURL}/accounts/registration/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("회원가입이 완료되었습니다!");
        navigate("/login");
      } else {
        const errorData = await response.json();
        const errorMessage = Object.values(errorData).flat().join(", ");
        alert(`회원가입 실패: ${errorMessage}`);
      }
    } catch (error) {
      console.error("회원가입 중 오류 발생:", error);
      alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoginContainer>
      <img
        src={LoginImage}
        alt="LoginImage"
        style={{
          width: "200px",
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <IDInput
          name="username"
          placeholder="아이디를 입력하세요"
          value={formData.username}
          onChange={handleInputChange}
        />
        <EmailInput
          name="email"
          type="email"
          placeholder="이메일을 입력하세요"
          value={formData.email}
          onChange={handleInputChange}
        />
        <NicknameInput
          name="nickname"
          placeholder="닉네임을 입력하세요"
          value={formData.nickname}
          onChange={handleInputChange}
        />
        <PWInput
          name="password1"
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={formData.password1}
          onChange={handleInputChange}
        />
        <ConfirmPasswordInput
          name="password2"
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
          value={formData.password2}
          onChange={handleInputChange}
        />
        <ButtonsDiv>
          <SignupButton onClick={() => navigate("/login")}>
            로그인으로
          </SignupButton>
          <LoginButton
            onClick={handleSignup}
            disabled={isSubmitting}
            style={{
              opacity: isSubmitting ? 0.6 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? "가입 중..." : "회원가입"}
          </LoginButton>
        </ButtonsDiv>
      </div>
    </LoginContainer>
  );
}
