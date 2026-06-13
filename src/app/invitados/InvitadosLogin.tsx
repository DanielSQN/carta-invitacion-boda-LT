"use client";

import { type FormEvent, useState } from "react";

export default function InvitadosLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/invitados/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        window.location.reload();
        return;
      }

      setError("Clave incorrecta");
    } catch {
      setError("No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="invitados-login" onSubmit={handleSubmit}>
      <h1>Panel de invitados</h1>
      <p>Ingresa la clave para ver las confirmaciones.</p>
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Clave"
        autoComplete="current-password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Verificando…" : "Entrar"}
      </button>
      {error ? <span className="invitados-login-error">{error}</span> : null}
    </form>
  );
}
