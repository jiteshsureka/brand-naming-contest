export function NetworkVisual() {
  const nodes = [
    { x: 60, y: 90 }, { x: 160, y: 40 }, { x: 260, y: 110 },
    { x: 360, y: 50 }, { x: 440, y: 130 }, { x: 200, y: 190 },
    { x: 340, y: 210 }, { x: 480, y: 60 },
  ];
  const edges: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 4], [1, 5], [5, 6], [6, 4], [3, 7], [7, 4], [2, 5],
  ];

  return (
    <svg
      viewBox="0 0 520 260"
      className="w-full h-auto max-w-xl mx-auto drift"
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.05" />
        </linearGradient>
        <radialGradient id="nodeGlow">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          stroke="url(#edgeGrad)" strokeWidth="1.5" className="flow-line"
          style={{ animationDelay: `${i * 0.3}s` }}
        />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r="16" fill="url(#nodeGlow)" />
          <circle
            cx={n.x} cy={n.y} r="4" fill="var(--accent)"
            className="pulse-dot" style={{ animationDelay: `${i * 0.2}s`, transformOrigin: `${n.x}px ${n.y}px` }}
          />
        </g>
      ))}
    </svg>
  );
}
