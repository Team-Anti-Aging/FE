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
import { useState } from "react";

const BASEURL = "/api";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!username || !email || !password) {
      alert("아이디, 이메일, 비밀번호를 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const loginData = {
        username: username,
        email: email,
        password: password,
      };

      console.log("로그인 요청 데이터:", loginData);

      const response = await fetch(`${BASEURL}/accounts/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      console.log("응답 상태:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("로그인 성공 데이터:", data);
        // 토큰을 로컬 스토리지에 저장
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);

        // 사용자 정보도 저장
        if (data.user) {
          localStorage.setItem("userInfo", JSON.stringify(data.user));
        } else {
          // API에서 user 정보가 없는 경우 입력한 정보를 저장
          localStorage.setItem(
            "userInfo",
            JSON.stringify({
              username: username,
              email: email,
              nickname: username, // 임시로 username을 nickname으로 사용
            })
          );
        }

        alert("로그인 성공!");
        navigate("/"); // 홈으로 이동
      } else {
        const errorData = await response.json();
        console.error("로그인 실패 응답:", errorData);

        // non_field_errors가 있는 경우 해당 메시지 표시
        let errorMessage = "아이디 또는 비밀번호가 올바르지 않습니다.";
        if (
          errorData.non_field_errors &&
          errorData.non_field_errors.length > 0
        ) {
          errorMessage = errorData.non_field_errors[0];
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        }

        alert(`로그인 실패: ${errorMessage}`);
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
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
          placeholder="아이디를 입력하세요"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <IDInput
          type="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PWInput
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <ButtonsDiv>
          <SignupButton onClick={() => navigate("/signup")}>
            회원가입
          </SignupButton>
          <LoginButton
            onClick={handleLogin}
            disabled={isSubmitting}
            style={{
              opacity: isSubmitting ? 0.6 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? "로그인 중..." : "로그인"}
          </LoginButton>
        </ButtonsDiv>
      </div>
    </LoginContainer>
  );
}
