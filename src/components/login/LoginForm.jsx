import { useState } from "react";
import { InputField }    from "../ui/InputField";
import { PrimaryButton } from "../ui/PrimaryButton";

export function LoginForm({ onSubmit, loading,errorGlobal }) {
  const [usuario,   setUsuario]   = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error,     setError]     = useState("");

  const handleClick = () => {
    setError("");
    if (!usuario || !contrasena) {
      setError("Por favor completa todos los campos.");
      return;
    }
    onSubmit(usuario, contrasena);
  };

  return (
    <div className="flex flex-col gap-6">
      <InputField
        id="usuario"
        label="Usuario"
        type="text"
        placeholder="nombre de usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
      />
      <InputField
        id="contrasena"
        label="Contraseña"
        type="password"
        placeholder="••••••••••"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
      />
      {(error || errorGlobal) && (
        <p className="text-sm text-red-500 -mt-3">{error || errorGlobal}</p>
      )}
      <PrimaryButton
        onClick={handleClick}
        loading={loading}
        label="Ingresar"
        loadingLabel="Ingresando..."
      />
    </div>
  );
}