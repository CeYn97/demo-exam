import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { flushSync } from 'react-dom'

import type { FormErrors } from '#/auth'

export function useFormErrors() {
  const formRef = useRef<HTMLFormElement>(null)
  const [errors, setErrors] = useState<FormErrors>({})

  // Текст ошибки появляется вне фокуса: без переноса программа чтения с экрана о нём не сообщит.
  function showErrors(next: FormErrors) {
    flushSync(() => setErrors(next))
    formRef.current
      ?.querySelector<HTMLElement>('[aria-invalid="true"]')
      ?.focus()
  }

  function clearError(event: FormEvent<HTMLFormElement>) {
    const { name } = event.target as HTMLInputElement
    setErrors((current) => ({ ...current, [name]: '', form: '' }))
  }

  return { formRef, errors, setErrors, showErrors, clearError }
}
