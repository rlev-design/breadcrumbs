import {
  useState,
  type FormEvent,
} from "react";

import type {
  Breadcrumb,
  NewBreadcrumbInput,
} from "../types";

type EditBreadcrumbProps = {
  breadcrumb: Breadcrumb;

  onSave: (
    input: NewBreadcrumbInput,
  ) => void;

  onDelete: () => void;

  onCancel: () => void;
};

function EditBreadcrumb({
  breadcrumb,
  onSave,
  onDelete,
  onCancel,
}: EditBreadcrumbProps) {
  const [
    title,
    setTitle,
  ] = useState(
    breadcrumb.title,
  );

  const [
    whatChanged,
    setWhatChanged,
  ] = useState(
    breadcrumb.whatChanged,
  );

  const [
    decisions,
    setDecisions,
  ] = useState(
    breadcrumb.decisions.join(
      ", ",
    ),
  );

  const [
    nextStep,
    setNextStep,
  ] = useState(
    breadcrumb.nextStep,
  );

  const [
    noteToFutureMe,
    setNoteToFutureMe,
  ] = useState(
    breadcrumb.noteToFutureMe,
  );

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const input: NewBreadcrumbInput =
      {
        title:
          title.trim(),

        date:
          breadcrumb.date,

        whatChanged:
          whatChanged.trim(),

        decisions: decisions
          .split(",")
          .map((decision) =>
            decision.trim(),
          )
          .filter(Boolean),

        nextStep:
          nextStep.trim(),

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
          Edit Breadcrumb
        </h2>
      </header>

      <div className="mt-6">
        <label
          htmlFor="edit-breadcrumb-title"
          className="text-xs font-medium uppercase tracking-wider text-black/40"
        >
          Title
        </label>

        <input
          id="edit-breadcrumb-title"
          value={title}
          onChange={(event) =>
            setTitle(
              event.target.value,
            )
          }
          required
          className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none transition focus:border-black/30"
        />
      </div>

      <div className="mt-6">
        <label
          htmlFor="edit-what-changed"
          className="text-xs font-medium uppercase tracking-wider text-black/40"
        >
          What changed
        </label>

        <textarea
          id="edit-what-changed"
          value={whatChanged}
          onChange={(event) =>
            setWhatChanged(
              event.target.value,
            )
          }
          rows={4}
          className="mt-2 w-full resize-none rounded-lg border border-black/10 px-3 py-2 text-sm leading-6 outline-none transition focus:border-black/30"
        />
      </div>

      <div className="mt-6">
        <label
          htmlFor="edit-decisions"
          className="text-xs font-medium uppercase tracking-wider text-black/40"
        >
          Decisions
        </label>

        <textarea
          id="edit-decisions"
          value={decisions}
          onChange={(event) =>
            setDecisions(
              event.target.value,
            )
          }
          rows={3}
          className="mt-2 w-full resize-none rounded-lg border border-black/10 px-3 py-2 text-sm leading-6 outline-none transition focus:border-black/30"
        />
      </div>

      <div className="mt-6">
        <label
          htmlFor="edit-next-step"
          className="text-xs font-medium uppercase tracking-wider text-black/40"
        >
          Next step
        </label>

        <textarea
          id="edit-next-step"
          value={nextStep}
          onChange={(event) =>
            setNextStep(
              event.target.value,
            )
          }
          rows={3}
          className="mt-2 w-full resize-none rounded-lg border border-black/10 px-3 py-2 text-sm leading-6 outline-none transition focus:border-black/30"
        />
      </div>

      <div className="mt-6">
        <label
          htmlFor="edit-note"
          className="text-xs font-medium uppercase tracking-wider text-black/40"
        >
          Note to future me
        </label>

        <textarea
          id="edit-note"
          value={noteToFutureMe}
          onChange={(event) =>
            setNoteToFutureMe(
              event.target.value,
            )
          }
          rows={3}
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
          Save Changes
        </button>
      </div>

      <div className="mt-6 border-t border-black/10 pt-6">
        <button
          type="button"
          onClick={onDelete}
          className="w-full rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          Delete Breadcrumb
        </button>
      </div>
    </form>
  );
}

export default EditBreadcrumb;