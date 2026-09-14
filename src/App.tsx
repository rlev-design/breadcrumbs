import { useEffect, useRef, useState } from "react";
import { Plus, Search, Sprout, X } from "lucide-react";
import { MotionConfig } from "motion/react";
import { Toaster, toast } from "sonner";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import Sidebar from "./components/Sidebar";
import ProjectWorkspace from "./components/ProjectWorkspace";
import DetailPanel from "./components/DetailPanel";
import Editor from "./components/Editor";
import * as db from "./db";
import type {
  Breadcrumb,
  NewBreadcrumbInput,
  NewProjectInput,
  Project,
} from "./types";

type Mode =
  "detail" | "newProject" | "editProject" | "newBreadcrumb" | "editBreadcrumb";
export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState<number | null>(null);
  const [breadcrumbId, setBreadcrumbId] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>("detail");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (mode !== "detail" && window.matchMedia("(max-width: 850px)").matches) {
      panelRef.current?.scrollIntoView({ block: "start" });
    }
  }, [mode]);
  const [confirmation, setConfirmation] = useState<
    "project" | "breadcrumb" | null
  >(null);
  const project = projects.find((p) => p.id === projectId) ?? null;
  const breadcrumb =
    project?.breadcrumbs.find((b) => b.id === breadcrumbId) ?? null;

  async function load() {
    setLoading(true);
    setLoadError(false);
    try {
      const stored = await db.getProjects();
      setProjects(stored);
      setProjectId(stored[0]?.id ?? null);
      setBreadcrumbId(stored[0]?.breadcrumbs.at(-1)?.id ?? null);
    } catch (error) {
      console.error(error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  useEffect(() => {
    const shortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);
  function selectProject(p: Project) {
    setProjectId(p.id);
    setBreadcrumbId(p.breadcrumbs.at(-1)?.id ?? null);
    setMode("detail");
    setQuery("");
  }
  function selectBreadcrumb(b: Breadcrumb) {
    setBreadcrumbId(b.id);
    setMode("detail");
  }
  function replaceProject(p: Project) {
    setProjects((current) =>
      current.map((item) => (item.id === p.id ? p : item)),
    );
  }
  // A synchronous ref closes the gap before React renders the disabled controls.
  async function mutate(action: () => Promise<void>, success: string) {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    try {
      await action();
      setMode("detail");
      setConfirmation(null);
      toast.success(success);
    } catch (error) {
      console.error(error);
      toast.error(
        "Couldn’t save this change. Your form is still here; please try again.",
      );
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }
  async function saveProject(input: NewProjectInput) {
    await mutate(async () => {
      if (mode === "editProject" && project) {
        await db.updateProject(project.id, input);
        replaceProject({ ...project, ...input });
      } else {
        const p = await db.createProject(input);
        setProjects((current) => [...current, p]);
        setProjectId(p.id);
        setBreadcrumbId(null);
      }
    }, "Project saved");
  }
  async function saveBreadcrumb(input: NewBreadcrumbInput) {
    if (!project) return;
    await mutate(async () => {
      if (mode === "editBreadcrumb" && breadcrumb) {
        await db.updateBreadcrumb(breadcrumb.id, input);
        replaceProject({
          ...project,
          breadcrumbs: project.breadcrumbs.map((b) =>
            b.id === breadcrumb.id ? { ...b, ...input } : b,
          ),
        });
      } else {
        const b = await db.createBreadcrumb(project.id, input);
        replaceProject({
          ...project,
          breadcrumbs: [...project.breadcrumbs, b],
        });
        setBreadcrumbId(b.id);
      }
    }, "Breadcrumb saved");
  }
  async function remove() {
    if (!project) return;
    await mutate(async () => {
      if (confirmation === "project") {
        await db.deleteProject(project.id);
        const remaining = projects.filter((p) => p.id !== project.id);
        setProjects(remaining);
        setProjectId(remaining[0]?.id ?? null);
        setBreadcrumbId(remaining[0]?.breadcrumbs.at(-1)?.id ?? null);
      } else if (breadcrumb) {
        await db.deleteBreadcrumb(breadcrumb.id);
        const remaining = project.breadcrumbs.filter(
          (b) => b.id !== breadcrumb.id,
        );
        replaceProject({ ...project, breadcrumbs: remaining });
        setBreadcrumbId(remaining.at(-1)?.id ?? null);
      }
    }, "Deleted");
  }
  const search = query.trim().toLowerCase();
  const results = search
    ? projects.flatMap((p) => [
        ...(p.name.toLowerCase().includes(search)
          ? [
              {
                key: `p${p.id}`,
                project: p,
                breadcrumb: null as Breadcrumb | null,
                label: p.name,
                context: "Project",
              },
            ]
          : []),
        ...p.breadcrumbs
          .filter((b) =>
            [
              b.title,
              b.whatChanged,
              ...b.decisions,
              b.nextStep,
              b.noteToFutureMe,
            ].some((text) => text.toLowerCase().includes(search)),
          )
          .map((b) => ({
            key: `b${b.id}`,
            project: p,
            breadcrumb: b as Breadcrumb | null,
            label: b.title,
            context: p.name,
          })),
      ])
    : [];

  return (
    <MotionConfig reducedMotion="user">
      <Toaster position="bottom-center" richColors />
      {loading ? (
        <div className="empty h-screen" role="status">
          Loading your breadcrumbs…
        </div>
      ) : loadError ? (
        <div className="empty h-screen">
          <h1 className="text-lg font-semibold text-ink">
            Couldn’t open your projects
          </h1>
          <p>Open Breadcrumbs in Tauri to connect to your local database.</p>
          <button className="btn" onClick={() => void load()}>
            Try again
          </button>
        </div>
      ) : (
        <fieldset
          disabled={busy}
          className="app-shell m-0 min-w-0 border-0 p-0"
          aria-busy={busy}
        >
          <Sidebar
            projects={projects}
            selectedProject={project}
            onSelectProject={selectProject}
            onCreateProject={() => setMode("newProject")}
          />
          <div className="flex min-h-0 min-w-0 flex-col">
            <header className="flex min-h-16 shrink-0 flex-wrap items-center gap-4 border-b border-line bg-gradient-to-r from-rose/50 to-sidebar/30 px-6 py-3">
              <p className="script hidden min-w-0 flex-1 -rotate-3 whitespace-nowrap text-center text-sm text-muted xl:block">
                somewhere between now and next
              </p>
              <div className="relative ml-auto min-w-0 flex-1 xl:max-w-80">
                <label className="flex items-center gap-2 rounded-lg border border-line bg-sidebar/45 px-3 py-2">
                  <Search size={15} className="shrink-0 text-muted" />
                  <input
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    ref={searchRef}
                    aria-label="Search projects and breadcrumbs"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setQuery("");
                    }}
                    placeholder="Search projects, notes, anything…"
                    className="min-w-0 flex-1 bg-transparent text-xs outline-none"
                  />
                  {query ? (
                    <button
                      className="text-muted"
                      aria-label="Clear search"
                      onClick={() => setQuery("")}
                    >
                      <X size={14} />
                    </button>
                  ) : (
                    <kbd className="hidden text-[10px] text-muted lg:block">
                      ⌘ K
                    </kbd>
                  )}
                </label>
                {search && (
                  <div
                    className="absolute left-0 right-0 top-full z-20 mt-2 max-h-80 overflow-auto rounded-xl border border-line bg-panel p-2 shadow-lg"
                    aria-label="Search results"
                  >
                    {results.length ? (
                      results.map((result) => (
                        <button
                          key={result.key}
                          className="block w-full rounded-lg p-3 text-left hover:bg-rose"
                          onClick={() => {
                            selectProject(result.project);
                            if (result.breadcrumb)
                              selectBreadcrumb(result.breadcrumb);
                          }}
                        >
                          <span className="block truncate text-sm font-medium">
                            {result.label}
                          </span>
                          <span className="text-xs text-muted">
                            {result.context}
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="p-4 text-sm text-muted">
                        No matches. Try another word.
                      </p>
                    )}
                  </div>
                )}
              </div>
              <button
                className="btn btn-primary"
                disabled={!project}
                onClick={() => setMode("newBreadcrumb")}
              >
                <Plus size={16} /> Breadcrumb
              </button>
            </header>
            <div className="workspace-shell">
              {project ? (
                <ProjectWorkspace
                  key={project.id}
                  project={project}
                  selectedBreadcrumb={breadcrumb}
                  onSelectBreadcrumb={selectBreadcrumb}
                  onCreateBreadcrumb={() => setMode("newBreadcrumb")}
                  onEditProject={() => setMode("editProject")}
                />
              ) : (
                <section className="empty">
                  <Sprout size={32} />
                  <h2 className="text-xl font-semibold text-ink">
                    Every idea starts somewhere.
                  </h2>
                  <p>Create a project to start leaving breadcrumbs.</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setMode("newProject")}
                  >
                    Create first project
                  </button>
                </section>
              )}
              <aside
                ref={panelRef}
                className="detail-panel"
                aria-label={mode === "detail" ? "Breadcrumb details" : "Editor"}
              >
                {mode === "detail" ? (
                  <DetailPanel
                    project={project}
                    breadcrumb={breadcrumb}
                    onEdit={() => setMode("editBreadcrumb")}
                    onSelect={selectBreadcrumb}
                  />
                ) : (
                  <Editor
                    key={`${mode}-${projectId}-${breadcrumbId}`}
                    kind={mode.endsWith("Project") ? "project" : "breadcrumb"}
                    project={
                      mode === "editProject"
                        ? (project ?? undefined)
                        : undefined
                    }
                    breadcrumb={
                      mode === "editBreadcrumb"
                        ? (breadcrumb ?? undefined)
                        : undefined
                    }
                    onProject={saveProject}
                    onBreadcrumb={saveBreadcrumb}
                    onCancel={() => setMode("detail")}
                    onDelete={
                      mode.startsWith("edit")
                        ? () =>
                            setConfirmation(
                              mode === "editProject" ? "project" : "breadcrumb",
                            )
                        : undefined
                    }
                  />
                )}
              </aside>
            </div>
          </div>
        </fieldset>
      )}
      <AlertDialog.Root
        open={confirmation !== null}
        onOpenChange={(open) => {
          if (!open && !busy) setConfirmation(null);
        }}
      >
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 z-40 bg-ink/25 backdrop-blur-sm" />
          <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-line bg-panel p-6 shadow-xl">
            <AlertDialog.Title className="text-lg font-semibold">
              Delete {confirmation}?
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-3 text-sm leading-6 text-muted">
              {confirmation === "project"
                ? `“${project?.name}” and its ${project?.breadcrumbs.length ?? 0} breadcrumbs will be permanently deleted.`
                : `“${breadcrumb?.title}” will be permanently deleted.`}
            </AlertDialog.Description>
            <div className="mt-6 flex justify-end gap-3">
              <AlertDialog.Cancel className="btn" disabled={busy}>
                Cancel
              </AlertDialog.Cancel>
              <button
                className="btn border-red-700 bg-red-700 text-white hover:bg-red-800"
                disabled={busy}
                onClick={() => void remove()}
              >
                {busy ? "Deleting…" : "Delete"}
              </button>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </MotionConfig>
  );
}
