import { useId, useState } from 'react'
import type { ComponentProps } from 'react'

type SelectFieldProps = ComponentProps<'select'> & {
  label: string
  placeholder?: string
  value?: string
  options: Array<[value: string, label: string]>
  error?: string
}

export function SelectField({
  label,
  placeholder,
  value,
  onChange,
  options,
  error,
  ...selectProps
}: SelectFieldProps) {
  const id = useId()
  const errorId = `${id}-error`
  const [ownValue, setOwnValue] = useState('')
  const current = value ?? ownValue
  const selected = options.find(([optionValue]) => optionValue === current)

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {}
      <div className="relative flex min-h-12 items-center rounded-sm border border-field bg-white py-2 pr-10 pl-3 transition-colors has-[select:hover]:border-ink has-[select:focus-visible]:outline-2 has-[select:focus-visible]:-outline-offset-1 has-[select:focus-visible]:outline-seal has-[select[aria-invalid=true]]:border-error has-[select[aria-invalid=true]:focus-visible]:outline-error">
        <span className={selected ? 'text-balance' : 'text-muted'}>
          {selected ? selected[1] : placeholder}
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
          className="absolute right-3 size-5"
        >
          <path d="M5 9l7 7 7-7" />
        </svg>
        <select
          id={id}
          value={current}
          onChange={(event) => {
            setOwnValue(event.target.value)
            onChange?.(event)
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
          {...selectProps}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map(([optionValue, optionLabel]) => (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p id={errorId} className="text-sm text-error">
          {error}
        </p>
      )}
    </div>
  )
}
