import { useState } from "react";
import { LoginForm } from "../components/login/LoginForm";
import { LoginLogo } from "../components/login/LoginLogo";
import { COLORS }    from "../constants/colors";
import { loginUsuario } from "../api/authApi";

export default function LoginPage({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = async (usuario, contrasena) => {
    setLoading(true);
    setError("");
    try {
      const data = await loginUsuario(usuario, contrasena);

      if (data.ok) {
        onLogin();
      } else {
        setError(data.message || "Credenciales incorrectas.");
      }
    } catch (err) {
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: COLORS.loginPageBg }}
    >
      <div className="flex w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden">
        <div
          className="w-2/3 px-10 py-12 flex flex-col justify-center"
          style={{ backgroundColor: COLORS.loginFormBg }}
        >
          <LoginForm
            onSubmit={handleSubmit}
            loading={loading}
            errorGlobal={error}
          />
        </div>
        <LoginLogo />
      </div>
    </div>
  );
}