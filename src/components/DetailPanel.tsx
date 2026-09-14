import {
  ArrowLeft,
  ArrowRight,
  ClipboardCheck,
  Gift,
  Link,
  Paperclip,
  Pencil,
  Route,
  StickyNote,
} from "lucide-react";
import { motion } from "motion/react";
import type { Breadcrumb, Project } from "../types";
import { breadcrumbNumber } from "./Trail";

type Props = {
  project: Project | null;
  breadcrumb: Breadcrumb | null;
  onEdit: () => void;
  onSelect: (breadcrumb: Breadcrumb) => void;
};
export default function DetailPanel({
  project,
  breadcrumb,
  onEdit,
  onSelect,
}: Props) {
  if (!breadcrumb)
    return (
      <div className="empty h-full">
        <Route size={30} strokeWidth={1.2} />
        <h2 className="font-medium text-ink">Your next step starts here.</h2>
        <p>
          {project
            ? "Select a breadcrumb, or leave your first one."
            : "Create a project to begin."}
        </p>
      </div>
    );
  const index =
    project?.breadcrumbs.findIndex((b) => b.id === breadcrumb.id) ?? -1;
  const previous = project?.breadcrumbs[index - 1];
  const next = project?.breadcrumbs[index + 1];
  return (
    <motion.div
      key={breadcrumb.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
    >
      <header>
        <div className="flex items-center justify-between gap-3 text-xs text-muted">
          <span className="font-mono">{breadcrumbNumber(index)}</span>
          <span className="ml-auto">{breadcrumb.date}</span>
          <button
            className="icon-btn"
            aria-label="Edit breadcrumb"
            onClick={onEdit}
          >
            <Pencil size={15} />
          </button>
        </div>
        <h2 className="mt-3 break-words text-2xl font-semibold tracking-tight">
          {breadcrumb.title}
        </h2>
        <span className="mt-4 inline-flex max-w-full items-center gap-2 rounded-full bg-rose px-3 py-1 text-xs">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ background: project?.color }}
          />
          <span className="truncate">{project?.name}</span>
        </span>
      </header>
      <section className="mt-8">
        <h3 className="flex items-center gap-3 text-sm font-semibold">
          <Gift size={17} /> What changed
        </h3>
        <p className="mt-2 whitespace-pre-wrap break-words pl-7 text-sm leading-6 text-muted">
          {breadcrumb.whatChanged || "No changes recorded yet."}
        </p>
      </section>
      <section className="mt-7">
        <h3 className="flex items-center gap-3 text-sm font-semibold">
          <ClipboardCheck size={17} /> Decisions
        </h3>
        {breadcrumb.decisions.length ? (
          <ul className="mt-2 list-disc space-y-1 pl-11 text-sm leading-6 text-muted">
            {breadcrumb.decisions.map((d, i) => (
              <li className="break-words" key={i}>
                {d}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 pl-7 text-sm text-muted">
            No decisions recorded yet.
          </p>
        )}
      </section>
      <section className="mt-7">
        <h3 className="flex items-center gap-3 text-sm font-semibold">
          <Route size={17} /> Next step
        </h3>
        <p className="mt-2 whitespace-pre-wrap break-words pl-7 text-sm leading-6 text-muted">
          {breadcrumb.nextStep || "Leave a small next step for later."}
        </p>
      </section>
      <section className="mt-7">
        <h3 className="flex items-center gap-3 text-sm font-semibold">
          <StickyNote size={17} /> Note to future me
        </h3>
        <blockquote className="mt-3 whitespace-pre-wrap break-words rounded-lg bg-rose/80 px-5 py-4 text-sm leading-6 text-muted">
          {breadcrumb.noteToFutureMe ||
            "A little context now can make coming back easier."}
        </blockquote>
      </section>
      <div className="mt-7 space-y-4 border-b border-line pb-6 text-xs text-muted">
        <p className="flex items-center gap-3">
          <Paperclip size={16} /> Attachments{" "}
          <span className="ml-auto">Coming later</span>
        </p>
        <p className="flex items-center gap-3">
          <Link size={16} /> Links <span className="ml-auto">Coming later</span>
        </p>
      </div>
      <nav
        aria-label="Adjacent breadcrumbs"
        className="mt-5 grid grid-cols-2 gap-3"
      >
        <button
          className="btn min-w-0 justify-start text-left"
          disabled={!previous}
          onClick={() => previous && onSelect(previous)}
        >
          <ArrowLeft size={15} className="shrink-0" />
          <span className="min-w-0">
            <span className="block font-mono text-[10px]">
              {previous ? breadcrumbNumber(index - 1) : "Start"}
            </span>
            <span className="block truncate text-[11px] text-muted">
              {previous?.title ?? "First breadcrumb"}
            </span>
          </span>
        </button>
        <button
          className="btn min-w-0 justify-end text-right"
          disabled={!next}
          onClick={() => next && onSelect(next)}
        >
          <span className="min-w-0">
            <span className="block font-mono text-[10px]">
              {next ? breadcrumbNumber(index + 1) : "Latest"}
            </span>
            <span className="block truncate text-[11px] text-muted">
              {next?.title ?? "You're up to date"}
            </span>
          </span>
          <ArrowRight size={15} className="shrink-0" />
        </button>
      </nav>
    </motion.div>
  );
}
