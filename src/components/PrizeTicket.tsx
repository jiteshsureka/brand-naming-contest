export function PrizeTicket({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`relative inline-flex items-stretch rounded-2xl overflow-hidden shadow-[0_20px_50px_-20px_rgba(255,107,74,0.5)] rotate-[-3deg] hover:rotate-0 transition-transform duration-300 ${
        compact ? "text-sm" : "text-base"
      }`}
    >
      <div
        className={`flex flex-col justify-center gap-1 bg-accent text-white ${compact ? "px-4 py-3" : "px-6 py-5"}`}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] opacity-80">Grand Prize</span>
        <span className={`font-display font-semibold ${compact ? "text-base" : "text-xl"}`}>
          Win a Flight ✈
        </span>
      </div>
      <div className="relative flex items-center px-3 bg-panel">
        <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-background" />
        <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-background" />
        <span
          className="border-l-2 border-dashed h-[70%]"
          style={{ borderColor: "var(--panel-border)" }}
        />
      </div>
      <div className={`flex items-center gap-2 bg-panel border border-panel-border border-l-0 font-mono font-medium ${compact ? "px-4 text-xs" : "px-6 text-sm"}`}>
        <span>DAC</span>
        <span className="text-accent">✈</span>
        <span>CXB</span>
        <span className="text-accent">✈</span>
        <span>DAC</span>
      </div>
    </div>
  );
}
