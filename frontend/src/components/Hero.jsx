const icons = [
  <svg key="i1" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  <svg key="i2" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  <svg key="i3" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  <svg key="i4" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  <svg key="i5" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>,
];

function DotPattern({ id, dotR = 1.6, gap = 6.5 }) {
  return (
    <pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse">
      <circle cx={gap / 2} cy={gap / 2} r={dotR} fill="white" />
    </pattern>
  );
}

function HalftoneHands() {
  return (
    <svg viewBox="0 0 600 420" className="mx-auto w-full max-w-3xl" aria-hidden="true">
      <defs>
        <DotPattern id="dots" dotR={1.6} gap={6.5} />

        <mask id="halftone-mask">
          <rect width="600" height="420" fill="url(#dots)" />
        </mask>

        <radialGradient id="center-glow" cx="50%" cy="50%" r="40%">
          <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="center-glow-outer" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="left-hand-color" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>

        <linearGradient id="right-hand-color" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#db2777" />
          <stop offset="50%" stopColor="#d946ef" />
          <stop offset="100%" stopColor="#8b5cf6" />
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

      {/* Left hand — cool blue/indigo/cyan halftone */}
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
            opacity="0.9"
          />
        </g>
      </g>

      {/* Left hand wireframe outline */}
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
          fill="none"
          stroke="url(#left-hand-color)"
          strokeWidth="1.2"
          opacity="0.25"
          strokeDasharray="4 4"
        />
      </g>

      {/* Right hand — warm pink/fuchsia/purple halftone */}
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
            opacity="0.9"
          />
        </g>
      </g>

      {/* Right hand wireframe outline */}
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
          fill="none"
          stroke="url(#right-hand-color)"
          strokeWidth="1.2"
          opacity="0.25"
          strokeDasharray="4 4"
        />
      </g>

      {/* Center geometric crystal & Orbiting Ring */}
      <g className="animate-float">
        {/* Outer glow */}
        <circle cx="300" cy="190" r="50" fill="url(#center-glow)" className="animate-pulse-glow" />

        {/* Orbiting rings */}
        <ellipse
          cx="300"
          cy="190"
          rx="52"
          ry="15"
          fill="none"
          stroke="url(#left-hand-color)"
          strokeWidth="1.5"
          opacity="0.75"
          className="animate-orbit"
          strokeDasharray="80 20"
        />
        <ellipse
          cx="300"
          cy="190"
          rx="68"
          ry="20"
          fill="none"
          stroke="url(#right-hand-color)"
          strokeWidth="1"
          opacity="0.5"
          className="animate-orbit-reverse"
          strokeDasharray="40 40"
        />

        {/* Crystal shape */}
        <polygon
          points="300,150 318,173 318,207 300,230 282,207 282,173"
          fill="none"
          stroke="#c4b5fd"
          strokeWidth="2"
          opacity="0.9"
        />
        <polygon
          points="300,155 314,175 314,205 300,225 286,205 286,175"
          fill="url(#left-hand-color)"
          opacity="0.3"
        />
        <line x1="300" y1="150" x2="300" y2="230" stroke="#c4b5fd" strokeWidth="0.75" opacity="0.6" />
        <line x1="282" y1="173" x2="318" y2="207" stroke="#c4b5fd" strokeWidth="0.75" opacity="0.5" />
        <line x1="318" y1="173" x2="282" y2="207" stroke="#c4b5fd" strokeWidth="0.75" opacity="0.5" />

        {/* Inner sparkle */}
        <circle cx="300" cy="190" r="4" fill="white" opacity="0.9" className="animate-pulse" />
      </g>
    </svg>
  );
}

export default function Hero({ onGetStarted }) {
  return (
    <section className="relative overflow-hidden bg-black pt-36 pb-12 md:pt-44 md:pb-20">
      {/* Background Grid */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-35" />

      {/* Background radial glows */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-[120px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
        <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-purple-500/5 blur-[150px] animate-pulse-glow" />
      </div>
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <h1 className="text-5xl font-black tracking-tight md:text-7xl leading-tight">
          <span className="bg-gradient-to-b from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
            Your Next Client
          </span>
          <br />
          <span className="bg-gradient-to-r from-amber-200 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent text-glow">
            Is One Form Away
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base text-neutral-400 md:text-lg leading-relaxed">
          A lightweight lead capture tool built for agencies.
          <br className="hidden sm:block" />
          Track every prospect from first touch to closed deal — <span className="text-white">no bloat</span>, <span className="text-white">no complexity</span>.
        </p>

        <button
          onClick={onGetStarted}
          className="group relative mt-8 inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] cursor-pointer"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-purple-100 to-cyan-100 opacity-0 transition-opacity group-hover:opacity-100" />
          <span className="relative flex items-center gap-2">
            Contact Form
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </button>
      </div>

      {/* Halftone hands visual */}
      <div className="relative z-10 mt-12 md:mt-16">
        <HalftoneHands />

        {/* Icons row wrapped in a premium floating glassmorphic dock */}
        <div className="mx-auto mt-8 flex max-w-xs items-center justify-center gap-6 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 backdrop-blur-md text-neutral-400">
          {icons.map((icon, i) => (
            <div key={i} className="transition-all hover:scale-120 hover:text-purple-400 cursor-pointer">
              {icon}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
