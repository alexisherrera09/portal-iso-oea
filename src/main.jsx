/**
 * @fileoverview Punto de entrada principal de la aplicación
 * @copyright Copyright (c) 2026 Ing. Alexis Salvador Herrera Garcia, DTM
 * @license MIT
 */

import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
