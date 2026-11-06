import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

const TOAST_MS = 4000

const ToastContext = createContext<(message: string) => void>(() => {})

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ id: number; message: string } | null>(
    null,
  )

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), TOAST_MS)
    return () => clearTimeout(timer)
  }, [toast])

  function show(message: string) {
    setToast({ id: Date.now(), message })
  }

  return (
    <ToastContext.Provider value={show}>
      {children}
      {/* Контейнер есть на странице заранее: иначе программа чтения с экрана не объявит первое сообщение. */}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md"
      >
        {toast && (
          <p
            key={toast.id}
            className="toast-in rounded-[3px] border border-foil bg-ink px-4 py-3 text-white outline-2 outline-ground"
          >
            {toast.message}
          </p>
        )}
      </div>
    </ToastContext.Provider>
  )
}
