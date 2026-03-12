import { useState } from "react";
import { LoginForm } from "../components/login/LoginForm";
import { LoginLogo } from "../components/login/LoginLogo";
import { COLORS } from "../constants/colors";

export default function LoginPage({ onLogin }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => onLogin();

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: COLORS.loginPageBg }} // ← era pageBg
    >
      <div className="flex w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden">
        <div
          className="w-2/3 px-10 py-12 flex flex-col justify-center"
          style={{ backgroundColor: COLORS.loginFormBg }} // ← era formBg
        >
          <LoginForm onSubmit={handleSubmit} loading={loading} />
        </div>
        <LoginLogo />
      </div>
    </div>
  );
}
