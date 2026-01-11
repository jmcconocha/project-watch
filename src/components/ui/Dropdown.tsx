import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
  type KeyboardEvent,
} from 'react'
import { ChevronDown } from 'lucide-react'

export interface DropdownOption {
  value: string
  label: string
  icon?: ReactNode
  disabled?: boolean
}

export interface DropdownProps {
  options: DropdownOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  disabled,
  className = '',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  const enabledOptions = options.filter((opt) => !opt.disabled)

  const close = useCallback(() => {
    setIsOpen(false)
    setHighlightedIndex(-1)
  }, [])

  const handleSelect = useCallback(
    (option: DropdownOption) => {
      if (!option.disabled) {
        onChange?.(option.value)
        close()
      }
    },
    [onChange, close]
  )

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (isOpen && highlightedIndex >= 0) {
          const option = enabledOptions[highlightedIndex]
          if (option) handleSelect(option)
        } else {
          setIsOpen(true)
        }
        break
      case 'ArrowDown':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        } else {
          setHighlightedIndex((prev) =>
            prev < enabledOptions.length - 1 ? prev + 1 : 0
          )
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (isOpen) {
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : enabledOptions.length - 1
          )
        }
        break
      case 'Escape':
        e.preventDefault()
        close()
        break
      case 'Tab':
        close()
        break
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        close()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, close])

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [isOpen, highlightedIndex])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`
          w-full h-10 px-3 rounded-md border bg-white dark:bg-slate-950
          text-left flex items-center justify-between gap-2
          transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isOpen ? 'border-cyan-500 ring-2 ring-cyan-500' : 'border-slate-300 dark:border-slate-700'}
        `}
      >
        <span
          className={
            selectedOption
              ? 'text-slate-900 dark:text-slate-100'
              : 'text-slate-400 dark:text-slate-500'
          }
        >
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          className="
            absolute z-50 w-full mt-1 py-1
            bg-white dark:bg-slate-900
            border border-slate-200 dark:border-slate-700
            rounded-md shadow-lg max-h-60 overflow-auto
          "
        >
          {options.map((option) => {
            const enabledIndex = enabledOptions.indexOf(option)
            const isHighlighted = enabledIndex === highlightedIndex
            const isSelected = option.value === value

            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => {
                  if (!option.disabled) {
                    setHighlightedIndex(enabledIndex)
                  }
                }}
                className={`
                  px-3 py-2 flex items-center gap-2 cursor-pointer
                  transition-colors duration-75
                  ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  ${isHighlighted ? 'bg-slate-100 dark:bg-slate-800' : ''}
                  ${isSelected ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-900 dark:text-slate-100'}
                `}
              >
                {option.icon && (
                  <span className="shrink-0 w-4 h-4">{option.icon}</span>
                )}
                <span>{option.label}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
