import type {
  Project,
} from "../types";

type SidebarProps = {
  projects: Project[];

  selectedProject:
    | Project
    | null;

  onSelectProject: (
    project: Project,
  ) => void;

  onCreateProject: () => void;
};

const navigationItems = [
  "Home",
  "Today",
  "All Projects",
  "Starred",
];

function Sidebar({
  projects,
  selectedProject,
  onSelectProject,
  onCreateProject,
}: SidebarProps) {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-black/10 p-6">
      <header>
        <h1 className="text-lg font-semibold tracking-tight">
          Breadcrumbs
        </h1>
      </header>

      <nav className="mt-8 space-y-1">
        {navigationItems.map(
          (item) => (
            <button
              key={item}
              className="w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-black/5"
            >
              {item}
            </button>
          ),
        )}
      </nav>

      <div className="mt-8">
        <p className="px-3 text-xs font-medium uppercase tracking-wider text-black/40">
          Projects
        </p>

        <div className="mt-3 space-y-1">
          {projects.map(
            (project) => (
              <button
                key={project.id}
                onClick={() =>
                  onSelectProject(
                    project,
                  )
                }
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                  selectedProject?.id ===
                  project.id
                    ? "bg-black/5 font-medium"
                    : "hover:bg-black/5"
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor:
                      project.color,
                  }}
                />

                {project.name}
              </button>
            ),
          )}
        </div>

        <button
          onClick={onCreateProject}
          className="mt-3 w-full rounded-lg px-3 py-2 text-left text-sm text-black/40 transition hover:bg-black/5 hover:text-black"
        >
          + New project
        </button>
      </div>

      <div className="mt-auto border-t border-black/10 pt-4">
        <button className="w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-black/5">
          Settings
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;