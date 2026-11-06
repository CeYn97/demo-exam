import { useEffect, useState } from 'react'
import type { ComponentProps } from 'react'

const INTERVAL_MS = 3000

const slides = [
  {
    src: '/slider/image13.webp',
    alt: 'Учебный класс с белыми столами и панорамными окнами, на стене оранжевый узор из ромбов',
  },
  {
    src: '/slider/image07.webp',
    alt: 'Светлая аудитория с белыми столами, деревянными стульями и экраном на стене',
  },
  {
    src: '/slider/image08.webp',
    alt: 'Компьютерный класс с мониторами на столах и проекционным экраном',
  },
  {
    src: '/slider/image10.webp',
    alt: 'Класс с деревянными столами, компьютерами у стены и маркерной доской',
  },
]

const icons = {
  previous: 'M15 5l-7 7 7 7',
  next: 'M9 5l7 7-7 7',
}

function ControlButton({
  icon,
  ...props
}: ComponentProps<'button'> & { icon: keyof typeof icons }) {
  return (
    <button
      type="button"
      className="grid size-11 cursor-pointer place-items-center rounded-[3px] border border-foil/60 text-foil transition-colors hover:bg-foil/15 active:bg-foil active:text-ink"
      {...props}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
        className="size-5"
      >
        <path d={icons[icon]} />
      </svg>
    </button>
  )
}

export function PhotoSlider() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setTimeout(
      () => setCurrent((index) => (index + 1) % slides.length),
      INTERVAL_MS,
    )
    return () => clearTimeout(timer)
  }, [current])

  function show(step: number) {
    setCurrent((current + step + slides.length) % slides.length)
  }

  return (
    <section
      aria-roledescription="карусель"
      aria-label="Фотографии учебных классов"
    >
      <div className="relative aspect-[3/2] bg-ink-soft/10">
        {slides.map((slide, index) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            width={960}
            height={640}
            aria-hidden={index !== current}
            fetchPriority={index === 0 ? 'high' : undefined}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ease-out motion-reduce:transition-none ${
              index === current ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      <div className="h-0.5">
        <div className="h-full bg-foil/25 motion-reduce:hidden">
          <div
            key={current}
            className="h-full origin-left bg-foil"
            style={{ animation: `slider-timer ${INTERVAL_MS}ms linear both` }}
          />
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <span className="mr-auto text-sm text-ink-soft">
          {current + 1} / {slides.length}
        </span>
        <ControlButton
          icon="previous"
          aria-label="Предыдущее фото"
          onClick={() => show(-1)}
        />
        <ControlButton
          icon="next"
          aria-label="Следующее фото"
          onClick={() => show(1)}
        />
      </div>
    </section>
  )
}
