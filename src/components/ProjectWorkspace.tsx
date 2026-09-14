import type {
  Breadcrumb,
  Project,
} from "../types";

type ProjectWorkspaceProps = {
  project: Project;
  selectedBreadcrumb: Breadcrumb | null;
  onSelectBreadcrumb: (
    breadcrumb: Breadcrumb,
  ) => void;
  onCreateBreadcrumb: () => void;
};

function ProjectWorkspace({
  project,
  selectedBreadcrumb,
  onSelectBreadcrumb,
  onCreateBreadcrumb,
}: ProjectWorkspaceProps) {
  const hasBreadcrumbs =
    project.breadcrumbs.length > 0;

  return (
    <section className="flex-1 overflow-y-auto p-8">
      <header className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {project.name}
          </h2>

          <div className="mt-2 flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor:
                  project.color,
              }}
            />

            <p className="text-sm text-black/40">
              Project trail
            </p>
          </div>
        </div>

        <button
          onClick={onCreateBreadcrumb}
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/80"
        >
          + New Breadcrumb
        </button>
      </header>

      {!hasBreadcrumbs ? (
        <div className="mt-24 flex flex-col items-center text-center">
          <div
            className="h-3 w-3 rounded-full"
            style={{
              backgroundColor:
                project.color,
            }}
          />

          <h3 className="mt-4 font-medium">
            No breadcrumbs yet
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-6 text-black/40">
            Capture the current state of this
            project to begin its trail.
          </p>

          <button
            onClick={onCreateBreadcrumb}
            className="mt-6 rounded-lg border border-black/10 px-4 py-2 text-sm font-medium transition hover:bg-black/5"
          >
            Create first breadcrumb
          </button>
        </div>
      ) : (
        <div className="mt-12">
          {project.breadcrumbs.map(
            (breadcrumb, index) => {
              const isLatest =
                index ===
                project.breadcrumbs.length -
                  1;

              const isSelected =
                selectedBreadcrumb?.id ===
                breadcrumb.id;

              return (
                <div
                  key={breadcrumb.id}
                  className="border-l border-black/10 pb-10 pl-6"
                >
                  <button
                    onClick={() =>
                      onSelectBreadcrumb(
                        breadcrumb,
                      )
                    }
                    className={`relative w-full rounded-xl p-3 text-left transition ${
                      isSelected
                        ? "bg-black/5"
                        : "hover:bg-black/[0.03]"
                    }`}
                  >
                    <span
                      className={`absolute -left-[32px] top-4 h-3 w-3 rounded-full border-2 ${
                        isSelected
                          ? "border-[#A89BC7] bg-[#A89BC7]"
                          : "border-white bg-black"
                      }`}
                    />

                    <p className="text-xs text-black/40">
                      #
                      {breadcrumb.id
                        .toString()
                        .padStart(3, "0")}
                    </p>

                    <h3 className="mt-1 font-medium">
                      {breadcrumb.title}
                    </h3>

                    <p className="mt-1 text-sm text-black/40">
                      {breadcrumb.date}
                    </p>

                    {isLatest && (
                      <p className="mt-2 text-xs font-medium text-[#7C6FA3]">
                        You are here
                      </p>
                    )}
                  </button>
                </div>
              );
            },
          )}
        </div>
      )}
    </section>
  );
}

export default ProjectWorkspace;