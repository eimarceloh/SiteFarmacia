export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 54"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect x="4" y="10" width="11" height="40" rx="5.5" fill="#B73336" />
      <rect x="4" y="10" width="33" height="11" rx="5.5" fill="#B73336" />
      <rect x="4" y="25" width="24" height="11" rx="5.5" fill="#B73336" />
      <path d="M13 18 C9 9 17 4 26 8 C21 11 16 15 13 18Z" fill="#18913D" />
      <path d="M17 13 C14 4 24 1 30 5 C25 7 20 10 17 13Z" fill="#18913D" />
      <path d="M21 9 C19 2 28 0 31 4 C27 4 23 6 21 9Z" fill="#18913D" opacity="0.75" />
    </svg>
  )
}
