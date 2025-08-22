// Login.jsx
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
import { apiUrl } from "../lib/api"; // ✅ 추가

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // ← 백엔드가 안 쓰면 지워도 됩니다.
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      alert("아이디와 비밀번호를 입력해주세요."); // 이메일 미필요 시 메시지도 수정
      return;
    }
    setIsSubmitting(true);
    try {
      // 백엔드 요구사항에 맞춰 body 구성
      const loginData = email
        ? { username, email, password } // (이메일도 받는 API라면 유지)
        : { username, password }; // (보통은 이 형태)

      const res = await fetch(apiUrl("/accounts/login/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 쿠키/세션 로그인이면 아래 주석 해제 + 서버 CORS 설정 필요
        // credentials: "include",
        body: JSON.stringify(loginData),
      });

      if (!res.ok) {
        // 응답이 JSON 아닐 수도 있어 대비
        let msg = "로그인 실패";
        try {
          const err = await res.json();
          msg =
            err?.non_field_errors?.[0] ??
            err?.detail ??
            `${msg} (${res.status})`;
        } catch {
          msg = `${msg} (${res.status})`;
        }
        alert(msg);
        return;
      }

      const data = await res.json();
      // 토큰 저장 (API 응답 키 이름에 맞게 조정)
      if (data.access) localStorage.setItem("accessToken", data.access);
      if (data.refresh) localStorage.setItem("refreshToken", data.refresh);

      localStorage.setItem(
        "userInfo",
        JSON.stringify(data.user ?? { username, email, nickname: username })
      );

      alert("로그인 성공!");
      navigate("/");
    } catch (e) {
      console.error(e);
      alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoginContainer>
      <img src={LoginImage} alt="LoginImage" style={{ width: 200 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <IDInput
          placeholder="아이디를 입력하세요"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {/* 이메일을 안 쓰면 이 입력도 제거 가능 */}
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
