export function Brand({ large = false }: { large?: boolean }) {
  return (
    <p
      className={`flex items-center font-stamp leading-none text-foil ${
        large ? 'gap-3 text-[min(11.5vw,44px)]' : 'gap-2.5 text-[23px]'
      }`}
    >
      <svg
        viewBox="6 5 120 80"
        aria-hidden="true"
        className={large ? 'h-9 w-[54px]' : 'h-6 w-9'}
      >
        <path
          className="fill-foil"
          fillRule="evenodd"
          d="M66 6l48.5 18L97 30.5V49Q66 68.6 35 49V30.5L17.5 24zm0 4.5L29.8 24 66 37.2 102.2 24zM39.2 32v14.8q26.8 16 53.6 0V32L66 41.5z"
        />
        <path
          className="fill-white"
          d="M27.2 45.5 17.5 64.5C32 62.5 52 65 65.5 83.5 52 68.5 30 65 8 71.3zM6.5 79.3C20 70.5 40 70 65.5 83.5 50 77.5 30 75.5 6.5 79.3zM104.8 45.5 114.5 64.5C100 62.5 80 65 66.5 83.5 80 68.5 102 65 124 71.3zM125.5 79.3C112 70.5 92 70 66.5 83.5 82 77.5 102 75.5 125.5 79.3z"
        />
      </svg>
      Корочки.есть
    </p>
  )
}
