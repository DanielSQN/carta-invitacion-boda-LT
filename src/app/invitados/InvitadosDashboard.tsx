"use client";

import { useEffect, useMemo, useState } from "react";
import type { InvitationRecord } from "@/lib/invitations";
import type { RsvpRecord } from "@/lib/rsvp";

type Props = {
  rsvps: RsvpRecord[];
  invitations: InvitationRecord[];
  supabaseConfigured: boolean;
  loadError: string;
};

type StatusFilter = "all" | "yes" | "no";

const norm = (value: string | null | undefined) => (value ?? "").trim().toLowerCase();

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("es-CO", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "America/Bogota",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function downloadCsv(rows: RsvpRecord[]) {
  const header = ["Estado", "Nombres", "Personas", "Para", "Mensaje", "Fecha"];
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;

  const lines = rows.map((r) =>
    [
      r.attending ? "Asiste" : "No asiste",
      r.names.join(" / "),
      r.attending ? String(r.guestCount || r.names.length || 0) : "0",
      r.invitedAs ?? "",
      r.message ?? "",
      formatDate(r.created_at),
    ]
      .map((cell) => escape(String(cell)))
      .join(","),
  );

  const csv = "﻿" + [header.map(escape).join(","), ...lines].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `invitados-boda-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// Celda editable del cupo de asistentes de una invitación. Guarda al salir del
// campo o con Enter; vacío = sin cupo (solo confirma 1 persona).
function CupoCell({ invitation }: { invitation: InvitationRecord }) {
  const initial = invitation.guestsPlanned ? String(invitation.guestsPlanned) : "";
  const [value, setValue] = useState(initial);
  const [savedValue, setSavedValue] = useState(initial);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const save = async () => {
    const trimmed = value.trim();

    if (trimmed === savedValue) {
      return;
    }

    setState("saving");

    try {
      const response = await fetch("/api/invitados/invitaciones", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: invitation.id, guestsPlanned: trimmed === "" ? null : Number(trimmed) }),
      });

      if (!response.ok) {
        throw new Error("save failed");
      }

      setSavedValue(trimmed);
      setState("saved");
      setTimeout(() => setState((current) => (current === "saved" ? "idle" : current)), 1400);
    } catch {
      setValue(savedValue);
      setState("error");
      setTimeout(() => setState((current) => (current === "error" ? "idle" : current)), 2000);
    }
  };

  return (
    <span className="dash-cupo">
      <input
        type="number"
        className="dash-cupo-input"
        min={1}
        max={12}
        placeholder="—"
        value={value}
        disabled={state === "saving"}
        onChange={(event) => setValue(event.target.value)}
        onBlur={save}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }
        }}
        aria-label={`Cupo de asistentes de ${invitation.label}`}
      />
      {state === "saved" ? <span className="dash-cupo-state dash-cupo-state--ok">✓</span> : null}
      {state === "error" ? <span className="dash-cupo-state dash-cupo-state--error">no se guardó</span> : null}
    </span>
  );
}

export default function InvitadosDashboard({ rsvps, invitations, supabaseConfigured, loadError }: Props) {
  const [tab, setTab] = useState<"respuestas" | "invitaciones">("invitaciones");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [importText, setImportText] = useState("");
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  // Invitación pendiente de confirmar su eliminación (modal de seguridad).
  const [pendingDelete, setPendingDelete] = useState<InvitationRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!pendingDelete) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPendingDelete(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pendingDelete]);

  const stats = useMemo(() => {
    const yes = rsvps.filter((r) => r.attending);
    const no = rsvps.filter((r) => !r.attending);
    const people = yes.reduce((total, r) => total + (r.guestCount || r.names.length || 0), 0);
    return { total: rsvps.length, yes: yes.length, no: no.length, people };
  }, [rsvps]);

  const filteredRsvps = useMemo(() => {
    const q = norm(search);
    return rsvps.filter((r) => {
      if (statusFilter === "yes" && !r.attending) return false;
      if (statusFilter === "no" && r.attending) return false;
      if (!q) return true;
      return (
        r.names.some((name) => norm(name).includes(q)) ||
        norm(r.invitedAs).includes(q) ||
        norm(r.message).includes(q)
      );
    });
  }, [rsvps, statusFilter, search]);

  // Cruce invitaciones ↔ respuestas (por label / invited_as).
  const latestByLabel = useMemo(() => {
    const map = new Map<string, RsvpRecord>();
    // rsvps llega ordenado desc por created_at: el primero de cada label es el último.
    for (const r of rsvps) {
      const key = norm(r.invitedAs);
      if (key && !map.has(key)) {
        map.set(key, r);
      }
    }
    return map;
  }, [rsvps]);

  const invitationRows = useMemo(
    () =>
      invitations.map((inv) => {
        const response = latestByLabel.get(norm(inv.label));
        const status: "pending" | "yes" | "no" = !response ? "pending" : response.attending ? "yes" : "no";
        return { inv, response, status };
      }),
    [invitations, latestByLabel],
  );

  const invStats = useMemo(() => {
    const responded = invitationRows.filter((row) => row.status !== "pending").length;
    return { total: invitations.length, responded, pending: invitations.length - responded };
  }, [invitationRows, invitations.length]);

  const selectStat = (filter: StatusFilter) => {
    setStatusFilter(filter);
    setTab("respuestas");
  };

  const handleImport = async () => {
    setImporting(true);
    setImportMsg("");
    try {
      const response = await fetch("/api/invitados/invitaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: importText }),
      });
      const data = await response.json();
      if (response.ok) {
        setImportText("");
        setImportMsg(`${data.count} invitación(es) guardada(s).`);
        setTimeout(() => window.location.reload(), 600);
      } else {
        setImportMsg(data.error || "No se pudo importar.");
      }
    } catch {
      setImportMsg("No se pudo importar.");
    } finally {
      setImporting(false);
    }
  };

  const handleCsvFile = async (file: File | undefined) => {
    if (!file) {
      return;
    }
    const content = await file.text();
    // Primeras dos columnas de cada fila (nombre y cupo opcional), sin
    // comillas; se descarta encabezado obvio.
    const unquote = (value: string) => value.replace(/^["']|["']$/g, "").trim();
    const names = content
      .split(/\r?\n/)
      .map((line) => {
        const [rawLabel, rawCupo] = line.split(/[,;]/);
        const label = unquote(rawLabel ?? "");
        const cupo = unquote(rawCupo ?? "");
        return label && /^\d{1,2}$/.test(cupo) ? `${label}, ${cupo}` : label;
      })
      .filter((name, index) => name && !(index === 0 && /^(nombre|para|invitaci[oó]n|label)s?$/i.test(name)));
    setImportText((current) => (current.trim() ? `${current.trim()}\n${names.join("\n")}` : names.join("\n")));
  };

  const confirmDeleteInvitation = async () => {
    if (!pendingDelete) {
      return;
    }

    setDeleting(true);

    try {
      await fetch("/api/invitados/invitaciones", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: pendingDelete.id }),
      });
      window.location.reload();
    } catch {
      setDeleting(false);
      setPendingDelete(null);
    }
  };

  const copyLink = async (label: string) => {
    const link = `${window.location.origin}/?para=${encodeURIComponent(label)}`;
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      // fallback silencioso
    }
    setCopied(label);
    setTimeout(() => setCopied((current) => (current === label ? null : current)), 1600);
  };

  return (
    <div className="dash">
      <header className="dash-top">
        <div>
          <h1>Panel de invitados</h1>
          <p className="dash-subtitle">Confirmaciones y control de invitaciones · Boda Luisa &amp; Jhonnatan</p>
        </div>
        <form action="/api/invitados/logout" method="post">
          <button type="submit" className="dash-logout">
            Cerrar sesión
          </button>
        </form>
      </header>

      {!supabaseConfigured ? (
        <div className="dash-banner dash-banner--warn">
          Supabase no está configurado: define <code>SUPABASE_URL</code> y <code>SUPABASE_SERVICE_ROLE_KEY</code>.
        </div>
      ) : null}
      {loadError ? <div className="dash-banner dash-banner--error">{loadError}</div> : null}

      <section className="dash-stats" aria-label="Resumen">
        <button type="button" className="dash-stat" onClick={() => setTab("invitaciones")}>
          <span className="dash-stat-value">{invitations.length}</span>
          <span className="dash-stat-label">Invitaciones</span>
          <span className="dash-stat-hint">A las que enviaste el link</span>
        </button>
        <button
          type="button"
          className={`dash-stat dash-stat--yes${statusFilter === "yes" && tab === "respuestas" ? " is-active" : ""}`}
          onClick={() => selectStat("yes")}
        >
          <span className="dash-stat-value">{stats.yes}</span>
          <span className="dash-stat-label">Dicen que sí</span>
          <span className="dash-stat-hint">Confirmaron asistencia</span>
        </button>
        <button
          type="button"
          className={`dash-stat dash-stat--no${statusFilter === "no" && tab === "respuestas" ? " is-active" : ""}`}
          onClick={() => selectStat("no")}
        >
          <span className="dash-stat-value">{stats.no}</span>
          <span className="dash-stat-label">Dicen que no</span>
          <span className="dash-stat-hint">No podrán asistir</span>
        </button>
        <div className="dash-stat dash-stat--people">
          <span className="dash-stat-value">{stats.people}</span>
          <span className="dash-stat-label">Total de asistentes</span>
          <span className="dash-stat-hint">Personas que irán</span>
        </div>
      </section>

      <nav className="dash-tabs">
        <button type="button" className={tab === "invitaciones" ? "is-active" : ""} onClick={() => setTab("invitaciones")}>
          Invitaciones <span className="dash-tab-count">{invitations.length}</span>
        </button>
        <button type="button" className={tab === "respuestas" ? "is-active" : ""} onClick={() => setTab("respuestas")}>
          Respuestas <span className="dash-tab-count">{rsvps.length}</span>
        </button>
      </nav>

      {tab === "respuestas" ? (
        <section>
          <div className="dash-toolbar">
            <input
              type="search"
              className="dash-search"
              placeholder="Buscar por nombre, invitación o mensaje…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <div className="dash-segment" role="group" aria-label="Filtrar por estado">
              <button type="button" className={statusFilter === "all" ? "is-active" : ""} onClick={() => setStatusFilter("all")}>
                Todas
              </button>
              <button type="button" className={statusFilter === "yes" ? "is-active" : ""} onClick={() => setStatusFilter("yes")}>
                Asisten
              </button>
              <button type="button" className={statusFilter === "no" ? "is-active" : ""} onClick={() => setStatusFilter("no")}>
                No asisten
              </button>
            </div>
            <button
              type="button"
              className="dash-export"
              onClick={() => downloadCsv(filteredRsvps)}
              disabled={filteredRsvps.length === 0}
            >
              Exportar CSV
            </button>
          </div>

          {filteredRsvps.length === 0 ? (
            <p className="dash-empty">No hay respuestas para este filtro.</p>
          ) : (
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Estado</th>
                    <th>Nombres</th>
                    <th>Pers.</th>
                    <th>Para (invitación)</th>
                    <th>Mensaje</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRsvps.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <span className={`dash-badge${r.attending ? " dash-badge--yes" : " dash-badge--no"}`}>
                          {r.attending ? "Asiste" : "No asiste"}
                        </span>
                      </td>
                      <td className="dash-td-names">{r.names.join(", ")}</td>
                      <td>{r.attending ? r.guestCount || r.names.length : "—"}</td>
                      <td>{r.invitedAs || <span className="dash-muted">—</span>}</td>
                      <td className="dash-td-message">{r.message || <span className="dash-muted">—</span>}</td>
                      <td className="dash-td-date">{formatDate(r.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : (
        <section>
          <div className="dash-import">
            <h2>Importar invitaciones</h2>
            <p>
              Sube un <strong>CSV</strong> con los nombres tal cual van en el <code>?para=</code> (un nombre por fila,
              primera columna). La segunda columna es el <strong>cupo</strong> de asistentes de esa invitación
              (opcional; sin cupo solo confirma 1 persona). También puedes pegarlos abajo, uno por línea. Reimportar un
              nombre existente sin cupo no borra el cupo que ya tenga.
            </p>
            <label className="dash-csv">
              <input type="file" accept=".csv,text/csv" onChange={(event) => handleCsvFile(event.target.files?.[0])} />
              <span>Subir CSV</span>
            </label>
            <textarea
              className="dash-import-text"
              rows={4}
              placeholder={"Familia Pérez, 4\nLaura Gómez\nTíos Restrepo, 2"}
              value={importText}
              onChange={(event) => setImportText(event.target.value)}
            />
            <div className="dash-import-actions">
              <button type="button" className="dash-export" onClick={handleImport} disabled={importing || !importText.trim()}>
                {importing ? "Importando…" : "Importar"}
              </button>
              {importMsg ? <span className="dash-import-msg">{importMsg}</span> : null}
            </div>
          </div>

          <div className="dash-inv-summary">
            <span>
              <strong>{invStats.total}</strong> invitaciones
            </span>
            <span className="dash-muted">·</span>
            <span>
              <strong>{invStats.responded}</strong> respondieron
            </span>
            <span className="dash-muted">·</span>
            <span>
              <strong>{invStats.pending}</strong> pendientes
            </span>
          </div>

          {invitations.length === 0 ? (
            <p className="dash-empty">Aún no has importado invitaciones. Agrégalas arriba para llevar el control de a quién enviaste el link.</p>
          ) : (
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Para (invitación)</th>
                    <th>Cupo</th>
                    <th>Estado</th>
                    <th>Respondió</th>
                    <th>Link</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {invitationRows.map(({ inv, response, status }) => (
                    <tr key={inv.id}>
                      <td className="dash-td-names">{inv.label}</td>
                      <td>
                        <CupoCell invitation={inv} />
                      </td>
                      <td>
                        <span
                          className={`dash-badge${
                            status === "yes" ? " dash-badge--yes" : status === "no" ? " dash-badge--no" : " dash-badge--pending"
                          }`}
                        >
                          {status === "yes" ? "Confirmó" : status === "no" ? "Declinó" : "Pendiente"}
                        </span>
                      </td>
                      <td>{response && response.attending ? `${response.guestCount} pers.` : <span className="dash-muted">—</span>}</td>
                      <td>
                        <button type="button" className="dash-link-btn" onClick={() => copyLink(inv.label)}>
                          {copied === inv.label ? "¡Copiado!" : "Copiar link"}
                        </button>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="dash-del-btn"
                          onClick={() => setPendingDelete(inv)}
                          aria-label={`Eliminar ${inv.label}`}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {pendingDelete ? (
        <div
          className="dash-modal-backdrop"
          role="presentation"
          onClick={() => (deleting ? null : setPendingDelete(null))}
        >
          <div
            className="dash-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dash-delete-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="dash-delete-title">¿Eliminar esta invitación?</h3>
            <p>
              Vas a eliminar <strong>{pendingDelete.label}</strong> de la lista. Perderás el seguimiento de si
              responde o no (su link seguirá abriendo la invitación y, si ya respondió, su respuesta seguirá en la
              pestaña &ldquo;Respuestas&rdquo;).
            </p>
            <div className="dash-modal-actions">
              <button type="button" className="dash-modal-cancel" onClick={() => setPendingDelete(null)} disabled={deleting}>
                Cancelar
              </button>
              <button type="button" className="dash-modal-delete" onClick={confirmDeleteInvitation} disabled={deleting}>
                {deleting ? "Eliminando…" : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
