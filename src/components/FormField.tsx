import { useId } from 'react'
import type { ComponentProps } from 'react'

type FormFieldProps = ComponentProps<'input'> & {
  label: string
  error?: string
}

export function FormField({ label, error, ...inputProps }: FormFieldProps) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="h-12 w-full rounded-sm border border-field bg-white px-3 text-base transition-colors placeholder:text-muted hover:border-ink aria-invalid:border-error"
        {...inputProps}
      />
      {error && (
        <p id={errorId} className="text-sm text-error">
          {error}
        </p>
      )}
    </div>
  )
}
