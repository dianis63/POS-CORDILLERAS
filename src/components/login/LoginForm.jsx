import { InputField }    from "../ui/InputField";
import { PrimaryButton } from "../ui/PrimaryButton";

export function LoginForm({ onSubmit, loading }) {
  return (
    <div className="flex flex-col gap-6">
      <InputField
        id="usuario"
        label="Usuario"
        type="text"
        placeholder="nombre de usuario"
      />
      <InputField
        id="contrasena"
        label="Contraseña"
        type="password"
        placeholder="••••••••••"
      />
      <PrimaryButton
        onClick={onSubmit}
        loading={loading}
        label="Ingresar"
        loadingLabel="Ingresando..."
      />
    </div>
  );
}