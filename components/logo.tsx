// O arquivo da logo fica em public/logo.png (troque por sua arte quando quiser).
export function LogoIcon({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="Farmácia do Povo"
      className={`object-contain${className ? ` ${className}` : ""}`}
    />
  )
}
