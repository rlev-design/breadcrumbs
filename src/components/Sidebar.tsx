import sidebarCatArch from "../assets/sidebar-cat-arch.png";
import { Archive, FolderOpen, Home, Plus, Sprout, Star } from "lucide-react";
import type { Project } from "../types";

type Props = {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (project: Project) => void;
  onCreateProject: () => void;
};

export default function Sidebar({
  projects,
  selectedProject,
  onSelectProject,
  onCreateProject,
}: Props) {
  return (
    <aside className="sidebar">
      <h1 className="flex items-center gap-2 px-2 text-xl font-bold tracking-tight">
        Breadcrumbs <Sprout size={17} className="text-emerald-700/60" />
      </h1>
      <nav
        aria-label="Workspace"
        className="sidebar-nav mt-8 space-y-1 border-b border-line pb-6"
      >
        <div className="flex items-center gap-3 rounded-lg border border-line bg-panel px-3 py-3 text-sm">
          <Home size={18} /> Home
        </div>
        <div className="flex items-center gap-3 px-3 py-3 text-sm text-muted">
          <FolderOpen size={18} /> {projects.length} projects
        </div>
        <button
          disabled
          title="Starred projects are planned for a later chapter"
          className="flex w-full items-center gap-3 px-3 py-3 text-sm"
        >
          <Star size={18} /> Starred
        </button>
        <button
          disabled
          title="Archive is planned for a later chapter"
          className="flex w-full items-center gap-3 px-3 py-3 text-sm"
        >
          <Archive size={18} /> Archive
        </button>
      </nav>
      <div className="mt-5 flex items-center justify-between px-2">
        <h2 className="eyebrow">Projects</h2>
        <button
          className="icon-btn"
          aria-label="Create project"
          onClick={onCreateProject}
        >
          <Plus size={17} />
        </button>
      </div>
      <nav
        aria-label="Projects"
        className="sidebar-projects min-h-0 space-y-1 overflow-y-auto"
      >
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => onSelectProject(project)}
            aria-current={
              selectedProject?.id === project.id ? "page" : undefined
            }
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition-colors ${selectedProject?.id === project.id ? "bg-rose font-medium" : "hover:bg-panel/70"}`}
          >
            <span
              className="size-3.5 shrink-0 rounded-full border border-black/5"
              style={{ backgroundColor: project.color }}
            />
            <span className="truncate">{project.name}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-decoration mt-auto -translate-y-[6px] pt-12 text-center">
        <img
          src={sidebarCatArch}
          alt=""
          aria-hidden="true"
          width={922}
          height={1706}
          className="mx-auto block h-[148px] w-24 select-none"
          draggable={false}
        />
        <p className="mx-auto w-[132px] max-w-full text-left font-mono text-xs leading-4 tracking-[0.06em] text-ink/80">
          <span className="block">Progress</span>
          <span className="block pl-1">lives here.</span>
        </p>
      </div>
    </aside>
  );
}
