import type { Breadcrumb } from "../types";

// Display positions are local to each project; database IDs stay unchanged.
export const breadcrumbNumber = (index: number) =>
  `#${String(index + 1).padStart(3, "0")}`;
const colors = ["#969ba4", "#b7a8e4", "#83bda0", "#71a9e6", "#df9fa5"];
export function nodeColor(index: number) {
  return colors[index % colors.length];
}

type Props = {
  breadcrumbs: Breadcrumb[];
  selectedId?: number;
  onSelect: (breadcrumb: Breadcrumb) => void;
  onCreate: () => void;
};
export default function Trail({
  breadcrumbs,
  selectedId,
  onSelect,
  onCreate,
}: Props) {
  const selectedIndex = breadcrumbs.findIndex((b) => b.id === selectedId);
  // Keep the selected checkpoint in the five-node window, even on long trails.
  const start = Math.max(
    0,
    Math.min(selectedIndex - 2, breadcrumbs.length - 5),
  );
  const visible = breadcrumbs.slice(start, start + 5);
  const continuation = breadcrumbs[start + 5];
  const ys = [135, 190, 130, 173, 97];
  const points = visible.map((_, i) => ({ x: 45 + i * 133, y: ys[i] }));
  const last = points.at(-1);
  const ghost = last ? { x: last.x + 140, y: last.y - 15 } : { x: 45, y: 135 };
  const all = [...points, ghost];
  const path = all.reduce(
    (d, p, i) =>
      i === 0
        ? `M ${p.x} ${p.y}`
        : `${d} C ${all[i - 1].x + 65} ${all[i - 1].y}, ${p.x - 65} ${p.y}, ${p.x} ${p.y}`,
    "",
  );
  if (!breadcrumbs.length)
    return (
      <div className="empty">
        <p>Your trail starts with one small step.</p>
        <button className="btn" onClick={onCreate}>
          Leave your first breadcrumb
        </button>
      </div>
    );
  return (
    <div className="overflow-x-auto" aria-label="Breadcrumb trail">
      <div className="relative h-[315px] min-w-[740px]">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 740 315"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d={path}
            fill="none"
            stroke="#c9c7cd"
            strokeWidth="1.2"
            strokeDasharray="4 5"
          />
        </svg>
        {visible.map((b, i) => (
          <button
            key={b.id}
            onClick={() => onSelect(b)}
            aria-pressed={b.id === selectedId}
            className="group absolute w-28 text-left font-mono text-xs"
            style={{
              left: `${(points[i].x / 740) * 100}%`,
              top: points[i].y - 9,
              transform: "translateX(-9px)",
            }}
          >
            {b.id === selectedId && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-[64px] left-[6px] h-[60px] w-[140px] text-muted"
              >
                <span className="script absolute left-2 top-0 -rotate-6 whitespace-nowrap text-base leading-5">
                  you are here
                </span>
                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 140 60"
                  fill="none"
                >
                  <path
                    d="M 38 26 Q 35 36, 16 47"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 18 37 L 16 47 L 26 47"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            )}
            <span
              className={`block size-[18px] rounded-full border border-black/5 transition-shadow group-hover:ring-4 group-hover:ring-rose ${b.id === selectedId ? "outline outline-2 outline-offset-[7px] outline-rose" : ""}`}
              style={{ background: nodeColor(start + i) }}
            />
            <span className="mt-4 block font-semibold">
              {breadcrumbNumber(start + i)}
            </span>
            <span className="mt-1 line-clamp-3 pr-2 leading-4">{b.title}</span>
            <span className="mt-2 block text-[10px] text-muted">{b.date}</span>
          </button>
        ))}
        <button
          onClick={() => (continuation ? onSelect(continuation) : onCreate())}
          className="absolute w-24 text-left font-mono text-xs text-muted"
          style={{
            left: `${(ghost.x / 740) * 100}%`,
            top: ghost.y - 9,
            transform: "translateX(-9px)",
          }}
          aria-label={
            continuation ? "Show more checkpoints" : "Add next breadcrumb"
          }
        >
          <span className="block size-[18px] rounded-full border-2 border-line bg-app" />
          <span className="mt-4 block">
            Next
            <br />
            {continuation ? "More checkpoints →" : "Small step…"}
          </span>
        </button>
      </div>
    </div>
  );
}
