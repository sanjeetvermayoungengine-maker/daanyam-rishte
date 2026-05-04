import { ReactNode } from "react";

export function BackButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-none border-0 bg-none px-0 py-0 text-xs font-bold uppercase tracking-widest text-slate-500 transition-colors hover:text-slate-900"
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path
          d="M10 3L5 8L10 13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {children}
    </button>
  );
}

export function Heading({
  children,
  size = "clamp(2.125rem, 7vw, 3.25rem)",
}: {
  children: ReactNode;
  size?: string;
}) {
  return (
    <h1
      className="font-cormorant leading-tight tracking-tight text-slate-900"
      style={{
        fontSize: size,
        fontWeight: 500,
        letterSpacing: "-0.02em",
        margin: 0,
      }}
    >
      {children}
    </h1>
  );
}

export function Eyebrow({
  children,
  color = "text-amber-600",
}: {
  children: ReactNode;
  color?: string;
}) {
  return (
    <p className={`mb-4 text-sm font-black uppercase tracking-widest ${color}`}>
      {children}
    </p>
  );
}

export function SubLine({ children }: { children: ReactNode }) {
  return (
    <p className="font-cormorant mt-4 max-w-xl text-xl italic leading-relaxed text-slate-600">
      {children}
    </p>
  );
}

export function Ornament({
  color = "text-amber-600",
}: {
  color?: string;
}) {
  return (
    <div className="my-6 flex items-center gap-2.5">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-600/35 to-transparent" />
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={color}>
        <path
          d="M7 1L8.5 5.5L13 7L8.5 8.5L7 13L5.5 8.5L1 7L5.5 5.5L7 1Z"
          fill="currentColor"
        />
      </svg>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-600/35 to-transparent" />
    </div>
  );
}
