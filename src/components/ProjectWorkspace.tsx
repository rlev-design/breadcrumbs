import projectRooftopDusk from "../assets/project-rooftop-dusk.png";
import { useState } from "react";
import { ArrowRight, GitBranch, Image, Settings2 } from "lucide-react";
import type { Breadcrumb, Project } from "../types";
import Trail, { breadcrumbNumber, nodeColor } from "./Trail";

type Props = {
  project: Project;
  selectedBreadcrumb: Breadcrumb | null;
  onSelectBreadcrumb: (breadcrumb: Breadcrumb) => void;
  onCreateBreadcrumb: () => void;
  onEditProject: () => void;
};
export default function ProjectWorkspace({
  project,
  selectedBreadcrumb,
  onSelectBreadcrumb,
  onCreateBreadcrumb,
  onEditProject,
}: Props) {
  const [tab, setTab] = useState("Trail");
  const [view, setView] = useState("Timeline");
  const [showAll, setShowAll] = useState(false);
  const recent = [...project.breadcrumbs].reverse();
  return (
    <section className="min-w-0 overflow-y-auto">
      <header className="border-b border-line px-7 pt-6">
        <div className="flex min-h-28 items-start justify-between gap-5">
          <div className="flex min-w-0 gap-4 pt-2">
            <span
              className="mt-2 size-6 shrink-0 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <div className="min-w-0">
              <h2 className="break-words text-[28px] font-semibold tracking-tight">
                {project.name}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Small steps, saved along the way.
              </p>
            </div>
          </div>
          <div className="relative hidden h-28 w-48 shrink-0 overflow-hidden rounded-lg xl:block">
            <img
              src={projectRooftopDusk}
              alt="A dark rooftop with a warm window beneath a muted mauve dusk sky"
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />
            <p className="script absolute right-3 top-4 z-10 w-20 -rotate-12 text-left text-xs leading-4 text-white">
              <span className="block">same</span>
              <span className="block pl-2">dreams,</span>
              <span className="block pl-3">different</span>
              <span className="block pl-5">days.</span>
            </p>
          </div>
        </div>
        <nav
          aria-label="Project sections"
          className="mt-5 flex gap-5 overflow-x-auto"
        >
          {["Trail", "Overview", "Files", "Notes", "Settings"].map((item) => (
            <button
              key={item}
              aria-current={tab === item ? "page" : undefined}
              onClick={() => {
                if (item === "Settings") onEditProject();
                else setTab(item);
              }}
              className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm transition-colors hover:text-ink ${tab === item ? "border-ink font-semibold" : "border-transparent text-muted"}`}
            >
              {item}
            </button>
          ))}
        </nav>
      </header>
      {tab === "Trail" && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 px-7 pt-5">
            <div className="flex gap-2">
              {["Timeline", "Paths", "Gallery"].map((item) => (
                <button
                  key={item}
                  disabled={item === "Paths"}
                  title={
                    item === "Paths"
                      ? "Branches are not part of the current data model"
                      : undefined
                  }
                  aria-pressed={view === item}
                  onClick={() => setView(item)}
                  className={`btn ${view === item ? "btn-primary" : ""}`}
                >
                  {item}
                </button>
              ))}
            </div>
            <span className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-xs text-muted">
              <GitBranch size={15} /> main
            </span>
          </div>
          <div className="px-5">
            {view === "Timeline" ? (
              <Trail
                breadcrumbs={project.breadcrumbs}
                selectedId={selectedBreadcrumb?.id}
                onSelect={onSelectBreadcrumb}
                onCreate={onCreateBreadcrumb}
              />
            ) : (
              <div className="grid grid-cols-2 gap-3 py-6">
                {recent.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => onSelectBreadcrumb(b)}
                    aria-pressed={b.id === selectedBreadcrumb?.id}
                    className={`rounded-xl border p-4 text-left ${b.id === selectedBreadcrumb?.id ? "border-rose bg-rose" : "border-line bg-panel hover:bg-white"}`}
                  >
                    <span className="font-mono text-xs text-muted">
                      {breadcrumbNumber(
                        project.breadcrumbs.findIndex(
                          (item) => item.id === b.id,
                        ),
                      )}
                    </span>
                    <h3 className="mt-3 text-sm font-semibold">{b.title}</h3>
                    <p className="mt-2 line-clamp-3 text-xs leading-5 text-muted">
                      {b.whatChanged || "A small step forward."}
                    </p>
                  </button>
                ))}
                {!recent.length && (
                  <p className="empty col-span-2">No breadcrumbs yet.</p>
                )}
              </div>
            )}
          </div>
          <div className="px-6 pb-8">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium">Recent breadcrumbs</h3>
              {recent.length > 5 && (
                <button
                  className="btn border-transparent text-xs text-muted"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? "Show recent" : "See all"}
                  <ArrowRight size={13} />
                </button>
              )}
            </div>
            {recent.slice(0, showAll ? undefined : 5).map((b) => (
              <button
                key={b.id}
                onClick={() => onSelectBreadcrumb(b)}
                aria-pressed={b.id === selectedBreadcrumb?.id}
                className={`my-1 flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left transition-colors ${b.id === selectedBreadcrumb?.id ? "bg-rose/75" : "hover:bg-sidebar/50"}`}
              >
                <span
                  className="size-3.5 shrink-0 rounded-full"
                  style={{
                    background: nodeColor(project.breadcrumbs.indexOf(b)),
                  }}
                />
                <span className="hidden font-mono text-[11px] text-muted xl:block">
                  {breadcrumbNumber(
                    project.breadcrumbs.findIndex((item) => item.id === b.id),
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">
                    {b.title}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted">
                    {b.whatChanged || "A checkpoint on your journey."}
                  </span>
                </span>
                <span className="shrink-0 text-[11px] text-muted">
                  {b.date}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
      {tab === "Overview" && (
        <div className="p-7">
          <p className="eyebrow">Your progress</p>
          <h3 className="mt-3 text-3xl font-semibold">
            {project.breadcrumbs.length} breadcrumbs
          </h3>
          <p className="mt-3 text-sm text-muted">
            Every checkpoint is a way back into your work.
          </p>
          <button className="btn mt-6" onClick={onEditProject}>
            <Settings2 size={15} /> Edit project
          </button>
        </div>
      )}
      {tab === "Files" && (
        <div className="empty">
          <Image size={28} strokeWidth={1.3} />
          <h3 className="font-medium text-ink">A home for your files, soon.</h3>
          <p>Attachments aren’t supported in this version yet.</p>
        </div>
      )}
      {tab === "Notes" && (
        <div className="space-y-4 p-7">
          {recent
            .filter((b) => b.noteToFutureMe)
            .map((b) => (
              <button
                key={b.id}
                onClick={() => onSelectBreadcrumb(b)}
                className="block w-full rounded-xl bg-rose p-5 text-left"
              >
                <span className="text-sm font-semibold">{b.title}</span>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted">
                  {b.noteToFutureMe}
                </p>
              </button>
            ))}
          {!recent.some((b) => b.noteToFutureMe) && (
            <p className="empty">Notes to your future self will appear here.</p>
          )}
        </div>
      )}
    </section>
  );
}
