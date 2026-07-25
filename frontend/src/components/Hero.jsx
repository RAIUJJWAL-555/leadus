const icons = [
  <svg key="i1" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  <svg key="i2" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  <svg key="i3" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  <svg key="i4" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  <svg key="i5" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>,
];

function DotPattern({ id, dotR = 2.2, gap = 9 }) {
  const cols = Math.ceil(600 / gap);
  const rows = Math.ceil(500 / gap);
  const dots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push(<circle key={`${r}-${c}`} cx={c * gap + gap / 2} cy={r * gap + gap / 2} r={dotR} fill="white" />);
    }
  }
  return (
    <pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse">
      {dots}
    </pattern>
  );
}

function HalftoneHands() {
  return (
    <svg viewBox="0 0 600 420" className="mx-auto w-full max-w-3xl" aria-hidden="true">
      <defs>
        <DotPattern id="dots" dotR={2.2} gap={9} />

        <mask id="halftone-mask">
          <rect width="600" height="420" fill="url(#dots)" />
        </mask>

        <radialGradient id="center-glow" cx="50%" cy="45%" r="30%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="center-glow-outer" cx="50%" cy="45%" r="45%">
          <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="left-hand-color" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9ca3af" />
          <stop offset="100%" stopColor="#6b7280" />
        </linearGradient>

        <linearGradient id="right-hand-color" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d4a574" />
          <stop offset="100%" stopColor="#b8885c" />
        </linearGradient>

        <mask id="fade-left">
          <linearGradient id="fade-left-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="40%" stopColor="white" stopOpacity="0.6" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </linearGradient>
          <rect width="300" height="420" fill="url(#fade-left-grad)" />
        </mask>

        <mask id="fade-right">
          <linearGradient id="fade-right-grad" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="40%" stopColor="white" stopOpacity="0.6" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </linearGradient>
          <rect x="300" width="300" height="420" fill="url(#fade-right-grad)" />
        </mask>
      </defs>

      {/* Glow behind center */}
      <ellipse cx="300" cy="190" rx="200" ry="160" fill="url(#center-glow-outer)" className="animate-pulse-glow" />

      {/* Left hand — cool gray halftone */}
      <g mask="url(#halftone-mask)">
        <g mask="url(#fade-left)">
          <path
            d="M-20 420 C10 380, 30 320, 40 280 C45 260, 50 240, 55 220 C58 208, 52 200, 48 195
               C44 190, 38 188, 35 192 C32 196, 30 204, 32 210
               C28 200, 20 195, 16 198 C12 201, 10 210, 14 216
               C8 208, 0 206, -4 210 C-8 214, -6 224, 0 228
               C-6 222, -14 220, -18 224 C-22 228, -20 238, -14 242
               C-22 238, -30 236, -34 240 C-38 244, -36 256, -28 260
               C-36 258, -44 260, -46 266 C-48 272, -42 282, -34 284
               C10 300, 50 340, 70 380 C80 400, 60 420, 20 420 Z"
            fill="url(#left-hand-color)"
            opacity="0.85"
          />
        </g>
      </g>

      {/* Right hand — warm skin-tone halftone */}
      <g mask="url(#halftone-mask)">
        <g mask="url(#fade-right)">
          <path
            d="M620 420 C590 380, 570 320, 560 280 C555 260, 550 240, 545 220 C542 208, 548 200, 552 195
               C556 190, 562 188, 565 192 C568 196, 570 204, 568 210
               C572 200, 580 195, 584 198 C588 201, 590 210, 586 216
               C592 208, 600 206, 604 210 C608 214, 606 224, 600 228
               C606 222, 614 220, 618 224 C622 228, 620 238, 614 242
               C622 238, 630 236, 634 240 C638 244, 636 256, 628 260
               C636 258, 644 260, 646 266 C648 272, 642 282, 634 284
               C590 300, 550 340, 530 380 C520 400, 540 420, 580 420 Z"
            fill="url(#right-hand-color)"
            opacity="0.85"
          />
        </g>
      </g>

      {/* Center geometric crystal */}
      <g className="animate-float">
        {/* Outer glow */}
        <circle cx="300" cy="190" r="40" fill="url(#center-glow)" className="animate-pulse-glow" />

        {/* Crystal shape */}
        <polygon
          points="300,155 315,175 315,205 300,225 285,205 285,175"
          fill="none"
          stroke="#c4b5fd"
          strokeWidth="1.5"
          opacity="0.9"
        />
        <polygon
          points="300,160 312,177 312,203 300,220 288,203 288,177"
          fill="#7c3aed"
          opacity="0.3"
        />
        <line x1="300" y1="155" x2="300" y2="225" stroke="#c4b5fd" strokeWidth="0.5" opacity="0.5" />
        <line x1="285" y1="175" x2="315" y2="205" stroke="#c4b5fd" strokeWidth="0.5" opacity="0.4" />
        <line x1="315" y1="175" x2="285" y2="205" stroke="#c4b5fd" strokeWidth="0.5" opacity="0.4" />

        {/* Inner sparkle */}
        <circle cx="300" cy="190" r="3" fill="white" opacity="0.8" />
      </g>

      {/* Icons row below */}
      <g transform="translate(240, 260)" className="text-neutral-500">
        {icons.map((icon, i) => (
          <g key={i} transform={`translate(${i * 30}, 0)`}>
            <use href={`#icon-${i}`} />
          </g>
        ))}
      </g>
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-black pt-32 pb-8 md:pt-40 md:pb-12">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[600px] rounded-full bg-violet-600/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-white md:text-7xl">
          Your Next Client
          <br />
          <span className="text-neutral-400">Is One Form Away</span>
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-base text-neutral-500 md:text-lg">
          A lightweight lead capture tool built for agencies.
          <br className="hidden sm:block" />
          Track every prospect from first touch to closed deal — no bloat, no complexity.
        </p>

        <a
          href="#form"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-transparent px-6 py-3 text-sm font-medium text-white transition-all hover:border-neutral-500 hover:bg-white/5"
        >
          Get Started
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      {/* Halftone hands visual */}
      <div className="relative z-10 mt-12 md:mt-16">
        <HalftoneHands />

        {/* Icons row */}
        <div className="mx-auto mt-6 flex max-w-xs items-center justify-center gap-6 text-neutral-600">
          {icons}
        </div>
      </div>
    </section>
  );
}
