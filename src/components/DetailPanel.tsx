import NewBreadcrumb from "./NewBreadcrumb";
import NewProject from "./NewProject";

import type {
  Breadcrumb,
  NewBreadcrumbInput,
  NewProjectInput,
} from "../types";

type PanelMode =
  | "detail"
  | "newBreadcrumb"
  | "newProject";

type DetailPanelProps = {
  breadcrumb: Breadcrumb | null;
  panelMode: PanelMode;
  hasSelectedProject: boolean;
  onSaveBreadcrumb: (
    input: NewBreadcrumbInput,
  ) => void;
  onSaveProject: (
    input: NewProjectInput,
  ) => void;
  onCancel: () => void;
};

function DetailPanel({
  breadcrumb,
  panelMode,
  hasSelectedProject,
  onSaveBreadcrumb,
  onSaveProject,
  onCancel,
}: DetailPanelProps) {
  if (panelMode === "newBreadcrumb") {
    return (
      <aside className="w-96 shrink-0 overflow-y-auto border-l border-black/10 p-6">
        <NewBreadcrumb
          onSave={onSaveBreadcrumb}
          onCancel={onCancel}
        />
      </aside>
    );
  }

  if (panelMode === "newProject") {
    return (
      <aside className="w-96 shrink-0 overflow-y-auto border-l border-black/10 p-6">
        <NewProject
          onSave={onSaveProject}
          onCancel={onCancel}
        />
      </aside>
    );
  }

  if (!breadcrumb) {
    return (
      <aside className="flex w-96 shrink-0 items-center justify-center border-l border-black/10 p-6">
        <div className="max-w-xs text-center">
          <h2 className="font-medium">
            {hasSelectedProject
              ? "No breadcrumb selected"
              : "No project selected"}
          </h2>

          <p className="mt-2 text-sm leading-6 text-black/40">
            {hasSelectedProject
              ? "This project doesn't have any breadcrumbs yet."
              : "Create a project to begin."}
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-96 shrink-0 overflow-y-auto border-l border-black/10 p-6">
      <header className="border-b border-black/10 pb-6">
        <p className="text-xs font-medium tracking-wider text-black/40">
          #
          {breadcrumb.id
            .toString()
            .padStart(3, "0")}
        </p>

        <h2 className="mt-2 text-xl font-semibold tracking-tight">
          {breadcrumb.title}
        </h2>

        <p className="mt-2 text-sm text-black/40">
          {breadcrumb.date}
        </p>
      </header>

      <section className="mt-6">
        <p className="text-xs font-medium uppercase tracking-wider text-black/40">
          What changed
        </p>

        <p className="mt-3 text-sm leading-6 text-black/70">
          {breadcrumb.whatChanged}
        </p>
      </section>

      <section className="mt-8">
        <p className="text-xs font-medium uppercase tracking-wider text-black/40">
          Decisions
        </p>

        <ul className="mt-3 space-y-2">
          {breadcrumb.decisions.map(
            (decision) => (
              <li
                key={decision}
                className="flex gap-2 text-sm leading-6 text-black/70"
              >
                <span className="text-black/30">
                  •
                </span>

                <span>{decision}</span>
              </li>
            ),
          )}
        </ul>
      </section>

      <section className="mt-8">
        <p className="text-xs font-medium uppercase tracking-wider text-black/40">
          Next step
        </p>

        <div className="mt-3 rounded-xl bg-black/5 p-4">
          <p className="text-sm leading-6">
            {breadcrumb.nextStep}
          </p>
        </div>
      </section>

      <section className="mt-8">
        <p className="text-xs font-medium uppercase tracking-wider text-black/40">
          Note to future me
        </p>

        <blockquote className="mt-3 border-l-2 border-[#A89BC7] pl-4 text-sm italic leading-6 text-black/60">
          {breadcrumb.noteToFutureMe}
        </blockquote>
      </section>
    </aside>
  );
}

export default DetailPanel;