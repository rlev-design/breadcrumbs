import Database from "@tauri-apps/plugin-sql";

import type {
  Breadcrumb,
  NewBreadcrumbInput,
  NewProjectInput,
  Project,
} from "./types";

const DATABASE_URL = "sqlite:breadcrumbs.db";

type ProjectRow = {
  id: number;
  name: string;
  color: string;
};

type BreadcrumbRow = {
  id: number;
  project_id: number;
  title: string;
  date: string;
  what_changed: string;
  decisions: string;
  next_step: string;
  note_to_future_me: string;
};

async function getDatabase() {
  return Database.load(DATABASE_URL);
}

export async function getProjects(): Promise<Project[]> {
  const db = await getDatabase();

  const projectRows = await db.select<ProjectRow[]>(
    `
      SELECT id, name, color
      FROM projects
      ORDER BY id ASC
    `,
  );

  const breadcrumbRows =
    await db.select<BreadcrumbRow[]>(
      `
        SELECT
          id,
          project_id,
          title,
          date,
          what_changed,
          decisions,
          next_step,
          note_to_future_me
        FROM breadcrumbs
        ORDER BY id ASC
      `,
    );

  return projectRows.map((projectRow) => {
    const breadcrumbs: Breadcrumb[] =
      breadcrumbRows
        .filter(
          (breadcrumbRow) =>
            breadcrumbRow.project_id ===
            projectRow.id,
        )
        .map((breadcrumbRow) => ({
          id: breadcrumbRow.id,
          title: breadcrumbRow.title,
          date: breadcrumbRow.date,
          whatChanged:
            breadcrumbRow.what_changed,
          decisions: JSON.parse(
            breadcrumbRow.decisions,
          ) as string[],
          nextStep: breadcrumbRow.next_step,
          noteToFutureMe:
            breadcrumbRow.note_to_future_me,
        }));

    return {
      id: projectRow.id,
      name: projectRow.name,
      color: projectRow.color,
      breadcrumbs,
    };
  });
}

export async function createProject(
  input: NewProjectInput,
): Promise<Project> {
  const db = await getDatabase();

  const result = await db.execute(
    `
      INSERT INTO projects (name, color)
      VALUES ($1, $2)
    `,
    [input.name, input.color],
  );

  if (result.lastInsertId === undefined) {
    throw new Error(
      "SQLite did not return a project ID.",
    );
  }

  return {
    id: result.lastInsertId,
    name: input.name,
    color: input.color,
    breadcrumbs: [],
  };
}

export async function createBreadcrumb(
  projectId: number,
  input: NewBreadcrumbInput,
): Promise<Breadcrumb> {
  const db = await getDatabase();

  const result = await db.execute(
    `
      INSERT INTO breadcrumbs (
        project_id,
        title,
        date,
        what_changed,
        decisions,
        next_step,
        note_to_future_me
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
    [
      projectId,
      input.title,
      input.date,
      input.whatChanged,
      JSON.stringify(input.decisions),
      input.nextStep,
      input.noteToFutureMe,
    ],
  );

  if (result.lastInsertId === undefined) {
    throw new Error(
      "SQLite did not return a breadcrumb ID.",
    );
  }

  return {
    id: result.lastInsertId,
    title: input.title,
    date: input.date,
    whatChanged: input.whatChanged,
    decisions: input.decisions,
    nextStep: input.nextStep,
    noteToFutureMe: input.noteToFutureMe,
  };
}