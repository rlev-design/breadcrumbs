import { useState, type FormEvent } from "react";
import type {
  Breadcrumb,
  NewBreadcrumbInput,
  NewProjectInput,
  Project,
} from "../types";

type Props = {
  kind: "project" | "breadcrumb";
  project?: Project;
  breadcrumb?: Breadcrumb;
  onProject: (input: NewProjectInput) => Promise<void>;
  onBreadcrumb: (input: NewBreadcrumbInput) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => void;
};
export default function Editor({
  kind,
  project,
  breadcrumb,
  onProject,
  onBreadcrumb,
  onCancel,
  onDelete,
}: Props) {
  const [name, setName] = useState(project?.name ?? "");
  const [color, setColor] = useState(project?.color ?? "#dfa0a6");
  const [title, setTitle] = useState(breadcrumb?.title ?? "");
  const [whatChanged, setWhatChanged] = useState(breadcrumb?.whatChanged ?? "");
  const [decisions, setDecisions] = useState(
    breadcrumb?.decisions.join("\n") ?? "",
  );
  const [nextStep, setNextStep] = useState(breadcrumb?.nextStep ?? "");
  const [noteToFutureMe, setNote] = useState(breadcrumb?.noteToFutureMe ?? "");
  const editing = kind === "project" ? !!project : !!breadcrumb;
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (kind === "project") {
      if (!name.trim()) return;
      await onProject({ name: name.trim(), color });
    } else {
      if (!title.trim()) return;
      await onBreadcrumb({
        title: title.trim(),
        date:
          breadcrumb?.date ??
          new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        whatChanged: whatChanged.trim(),
        decisions: decisions
          .split("\n")
          .map((d) => d.trim())
          .filter(Boolean),
        nextStep: nextStep.trim(),
        noteToFutureMe: noteToFutureMe.trim(),
      });
    }
  }
  return (
    <form onSubmit={submit}>
      <p className="eyebrow">{kind}</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight">
        {editing ? "Edit" : "New"} {kind}
      </h2>
      <p className="mt-2 text-sm text-muted">
        {kind === "project"
          ? "Make a little space for your next idea."
          : "Capture where you are before moving on."}
      </p>
      {kind === "project" ? (
        <>
          <label className="mt-6 block text-sm">
            Name
            <input
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              autoFocus
              className="field"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="mt-6 block text-sm">
            Project color
            <input
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className="field h-12"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </label>
        </>
      ) : (
        <>
          <label className="mt-6 block text-sm">
            Title
            <input
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              autoFocus
              className="field"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What happened?"
            />
          </label>
          <label className="mt-5 block text-sm">
            What changed
            <textarea
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className="field"
              rows={4}
              value={whatChanged}
              onChange={(e) => setWhatChanged(e.target.value)}
            />
          </label>
          <label className="mt-5 block text-sm">
            Decisions <span className="text-xs text-muted">· one per line</span>
            <textarea
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className="field"
              rows={3}
              value={decisions}
              onChange={(e) => setDecisions(e.target.value)}
            />
          </label>
          <label className="mt-5 block text-sm">
            Next step
            <textarea
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className="field"
              rows={2}
              value={nextStep}
              onChange={(e) => setNextStep(e.target.value)}
            />
          </label>
          <label className="mt-5 block text-sm">
            Note to future me
            <textarea
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className="field bg-rose/50"
              rows={3}
              value={noteToFutureMe}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>
        </>
      )}
      <div className="mt-7 flex gap-3 border-t border-line pt-5">
        <button type="button" className="btn flex-1" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="btn btn-primary flex-1"
          disabled={!(kind === "project" ? name.trim() : title.trim())}
        >
          Save {kind}
        </button>
      </div>
      {onDelete && (
        <button
          type="button"
          className="mt-6 text-sm text-red-700 hover:underline"
          onClick={onDelete}
        >
          Delete {kind}
        </button>
      )}
    </form>
  );
}
