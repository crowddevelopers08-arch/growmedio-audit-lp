export function Container({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={`mx-auto w-full max-w-[1180px] pl-[max(16px,env(safe-area-inset-left,0px))] pr-[max(16px,env(safe-area-inset-right,0px))] ${className}`}
    >
      {children}
    </div>
  );
}
