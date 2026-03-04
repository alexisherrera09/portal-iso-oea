import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "2-digit", month: "short", year: "numeric"
  });
};

const daysUntil = (iso) => {
  if (!iso) return null;
  return Math.ceil((new Date(iso) - new Date()) / 86400000);
};

const formatSize = (bytes) => {
  if (!bytes) return "—";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
};

const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const downloadBase64 = (base64, nombre) => {
  const a = document.createElement("a");
  a.href = base64;
  a.download = nombre;
  a.click();
};

const exportarTodo = (allData) => {
  const json = JSON.stringify(allData, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `portal_backup_${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

const calcularUsoStorage = () => {
  let total = 0;
  for (let key in localStorage) {
    if (key.startsWith("portal_")) {
      total += localStorage.getItem(key).length * 2;
    }
  }
  return formatSize(total);
};

// ============================================
// TEMA
// ============================================

const THEME = {
  navy: "#0B1F3A",
  navyLight: "#162E52",
  gold: "#C9952A",
  goldLight: "#F0C060",
  cream: "#F7F4EF",
  white: "#FFFFFF",
  textDark: "#0B1F3A",
  textMid: "#4A5568",
  textLight: "#718096",
  border: "#E2DBD0",
  green: "#1A6B45", greenBg: "#EAF4EE",
  amber: "#B45309", amberBg: "#FEF3C7",
  red: "#9B2335", redBg: "#FEE2E2",
  blue: "#1E40AF", blueBg: "#DBEAFE",
  gray: "#6B7280", grayBg: "#F3F4F6",
};

// ============================================
// HOOK useLocalStorage
// ============================================

function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn("localStorage lleno:", e);
    }
  }, [key, value]);

  return [value, setValue];
}

// ============================================
// SEED DATA
// ============================================

const seedData = () => {
  const now = new Date().toISOString();
  const future30 = new Date(Date.now() + 30 * 86400000).toISOString();
  const future60 = new Date(Date.now() + 60 * 86400000).toISOString();
  const past7 = new Date(Date.now() - 7 * 86400000).toISOString();
  const past20 = new Date(Date.now() - 20 * 86400000).toISOString();

  const isoDocs = [
    {
      id: generateId(),
      codigo: "POL-CAL-001",
      titulo: "Política de Calidad",
      descripcion: "Establece el compromiso de la organización con la calidad y la mejora continua del sistema de gestión.",
      version: "v1.0",
      estado: "Vigente",
      categoria: "Calidad",
      responsable: "Dirección General",
      fechaCreacion: now,
      fechaActualizacion: now,
      fechaVigencia: future30,
      etiquetas: ["calidad", "iso", "política"],
      subidoPor: "Admin",
      archivo: null,
      historial: [{ version: "v1.0", fecha: now, autor: "Admin", nota: "Versión inicial" }]
    },
    {
      id: generateId(),
      codigo: "POL-CAL-002",
      titulo: "Política de Mejora Continua",
      descripcion: "Define los lineamientos para la mejora continua de los procesos y servicios.",
      version: "v1.0",
      estado: "Vigente",
      categoria: "Mejora",
      responsable: "Gerencia de Calidad",
      fechaCreacion: now,
      fechaActualizacion: now,
      fechaVigencia: past7,
      etiquetas: ["mejora", "iso", "procesos"],
      subidoPor: "Admin",
      archivo: null,
      historial: [{ version: "v1.0", fecha: now, autor: "Admin", nota: "Versión inicial" }]
    },
    {
      id: generateId(),
      codigo: "POL-CAL-003",
      titulo: "Política de Satisfacción del Cliente",
      descripcion: "Orientada a garantizar la satisfacción y cumplimiento de expectativas de los clientes.",
      version: "v1.0",
      estado: "Vigente",
      categoria: "Cliente",
      responsable: "Dirección Comercial",
      fechaCreacion: now,
      fechaActualizacion: now,
      fechaVigencia: past20,
      etiquetas: ["cliente", "satisfacción", "iso"],
      subidoPor: "Admin",
      archivo: null,
      historial: [{ version: "v1.0", fecha: now, autor: "Admin", nota: "Versión inicial" }]
    },
    {
      id: generateId(),
      codigo: "POL-CAL-004",
      titulo: "Política de Gestión de Riesgos",
      descripcion: "Establece el marco para la identificación, evaluación y gestión de riesgos operativos.",
      version: "v1.0",
      estado: "Vigente",
      categoria: "Riesgos",
      responsable: "Gerencia de Operaciones",
      fechaCreacion: now,
      fechaActualizacion: now,
      fechaVigencia: future60,
      etiquetas: ["riesgos", "gestión", "iso"],
      subidoPor: "Admin",
      archivo: null,
      historial: [{ version: "v1.0", fecha: now, autor: "Admin", nota: "Versión inicial" }]
    },
    {
      id: generateId(),
      codigo: "POL-CAL-005",
      titulo: "Política de Competencia del Personal",
      descripcion: "Define los criterios para asegurar la competencia del personal en sus funciones.",
      version: "v1.0",
      estado: "Vigente",
      categoria: "Recursos Humanos",
      responsable: "Gerencia de RH",
      fechaCreacion: now,
      fechaActualizacion: now,
      fechaVigencia: future30,
      etiquetas: ["personal", "competencia", "iso"],
      subidoPor: "Admin",
      archivo: null,
      historial: [{ version: "v1.0", fecha: now, autor: "Admin", nota: "Versión inicial" }]
    },
    {
      id: generateId(),
      codigo: "POL-CAL-006",
      titulo: "Política de Documentación",
      descripcion: "Establece los lineamientos para el control y gestión de la documentación del sistema.",
      version: "v1.0",
      estado: "Vigente",
      categoria: "Documentación",
      responsable: "Gerencia de Calidad",
      fechaCreacion: now,
      fechaActualizacion: now,
      fechaVigencia: future60,
      etiquetas: ["documentación", "control", "iso"],
      subidoPor: "Admin",
      archivo: null,
      historial: [{ version: "v1.0", fecha: now, autor: "Admin", nota: "Versión inicial" }]
    }
  ];

  const oeaDocs = [
    {
      id: generateId(),
      codigo: "REQ-OEA-001",
      titulo: "Requisito de Seguridad Física",
      descripcion: "Cumplimiento de medidas de seguridad física en instalaciones según RGCE.",
      version: "v1.0",
      estado: "Implementado",
      categoria: "Seguridad",
      responsable: "Gerencia de Seguridad",
      fechaCreacion: now,
      fechaActualizacion: now,
      fechaVigencia: null,
      etiquetas: ["seguridad", "oea", "física"],
      subidoPor: "Admin",
      archivo: null,
      historial: [{ version: "v1.0", fecha: now, autor: "Admin", nota: "Versión inicial" }]
    },
    {
      id: generateId(),
      codigo: "REQ-OEA-002",
      titulo: "Control de Acceso y Personal",
      descripcion: "Procedimientos para el control de acceso de personal y visitantes.",
      version: "v1.0",
      estado: "Implementado",
      categoria: "Control",
      responsable: "Gerencia de Seguridad",
      fechaCreacion: now,
      fechaActualizacion: now,
      fechaVigencia: null,
      etiquetas: ["control", "oea", "acceso"],
      subidoPor: "Admin",
      archivo: null,
      historial: [{ version: "v1.0", fecha: now, autor: "Admin", nota: "Versión inicial" }]
    },
    {
      id: generateId(),
      codigo: "REQ-OEA-003",
      titulo: "Trazabilidad de Mercancías",
      descripcion: "Sistema de trazabilidad para el seguimiento de mercancías en tránsito.",
      version: "v1.0",
      estado: "Implementado",
      categoria: "Trazabilidad",
      responsable: "Gerencia de Operaciones",
      fechaCreacion: now,
      fechaActualizacion: now,
      fechaVigencia: null,
      etiquetas: ["trazabilidad", "oea", "mercancías"],
      subidoPor: "Admin",
      archivo: null,
      historial: [{ version: "v1.0", fecha: now, autor: "Admin", nota: "Versión inicial" }]
    },
    {
      id: generateId(),
      codigo: "REQ-OEA-004",
      titulo: "Gestión de Información Comercial",
      descripcion: "Protección y gestión de información comercial sensible.",
      version: "v1.0",
      estado: "Implementado",
      categoria: "Información",
      responsable: "Gerencia de TI",
      fechaCreacion: now,
      fechaActualizacion: now,
      fechaVigencia: null,
      etiquetas: ["información", "oea", "comercial"],
      subidoPor: "Admin",
      archivo: null,
      historial: [{ version: "v1.0", fecha: now, autor: "Admin", nota: "Versión inicial" }]
    },
    {
      id: generateId(),
      codigo: "REQ-OEA-005",
      titulo: "Capacitación en Seguridad",
      descripcion: "Programa de capacitación continua en seguridad y cumplimiento OEA.",
      version: "v1.0",
      estado: "En revisión",
      categoria: "Capacitación",
      responsable: "Gerencia de RH",
      fechaCreacion: now,
      fechaActualizacion: now,
      fechaVigencia: null,
      etiquetas: ["capacitación", "oea", "seguridad"],
      subidoPor: "Admin",
      archivo: null,
      historial: [{ version: "v1.0", fecha: now, autor: "Admin", nota: "Versión inicial" }]
    },
    {
      id: generateId(),
      codigo: "REQ-OEA-006",
      titulo: "Auditorías Internas OEA",
      descripcion: "Procedimiento para la realización de auditorías internas del programa OEA.",
      version: "v1.0",
      estado: "En revisión",
      categoria: "Auditoría",
      responsable: "Gerencia de Calidad",
      fechaCreacion: now,
      fechaActualizacion: now,
      fechaVigencia: null,
      etiquetas: ["auditoría", "oea", "interna"],
      subidoPor: "Admin",
      archivo: null,
      historial: [{ version: "v1.0", fecha: now, autor: "Admin", nota: "Versión inicial" }]
    }
  ];

  const procDocs = [
    {
      id: generateId(),
      codigo: "PROC-IMP-001",
      titulo: "Procedimiento de Importación",
      descripcion: "Proceso completo para la gestión de operaciones de importación.",
      version: "v1.0",
      estado: "Vigente",
      categoria: "Operaciones",
      responsable: "Gerencia de Operaciones",
      fechaCreacion: now,
      fechaActualizacion: now,
      fechaVigencia: future60,
      etiquetas: ["importación", "procedimiento", "operaciones"],
      subidoPor: "Admin",
      archivo: null,
      historial: [{ version: "v1.0", fecha: now, autor: "Admin", nota: "Versión inicial" }]
    },
    {
      id: generateId(),
      codigo: "PROC-EXP-001",
      titulo: "Procedimiento de Exportación",
      descripcion: "Proceso completo para la gestión de operaciones de exportación.",
      version: "v1.0",
      estado: "Vigente",
      categoria: "Operaciones",
      responsable: "Gerencia de Operaciones",
      fechaCreacion: now,
      fechaActualizacion: now,
      fechaVigencia: future60,
      etiquetas: ["exportación", "procedimiento", "operaciones"],
      subidoPor: "Admin",
      archivo: null,
      historial: [{ version: "v1.0", fecha: now, autor: "Admin", nota: "Versión inicial" }]
    },
    {
      id: generateId(),
      codigo: "PROC-QUE-001",
      titulo: "Procedimiento de Gestión de Quejas",
      descripcion: "Proceso para el registro, análisis y resolución de quejas de clientes.",
      version: "v1.0",
      estado: "Vigente",
      categoria: "Atención",
      responsable: "Gerencia de Atención",
      fechaCreacion: now,
      fechaActualizacion: now,
      fechaVigencia: future60,
      etiquetas: ["quejas", "procedimiento", "cliente"],
      subidoPor: "Admin",
      archivo: null,
      historial: [{ version: "v1.0", fecha: now, autor: "Admin", nota: "Versión inicial" }]
    },
    {
      id: generateId(),
      codigo: "PROC-SEG-001",
      titulo: "Procedimiento de Seguridad",
      descripcion: "Medidas y protocolos de seguridad para instalaciones y operaciones.",
      version: "v1.0",
      estado: "Vigente",
      categoria: "Seguridad",
      responsable: "Gerencia de Seguridad",
      fechaCreacion: now,
      fechaActualizacion: now,
      fechaVigencia: future60,
      etiquetas: ["seguridad", "procedimiento", "protocolos"],
      subidoPor: "Admin",
      archivo: null,
      historial: [{ version: "v1.0", fecha: now, autor: "Admin", nota: "Versión inicial" }]
    }
  ];

  const formatoDocs = Array.from({ length: 10 }, (_, i) => ({
    id: generateId(),
    codigo: `FMT-${String(i + 1).padStart(3, '0')}`,
    titulo: `Formato ${i < 3 ? 'Checklist' : i < 6 ? 'Formulario' : i < 8 ? 'Reporte' : 'Encuesta'} ${i + 1}`,
    descripcion: `Formato tipo ${i < 3 ? 'Checklist' : i < 6 ? 'Formulario' : i < 8 ? 'Reporte' : 'Encuesta'} para uso interno.`,
    version: "v1.0",
    estado: "Vigente",
    categoria: i < 3 ? "Checklist" : i < 6 ? "Formulario" : i < 8 ? "Reporte" : "Encuesta",
    responsable: "Gerencia de Calidad",
    fechaCreacion: now,
    fechaActualizacion: now,
    fechaVigencia: future60,
    etiquetas: [i < 3 ? "checklist" : i < 6 ? "formulario" : i < 8 ? "reporte" : "encuesta", "formato"],
    subidoPor: "Admin",
    archivo: null,
    historial: [{ version: "v1.0", fecha: now, autor: "Admin", nota: "Versión inicial" }]
  }));

  const manualDocs = [
    {
      id: generateId(),
      codigo: "MAN-SIS-001",
      titulo: "Manual del Sistema de Gestión",
      descripcion: "Manual completo del sistema de gestión de calidad ISO 9001.",
      version: "v1.0",
      estado: "Vigente",
      categoria: "Sistema",
      responsable: "Dirección General",
      fechaCreacion: now,
      fechaActualizacion: now,
      fechaVigencia: future60,
      etiquetas: ["manual", "sistema", "iso"],
      subidoPor: "Admin",
      archivo: null,
      historial: [{ version: "v1.0", fecha: now, autor: "Admin", nota: "Versión inicial" }]
    },
    {
      id: generateId(),
      codigo: "MAN-SEG-001",
      titulo: "Manual de Seguridad",
      descripcion: "Manual de seguridad y protocolos de protección.",
      version: "v1.0",
      estado: "Vigente",
      categoria: "Seguridad",
      responsable: "Gerencia de Seguridad",
      fechaCreacion: now,
      fechaActualizacion: now,
      fechaVigencia: future60,
      etiquetas: ["manual", "seguridad", "protocolos"],
      subidoPor: "Admin",
      archivo: null,
      historial: [{ version: "v1.0", fecha: now, autor: "Admin", nota: "Versión inicial" }]
    }
  ];

  const comunicadoDocs = [
    {
      id: generateId(),
      codigo: "COM-001",
      titulo: "Bienvenido al Portal de Gestión",
      descripcion: "Comunicado de bienvenida al nuevo portal de gestión ISO 9001 y OEA.",
      version: "v1.0",
      estado: "Vigente",
      categoria: "General",
      responsable: "Dirección General",
      fechaCreacion: now,
      fechaActualizacion: now,
      fechaVigencia: null,
      etiquetas: ["bienvenida", "comunicado", "general"],
      subidoPor: "Admin",
      archivo: null,
      historial: [{ version: "v1.0", fecha: now, autor: "Admin", nota: "Versión inicial" }]
    }
  ];

  localStorage.setItem("portal_docs_iso", JSON.stringify(isoDocs));
  localStorage.setItem("portal_docs_oea", JSON.stringify(oeaDocs));
  localStorage.setItem("portal_docs_procedimientos", JSON.stringify(procDocs));
  localStorage.setItem("portal_docs_formatos", JSON.stringify(formatoDocs));
  localStorage.setItem("portal_docs_manuales", JSON.stringify(manualDocs));
  localStorage.setItem("portal_docs_comunicados", JSON.stringify(comunicadoDocs));
  localStorage.setItem("portal_seeded", "true");
};

// ============================================
// COMPONENTES REUTILIZABLES
// ============================================

const StatusBadge = ({ estado }) => {
  const colors = {
    "Vigente": { bg: THEME.greenBg, color: THEME.green },
    "En revisión": { bg: THEME.amberBg, color: THEME.amber },
    "Vencido": { bg: THEME.redBg, color: THEME.red },
    "Borrador": { bg: THEME.grayBg, color: THEME.gray },
    "Implementado": { bg: THEME.greenBg, color: THEME.green }
  };
  const style = colors[estado] || colors["Borrador"];
  return (
    <span style={{
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: 500,
      backgroundColor: style.bg,
      color: style.color
    }}>{estado}</span>
  );
};

const TagChip = ({ label, onRemove }) => (
  <span style={{
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    backgroundColor: THEME.blueBg,
    color: THEME.blue,
    marginRight: "6px",
    marginBottom: "6px"
  }}>
    {label}
    {onRemove && (
      <button onClick={onRemove} style={{
        border: "none",
        background: "none",
        cursor: "pointer",
        color: THEME.blue,
        fontSize: "14px",
        padding: 0,
        marginLeft: "4px"
      }}>×</button>
    )}
  </span>
);

const SearchBar = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="portal-input"
    style={{
      width: "100%",
      padding: "10px 16px",
      border: `1px solid ${THEME.border}`,
      borderRadius: "8px",
      fontSize: "14px",
      fontFamily: "'Source Sans 3', sans-serif"
    }}
  />
);

const Modal = ({ isOpen, onClose, title, children, size = "medium" }) => {
  if (!isOpen) return null;
  const width = size === "large" ? "900px" : size === "small" ? "500px" : "700px";
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(11, 31, 58, 0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      animation: "fadeIn 0.2s ease forwards"
    }} onClick={onClose}>
      <div className="scale-in" style={{
        backgroundColor: THEME.white,
        borderRadius: "12px",
        width: width,
        maxWidth: "95%",
        maxHeight: "90vh",
        overflow: "auto",
        boxShadow: "0 20px 60px rgba(11,31,58,0.3)"
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{
          padding: "24px",
          borderBottom: `1px solid ${THEME.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h2 style={{
            margin: 0,
            fontFamily: "'Playfair Display', serif",
            fontSize: "24px",
            fontWeight: 700,
            color: THEME.textDark
          }}>{title}</h2>
          <button onClick={onClose} style={{
            border: "none",
            background: "none",
            fontSize: "24px",
            cursor: "pointer",
            color: THEME.textLight,
            padding: "4px 8px"
          }}>×</button>
        </div>
        <div style={{ padding: "24px" }}>{children}</div>
      </div>
    </div>
  );
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="small">
    <p style={{ marginBottom: "24px", color: THEME.textMid }}>{message}</p>
    <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
      <button onClick={onClose} style={{
        padding: "10px 20px",
        border: `1px solid ${THEME.border}`,
        borderRadius: "8px",
        background: THEME.white,
        color: THEME.textDark,
        cursor: "pointer",
        fontFamily: "'Source Sans 3', sans-serif",
        fontSize: "14px"
      }}>Cancelar</button>
      <button onClick={onConfirm} style={{
        padding: "10px 20px",
        border: "none",
        borderRadius: "8px",
        background: THEME.red,
        color: THEME.white,
        cursor: "pointer",
        fontFamily: "'Source Sans 3', sans-serif",
        fontSize: "14px",
        fontWeight: 500
      }}>Eliminar</button>
    </div>
  </Modal>
);

const Toast = ({ id, message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);
  
  const colors = {
    success: { bg: THEME.green, icon: "✅" },
    error: { bg: THEME.red, icon: "❌" },
    warning: { bg: THEME.amber, icon: "⚠️" }
  };
  const style = colors[type] || colors.success;
  
  return (
    <div className="toast-in" style={{
      backgroundColor: THEME.white,
      padding: "14px 18px",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(11,31,58,0.15)",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      minWidth: "300px",
      borderLeft: `4px solid ${style.bg}`
    }}>
      <span style={{ fontSize: "18px" }}>{style.icon}</span>
      <span style={{ flex: 1, color: THEME.textDark, fontSize: "14px" }}>{message}</span>
      <button onClick={onClose} style={{
        border: "none",
        background: "none",
        cursor: "pointer",
        color: THEME.textLight,
        fontSize: "18px",
        padding: 0
      }}>×</button>
    </div>
  );
};

const ToastContainer = ({ toasts, onClose }) => (
  <div style={{
    position: "fixed",
    bottom: "24px",
    right: "24px",
    zIndex: 2000,
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  }}>
    {toasts.slice(0, 3).map(toast => (
      <Toast key={toast.id} {...toast} onClose={() => onClose(toast.id)} />
    ))}
  </div>
);

const EmptyState = ({ icon, title, subtitle, actionLabel, onAction }) => (
  <div style={{
    textAlign: "center",
    padding: "60px 20px",
    color: THEME.textLight
  }}>
    <div style={{ fontSize: "64px", marginBottom: "16px" }}>{icon}</div>
    <h3 style={{
      fontFamily: "'Playfair Display', serif",
      fontSize: "20px",
      fontWeight: 700,
      color: THEME.textDark,
      marginBottom: "8px"
    }}>{title}</h3>
    <p style={{ marginBottom: "24px", color: THEME.textMid }}>{subtitle}</p>
    {onAction && (
      <button onClick={onAction} style={{
        padding: "12px 24px",
        border: "none",
        borderRadius: "8px",
        background: THEME.navy,
        color: THEME.goldLight,
        cursor: "pointer",
        fontFamily: "'Source Sans 3', sans-serif",
        fontSize: "14px",
        fontWeight: 500
      }}>{actionLabel}</button>
    )}
  </div>
);

const Pagination = ({ total, perPage, current, onChange }) => {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      justifyContent: "center",
      marginTop: "24px"
    }}>
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        style={{
          padding: "8px 12px",
          border: `1px solid ${THEME.border}`,
          borderRadius: "6px",
          background: current === 1 ? THEME.grayBg : THEME.white,
          color: current === 1 ? THEME.textLight : THEME.textDark,
          cursor: current === 1 ? "not-allowed" : "pointer",
          fontSize: "14px"
        }}
      >Anterior</button>
      {Array.from({ length: pages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          onClick={() => onChange(page)}
          style={{
            padding: "8px 12px",
            border: `1px solid ${current === page ? THEME.gold : THEME.border}`,
            borderRadius: "6px",
            background: current === page ? THEME.gold : THEME.white,
            color: current === page ? THEME.white : THEME.textDark,
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: current === page ? 600 : 400
          }}
        >{page}</button>
      ))}
      <button
        onClick={() => onChange(current + 1)}
        disabled={current === pages}
        style={{
          padding: "8px 12px",
          border: `1px solid ${THEME.border}`,
          borderRadius: "6px",
          background: current === pages ? THEME.grayBg : THEME.white,
          color: current === pages ? THEME.textLight : THEME.textDark,
          cursor: current === pages ? "not-allowed" : "pointer",
          fontSize: "14px"
        }}
      >Siguiente</button>
    </div>
  );
};

const FileDropZone = ({ onFile, currentFile, onRemove }) => {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const handleDrop = async (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    await processFile(file);
  };
  
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await processFile(file);
  };
  
  const processFile = async (file) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/png', 
                       'image/jpeg', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      alert("Tipo de archivo no permitido");
      return;
    }
    
    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      setTimeout(() => {
        onFile({
          nombre: file.name,
          tipo: file.type,
          tamano: file.size,
          base64,
          subidoPor: "Usuario",
          fecha: new Date().toISOString()
        });
        setUploading(false);
      }, 800);
    } catch (error) {
      setUploading(false);
      alert("Error al procesar el archivo");
    }
  };
  
  return (
    <div>
      {!currentFile ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={dragging ? "dropzone-active" : ""}
          style={{
            border: `2px dashed ${dragging ? THEME.gold : THEME.border}`,
            borderRadius: "8px",
            padding: "40px",
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: dragging ? THEME.amberBg : THEME.cream,
            transition: "all 0.2s ease"
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept=".pdf,.docx,.xlsx,.png,.jpg,.txt"
            style={{ display: "none" }}
          />
          {uploading ? (
            <div>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
              <div style={{ marginBottom: "8px", color: THEME.textDark }}>Procesando archivo...</div>
              <div style={{
                width: "100%",
                height: "4px",
                backgroundColor: THEME.border,
                borderRadius: "2px",
                overflow: "hidden"
              }}>
                <div style={{
                  width: uploading ? "100%" : "0%",
                  height: "100%",
                  backgroundColor: THEME.gold,
                  transition: "width 0.8s ease"
                }} />
              </div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>📎</div>
              <div style={{ color: THEME.textDark, marginBottom: "4px", fontWeight: 500 }}>
                Arrastra un archivo aquí o haz clic para seleccionar
              </div>
              <div style={{ color: THEME.textLight, fontSize: "12px" }}>
                PDF, DOCX, XLSX, PNG, JPG, TXT (máx. 2MB recomendado)
              </div>
            </>
          )}
        </div>
      ) : (
        <div style={{
          border: `1px solid ${THEME.border}`,
          borderRadius: "8px",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: THEME.cream
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 500, color: THEME.textDark, marginBottom: "4px" }}>
              {currentFile.nombre}
            </div>
            <div style={{ fontSize: "12px", color: THEME.textLight }}>
              {formatSize(currentFile.tamano)} · {currentFile.tipo}
              {currentFile.tamano > 2097152 && (
                <span style={{ color: THEME.amber, marginLeft: "8px" }}>⚠️ Archivo grande</span>
              )}
            </div>
          </div>
          <button onClick={onRemove} style={{
            border: "none",
            background: "none",
            fontSize: "20px",
            cursor: "pointer",
            color: THEME.textLight,
            padding: "4px 8px"
          }}>✕</button>
        </div>
      )}
    </div>
  );
};

const ProgressBar = ({ percent, color }) => (
  <div style={{
    width: "100%",
    height: "4px",
    backgroundColor: THEME.border,
    borderRadius: "2px",
    overflow: "hidden"
  }}>
    <div style={{
      width: `${percent}%`,
      height: "100%",
      backgroundColor: color || THEME.gold,
      transition: "width 0.3s ease"
    }} />
  </div>
);

const StatCard = ({ label, value, vigentes, enRevision, vencidos, color, emoji, onClick }) => (
  <div
    onClick={onClick}
    className="doc-card fade-up"
    style={{
      backgroundColor: THEME.white,
      borderRadius: "12px",
      padding: "20px",
      cursor: onClick ? "pointer" : "default",
      boxShadow: "0 2px 8px rgba(11,31,58,0.08)"
    }}
  >
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
      <span style={{ fontSize: "32px" }}>{emoji}</span>
      <span style={{
        fontSize: "32px",
        fontWeight: 700,
        fontFamily: "'Playfair Display', serif",
        color: color || THEME.navy
      }}>{value}</span>
    </div>
    <div style={{ fontSize: "14px", fontWeight: 600, color: THEME.textDark, marginBottom: "12px" }}>
      {label}
    </div>
    <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: THEME.textLight }}>
      <span>✓ {vigentes}</span>
      <span>⏳ {enRevision}</span>
      <span>⚠ {vencidos}</span>
    </div>
  </div>
);

const DocumentCard = ({ doc, onView, onEdit, onDownload, onDelete }) => (
  <div className="doc-card fade-up" style={{
    backgroundColor: THEME.white,
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(11,31,58,0.08)"
  }}>
    <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", marginBottom: "12px" }}>
      <span style={{
        padding: "4px 10px",
        borderRadius: "6px",
        backgroundColor: THEME.gold,
        color: THEME.white,
        fontSize: "11px",
        fontWeight: 600
      }}>{doc.codigo}</span>
      {doc.archivo && <span style={{ fontSize: "18px" }}>📎</span>}
    </div>
    <h3 style={{
      fontFamily: "'Playfair Display', serif",
      fontSize: "18px",
      fontWeight: 700,
      color: THEME.textDark,
      marginBottom: "8px"
    }}>{doc.titulo}</h3>
    <p style={{
      fontSize: "13px",
      color: THEME.textMid,
      marginBottom: "12px",
      lineHeight: "1.5",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden"
    }}>{doc.descripcion}</p>
    <div style={{ marginBottom: "12px" }}>
      <StatusBadge estado={doc.estado} />
    </div>
    <div style={{ fontSize: "12px", color: THEME.textLight, marginBottom: "12px" }}>
      v{doc.version} · {doc.responsable} · {formatDate(doc.fechaActualizacion)}
    </div>
    {doc.etiquetas && doc.etiquetas.length > 0 && (
      <div style={{ marginBottom: "12px" }}>
        {doc.etiquetas.map((tag, i) => (
          <TagChip key={i} label={tag} />
        ))}
      </div>
    )}
    <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
      <button onClick={onView} style={{
        flex: 1,
        padding: "8px",
        border: `1px solid ${THEME.border}`,
        borderRadius: "6px",
        background: THEME.white,
        color: THEME.textDark,
        cursor: "pointer",
        fontSize: "12px"
      }}>👁 Ver</button>
      <button onClick={onEdit} style={{
        flex: 1,
        padding: "8px",
        border: `1px solid ${THEME.border}`,
        borderRadius: "6px",
        background: THEME.white,
        color: THEME.textDark,
        cursor: "pointer",
        fontSize: "12px"
      }}>✏️ Editar</button>
      {doc.archivo && (
        <button onClick={onDownload} style={{
          padding: "8px",
          border: `1px solid ${THEME.border}`,
          borderRadius: "6px",
          background: THEME.white,
          color: THEME.textDark,
          cursor: "pointer",
          fontSize: "12px"
        }}>📥</button>
      )}
      <button onClick={onDelete} style={{
        padding: "8px",
        border: `1px solid ${THEME.border}`,
        borderRadius: "6px",
        background: THEME.white,
        color: THEME.red,
        cursor: "pointer",
        fontSize: "12px"
      }}>🗑</button>
    </div>
  </div>
);

const DocumentRow = ({ doc, onView, onEdit, onDownload, onDelete }) => (
  <tr className="doc-row" style={{
    backgroundColor: THEME.white,
    borderBottom: `1px solid ${THEME.border}`
  }}>
    <td style={{ padding: "12px" }}>
      <span style={{
        padding: "4px 10px",
        borderRadius: "6px",
        backgroundColor: THEME.gold,
        color: THEME.white,
        fontSize: "11px",
        fontWeight: 600
      }}>{doc.codigo}</span>
    </td>
    <td style={{ padding: "12px" }}>
      <div style={{ fontWeight: 500, color: THEME.textDark, marginBottom: "4px" }}>{doc.titulo}</div>
      <div style={{ fontSize: "12px", color: THEME.textLight }}>{doc.descripcion.substring(0, 60)}...</div>
    </td>
    <td style={{ padding: "12px" }}>
      <StatusBadge estado={doc.estado} />
    </td>
    <td style={{ padding: "12px", fontSize: "12px", color: THEME.textMid }}>{doc.categoria}</td>
    <td style={{ padding: "12px", fontSize: "12px", color: THEME.textLight }}>{doc.version}</td>
    <td style={{ padding: "12px", fontSize: "12px", color: THEME.textLight }}>{formatDate(doc.fechaActualizacion)}</td>
    <td style={{ padding: "12px" }}>
      <div style={{ display: "flex", gap: "6px" }}>
        <button onClick={onView} style={{
          padding: "6px 10px",
          border: `1px solid ${THEME.border}`,
          borderRadius: "6px",
          background: THEME.white,
          color: THEME.textDark,
          cursor: "pointer",
          fontSize: "12px"
        }}>👁</button>
        <button onClick={onEdit} style={{
          padding: "6px 10px",
          border: `1px solid ${THEME.border}`,
          borderRadius: "6px",
          background: THEME.white,
          color: THEME.textDark,
          cursor: "pointer",
          fontSize: "12px"
        }}>✏️</button>
        {doc.archivo && (
          <button onClick={onDownload} style={{
            padding: "6px 10px",
            border: `1px solid ${THEME.border}`,
            borderRadius: "6px",
            background: THEME.white,
            color: THEME.textDark,
            cursor: "pointer",
            fontSize: "12px"
          }}>📥</button>
        )}
        <button onClick={onDelete} style={{
          padding: "6px 10px",
          border: `1px solid ${THEME.border}`,
          borderRadius: "6px",
          background: THEME.white,
          color: THEME.red,
          cursor: "pointer",
          fontSize: "12px"
        }}>🗑</button>
      </div>
    </td>
  </tr>
);

// ============================================
// APLICACIÓN PRINCIPAL
// ============================================

function App() {
  // Estados principales
  const [seccion, setSeccion] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage("portal_sidebar_collapsed", false);
  const [config, setConfig] = useLocalStorage("portal_config", {
    nombreEmpresa: "Agencia Aduanal",
    logo: null,
    tagline: "ISO 9001 · OEA Portal",
    bannerTexto: "Bienvenido al Portal de Gestión",
    colorPrimario: THEME.navy,
    colorAcento: THEME.gold,
    modulos: {
      iso: { activo: true, nombre: "Políticas ISO 9001", emoji: "📋" },
      oea: { activo: true, nombre: "Requisitos OEA", emoji: "🛡️" },
      procedimientos: { activo: true, nombre: "Procedimientos", emoji: "📌" },
      formatos: { activo: true, nombre: "Formatos y Documentos", emoji: "📁" },
      manuales: { activo: true, nombre: "Manuales", emoji: "📚" },
      comunicados: { activo: true, nombre: "Comunicados", emoji: "📢" }
    }
  });
  const [activeUser, setActiveUser] = useLocalStorage("portal_active_user", "Admin");
  const [users, setUsers] = useLocalStorage("portal_users", [
    { nombre: "Admin", rol: "Admin" },
    { nombre: "Editor", rol: "Editor" },
    { nombre: "Lector", rol: "Lector" }
  ]);

  // Estados de documentos
  const [docsISO, setDocsISO] = useLocalStorage("portal_docs_iso", []);
  const [docsOEA, setDocsOEA] = useLocalStorage("portal_docs_oea", []);
  const [docsProcedimientos, setDocsProcedimientos] = useLocalStorage("portal_docs_procedimientos", []);
  const [docsFormatos, setDocsFormatos] = useLocalStorage("portal_docs_formatos", []);
  const [docsManuales, setDocsManuales] = useLocalStorage("portal_docs_manuales", []);
  const [docsComunicados, setDocsComunicados] = useLocalStorage("portal_docs_comunicados", []);

  // Estados de UI
  const [toasts, setToasts] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(null);
  const [docEditando, setDocEditando] = useState(null);
  const [docViendo, setDocViendo] = useState(null);
  const [docEliminando, setDocEliminando] = useState(null);
  const [busquedaGlobal, setBusquedaGlobal] = useState("");
  const [busquedaLocal, setBusquedaLocal] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [vistaLista, setVistaLista] = useState(true);
  const [ordenarPor, setOrdenarPor] = useState("fecha");
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  // Seed data inicial
  useEffect(() => {
    if (!localStorage.getItem("portal_seeded")) {
      seedData();
      addToast("Datos iniciales cargados", "success");
    }
  }, []);

  // Funciones de toast
  const addToast = (message, type = "success") => {
    const id = generateId();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Obtener documentos según sección
  const getDocsActuales = () => {
    switch (seccion) {
      case "iso": return docsISO;
      case "oea": return docsOEA;
      case "procedimientos": return docsProcedimientos;
      case "formatos": return docsFormatos;
      case "manuales": return docsManuales;
      case "comunicados": return docsComunicados;
      default: return [];
    }
  };

  const setDocsActuales = (docs) => {
    switch (seccion) {
      case "iso": setDocsISO(docs); break;
      case "oea": setDocsOEA(docs); break;
      case "procedimientos": setDocsProcedimientos(docs); break;
      case "formatos": setDocsFormatos(docs); break;
      case "manuales": setDocsManuales(docs); break;
      case "comunicados": setDocsComunicados(docs); break;
    }
  };

  // Filtrar y ordenar documentos
  const documentosFiltrados = useMemo(() => {
    let docs = getDocsActuales();
    
    // Buscar
    if (busquedaLocal) {
      const search = busquedaLocal.toLowerCase();
      docs = docs.filter(doc => 
        doc.titulo.toLowerCase().includes(search) ||
        doc.codigo.toLowerCase().includes(search) ||
        doc.descripcion.toLowerCase().includes(search) ||
        (doc.etiquetas && doc.etiquetas.some(tag => tag.toLowerCase().includes(search)))
      );
    }
    
    // Filtrar por estado
    if (filtroEstado) {
      docs = docs.filter(doc => doc.estado === filtroEstado);
    }
    
    // Filtrar por categoría
    if (filtroCategoria) {
      docs = docs.filter(doc => doc.categoria === filtroCategoria);
    }
    
    // Ordenar
    docs.sort((a, b) => {
      switch (ordenarPor) {
        case "codigo": return a.codigo.localeCompare(b.codigo);
        case "titulo": return a.titulo.localeCompare(b.titulo);
        case "estado": return a.estado.localeCompare(b.estado);
        case "fecha":
        default: return new Date(b.fechaActualizacion) - new Date(a.fechaActualizacion);
      }
    });
    
    return docs;
  }, [seccion, busquedaLocal, filtroEstado, filtroCategoria, ordenarPor, docsISO, docsOEA, docsProcedimientos, docsFormatos, docsManuales, docsComunicados]);

  // Paginación
  const documentosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * itemsPorPagina;
    return documentosFiltrados.slice(inicio, inicio + itemsPorPagina);
  }, [documentosFiltrados, paginaActual]);

  // Estadísticas
  const estadisticas = useMemo(() => {
    const modulos = [
      { key: "iso", docs: docsISO, emoji: config.modulos.iso.emoji, nombre: config.modulos.iso.nombre },
      { key: "oea", docs: docsOEA, emoji: config.modulos.oea.emoji, nombre: config.modulos.oea.nombre },
      { key: "procedimientos", docs: docsProcedimientos, emoji: config.modulos.procedimientos.emoji, nombre: config.modulos.procedimientos.nombre },
      { key: "formatos", docs: docsFormatos, emoji: config.modulos.formatos.emoji, nombre: config.modulos.formatos.nombre },
      { key: "manuales", docs: docsManuales, emoji: config.modulos.manuales.emoji, nombre: config.modulos.manuales.nombre },
      { key: "comunicados", docs: docsComunicados, emoji: config.modulos.comunicados.emoji, nombre: config.modulos.comunicados.nombre }
    ];
    
    return modulos.map(mod => {
      const docs = mod.docs;
      return {
        ...mod,
        total: docs.length,
        vigentes: docs.filter(d => d.estado === "Vigente" || d.estado === "Implementado").length,
        enRevision: docs.filter(d => d.estado === "En revisión").length,
        vencidos: docs.filter(d => d.estado === "Vencido").length
      };
    });
  }, [docsISO, docsOEA, docsProcedimientos, docsFormatos, docsManuales, docsComunicados, config]);

  // Documentos próximos a vencer
  const proximosVencer = useMemo(() => {
    const todos = [...docsISO, ...docsOEA, ...docsProcedimientos, ...docsFormatos, ...docsManuales, ...docsComunicados];
    return todos
      .filter(doc => doc.fechaVigencia)
      .map(doc => ({ ...doc, diasRestantes: daysUntil(doc.fechaVigencia) }))
      .filter(doc => doc.diasRestantes !== null && doc.diasRestantes <= 30)
      .sort((a, b) => a.diasRestantes - b.diasRestantes)
      .slice(0, 10);
  }, [docsISO, docsOEA, docsProcedimientos, docsFormatos, docsManuales, docsComunicados]);

  // Últimos documentos
  const ultimosDocs = useMemo(() => {
    const todos = [...docsISO, ...docsOEA, ...docsProcedimientos, ...docsFormatos, ...docsManuales, ...docsComunicados];
    return todos
      .sort((a, b) => new Date(b.fechaActualizacion) - new Date(a.fechaActualizacion))
      .slice(0, 5);
  }, [docsISO, docsOEA, docsProcedimientos, docsFormatos, docsManuales, docsComunicados]);

  // Categorías disponibles
  const categoriasDisponibles = useMemo(() => {
    const docs = getDocsActuales();
    return [...new Set(docs.map(d => d.categoria).filter(Boolean))].sort();
  }, [seccion, docsISO, docsOEA, docsProcedimientos, docsFormatos, docsManuales, docsComunicados]);

  // Manejar guardar documento
  const handleGuardarDoc = (docData) => {
    try {
      const docs = getDocsActuales();
      
      if (docEditando) {
        // Editar
        const index = docs.findIndex(d => d.id === docEditando.id);
        if (index === -1) return;
        
        const docActualizado = {
          ...docEditando,
          ...docData,
          fechaActualizacion: new Date().toISOString(),
          historial: [
            ...docEditando.historial,
            {
              version: docData.version,
              fecha: new Date().toISOString(),
              autor: activeUser,
              nota: docData.notaVersion || "Actualización"
            }
          ]
        };
        
        docs[index] = docActualizado;
        setDocsActuales(docs);
        addToast("Documento actualizado", "success");
      } else {
        // Nuevo
        if (docs.some(d => d.codigo === docData.codigo)) {
          addToast("El código ya existe en este módulo", "error");
          return;
        }
        
        const nuevoDoc = {
          id: generateId(),
          ...docData,
          fechaCreacion: new Date().toISOString(),
          fechaActualizacion: new Date().toISOString(),
          subidoPor: activeUser,
          historial: [{
            version: docData.version,
            fecha: new Date().toISOString(),
            autor: activeUser,
            nota: docData.notaVersion || "Versión inicial"
          }]
        };
        
        setDocsActuales([...docs, nuevoDoc]);
        addToast("Documento creado", "success");
      }
      
      setModalAbierto(null);
      setDocEditando(null);
      setPaginaActual(1);
    } catch (e) {
      addToast("Error al guardar. Almacenamiento lleno.", "warning");
    }
  };

  // Manejar eliminar documento
  const handleEliminarDoc = () => {
    if (!docEliminando) return;
    const docs = getDocsActuales();
    setDocsActuales(docs.filter(d => d.id !== docEliminando.id));
    addToast("Documento eliminado", "success");
    setDocEliminando(null);
  };

  // Renderizar Sidebar
  const renderSidebar = () => {
    const width = sidebarCollapsed ? "80px" : "280px";
    const modulosActivos = estadisticas.filter(s => config.modulos[s.key]?.activo);
    
    return (
      <div className="sidebar" style={{
        width,
        backgroundColor: config.colorPrimario,
        color: THEME.white,
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        display: "flex",
        flexDirection: "column",
        transition: "width 0.25s ease",
        zIndex: 100
      }}>
        {/* Logo y nombre */}
        <div style={{ padding: "24px", textAlign: "center", borderBottom: `1px solid ${config.colorAcento}33` }}>
          {config.logo ? (
            <img src={config.logo} alt="Logo" style={{
              width: sidebarCollapsed ? "40px" : "60px",
              height: sidebarCollapsed ? "40px" : "60px",
              borderRadius: "50%",
              marginBottom: sidebarCollapsed ? 0 : "12px",
              objectFit: "cover"
            }} />
          ) : (
            <div style={{
              width: sidebarCollapsed ? "40px" : "60px",
              height: sidebarCollapsed ? "40px" : "60px",
              borderRadius: "50%",
              backgroundColor: config.colorAcento,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: sidebarCollapsed ? "0 auto" : "0 auto 12px",
              fontSize: sidebarCollapsed ? "18px" : "24px",
              fontWeight: 700
            }}>
              {config.nombreEmpresa.substring(0, 2).toUpperCase()}
            </div>
          )}
          {!sidebarCollapsed && (
            <>
              <div style={{ fontSize: "18px", fontWeight: 700, marginTop: "12px" }}>
                {config.nombreEmpresa}
              </div>
              <div style={{ fontSize: "11px", color: config.colorAcento, marginTop: "4px" }}>
                {config.tagline}
              </div>
            </>
          )}
        </div>

        {/* Menú */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 0" }}>
          <div
            onClick={() => setSeccion("dashboard")}
            className="nav-item"
            style={{
              padding: sidebarCollapsed ? "16px" : "12px 24px",
              cursor: "pointer",
              backgroundColor: seccion === "dashboard" ? `${config.colorAcento}33` : "transparent",
              borderLeft: seccion === "dashboard" ? `3px solid ${config.colorAcento}` : "3px solid transparent",
              color: seccion === "dashboard" ? config.colorAcento : THEME.white,
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "14px",
              fontWeight: seccion === "dashboard" ? 600 : 400
            }}
          >
            <span style={{ fontSize: "20px" }}>🏠</span>
            {!sidebarCollapsed && <span>Panel Principal</span>}
          </div>

          {modulosActivos.map(stat => (
            <div
              key={stat.key}
              onClick={() => { setSeccion(stat.key); setPaginaActual(1); }}
              className="nav-item"
              style={{
                padding: sidebarCollapsed ? "16px" : "12px 24px",
                cursor: "pointer",
                backgroundColor: seccion === stat.key ? `${config.colorAcento}33` : "transparent",
                borderLeft: seccion === stat.key ? `3px solid ${config.colorAcento}` : "3px solid transparent",
                color: seccion === stat.key ? config.colorAcento : THEME.white,
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "14px",
                fontWeight: seccion === stat.key ? 600 : 400
              }}
            >
              <span style={{ fontSize: "20px" }}>{stat.emoji}</span>
              {!sidebarCollapsed && (
                <>
                  <span style={{ flex: 1 }}>{stat.nombre}</span>
                  <span style={{
                    backgroundColor: config.colorAcento,
                    color: config.colorPrimario,
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontSize: "11px",
                    fontWeight: 600
                  }}>{stat.total}</span>
                </>
              )}
            </div>
          ))}

          <div
            onClick={() => setSeccion("config")}
            className="nav-item"
            style={{
              padding: sidebarCollapsed ? "16px" : "12px 24px",
              cursor: "pointer",
              backgroundColor: seccion === "config" ? `${config.colorAcento}33` : "transparent",
              borderLeft: seccion === "config" ? `3px solid ${config.colorAcento}` : "3px solid transparent",
              color: seccion === "config" ? config.colorAcento : THEME.white,
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "14px",
              fontWeight: seccion === "config" ? 600 : 400
            }}
          >
            <span style={{ fontSize: "20px" }}>⚙️</span>
            {!sidebarCollapsed && <span>Configuración</span>}
          </div>
        </div>

        {/* Usuario y botón colapsar */}
        <div style={{ padding: "16px", borderTop: `1px solid ${config.colorAcento}33` }}>
          {!sidebarCollapsed && (
            <div style={{ fontSize: "12px", color: config.colorAcento, marginBottom: "12px" }}>
              Usuario: {activeUser}
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              width: "100%",
              padding: "8px",
              border: `1px solid ${config.colorAcento}33`,
              borderRadius: "6px",
              background: "transparent",
              color: THEME.white,
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            {sidebarCollapsed ? "→" : "←"}
          </button>
        </div>
      </div>
    );
  };

  // Renderizar Topbar
  const renderTopbar = () => {
    const seccionNombres = {
      dashboard: "Panel Principal",
      iso: config.modulos.iso.nombre,
      oea: config.modulos.oea.nombre,
      procedimientos: config.modulos.procedimientos.nombre,
      formatos: config.modulos.formatos.nombre,
      manuales: config.modulos.manuales.nombre,
      comunicados: config.modulos.comunicados.nombre,
      config: "Configuración"
    };

    return (
      <div style={{
        height: "64px",
        backgroundColor: THEME.white,
        borderBottom: `1px solid ${THEME.border}`,
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 2px 4px rgba(11,31,58,0.05)"
      }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ color: THEME.textLight, fontSize: "14px" }}>
            Portal › {seccionNombres[seccion] || seccion}
          </div>
        </div>

        {seccion !== "dashboard" && seccion !== "config" && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginRight: "16px" }}>
            <SearchBar
              value={busquedaGlobal}
              onChange={setBusquedaGlobal}
              placeholder="Buscar en todos los módulos..."
            />
          </div>
        )}

        {seccion !== "dashboard" && seccion !== "config" && (
          <button
            onClick={() => { setDocEditando(null); setModalAbierto("documento"); }}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              background: config.colorPrimario,
              color: config.colorAcento,
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            ➕ Nuevo documento
          </button>
        )}

        {proximosVencer.length > 0 && (
          <div style={{
            position: "relative",
            marginRight: "16px"
          }}>
            <button style={{
              padding: "10px",
              border: "none",
              borderRadius: "8px",
              background: "transparent",
              cursor: "pointer",
              fontSize: "20px"
            }}>🔔</button>
            <span style={{
              position: "absolute",
              top: "4px",
              right: "4px",
              backgroundColor: THEME.red,
              color: THEME.white,
              borderRadius: "50%",
              width: "18px",
              height: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              fontWeight: 600
            }}>{proximosVencer.length}</span>
          </div>
        )}

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 12px",
          borderRadius: "8px",
          backgroundColor: THEME.cream
        }}>
          <div style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: config.colorAcento,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: config.colorPrimario,
            fontWeight: 600,
            fontSize: "14px"
          }}>
            {activeUser.substring(0, 1).toUpperCase()}
          </div>
          <span style={{ fontSize: "14px", color: THEME.textDark }}>{activeUser}</span>
        </div>
      </div>
    );
  };

  // Renderizar Dashboard
  const renderDashboard = () => {
    const hoy = new Date().toLocaleDateString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    
    return (
      <div style={{ padding: "32px" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "32px",
            fontWeight: 700,
            color: THEME.textDark,
            marginBottom: "8px"
          }}>
            ¡Buenos días, {activeUser}!
          </h1>
          <p style={{ color: THEME.textLight, fontSize: "14px" }}>{hoy}</p>
        </div>

        {/* Estadísticas */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "32px"
        }}>
          {estadisticas.map(stat => (
            <StatCard
              key={stat.key}
              label={stat.nombre}
              value={stat.total}
              vigentes={stat.vigentes}
              enRevision={stat.enRevision}
              vencidos={stat.vencidos}
              emoji={stat.emoji}
              onClick={() => { setSeccion(stat.key); setPaginaActual(1); }}
            />
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
          {/* Últimos documentos */}
          <div className="fade-up" style={{
            backgroundColor: THEME.white,
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 2px 8px rgba(11,31,58,0.08)"
          }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "20px",
              fontWeight: 700,
              color: THEME.textDark,
              marginBottom: "20px"
            }}>Últimos documentos</h2>
            {ultimosDocs.length === 0 ? (
              <EmptyState icon="📄" title="No hay documentos" subtitle="Crea tu primer documento" />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {ultimosDocs.map(doc => (
                  <div
                    key={doc.id}
                    onClick={() => { setDocViendo(doc); setModalAbierto("detalle"); }}
                    style={{
                      padding: "12px",
                      border: `1px solid ${THEME.border}`,
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.18s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = THEME.cream}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{
                        padding: "2px 8px",
                        borderRadius: "6px",
                        backgroundColor: THEME.gold,
                        color: THEME.white,
                        fontSize: "10px",
                        fontWeight: 600
                      }}>{doc.codigo}</span>
                      <span style={{ fontSize: "14px", fontWeight: 500, color: THEME.textDark }}>{doc.titulo}</span>
                    </div>
                    <div style={{ fontSize: "12px", color: THEME.textLight }}>
                      {formatDate(doc.fechaActualizacion)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Próximos a vencer */}
          <div className="fade-up" style={{
            backgroundColor: THEME.white,
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 2px 8px rgba(11,31,58,0.08)"
          }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "20px",
              fontWeight: 700,
              color: THEME.textDark,
              marginBottom: "20px"
            }}>⚠️ Próximos a vencer</h2>
            {proximosVencer.length === 0 ? (
              <EmptyState icon="✅" title="Todo al día" subtitle="No hay documentos próximos a vencer" />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {proximosVencer.map(doc => {
                  const dias = doc.diasRestantes;
                  const color = dias <= 7 ? THEME.red : dias <= 30 ? THEME.amber : THEME.green;
                  const bgColor = dias <= 7 ? THEME.redBg : dias <= 30 ? THEME.amberBg : THEME.greenBg;
                  
                  return (
                    <div
                      key={doc.id}
                      onClick={() => { setDocViendo(doc); setModalAbierto("detalle"); }}
                      style={{
                        padding: "12px",
                        border: `1px solid ${THEME.border}`,
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "all 0.18s ease"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = THEME.cream}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{
                          padding: "2px 8px",
                          borderRadius: "6px",
                          backgroundColor: THEME.gold,
                          color: THEME.white,
                          fontSize: "10px",
                          fontWeight: 600
                        }}>{doc.codigo}</span>
                        <span style={{
                          padding: "4px 10px",
                          borderRadius: "12px",
                          backgroundColor: bgColor,
                          color: color,
                          fontSize: "11px",
                          fontWeight: 600
                        }}>
                          {dias <= 0 ? `Vencido hace ${Math.abs(dias)} días` : `${dias} días restantes`}
                        </span>
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: 500, color: THEME.textDark, marginBottom: "4px" }}>
                        {doc.titulo}
                      </div>
                      <div style={{ fontSize: "12px", color: THEME.textLight }}>
                        {formatDate(doc.fechaVigencia)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Accesos rápidos */}
        <div style={{
          backgroundColor: THEME.white,
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 2px 8px rgba(11,31,58,0.08)"
        }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "20px",
            fontWeight: 700,
            color: THEME.textDark,
            marginBottom: "20px"
          }}>Accesos rápidos</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "12px"
          }}>
            {estadisticas.map(stat => (
              <button
                key={stat.key}
                onClick={() => { setSeccion(stat.key); setPaginaActual(1); }}
                style={{
                  padding: "16px",
                  border: `1px solid ${THEME.border}`,
                  borderRadius: "8px",
                  background: THEME.white,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.18s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = config.colorAcento;
                  e.currentTarget.style.backgroundColor = THEME.cream;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = THEME.border;
                  e.currentTarget.style.backgroundColor = THEME.white;
                }}
              >
                <span style={{ fontSize: "32px" }}>{stat.emoji}</span>
                <span style={{ fontSize: "14px", fontWeight: 500, color: THEME.textDark }}>{stat.nombre}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Renderizar módulo de documentos
  const renderModuloDocumentos = () => {
    return (
      <div style={{ padding: "32px" }}>
        {/* Barra de herramientas */}
        <div style={{
          backgroundColor: THEME.white,
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "24px",
          boxShadow: "0 2px 8px rgba(11,31,58,0.08)"
        }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
            <div style={{ flex: "1", minWidth: "200px" }}>
              <SearchBar
                value={busquedaLocal}
                onChange={setBusquedaLocal}
                placeholder="Buscar documentos..."
              />
            </div>
            
            <select
              value={filtroEstado}
              onChange={(e) => { setFiltroEstado(e.target.value); setPaginaActual(1); }}
              className="portal-input"
              style={{
                padding: "10px 16px",
                border: `1px solid ${THEME.border}`,
                borderRadius: "8px",
                fontSize: "14px",
                fontFamily: "'Source Sans 3', sans-serif"
              }}
            >
              <option value="">Todos los estados</option>
              <option value="Vigente">Vigente</option>
              <option value="En revisión">En revisión</option>
              <option value="Vencido">Vencido</option>
              <option value="Borrador">Borrador</option>
              <option value="Implementado">Implementado</option>
            </select>

            <select
              value={filtroCategoria}
              onChange={(e) => { setFiltroCategoria(e.target.value); setPaginaActual(1); }}
              className="portal-input"
              style={{
                padding: "10px 16px",
                border: `1px solid ${THEME.border}`,
                borderRadius: "8px",
                fontSize: "14px",
                fontFamily: "'Source Sans 3', sans-serif"
              }}
            >
              <option value="">Todas las categorías</option>
              {categoriasDisponibles.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <button
              onClick={() => setVistaLista(!vistaLista)}
              style={{
                padding: "10px 16px",
                border: `1px solid ${THEME.border}`,
                borderRadius: "8px",
                background: THEME.white,
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              {vistaLista ? "⊞ Tarjetas" : "📋 Lista"}
            </button>

            <select
              value={ordenarPor}
              onChange={(e) => { setOrdenarPor(e.target.value); setPaginaActual(1); }}
              className="portal-input"
              style={{
                padding: "10px 16px",
                border: `1px solid ${THEME.border}`,
                borderRadius: "8px",
                fontSize: "14px",
                fontFamily: "'Source Sans 3', sans-serif"
              }}
            >
              <option value="fecha">Por fecha</option>
              <option value="codigo">Por código</option>
              <option value="titulo">Por título</option>
              <option value="estado">Por estado</option>
            </select>
          </div>
        </div>

        {/* Lista de documentos */}
        {documentosFiltrados.length === 0 ? (
          <EmptyState
            icon="📄"
            title={busquedaLocal || filtroEstado || filtroCategoria ? "No se encontraron documentos" : "No hay documentos"}
            subtitle={busquedaLocal || filtroEstado || filtroCategoria ? "Intenta con otros filtros" : "Crea tu primer documento"}
            actionLabel="➕ Nuevo documento"
            onAction={() => { setDocEditando(null); setModalAbierto("documento"); }}
          />
        ) : (
          <>
            {vistaLista ? (
              <table style={{
                width: "100%",
                backgroundColor: THEME.white,
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(11,31,58,0.08)"
              }}>
                <thead>
                  <tr style={{ backgroundColor: THEME.cream, borderBottom: `2px solid ${THEME.border}` }}>
                    <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: THEME.textDark }}>Código</th>
                    <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: THEME.textDark }}>Título</th>
                    <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: THEME.textDark }}>Estado</th>
                    <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: THEME.textDark }}>Categoría</th>
                    <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: THEME.textDark }}>Versión</th>
                    <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: THEME.textDark }}>Fecha</th>
                    <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: THEME.textDark }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {documentosPaginados.map(doc => (
                    <DocumentRow
                      key={doc.id}
                      doc={doc}
                      onView={() => { setDocViendo(doc); setModalAbierto("detalle"); }}
                      onEdit={() => { setDocEditando(doc); setModalAbierto("documento"); }}
                      onDownload={() => doc.archivo && downloadBase64(doc.archivo.base64, doc.archivo.nombre)}
                      onDelete={() => setDocEliminando(doc)}
                    />
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "20px"
              }}>
                {documentosPaginados.map(doc => (
                  <DocumentCard
                    key={doc.id}
                    doc={doc}
                    onView={() => { setDocViendo(doc); setModalAbierto("detalle"); }}
                    onEdit={() => { setDocEditando(doc); setModalAbierto("documento"); }}
                    onDownload={() => doc.archivo && downloadBase64(doc.archivo.base64, doc.archivo.nombre)}
                    onDelete={() => setDocEliminando(doc)}
                  />
                ))}
              </div>
            )}

            <Pagination
              total={documentosFiltrados.length}
              perPage={itemsPorPagina}
              current={paginaActual}
              onChange={setPaginaActual}
            />
          </>
        )}
      </div>
    );
  };

  // Renderizar módulo de configuración
  const renderConfiguracion = () => {
    const [tabActivo, setTabActivo] = useState("empresa");
    const [formEmpresa, setFormEmpresa] = useState({
      nombreEmpresa: config.nombreEmpresa,
      tagline: config.tagline,
      bannerTexto: config.bannerTexto
    });
    const [logoPreview, setLogoPreview] = useState(config.logo);

    const handleLogoChange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const base64 = await fileToBase64(file);
        setLogoPreview(base64);
        setConfig({ ...config, logo: base64 });
        addToast("Logo actualizado", "success");
      } catch (error) {
        addToast("Error al cargar logo", "error");
      }
    };

    const handleGuardarEmpresa = () => {
      setConfig({ ...config, ...formEmpresa, logo: logoPreview });
      addToast("Configuración guardada", "success");
    };

    const totalDocs = docsISO.length + docsOEA.length + docsProcedimientos.length + docsFormatos.length + docsManuales.length + docsComunicados.length;

    return (
      <div style={{ padding: "32px" }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "32px",
          fontWeight: 700,
          color: THEME.textDark,
          marginBottom: "32px"
        }}>Configuración</h1>

        {/* Tabs */}
        <div style={{
          display: "flex",
          gap: "8px",
          borderBottom: `2px solid ${THEME.border}`,
          marginBottom: "24px"
        }}>
          {["empresa", "apariencia", "modulos", "usuarios", "datos"].map(tab => (
            <button
              key={tab}
              onClick={() => setTabActivo(tab)}
              style={{
                padding: "12px 24px",
                border: "none",
                borderBottom: tabActivo === tab ? `3px solid ${config.colorAcento}` : "3px solid transparent",
                background: "transparent",
                color: tabActivo === tab ? THEME.textDark : THEME.textLight,
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: tabActivo === tab ? 600 : 400,
                textTransform: "capitalize"
              }}
            >
              {tab === "empresa" ? "Empresa" : tab === "apariencia" ? "Apariencia" : tab === "modulos" ? "Módulos" : tab === "usuarios" ? "Usuarios" : "Datos"}
            </button>
          ))}
        </div>

        {/* Tab Empresa */}
        {tabActivo === "empresa" && (
          <div style={{
            backgroundColor: THEME.white,
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 2px 8px rgba(11,31,58,0.08)"
          }}>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: THEME.textDark }}>
                Nombre de la empresa
              </label>
              <input
                type="text"
                value={formEmpresa.nombreEmpresa}
                onChange={(e) => setFormEmpresa({ ...formEmpresa, nombreEmpresa: e.target.value })}
                className="portal-input"
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  border: `1px solid ${THEME.border}`,
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontFamily: "'Source Sans 3', sans-serif"
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: THEME.textDark }}>
                Logo
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                {logoPreview && (
                  <img src={logoPreview} alt="Logo" style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "cover"
                  }} />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  style={{ fontSize: "14px" }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: THEME.textDark }}>
                Tagline
              </label>
              <input
                type="text"
                value={formEmpresa.tagline}
                onChange={(e) => setFormEmpresa({ ...formEmpresa, tagline: e.target.value })}
                className="portal-input"
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  border: `1px solid ${THEME.border}`,
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontFamily: "'Source Sans 3', sans-serif"
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: THEME.textDark }}>
                Texto del banner
              </label>
              <textarea
                value={formEmpresa.bannerTexto}
                onChange={(e) => setFormEmpresa({ ...formEmpresa, bannerTexto: e.target.value })}
                className="portal-input"
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  border: `1px solid ${THEME.border}`,
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontFamily: "'Source Sans 3', sans-serif",
                  minHeight: "80px",
                  resize: "vertical"
                }}
              />
            </div>

            <button
              onClick={handleGuardarEmpresa}
              style={{
                padding: "12px 24px",
                border: "none",
                borderRadius: "8px",
                background: config.colorPrimario,
                color: config.colorAcento,
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500
              }}
            >
              Guardar
            </button>
          </div>
        )}

        {/* Tab Apariencia */}
        {tabActivo === "apariencia" && (
          <div style={{
            backgroundColor: THEME.white,
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 2px 8px rgba(11,31,58,0.08)"
          }}>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: THEME.textDark }}>
                Color primario
              </label>
              <input
                type="color"
                value={config.colorPrimario}
                onChange={(e) => setConfig({ ...config, colorPrimario: e.target.value })}
                style={{ width: "100px", height: "40px", cursor: "pointer" }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: THEME.textDark }}>
                Color de acento
              </label>
              <input
                type="color"
                value={config.colorAcento}
                onChange={(e) => setConfig({ ...config, colorAcento: e.target.value })}
                style={{ width: "100px", height: "40px", cursor: "pointer" }}
              />
            </div>

            <button
              onClick={() => setConfig({ ...config, colorPrimario: THEME.navy, colorAcento: THEME.gold })}
              style={{
                padding: "12px 24px",
                border: `1px solid ${THEME.border}`,
                borderRadius: "8px",
                background: THEME.white,
                color: THEME.textDark,
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500
              }}
            >
              Restaurar colores originales
            </button>
          </div>
        )}

        {/* Tab Módulos */}
        {tabActivo === "modulos" && (
          <div style={{
            backgroundColor: THEME.white,
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 2px 8px rgba(11,31,58,0.08)"
          }}>
            {Object.entries(config.modulos).map(([key, mod]) => (
              <div key={key} style={{
                padding: "16px",
                border: `1px solid ${THEME.border}`,
                borderRadius: "8px",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "16px"
              }}>
                <input
                  type="checkbox"
                  checked={mod.activo}
                  onChange={(e) => {
                    const nuevosModulos = { ...config.modulos };
                    nuevosModulos[key].activo = e.target.checked;
                    setConfig({ ...config, modulos: nuevosModulos });
                  }}
                />
                <input
                  type="text"
                  value={mod.emoji}
                  onChange={(e) => {
                    const nuevosModulos = { ...config.modulos };
                    nuevosModulos[key].emoji = e.target.value;
                    setConfig({ ...config, modulos: nuevosModulos });
                  }}
                  style={{
                    width: "60px",
                    padding: "8px",
                    border: `1px solid ${THEME.border}`,
                    borderRadius: "6px",
                    fontSize: "20px",
                    textAlign: "center"
                  }}
                />
                <input
                  type="text"
                  value={mod.nombre}
                  onChange={(e) => {
                    const nuevosModulos = { ...config.modulos };
                    nuevosModulos[key].nombre = e.target.value;
                    setConfig({ ...config, modulos: nuevosModulos });
                  }}
                  className="portal-input"
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    border: `1px solid ${THEME.border}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "'Source Sans 3', sans-serif"
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Tab Usuarios */}
        {tabActivo === "usuarios" && (
          <div style={{
            backgroundColor: THEME.white,
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 2px 8px rgba(11,31,58,0.08)"
          }}>
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>Usuarios</h3>
              {users.map((user, index) => (
                <div key={index} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px",
                  border: `1px solid ${THEME.border}`,
                  borderRadius: "8px",
                  marginBottom: "8px"
                }}>
                  <span style={{ flex: 1 }}>{user.nombre}</span>
                  <span style={{ color: THEME.textLight }}>{user.rol}</span>
                  <button
                    onClick={() => {
                      setUsers(users.filter((_, i) => i !== index));
                      addToast("Usuario eliminado", "success");
                    }}
                    style={{
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: "6px",
                      background: THEME.red,
                      color: THEME.white,
                      cursor: "pointer",
                      fontSize: "12px"
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>Agregar usuario</h3>
              <div style={{ display: "flex", gap: "12px" }}>
                <input
                  type="text"
                  placeholder="Nombre"
                  id="nuevoUsuarioNombre"
                  className="portal-input"
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    border: `1px solid ${THEME.border}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "'Source Sans 3', sans-serif"
                  }}
                />
                <select
                  id="nuevoUsuarioRol"
                  className="portal-input"
                  style={{
                    padding: "10px 16px",
                    border: `1px solid ${THEME.border}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "'Source Sans 3', sans-serif"
                  }}
                >
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Lector">Lector</option>
                </select>
                <button
                  onClick={() => {
                    const nombre = document.getElementById("nuevoUsuarioNombre").value;
                    const rol = document.getElementById("nuevoUsuarioRol").value;
                    if (nombre) {
                      setUsers([...users, { nombre, rol }]);
                      document.getElementById("nuevoUsuarioNombre").value = "";
                      addToast("Usuario agregado", "success");
                    }
                  }}
                  style={{
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "8px",
                    background: config.colorPrimario,
                    color: config.colorAcento,
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 500
                  }}
                >
                  Agregar
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: THEME.textDark }}>
                Usuario activo
              </label>
              <select
                value={activeUser}
                onChange={(e) => setActiveUser(e.target.value)}
                className="portal-input"
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  border: `1px solid ${THEME.border}`,
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontFamily: "'Source Sans 3', sans-serif"
                }}
              >
                {users.map((user, index) => (
                  <option key={index} value={user.nombre}>{user.nombre} ({user.rol})</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Tab Datos */}
        {tabActivo === "datos" && (
          <div style={{
            backgroundColor: THEME.white,
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 2px 8px rgba(11,31,58,0.08)"
          }}>
            <div style={{ marginBottom: "24px", padding: "16px", backgroundColor: THEME.cream, borderRadius: "8px" }}>
              <div style={{ fontSize: "14px", color: THEME.textDark }}>
                <strong>{totalDocs}</strong> documentos guardados · <strong>{calcularUsoStorage()}</strong> de localStorage usados
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button
                onClick={() => {
                  const allData = {
                    config,
                    docsISO,
                    docsOEA,
                    docsProcedimientos,
                    docsFormatos,
                    docsManuales,
                    docsComunicados,
                    users,
                    activeUser
                  };
                  exportarTodo(allData);
                  addToast("Datos exportados", "success");
                }}
                style={{
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "8px",
                  background: config.colorPrimario,
                  color: config.colorAcento,
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                📤 Exportar todo
              </button>

              <label style={{
                padding: "12px 24px",
                border: `1px solid ${THEME.border}`,
                borderRadius: "8px",
                background: THEME.white,
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                textAlign: "center",
                justifyContent: "center"
              }}>
                📥 Importar datos
                <input
                  type="file"
                  accept=".json"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    try {
                      const text = await file.text();
                      const data = JSON.parse(text);
                      if (confirm("¿Estás seguro de importar estos datos? Se sobrescribirán los datos actuales.")) {
                        if (data.config) setConfig(data.config);
                        if (data.docsISO) setDocsISO(data.docsISO);
                        if (data.docsOEA) setDocsOEA(data.docsOEA);
                        if (data.docsProcedimientos) setDocsProcedimientos(data.docsProcedimientos);
                        if (data.docsFormatos) setDocsFormatos(data.docsFormatos);
                        if (data.docsManuales) setDocsManuales(data.docsManuales);
                        if (data.docsComunicados) setDocsComunicados(data.docsComunicados);
                        if (data.users) setUsers(data.users);
                        if (data.activeUser) setActiveUser(data.activeUser);
                        addToast("Datos importados", "success");
                      }
                    } catch (error) {
                      addToast("Error al importar. Formato inválido.", "error");
                    }
                  }}
                  style={{ display: "none" }}
                />
              </label>

              <button
                onClick={() => {
                  if (confirm("¿Estás seguro de limpiar todos los datos? Esta acción no se puede deshacer.")) {
                    if (confirm("Confirmación final: ¿Eliminar TODOS los datos?")) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }
                }}
                style={{
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "8px",
                  background: THEME.red,
                  color: THEME.white,
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                🗑 Limpiar todo
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Modal de documento
  const renderModalDocumento = () => {
    const [formData, setFormData] = useState(docEditando ? {
      codigo: docEditando.codigo,
      titulo: docEditando.titulo,
      descripcion: docEditando.descripcion,
      version: docEditando.version,
      estado: docEditando.estado,
      categoria: docEditando.categoria,
      responsable: docEditando.responsable,
      fechaVigencia: docEditando.fechaVigencia ? docEditando.fechaVigencia.split("T")[0] : "",
      etiquetas: docEditando.etiquetas || [],
      notaVersion: "",
      archivo: docEditando.archivo
    } : {
      codigo: "",
      titulo: "",
      descripcion: "",
      version: "v1.0",
      estado: "Vigente",
      categoria: "",
      responsable: "",
      fechaVigencia: "",
      etiquetas: [],
      notaVersion: "",
      archivo: null
    });
    const [nuevaEtiqueta, setNuevaEtiqueta] = useState("");
    const [errores, setErrores] = useState({});

    const validar = () => {
      const errs = {};
      if (!formData.codigo.trim()) errs.codigo = "Requerido";
      if (!formData.titulo.trim()) errs.titulo = "Requerido";
      if (!formData.descripcion.trim()) errs.descripcion = "Requerido";
      
      if (!docEditando) {
        const docs = getDocsActuales();
        if (docs.some(d => d.codigo === formData.codigo)) {
          errs.codigo = "Código duplicado";
        }
      }
      
      setErrores(errs);
      return Object.keys(errs).length === 0;
    };

    const handleGuardar = () => {
      if (!validar()) {
        addToast("Completa los campos requeridos", "error");
        return;
      }

      handleGuardarDoc({
        ...formData,
        fechaVigencia: formData.fechaVigencia || null
      });
    };

    const agregarEtiqueta = () => {
      if (nuevaEtiqueta.trim() && !formData.etiquetas.includes(nuevaEtiqueta.trim())) {
        setFormData({ ...formData, etiquetas: [...formData.etiquetas, nuevaEtiqueta.trim()] });
        setNuevaEtiqueta("");
      }
    };

    return (
      <Modal
        isOpen={modalAbierto === "documento"}
        onClose={() => { setModalAbierto(null); setDocEditando(null); }}
        title={docEditando ? "Editar documento" : "Nuevo documento"}
        size="large"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: THEME.textDark }}>
              Código *
            </label>
            <input
              type="text"
              value={formData.codigo}
              onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
              className="portal-input"
              style={{
                width: "100%",
                padding: "10px 16px",
                border: `1px solid ${errores.codigo ? THEME.red : THEME.border}`,
                borderRadius: "8px",
                fontSize: "14px",
                fontFamily: "'Source Sans 3', sans-serif"
              }}
            />
            {errores.codigo && <div style={{ color: THEME.red, fontSize: "12px", marginTop: "4px" }}>{errores.codigo}</div>}
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: THEME.textDark }}>
              Título *
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              className="portal-input"
              style={{
                width: "100%",
                padding: "10px 16px",
                border: `1px solid ${errores.titulo ? THEME.red : THEME.border}`,
                borderRadius: "8px",
                fontSize: "14px",
                fontFamily: "'Source Sans 3', sans-serif"
              }}
            />
            {errores.titulo && <div style={{ color: THEME.red, fontSize: "12px", marginTop: "4px" }}>{errores.titulo}</div>}
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: THEME.textDark }}>
              Descripción *
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="portal-input"
              style={{
                width: "100%",
                padding: "10px 16px",
                border: `1px solid ${errores.descripcion ? THEME.red : THEME.border}`,
                borderRadius: "8px",
                fontSize: "14px",
                fontFamily: "'Source Sans 3', sans-serif",
                minHeight: "100px",
                resize: "vertical"
              }}
            />
            {errores.descripcion && <div style={{ color: THEME.red, fontSize: "12px", marginTop: "4px" }}>{errores.descripcion}</div>}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: THEME.textDark }}>
                Versión
              </label>
              <input
                type="text"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                className="portal-input"
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  border: `1px solid ${THEME.border}`,
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontFamily: "'Source Sans 3', sans-serif"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: THEME.textDark }}>
                Estado
              </label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                className="portal-input"
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  border: `1px solid ${THEME.border}`,
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontFamily: "'Source Sans 3', sans-serif"
                }}
              >
                <option value="Vigente">Vigente</option>
                <option value="En revisión">En revisión</option>
                <option value="Vencido">Vencido</option>
                <option value="Borrador">Borrador</option>
                {seccion === "oea" && <option value="Implementado">Implementado</option>}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: THEME.textDark }}>
                Categoría
              </label>
              <input
                type="text"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                list="categorias"
                className="portal-input"
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  border: `1px solid ${THEME.border}`,
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontFamily: "'Source Sans 3', sans-serif"
                }}
              />
              <datalist id="categorias">
                {categoriasDisponibles.map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: THEME.textDark }}>
                Responsable
              </label>
              <input
                type="text"
                value={formData.responsable}
                onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                className="portal-input"
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  border: `1px solid ${THEME.border}`,
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontFamily: "'Source Sans 3', sans-serif"
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: THEME.textDark }}>
              Fecha de vigencia
            </label>
            <input
              type="date"
              value={formData.fechaVigencia}
              onChange={(e) => setFormData({ ...formData, fechaVigencia: e.target.value })}
              className="portal-input"
              style={{
                width: "100%",
                padding: "10px 16px",
                border: `1px solid ${THEME.border}`,
                borderRadius: "8px",
                fontSize: "14px",
                fontFamily: "'Source Sans 3', sans-serif"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: THEME.textDark }}>
              Etiquetas
            </label>
            <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
              <input
                type="text"
                value={nuevaEtiqueta}
                onChange={(e) => setNuevaEtiqueta(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && agregarEtiqueta()}
                placeholder="Escribe y presiona Enter"
                className="portal-input"
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  border: `1px solid ${THEME.border}`,
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontFamily: "'Source Sans 3', sans-serif"
                }}
              />
              <button
                onClick={agregarEtiqueta}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "8px",
                  background: THEME.blue,
                  color: THEME.white,
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                Agregar
              </button>
            </div>
            <div>
              {formData.etiquetas.map((tag, i) => (
                <TagChip
                  key={i}
                  label={tag}
                  onRemove={() => setFormData({ ...formData, etiquetas: formData.etiquetas.filter((_, idx) => idx !== i) })}
                />
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: THEME.textDark }}>
              Nota de versión
            </label>
            <input
              type="text"
              value={formData.notaVersion}
              onChange={(e) => setFormData({ ...formData, notaVersion: e.target.value })}
              placeholder="Descripción de los cambios en esta versión"
              className="portal-input"
              style={{
                width: "100%",
                padding: "10px 16px",
                border: `1px solid ${THEME.border}`,
                borderRadius: "8px",
                fontSize: "14px",
                fontFamily: "'Source Sans 3', sans-serif"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: THEME.textDark }}>
              Archivo adjunto
            </label>
            <FileDropZone
              onFile={(file) => setFormData({ ...formData, archivo: file })}
              currentFile={formData.archivo}
              onRemove={() => setFormData({ ...formData, archivo: null })}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px" }}>
            <button
              onClick={() => { setModalAbierto(null); setDocEditando(null); }}
              style={{
                padding: "12px 24px",
                border: `1px solid ${THEME.border}`,
                borderRadius: "8px",
                background: THEME.white,
                color: THEME.textDark,
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleGuardar}
              disabled={Object.keys(errores).length > 0}
              style={{
                padding: "12px 24px",
                border: "none",
                borderRadius: "8px",
                background: Object.keys(errores).length > 0 ? THEME.gray : config.colorPrimario,
                color: Object.keys(errores).length > 0 ? THEME.white : config.colorAcento,
                cursor: Object.keys(errores).length > 0 ? "not-allowed" : "pointer",
                fontSize: "14px",
                fontWeight: 500
              }}
            >
              Guardar
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  // Modal de detalle
  const renderModalDetalle = () => {
    if (!docViendo) return null;

    return (
      <Modal
        isOpen={modalAbierto === "detalle"}
        onClose={() => { setModalAbierto(null); setDocViendo(null); }}
        title={docViendo.titulo}
        size="large"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <span style={{
                padding: "6px 12px",
                borderRadius: "6px",
                backgroundColor: THEME.gold,
                color: THEME.white,
                fontSize: "12px",
                fontWeight: 600
              }}>{docViendo.codigo}</span>
              <StatusBadge estado={docViendo.estado} />
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: "14px", fontWeight: 600, color: THEME.textDark, marginBottom: "8px" }}>Descripción</h3>
            <p style={{ color: THEME.textMid, lineHeight: "1.6" }}>{docViendo.descripcion}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <h3 style={{ fontSize: "12px", fontWeight: 600, color: THEME.textLight, marginBottom: "4px" }}>Versión</h3>
              <p style={{ color: THEME.textDark }}>{docViendo.version}</p>
            </div>
            <div>
              <h3 style={{ fontSize: "12px", fontWeight: 600, color: THEME.textLight, marginBottom: "4px" }}>Categoría</h3>
              <p style={{ color: THEME.textDark }}>{docViendo.categoria || "—"}</p>
            </div>
            <div>
              <h3 style={{ fontSize: "12px", fontWeight: 600, color: THEME.textLight, marginBottom: "4px" }}>Responsable</h3>
              <p style={{ color: THEME.textDark }}>{docViendo.responsable || "—"}</p>
            </div>
            <div>
              <h3 style={{ fontSize: "12px", fontWeight: 600, color: THEME.textLight, marginBottom: "4px" }}>Fecha de creación</h3>
              <p style={{ color: THEME.textDark }}>{formatDate(docViendo.fechaCreacion)}</p>
            </div>
            <div>
              <h3 style={{ fontSize: "12px", fontWeight: 600, color: THEME.textLight, marginBottom: "4px" }}>Última actualización</h3>
              <p style={{ color: THEME.textDark }}>{formatDate(docViendo.fechaActualizacion)}</p>
            </div>
            {docViendo.fechaVigencia && (
              <div>
                <h3 style={{ fontSize: "12px", fontWeight: 600, color: THEME.textLight, marginBottom: "4px" }}>Fecha de vigencia</h3>
                <p style={{ color: THEME.textDark }}>{formatDate(docViendo.fechaVigencia)}</p>
              </div>
            )}
          </div>

          {docViendo.etiquetas && docViendo.etiquetas.length > 0 && (
            <div>
              <h3 style={{ fontSize: "14px", fontWeight: 600, color: THEME.textDark, marginBottom: "8px" }}>Etiquetas</h3>
              <div>
                {docViendo.etiquetas.map((tag, i) => (
                  <TagChip key={i} label={tag} />
                ))}
              </div>
            </div>
          )}

          {docViendo.archivo && (
            <div>
              <h3 style={{ fontSize: "14px", fontWeight: 600, color: THEME.textDark, marginBottom: "8px" }}>Archivo adjunto</h3>
              <div style={{
                padding: "12px",
                border: `1px solid ${THEME.border}`,
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <div>
                  <div style={{ fontWeight: 500, color: THEME.textDark }}>{docViendo.archivo.nombre}</div>
                  <div style={{ fontSize: "12px", color: THEME.textLight }}>
                    {formatSize(docViendo.archivo.tamano)} · {docViendo.archivo.tipo}
                  </div>
                </div>
                <button
                  onClick={() => downloadBase64(docViendo.archivo.base64, docViendo.archivo.nombre)}
                  style={{
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "6px",
                    background: config.colorPrimario,
                    color: config.colorAcento,
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 500
                  }}
                >
                  📥 Descargar
                </button>
              </div>
            </div>
          )}

          <div>
            <h3 style={{ fontSize: "14px", fontWeight: 600, color: THEME.textDark, marginBottom: "16px" }}>Historial de versiones</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {docViendo.historial && docViendo.historial.slice().reverse().map((entry, i) => (
                <div key={i} style={{
                  padding: "12px",
                  border: `1px solid ${THEME.border}`,
                  borderRadius: "8px",
                  backgroundColor: i === 0 ? THEME.cream : THEME.white
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontWeight: 600, color: THEME.textDark }}>v{entry.version}</span>
                    <span style={{ fontSize: "12px", color: THEME.textLight }}>{formatDate(entry.fecha)}</span>
                    <span style={{ fontSize: "12px", color: THEME.textLight }}>por {entry.autor}</span>
                  </div>
                  {entry.nota && (
                    <div style={{ fontSize: "13px", color: THEME.textMid }}>{entry.nota}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px" }}>
            <button
              onClick={() => {
                setModalAbierto(null);
                setDocViendo(null);
                setDocEditando(docViendo);
                setModalAbierto("documento");
              }}
              style={{
                padding: "12px 24px",
                border: "none",
                borderRadius: "8px",
                background: config.colorPrimario,
                color: config.colorAcento,
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500
              }}
            >
              ✏️ Editar
            </button>
            <button
              onClick={() => { setModalAbierto(null); setDocViendo(null); }}
              style={{
                padding: "12px 24px",
                border: `1px solid ${THEME.border}`,
                borderRadius: "8px",
                background: THEME.white,
                color: THEME.textDark,
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  // Render principal
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Sans+3:wght@400;500;600&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Source Sans 3', sans-serif;
          background-color: ${THEME.cream};
          color: ${THEME.textDark};
        }
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.93); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .fade-up { animation: fadeUp 0.35s ease forwards; }
        .scale-in { animation: scaleIn 0.25s ease forwards; }
        .fade-in { animation: fadeIn 0.2s ease forwards; }
        .toast-in { animation: slideInRight 0.3s ease forwards; }
        
        .doc-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(11,31,58,0.13);
        }
        
        .doc-card {
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        
        .btn-primary:hover { filter: brightness(1.1); }
        .btn-outline:hover { background: ${THEME.navy} !important; color: ${THEME.goldLight} !important; }
        
        .nav-item:hover {
          background: rgba(201,149,42,0.12) !important;
          color: ${THEME.goldLight} !important;
        }
        
        .sidebar {
          transition: width 0.25s ease;
        }
        
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: ${THEME.cream}; }
        ::-webkit-scrollbar-thumb { background: ${THEME.gold}; border-radius: 10px; }
        
        .dropzone-active {
          border: 2px dashed ${THEME.gold} !important;
          background: ${THEME.amberBg} !important;
        }
        
        .doc-row:hover {
          background: ${THEME.cream} !important;
        }
        
        .portal-input:focus {
          outline: none;
          border-color: ${THEME.gold} !important;
          box-shadow: 0 0 0 3px rgba(201,149,42,0.18);
        }
      `}</style>

      {renderSidebar()}
      
      <div style={{ marginLeft: sidebarCollapsed ? "80px" : "280px", minHeight: "100vh" }}>
        {renderTopbar()}
        
        <main style={{ paddingTop: "0" }}>
          {seccion === "dashboard" && renderDashboard()}
          {seccion !== "dashboard" && seccion !== "config" && renderModuloDocumentos()}
          {seccion === "config" && renderConfiguracion()}
        </main>
      </div>

      {renderModalDocumento()}
      {renderModalDetalle()}
      
      <ConfirmModal
        isOpen={docEliminando !== null}
        onClose={() => setDocEliminando(null)}
        onConfirm={() => { handleEliminarDoc(); }}
        title="Eliminar documento"
        message={`¿Estás seguro de eliminar "${docEliminando?.titulo}"?`}
      />

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}

export default App;