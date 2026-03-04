# Portal de Gestión ISO 9001 + OEA

Portal interno de gestión de calidad y OEA para agencias aduanales mexicanas. Aplicación web completa 100% client-side con persistencia en localStorage.

## 🚀 Características

- ✅ **100% Client-Side**: Sin servidores, sin APIs, sin bases de datos externas
- ✅ **Persistencia en localStorage**: Todos los datos se guardan localmente
- ✅ **Gestión de Documentos**: ISO 9001, OEA, Procedimientos, Formatos, Manuales, Comunicados
- ✅ **Sistema de Archivos**: Sube y descarga archivos (PDF, DOCX, XLSX, imágenes, TXT)
- ✅ **Búsqueda y Filtros**: Búsqueda global y filtros por estado y categoría
- ✅ **Dashboard**: Estadísticas, últimos documentos, alertas de vencimiento
- ✅ **Configuración Completa**: Personaliza empresa, colores, módulos y usuarios
- ✅ **Exportar/Importar**: Respaldos completos en JSON
- ✅ **Datos de Ejemplo**: Seed data precargado al primer uso

## 📋 Requisitos

- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- No requiere instalación de dependencias
- No requiere servidor web (puede abrirse directamente desde el archivo HTML)

## 🎯 Uso Rápido

### Instalación

```bash
cd portal-iso-oea
npm install
```

### Desarrollo

```bash
npm run dev
```

Esto iniciará el servidor de desarrollo en `http://localhost:3000` y abrirá automáticamente el navegador.

### Build para Producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

### Preview de Producción

```bash
npm run preview
```

## 📁 Estructura del Proyecto

```
portal-iso-oea/
├── App.jsx          # Aplicación React completa (único archivo)
├── index.html       # Archivo HTML principal
└── README.md        # Este archivo
```

## 🎨 Módulos Disponibles

1. **📋 Políticas ISO 9001**: Gestión de políticas de calidad
2. **🛡️ Requisitos OEA**: Cumplimiento de requisitos OEA
3. **📌 Procedimientos**: Procedimientos operativos
4. **📁 Formatos y Documentos**: Formatos, checklists, formularios
5. **📚 Manuales**: Manuales del sistema
6. **📢 Comunicados**: Comunicados internos

## ⚙️ Configuración

Accede al módulo de **Configuración** (⚙️) para:

- **Empresa**: Nombre, logo, tagline, banner
- **Apariencia**: Colores primario y de acento
- **Módulos**: Activar/desactivar y renombrar módulos
- **Usuarios**: Gestionar usuarios y roles
- **Datos**: Exportar, importar o limpiar datos

## 💾 Persistencia de Datos

Todos los datos se guardan en `localStorage` del navegador con las siguientes claves:

- `portal_config`: Configuración general
- `portal_sidebar_collapsed`: Estado del sidebar
- `portal_active_user`: Usuario activo
- `portal_docs_iso`: Documentos ISO 9001
- `portal_docs_oea`: Documentos OEA
- `portal_docs_procedimientos`: Procedimientos
- `portal_docs_formatos`: Formatos
- `portal_docs_manuales`: Manuales
- `portal_docs_comunicados`: Comunicados
- `portal_users`: Lista de usuarios
- `portal_seeded`: Flag de datos iniciales

## 📤 Exportar/Importar Datos

### Exportar

1. Ve a **Configuración** → **Datos**
2. Haz clic en **📤 Exportar todo**
3. Se descargará un archivo JSON con todos los datos

### Importar

1. Ve a **Configuración** → **Datos**
2. Haz clic en **📥 Importar datos**
3. Selecciona el archivo JSON de respaldo
4. Confirma la importación

⚠️ **Advertencia**: La importación sobrescribirá todos los datos actuales.

## 🗑️ Limpiar Datos

1. Ve a **Configuración** → **Datos**
2. Haz clic en **🗑 Limpiar todo**
3. Confirma dos veces
4. Se eliminarán todos los datos y se recargarán los datos de ejemplo

## 📝 Gestión de Documentos

### Crear Documento

1. Selecciona un módulo (ISO, OEA, etc.)
2. Haz clic en **➕ Nuevo documento**
3. Completa el formulario:
   - Código (único por módulo)
   - Título y descripción
   - Versión, estado, categoría
   - Responsable y fecha de vigencia
   - Etiquetas
   - Archivo adjunto (opcional)
4. Haz clic en **Guardar**

### Editar Documento

1. Haz clic en **✏️ Editar** en cualquier documento
2. Modifica los campos necesarios
3. Agrega una nota de versión para el historial
4. Haz clic en **Guardar**

### Ver Detalle

1. Haz clic en **👁 Ver** en cualquier documento
2. Verás toda la información y el historial de versiones
3. Puedes descargar el archivo adjunto si existe

### Eliminar Documento

1. Haz clic en **🗑 Eliminar** en cualquier documento
2. Confirma la eliminación

## 🔍 Búsqueda y Filtros

- **Búsqueda global**: Busca en todos los módulos desde el topbar
- **Búsqueda local**: Busca dentro del módulo actual
- **Filtro por estado**: Vigente, En revisión, Vencido, Borrador, Implementado
- **Filtro por categoría**: Filtra por categorías existentes
- **Ordenar**: Por fecha, código, título o estado
- **Vista**: Lista o tarjetas

## 📊 Dashboard

El dashboard muestra:

- **Estadísticas por módulo**: Total, vigentes, en revisión, vencidos
- **Últimos documentos**: Los 5 documentos más recientes
- **Próximos a vencer**: Documentos que vencen en ≤30 días
- **Accesos rápidos**: Enlaces directos a cada módulo

## 🎨 Personalización

### Colores

En **Configuración** → **Apariencia** puedes cambiar:
- Color primario (sidebar y elementos principales)
- Color de acento (botones y destacados)

### Módulos

En **Configuración** → **Módulos** puedes:
- Activar/desactivar módulos
- Cambiar el emoji de cada módulo
- Renombrar módulos

## ⚠️ Limitaciones

- **localStorage**: Tiene un límite de ~5-10MB dependiendo del navegador
- **Archivos grandes**: Se recomienda no subir archivos mayores a 2MB
- **Sin sincronización**: Los datos son locales al navegador
- **Sin autenticación real**: El sistema de usuarios es básico

## 🐛 Solución de Problemas

### La aplicación no carga

- Verifica que estés usando un navegador moderno
- Abre la consola del navegador (F12) para ver errores
- Asegúrate de que `App.jsx` esté en la misma carpeta que `index.html`

### Los datos no se guardan

- Verifica que localStorage no esté deshabilitado
- Limpia el localStorage si está lleno
- Exporta tus datos antes de limpiar

### Error al importar datos

- Verifica que el archivo JSON sea válido
- Asegúrate de que el archivo sea un respaldo exportado desde esta aplicación

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

Copyright (c) 2026 Ing. Alexis Salvador Herrera Garcia, DTM

Se concede permiso, de forma gratuita, a cualquier persona que obtenga una copia
de este software y archivos de documentación asociados, para usar, copiar, modificar,
fusionar, publicar, distribuir, sublicenciar y/o vender copias del software, y para
permitir a las personas a quienes se les proporcione el software hacer lo mismo,
sujeto a las siguientes condiciones:

El aviso de copyright anterior y este aviso de permiso se incluirán en todas
las copias o partes sustanciales del software.

EL SOFTWARE SE PROPORCIONA "TAL CUAL", SIN GARANTÍA DE NINGÚN TIPO.

## 👨‍💻 Desarrollo

La aplicación está construida con:
- **React 18**: Framework de UI
- **Hooks**: useState, useEffect, useMemo, useCallback
- **localStorage**: Persistencia de datos
- **Google Fonts**: Playfair Display + Source Sans 3
- **Emojis Unicode**: Íconos sin dependencias externas

## 📞 Soporte

Para problemas o preguntas, revisa la consola del navegador para mensajes de error.

---

**Portal ISO 9001 + OEA — Agencia Aduanal México**  
*100% localStorage · Sin backend · Sin dependencias externas*
