import {
  useState,
  type FormEvent,
} from "react";

import type { NewBreadcrumbInput } from "../types";

type NewBreadcrumbProps = {
  onSave: (
    input: NewBreadcrumbInput,
  ) => void;
  onCancel: () => void;
};

function NewBreadcrumb({
  onSave,
  onCancel,
}: NewBreadcrumbProps) {
  const [title, setTitle] = useState("");

  const [whatChanged, setWhatChanged] =
    useState("");

  const [decisions, setDecisions] =
    useState("");

  const [nextStep, setNextStep] =
    useState("");

  const [
    noteToFutureMe,
    setNoteToFutureMe,
  ] = useState("");

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const date = new Date().toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
      },
    );

    const input: NewBreadcrumbInput = {
      title: title.trim(),
      date,
      whatChanged: whatChanged.trim(),

      decisions: decisions
        .split(",")
        .map((decision) =>
          decision.trim(),
        )
        .filter(Boolean),

      nextStep: nextStep.trim(),

      noteToFutureMe:
        noteToFutureMe.trim(),
    };

    onSave(input);
  }

  return (
    <form onSubmit={handleSubmit}>
      <header className="border-b border-black/10 pb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-black/40">
          Breadcrumb
        </p>

        <h2 className="mt-2 text-xl font-semibold tracking-tight">
          New Breadcrumb
        </h2>

        <p className="mt-2 text-sm text-black/40">
          Capture where you are before moving on.
        </p>
      </header>

      <div className="mt-6">
        <label
          htmlFor="breadcrumb-title"
          className="text-xs font-medium uppercase tracking-wider text-black/40"
        >
          Title
        </label>

        <input
          id="breadcrumb-title"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          required
          placeholder="What happened?"
          className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none transition focus:border-black/30"
        />
      </div>

      <div className="mt-6">
        <label
          htmlFor="breadcrumb-what-changed"
          className="text-xs font-medium uppercase tracking-wider text-black/40"
        >
          What changed
        </label>

        <textarea
          id="breadcrumb-what-changed"
          value={whatChanged}
          onChange={(event) =>
            setWhatChanged(
              event.target.value,
            )
          }
          rows={4}
          placeholder="What changed since the last breadcrumb?"
          className="mt-2 w-full resize-none rounded-lg border border-black/10 px-3 py-2 text-sm leading-6 outline-none transition focus:border-black/30"
        />
      </div>

      <div className="mt-6">
        <label
          htmlFor="breadcrumb-decisions"
          className="text-xs font-medium uppercase tracking-wider text-black/40"
        >
          Decisions
        </label>

        <textarea
          id="breadcrumb-decisions"
          value={decisions}
          onChange={(event) =>
            setDecisions(event.target.value)
          }
          rows={3}
          placeholder="Separate decisions with commas"
          className="mt-2 w-full resize-none rounded-lg border border-black/10 px-3 py-2 text-sm leading-6 outline-none transition focus:border-black/30"
        />

        <p className="mt-2 text-xs text-black/30">
          Example: Use Tauri, Keep data local-first
        </p>
      </div>

      <div className="mt-6">
        <label
          htmlFor="breadcrumb-next-step"
          className="text-xs font-medium uppercase tracking-wider text-black/40"
        >
          Next step
        </label>

        <textarea
          id="breadcrumb-next-step"
          value={nextStep}
          onChange={(event) =>
            setNextStep(event.target.value)
          }
          rows={3}
          placeholder="What should you do when you return?"
          className="mt-2 w-full resize-none rounded-lg border border-black/10 px-3 py-2 text-sm leading-6 outline-none transition focus:border-black/30"
        />
      </div>

      <div className="mt-6">
        <label
          htmlFor="breadcrumb-note"
          className="text-xs font-medium uppercase tracking-wider text-black/40"
        >
          Note to future me
        </label>

        <textarea
          id="breadcrumb-note"
          value={noteToFutureMe}
          onChange={(event) =>
            setNoteToFutureMe(
              event.target.value,
            )
          }
          rows={3}
          placeholder="Anything future-you should remember?"
          className="mt-2 w-full resize-none rounded-lg border border-black/10 px-3 py-2 text-sm leading-6 outline-none transition focus:border-black/30"
        />
      </div>

      <div className="mt-8 flex gap-3 border-t border-black/10 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg border border-black/10 px-4 py-2 text-sm font-medium transition hover:bg-black/5"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="flex-1 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/80"
        >
          Save Breadcrumb
        </button>
      </div>
    </form>
  );
}

export default NewBreadcrumb;