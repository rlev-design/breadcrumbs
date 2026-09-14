use tauri_plugin_sql::{
    Migration,
    MigrationKind,
};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        Migration {
            version: 1,
            description: "create_projects_and_breadcrumbs",
            sql: r#"
                CREATE TABLE IF NOT EXISTS projects (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    color TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS breadcrumbs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    project_id INTEGER NOT NULL,
                    title TEXT NOT NULL,
                    date TEXT NOT NULL,
                    what_changed TEXT NOT NULL DEFAULT '',
                    decisions TEXT NOT NULL DEFAULT '[]',
                    next_step TEXT NOT NULL DEFAULT '',
                    note_to_future_me TEXT NOT NULL DEFAULT '',
                    FOREIGN KEY (project_id)
                        REFERENCES projects(id)
                        ON DELETE CASCADE
                );
            "#,
            kind: MigrationKind::Up,
        },
    ];

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations(
                    "sqlite:breadcrumbs.db",
                    migrations,
                )
                .build(),
        )
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}