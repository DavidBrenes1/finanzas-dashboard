import { useState } from 'react'

interface Props {
  csv: string
  fileName: string
  rows: number
  onClose: () => void
}

/**
 * Panel de exportación: ofrece descargar el archivo o copiar el texto.
 * Copiar sirve como respaldo en entornos donde las descargas están bloqueadas (iframes, embeds).
 */
export function ExportPanel({ csv, fileName, rows, onClose }: Props) {
  const [copied, setCopied] = useState(false)

  function download() {
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }) // BOM: Excel lee bien las tildes
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(csv)
      setCopied(true)
    } catch {
      // Respaldo: seleccionar el texto para que el usuario lo copie a mano
      const el = document.getElementById('csv-preview') as HTMLTextAreaElement | null
      el?.select()
    }
  }

  return (
    <div
      className="fixed inset-0 z-20 grid place-items-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-title"
      onClick={onClose}
    >
      <div className="w-full max-w-lg rounded-2xl border border-line bg-surface p-5" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h2 id="export-title" className="font-semibold">
            Exportar {rows} movimientos
          </h2>
          <button onClick={onClose} aria-label="Cerrar" className="rounded-md p-1 text-muted hover:text-ink">
            ✕
          </button>
        </div>
        <textarea
          id="csv-preview"
          readOnly
          value={csv}
          className="tabular h-40 w-full resize-none rounded-lg border border-line bg-page p-3 font-mono text-xs text-ink-2"
        />
        <div className="mt-3 flex gap-2">
          <button onClick={download} className="flex-1 rounded-lg bg-brand py-2 text-sm font-semibold text-white hover:bg-brand-strong">
            Descargar {fileName}
          </button>
          <button onClick={copy} className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink-2 hover:text-ink">
            {copied ? 'Copiado ✓' : 'Copiar'}
          </button>
        </div>
      </div>
    </div>
  )
}
