import {
  useState,
  type FormEvent,
} from "react";

import type {
  NewProjectInput,
  Project,
} from "../types";

type EditProjectProps = {
  project: Project;

  onSave: (
    input: NewProjectInput,
  ) => void;

  onDelete: () => void;

  onCancel: () => void;
};

function EditProject({
  project,
  onSave,
  onDelete,
  onCancel,
}: EditProjectProps) {
  const [
    name,
    setName,
  ] = useState(project.name);

  const [
    color,
    setColor,
  ] = useState(project.color);

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    onSave({
      name: name.trim(),
      color,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <header className="border-b border-black/10 pb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-black/40">
          Project
        </p>

        <h2 className="mt-2 text-xl font-semibold tracking-tight">
          Edit Project
        </h2>
      </header>

      <div className="mt-6">
        <label
          htmlFor="edit-project-name"
          className="text-xs font-medium uppercase tracking-wider text-black/40"
        >
          Name
        </label>

        <input
          id="edit-project-name"
          value={name}
          onChange={(event) =>
            setName(
              event.target.value,
            )
          }
          required
          className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none transition focus:border-black/30"
        />
      </div>

      <div className="mt-6">
        <label
          htmlFor="edit-project-color"
          className="text-xs font-medium uppercase tracking-wider text-black/40"
        >
          Color
        </label>

        <div className="mt-3 flex items-center gap-3">
          <input
            id="edit-project-color"
            type="color"
            value={color}
            onChange={(event) =>
              setColor(
                event.target.value,
              )
            }
            className="h-10 w-12 cursor-pointer rounded border border-black/10 bg-white p-1"
          />

          <span
            className="h-3 w-3 rounded-full"
            style={{
              backgroundColor:
                color,
            }}
          />

          <span className="text-sm text-black/50">
            {color}
          </span>
        </div>
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
          Delete Project
        </button>
      </div>
    </form>
  );
}

export default EditProject;