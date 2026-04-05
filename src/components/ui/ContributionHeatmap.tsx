// Deterministic seeded RNG — same output every render/build
function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

const WEEKS = 52;
const DAYS = 7;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Generate 364 cells (52 weeks × 7 days) with activity level 0–4
const cells = Array.from({ length: WEEKS * DAYS }, (_, i) => {
  const r = seededRandom(i);
  if (r < 0.45) return 0;
  if (r < 0.62) return 1;
  if (r < 0.78) return 2;
  if (r < 0.91) return 3;
  return 4;
});

const LEVEL_CLASSES = [
  "bg-terminal-surface",
  "bg-git-green/20",
  "bg-git-green/40",
  "bg-git-green/70",
  "bg-git-green",
];

// Place month labels at week indices where month changes (approximate)
const MONTH_POSITIONS = [0, 4, 8, 13, 17, 22, 26, 30, 35, 39, 43, 48];

export function ContributionHeatmap() {
  return (
    <div className="py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="overflow-x-auto">
          {/* Month labels */}
          <div
            className="mb-1 text-[10px] font-mono text-text-faint"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))`,
              gap: "2px",
            }}
          >
            {Array.from({ length: WEEKS }, (_, w) => {
              const monthIdx = MONTH_POSITIONS.indexOf(w);
              return (
                <span key={w} className="overflow-hidden whitespace-nowrap">
                  {monthIdx >= 0 ? MONTHS[monthIdx] : ""}
                </span>
              );
            })}
          </div>

          {/* Cell grid — column-major (day within week) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${DAYS}, minmax(0, 1fr))`,
              gridAutoFlow: "column",
              gap: "2px",
            }}
          >
            {cells.map((level, i) => (
              <div
                key={i}
                title={`Activity level ${level}`}
                className={`w-3 h-3 rounded-sm ${LEVEL_CLASSES[level]} transition-opacity hover:opacity-80`}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="mt-2 flex items-center justify-end gap-1.5 text-[10px] font-mono text-text-faint">
            <span>Less</span>
            {LEVEL_CLASSES.map((cls, i) => (
              <div key={i} className={`w-3 h-3 rounded-sm ${cls}`} />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
