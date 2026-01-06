'use client'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export function Logo({ className = '', size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 24, text: 'text-lg' },
    md: { icon: 32, text: 'text-xl' },
    lg: { icon: 48, text: 'text-3xl' },
  }

  const { icon, text } = sizes[size]

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Battery outline */}
        <rect
          x="6"
          y="12"
          width="32"
          height="24"
          rx="3"
          className="stroke-current"
          strokeWidth="2.5"
          fill="none"
        />
        {/* Battery terminal */}
        <rect
          x="38"
          y="19"
          width="6"
          height="10"
          rx="1"
          className="fill-current"
        />
        {/* Lightning bolt - representing VPP energy */}
        <path
          d="M26 14L18 24H24L22 34L30 24H24L26 14Z"
          className="fill-accent"
        />
        {/* Power flow dots */}
        <circle cx="12" cy="24" r="2" className="fill-current opacity-60" />
      </svg>
      {showText && (
        <span className={`font-display font-bold ${text}`}>
          VPP Finder
        </span>
      )}
    </div>
  )
}

export function LogoIcon({ className = '', size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Battery outline */}
      <rect
        x="6"
        y="12"
        width="32"
        height="24"
        rx="3"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
      />
      {/* Battery terminal */}
      <rect
        x="38"
        y="19"
        width="6"
        height="10"
        rx="1"
        fill="currentColor"
      />
      {/* Lightning bolt */}
      <path
        d="M26 14L18 24H24L22 34L30 24H24L26 14Z"
        fill="#10b981"
      />
      {/* Power flow dot */}
      <circle cx="12" cy="24" r="2" fill="currentColor" opacity="0.6" />
    </svg>
  )
}
