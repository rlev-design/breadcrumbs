import {
  useState,
  type FormEvent,
} from "react";

import type { NewProjectInput } from "../types";

type NewProjectProps = {
  onSave: (input: NewProjectInput) => void;
  onCancel: () => void;
};

function NewProject({
  onSave,
  onCancel,
}: NewProjectProps) {
  const [name, setName] = useState("");
  const [color, setColor] =
    useState("#A89BC7");

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const input: NewProjectInput = {
      name: name.trim(),
      color,
    };

    onSave(input);
  }

  return (
    <form onSubmit={handleSubmit}>
      <header className="border-b border-black/10 pb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-black/40">
          Project
        </p>

        <h2 className="mt-2 text-xl font-semibold tracking-tight">
          New Project
        </h2>

        <p className="mt-2 text-sm leading-6 text-black/40">
          Create a place for a new trail.
        </p>
      </header>

      <div className="mt-6">
        <label
          htmlFor="project-name"
          className="text-xs font-medium uppercase tracking-wider text-black/40"
        >
          Name
        </label>

        <input
          id="project-name"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          required
          placeholder="Project name"
          className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none transition focus:border-black/30"
        />
      </div>

      <div className="mt-6">
        <label
          htmlFor="project-color"
          className="text-xs font-medium uppercase tracking-wider text-black/40"
        >
          Color
        </label>

        <div className="mt-3 flex items-center gap-3">
          <input
            id="project-color"
            type="color"
            value={color}
            onChange={(event) =>
              setColor(event.target.value)
            }
            className="h-10 w-12 cursor-pointer rounded border border-black/10 bg-white p-1"
          />

          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{
                backgroundColor: color,
              }}
            />

            <span className="text-sm text-black/50">
              {color}
            </span>
          </div>
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
          Create Project
        </button>
      </div>
    </form>
  );
}

export default NewProject;