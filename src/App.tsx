import {
  useEffect,
  useState,
} from "react";

import Sidebar from "./components/Sidebar";
import ProjectWorkspace from "./components/ProjectWorkspace";
import DetailPanel from "./components/DetailPanel";

import {
  createBreadcrumb,
  createProject,
  deleteBreadcrumb,
  deleteProject,
  getProjects,
  updateBreadcrumb,
  updateProject,
} from "./db";

import type {
  Breadcrumb,
  NewBreadcrumbInput,
  NewProjectInput,
  Project,
} from "./types";

type PanelMode =
  | "detail"
  | "newBreadcrumb"
  | "newProject"
  | "editBreadcrumb"
  | "editProject";

function App() {
  const [
    projects,
    setProjects,
  ] = useState<Project[]>([]);

  const [
    selectedProject,
    setSelectedProject,
  ] =
    useState<Project | null>(
      null,
    );

  const [
    selectedBreadcrumb,
    setSelectedBreadcrumb,
  ] =
    useState<Breadcrumb | null>(
      null,
    );

  const [
    panelMode,
    setPanelMode,
  ] =
    useState<PanelMode>(
      "detail",
    );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const storedProjects =
          await getProjects();

        setProjects(
          storedProjects,
        );

        const firstProject =
          storedProjects[0] ??
          null;

        setSelectedProject(
          firstProject,
        );

        setSelectedBreadcrumb(
          firstProject?.breadcrumbs.at(
            -1,
          ) ?? null,
        );
      } catch (error) {
        console.error(
          "Failed to load projects:",
          error,
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, []);

  function handleSelectProject(
    project: Project,
  ) {
    setSelectedProject(
      project,
    );

    setSelectedBreadcrumb(
      project.breadcrumbs.at(-1) ??
        null,
    );

    setPanelMode("detail");
  }

  function handleSelectBreadcrumb(
    breadcrumb: Breadcrumb,
  ) {
    setSelectedBreadcrumb(
      breadcrumb,
    );

    setPanelMode("detail");
  }

  function handleCreateProject() {
    setPanelMode(
      "newProject",
    );
  }

  function handleCreateBreadcrumb() {
    if (!selectedProject) {
      return;
    }

    setPanelMode(
      "newBreadcrumb",
    );
  }

  function handleEditProject() {
    if (!selectedProject) {
      return;
    }

    setPanelMode(
      "editProject",
    );
  }

  function handleEditBreadcrumb() {
    if (!selectedBreadcrumb) {
      return;
    }

    setPanelMode(
      "editBreadcrumb",
    );
  }

  function handleCancelPanel() {
    setPanelMode("detail");
  }

  async function handleSaveProject(
    input: NewProjectInput,
  ) {
    try {
      const project =
        await createProject(
          input,
        );

      setProjects(
        (currentProjects) => [
          ...currentProjects,
          project,
        ],
      );

      setSelectedProject(
        project,
      );

      setSelectedBreadcrumb(
        null,
      );

      setPanelMode("detail");
    } catch (error) {
      console.error(
        "Failed to create project:",
        error,
      );
    }
  }

  async function handleSaveBreadcrumb(
    input: NewBreadcrumbInput,
  ) {
    if (!selectedProject) {
      return;
    }

    try {
      const breadcrumb =
        await createBreadcrumb(
          selectedProject.id,
          input,
        );

      const updatedProject: Project =
        {
          ...selectedProject,

          breadcrumbs: [
            ...selectedProject.breadcrumbs,
            breadcrumb,
          ],
        };

      setProjects(
        (currentProjects) =>
          currentProjects.map(
            (project) =>
              project.id ===
              updatedProject.id
                ? updatedProject
                : project,
          ),
      );

      setSelectedProject(
        updatedProject,
      );

      setSelectedBreadcrumb(
        breadcrumb,
      );

      setPanelMode("detail");
    } catch (error) {
      console.error(
        "Failed to create breadcrumb:",
        error,
      );
    }
  }

  async function handleUpdateProject(
    input: NewProjectInput,
  ) {
    if (!selectedProject) {
      return;
    }

    try {
      await updateProject(
        selectedProject.id,
        input,
      );

      const updatedProject: Project =
        {
          ...selectedProject,

          name:
            input.name,

          color:
            input.color,
        };

      setProjects(
        (currentProjects) =>
          currentProjects.map(
            (project) =>
              project.id ===
              updatedProject.id
                ? updatedProject
                : project,
          ),
      );

      setSelectedProject(
        updatedProject,
      );

      setPanelMode("detail");
    } catch (error) {
      console.error(
        "Failed to update project:",
        error,
      );
    }
  }

  async function handleUpdateBreadcrumb(
    input: NewBreadcrumbInput,
  ) {
    if (
      !selectedProject ||
      !selectedBreadcrumb
    ) {
      return;
    }

    try {
      await updateBreadcrumb(
        selectedBreadcrumb.id,
        input,
      );

      const updatedBreadcrumb: Breadcrumb =
        {
          id:
            selectedBreadcrumb.id,

          ...input,
        };

      const updatedProject: Project =
        {
          ...selectedProject,

          breadcrumbs:
            selectedProject.breadcrumbs.map(
              (breadcrumb) =>
                breadcrumb.id ===
                updatedBreadcrumb.id
                  ? updatedBreadcrumb
                  : breadcrumb,
            ),
        };

      setProjects(
        (currentProjects) =>
          currentProjects.map(
            (project) =>
              project.id ===
              updatedProject.id
                ? updatedProject
                : project,
          ),
      );

      setSelectedProject(
        updatedProject,
      );

      setSelectedBreadcrumb(
        updatedBreadcrumb,
      );

      setPanelMode("detail");
    } catch (error) {
      console.error(
        "Failed to update breadcrumb:",
        error,
      );
    }
  }

  async function handleDeleteBreadcrumb() {
    if (
      !selectedProject ||
      !selectedBreadcrumb
    ) {
      return;
    }

    try {
      await deleteBreadcrumb(
        selectedBreadcrumb.id,
      );

      const remainingBreadcrumbs =
        selectedProject.breadcrumbs.filter(
          (breadcrumb) =>
            breadcrumb.id !==
            selectedBreadcrumb.id,
        );

      const updatedProject: Project =
        {
          ...selectedProject,

          breadcrumbs:
            remainingBreadcrumbs,
        };

      setProjects(
        (currentProjects) =>
          currentProjects.map(
            (project) =>
              project.id ===
              updatedProject.id
                ? updatedProject
                : project,
          ),
      );

      setSelectedProject(
        updatedProject,
      );

      setSelectedBreadcrumb(
        remainingBreadcrumbs.at(
          -1,
        ) ?? null,
      );

      setPanelMode("detail");
    } catch (error) {
      console.error(
        "Failed to delete breadcrumb:",
        error,
      );
    }
  }

  async function handleDeleteProject() {
    if (!selectedProject) {
      return;
    }

    try {
      const projectId =
        selectedProject.id;

      await deleteProject(
        projectId,
      );

      const remainingProjects =
        projects.filter(
          (project) =>
            project.id !==
            projectId,
        );

      const nextProject =
        remainingProjects[0] ??
        null;

      setProjects(
        remainingProjects,
      );

      setSelectedProject(
        nextProject,
      );

      setSelectedBreadcrumb(
        nextProject?.breadcrumbs.at(
          -1,
        ) ?? null,
      );

      setPanelMode("detail");
    } catch (error) {
      console.error(
        "Failed to delete project:",
        error,
      );
    }
  }

  if (isLoading) {
    return (
      <main className="flex h-screen items-center justify-center">
        <p className="text-sm text-black/40">
          Loading Breadcrumbs...
        </p>
      </main>
    );
  }

  return (
    <main className="flex h-screen">
      <Sidebar
        projects={projects}
        selectedProject={
          selectedProject
        }
        onSelectProject={
          handleSelectProject
        }
        onCreateProject={
          handleCreateProject
        }
      />

      {selectedProject ? (
        <ProjectWorkspace
          project={
            selectedProject
          }
          selectedBreadcrumb={
            selectedBreadcrumb
          }
          onSelectBreadcrumb={
            handleSelectBreadcrumb
          }
          onCreateBreadcrumb={
            handleCreateBreadcrumb
          }
          onEditProject={
            handleEditProject
          }
        />
      ) : (
        <section className="flex flex-1 items-center justify-center p-8">
          <div className="max-w-sm text-center">
            <h2 className="text-xl font-semibold tracking-tight">
              No projects yet
            </h2>

            <p className="mt-2 text-sm leading-6 text-black/40">
              Create your first
              project to start
              leaving breadcrumbs.
            </p>

            <button
              onClick={
                handleCreateProject
              }
              className="mt-6 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/80"
            >
              Create first project
            </button>
          </div>
        </section>
      )}

      <DetailPanel
        project={
          selectedProject
        }
        breadcrumb={
          selectedBreadcrumb
        }
        panelMode={
          panelMode
        }
        onSaveBreadcrumb={
          handleSaveBreadcrumb
        }
        onSaveProject={
          handleSaveProject
        }
        onUpdateBreadcrumb={
          handleUpdateBreadcrumb
        }
        onUpdateProject={
          handleUpdateProject
        }
        onEditBreadcrumb={
          handleEditBreadcrumb
        }
        onDeleteBreadcrumb={
          handleDeleteBreadcrumb
        }
        onDeleteProject={
          handleDeleteProject
        }
        onCancel={
          handleCancelPanel
        }
      />
    </main>
  );
}

export default App;