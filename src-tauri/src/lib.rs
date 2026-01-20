use std::process::Command;
use std::path::Path;
use serde::{Deserialize, Serialize};
use tauri::{
    menu::{Menu, MenuBuilder, MenuItemBuilder, SubmenuBuilder, PredefinedMenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager, Emitter,
};
use regex::Regex;
use walkdir::WalkDir;

#[derive(Debug, Serialize, Deserialize)]
pub struct GitStatus {
    pub branch: String,
    pub is_dirty: bool,
    pub uncommitted_files: u32,
    pub commits_ahead: u32,
    pub commits_behind: u32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProjectInfo {
    pub name: String,
    pub path: String,
    pub has_git: bool,
}

// Documentation parsing types
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Step {
    pub content: String,
    pub is_completed: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Stage {
    pub name: String,
    pub steps: Vec<Step>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Phase {
    pub name: String,
    pub order: u32,
    pub status: String,  // "not-started", "in-progress", "completed"
    pub stages: Vec<Stage>,
    pub progress: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProjectDocumentation {
    pub phases: Vec<Phase>,
    pub source_files: Vec<String>,
    pub progress_percentage: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DocFileInfo {
    pub path: String,
    pub name: String,
    pub relative_path: String,
}

/// Open a folder in the system file manager (Finder on macOS)
#[tauri::command]
fn open_in_finder(path: String) -> Result<(), String> {
    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .arg(&path)
            .spawn()
            .map_err(|e| format!("Failed to open Finder: {}", e))?;
    }
    #[cfg(target_os = "windows")]
    {
        Command::new("explorer")
            .arg(&path)
            .spawn()
            .map_err(|e| format!("Failed to open Explorer: {}", e))?;
    }
    #[cfg(target_os = "linux")]
    {
        Command::new("xdg-open")
            .arg(&path)
            .spawn()
            .map_err(|e| format!("Failed to open file manager: {}", e))?;
    }
    Ok(())
}

/// Open a folder in Terminal
#[tauri::command]
fn open_in_terminal(path: String) -> Result<(), String> {
    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .args(["-a", "Terminal", &path])
            .spawn()
            .map_err(|e| format!("Failed to open Terminal: {}", e))?;
    }
    #[cfg(target_os = "windows")]
    {
        Command::new("cmd")
            .args(["/c", "start", "cmd", "/k", &format!("cd /d {}", path)])
            .spawn()
            .map_err(|e| format!("Failed to open Command Prompt: {}", e))?;
    }
    #[cfg(target_os = "linux")]
    {
        // Try common terminal emulators
        let terminals = ["gnome-terminal", "konsole", "xterm"];
        let mut opened = false;
        for term in terminals {
            if Command::new(term)
                .arg("--working-directory")
                .arg(&path)
                .spawn()
                .is_ok()
            {
                opened = true;
                break;
            }
        }
        if !opened {
            return Err("Failed to find a terminal emulator".to_string());
        }
    }
    Ok(())
}

/// Open a folder in the configured code editor
#[tauri::command]
fn open_in_editor(path: String, editor: String) -> Result<(), String> {
    let cmd = match editor.as_str() {
        "vscode" => "code",
        "cursor" => "cursor",
        "sublime" => "subl",
        "webstorm" => "webstorm",
        "zed" => "zed",
        "neovim" => "nvim",
        _ => "code", // Default to VS Code
    };

    Command::new(cmd)
        .arg(&path)
        .spawn()
        .map_err(|e| format!("Failed to open {}: {}", editor, e))?;

    Ok(())
}

/// Open a URL in the default browser
#[tauri::command]
fn open_url(url: String) -> Result<(), String> {
    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .arg(&url)
            .spawn()
            .map_err(|e| format!("Failed to open URL: {}", e))?;
    }
    #[cfg(target_os = "windows")]
    {
        Command::new("cmd")
            .args(["/c", "start", &url])
            .spawn()
            .map_err(|e| format!("Failed to open URL: {}", e))?;
    }
    #[cfg(target_os = "linux")]
    {
        Command::new("xdg-open")
            .arg(&url)
            .spawn()
            .map_err(|e| format!("Failed to open URL: {}", e))?;
    }
    Ok(())
}

/// Get git status for a repository
#[tauri::command]
fn get_git_status(path: String) -> Result<GitStatus, String> {
    // Get current branch
    let branch_output = Command::new("git")
        .args(["rev-parse", "--abbrev-ref", "HEAD"])
        .current_dir(&path)
        .output()
        .map_err(|e| format!("Failed to get git branch: {}", e))?;

    let branch = String::from_utf8_lossy(&branch_output.stdout)
        .trim()
        .to_string();

    // Get status (uncommitted files)
    let status_output = Command::new("git")
        .args(["status", "--porcelain"])
        .current_dir(&path)
        .output()
        .map_err(|e| format!("Failed to get git status: {}", e))?;

    let status_lines = String::from_utf8_lossy(&status_output.stdout);
    let uncommitted_files = status_lines.lines().count() as u32;
    let is_dirty = uncommitted_files > 0;

    // Get ahead/behind counts
    let ahead_behind_output = Command::new("git")
        .args(["rev-list", "--left-right", "--count", "HEAD...@{upstream}"])
        .current_dir(&path)
        .output();

    let (commits_ahead, commits_behind) = match ahead_behind_output {
        Ok(output) => {
            let counts = String::from_utf8_lossy(&output.stdout);
            let parts: Vec<&str> = counts.trim().split('\t').collect();
            if parts.len() == 2 {
                (
                    parts[0].parse().unwrap_or(0),
                    parts[1].parse().unwrap_or(0),
                )
            } else {
                (0, 0)
            }
        }
        Err(_) => (0, 0), // No upstream set
    };

    Ok(GitStatus {
        branch,
        is_dirty,
        uncommitted_files,
        commits_ahead,
        commits_behind,
    })
}

/// Scan a folder for git repositories
#[tauri::command(rename_all = "snake_case")]
fn scan_folder_for_projects(path: String, max_depth: u32) -> Result<Vec<ProjectInfo>, String> {
    let mut projects = Vec::new();
    scan_directory(&path, 0, max_depth, &mut projects)?;
    Ok(projects)
}

fn scan_directory(
    path: &str,
    current_depth: u32,
    max_depth: u32,
    projects: &mut Vec<ProjectInfo>,
) -> Result<(), String> {
    if current_depth > max_depth {
        return Ok(());
    }

    let entries = std::fs::read_dir(path)
        .map_err(|e| format!("Failed to read directory {}: {}", path, e))?;

    for entry in entries.flatten() {
        let entry_path = entry.path();

        if entry_path.is_dir() {
            let dir_name = entry_path.file_name()
                .and_then(|n| n.to_str())
                .unwrap_or("");

            // Skip hidden directories and common non-project folders
            if dir_name.starts_with('.')
                || dir_name == "node_modules"
                || dir_name == "target"
                || dir_name == "dist"
                || dir_name == "build"
            {
                continue;
            }

            // Check if this is a git repository
            let git_dir = entry_path.join(".git");
            if git_dir.exists() {
                projects.push(ProjectInfo {
                    name: dir_name.to_string(),
                    path: entry_path.to_string_lossy().to_string(),
                    has_git: true,
                });
            } else {
                // Recursively scan subdirectories
                scan_directory(
                    &entry_path.to_string_lossy(),
                    current_depth + 1,
                    max_depth,
                    projects,
                )?;
            }
        }
    }

    Ok(())
}

/// Discover documentation files in a project directory
#[tauri::command]
fn discover_doc_files(path: String) -> Result<Vec<DocFileInfo>, String> {
    let base_path = Path::new(&path);
    let mut doc_files = Vec::new();
    let mut seen_paths = std::collections::HashSet::new();

    // Root-level documentation files to look for
    let root_docs = ["README.md", "CLAUDE.md", "ROADMAP.md", "TODO.md", "CHANGELOG.md", "SPEC.md"];

    // Check root-level files
    for doc_name in &root_docs {
        let doc_path = base_path.join(doc_name);
        if doc_path.exists() && doc_path.is_file() {
            let path_str = doc_path.to_string_lossy().to_string();
            if seen_paths.insert(path_str.clone()) {
                doc_files.push(DocFileInfo {
                    path: path_str,
                    name: doc_name.to_string(),
                    relative_path: doc_name.to_string(),
                });
            }
        }
    }

    // Directories to scan for documentation
    let doc_dirs = [
        "docs",
        "specs",
        ".claude",
        "documentation",
        "design-reference",
        "instructions",
        "planning",
        "roadmap",
    ];

    // Helper function to scan a directory for markdown files
    let scan_dir = |dir_path: &Path, prefix: &str, doc_files: &mut Vec<DocFileInfo>, seen_paths: &mut std::collections::HashSet<String>| {
        if dir_path.exists() && dir_path.is_dir() {
            for entry in WalkDir::new(dir_path)
                .max_depth(5)
                .into_iter()
                .filter_map(|e| e.ok())
            {
                let entry_path = entry.path();
                if entry_path.is_file() {
                    if let Some(ext) = entry_path.extension() {
                        if ext == "md" || ext == "markdown" {
                            let path_str = entry_path.to_string_lossy().to_string();
                            if seen_paths.insert(path_str.clone()) {
                                let relative = if prefix.is_empty() {
                                    entry_path
                                        .strip_prefix(dir_path.parent().unwrap_or(dir_path))
                                        .unwrap_or(entry_path)
                                        .to_string_lossy()
                                        .to_string()
                                } else {
                                    format!("{}/{}", prefix, entry_path
                                        .strip_prefix(dir_path)
                                        .unwrap_or(entry_path)
                                        .to_string_lossy())
                                };

                                doc_files.push(DocFileInfo {
                                    path: path_str,
                                    name: entry_path
                                        .file_name()
                                        .map(|n| n.to_string_lossy().to_string())
                                        .unwrap_or_default(),
                                    relative_path: relative,
                                });
                            }
                        }
                    }
                }
            }
        }
    };

    // Scan doc directories in the project root
    for dir_name in &doc_dirs {
        let dir_path = base_path.join(dir_name);
        scan_dir(&dir_path, dir_name, &mut doc_files, &mut seen_paths);
    }

    // Also check parent directory for documentation folders
    // (handles monorepo structures where docs are at workspace root)
    if let Some(parent_path) = base_path.parent() {
        for dir_name in &doc_dirs {
            let dir_path = parent_path.join(dir_name);
            // Only scan if it exists and we haven't already scanned it
            if dir_path.exists() && dir_path.is_dir() {
                let parent_prefix = format!("../{}", dir_name);
                scan_dir(&dir_path, &parent_prefix, &mut doc_files, &mut seen_paths);
            }
        }

        // Also check parent's root documentation files
        for doc_name in &root_docs {
            let doc_path = parent_path.join(doc_name);
            if doc_path.exists() && doc_path.is_file() {
                let path_str = doc_path.to_string_lossy().to_string();
                if seen_paths.insert(path_str.clone()) {
                    doc_files.push(DocFileInfo {
                        path: path_str,
                        name: doc_name.to_string(),
                        relative_path: format!("../{}", doc_name),
                    });
                }
            }
        }
    }

    Ok(doc_files)
}

/// Parse a single markdown file and extract phases, stages, and steps
fn parse_markdown_file(content: &str, file_name: &str) -> Vec<Phase> {
    let mut phases: Vec<Phase> = Vec::new();
    let mut current_phase: Option<Phase> = None;
    let mut current_stage: Option<Stage> = None;
    let mut orphan_steps: Vec<Step> = Vec::new();
    let mut last_h1_title: Option<String> = None;

    // Regex patterns for detecting phase/milestone headers
    // Matches: # Milestone N: Name, ## Phase N: Name, # Phase N - Name, etc.
    let phase_re = Regex::new(r"^#{1,2}\s*(?:Milestone|Phase|Part|Step)\s*(\d+)[\s:.-]*(.+)$").unwrap();

    // Regex for H1 headers (to use as fallback phase name)
    let h1_re = Regex::new(r"^#\s+(.+)$").unwrap();

    // Regex for stage/section headers (## or ### without phase keywords)
    let stage_re = Regex::new(r"^#{2,3}\s+(.+)$").unwrap();

    // Regex for checklist items - case insensitive for [x] and [X]
    let checked_re = Regex::new(r"(?i)^\s*[-*]\s*\[[xX]\]\s*(.+)$").unwrap();
    let unchecked_re = Regex::new(r"^\s*[-*]\s*\[\s*\]\s*(.+)$").unwrap();

    for line in content.lines() {
        let trimmed = line.trim();

        // Check for H1 header (potential fallback title)
        if let Some(caps) = h1_re.captures(trimmed) {
            if !phase_re.is_match(trimmed) {
                last_h1_title = Some(caps.get(1).map(|m| m.as_str().trim().to_string()).unwrap_or_default());
            }
        }

        // Check for phase header
        if let Some(caps) = phase_re.captures(trimmed) {
            // Save current stage to current phase
            if let Some(stage) = current_stage.take() {
                if let Some(ref mut phase) = current_phase {
                    phase.stages.push(stage);
                }
            }

            // Save current phase
            if let Some(phase) = current_phase.take() {
                phases.push(phase);
            }

            let order: u32 = caps.get(1).map(|m| m.as_str().parse().unwrap_or(0)).unwrap_or(0);
            let name = caps.get(2).map(|m| m.as_str().trim().to_string()).unwrap_or_default();

            current_phase = Some(Phase {
                name,
                order,
                status: "not-started".to_string(),
                stages: Vec::new(),
                progress: 0.0,
            });
            continue;
        }

        // Check for stage header (only if we're inside a phase or at start)
        if let Some(caps) = stage_re.captures(trimmed) {
            // Don't treat phase headers as stages
            if phase_re.is_match(trimmed) {
                continue;
            }

            // Save current stage
            if let Some(stage) = current_stage.take() {
                if let Some(ref mut phase) = current_phase {
                    phase.stages.push(stage);
                }
            }

            let name = caps.get(1).map(|m| m.as_str().trim().to_string()).unwrap_or_default();
            current_stage = Some(Stage {
                name,
                steps: Vec::new(),
            });
            continue;
        }

        // Check for checklist items
        if let Some(caps) = checked_re.captures(line) {
            let content = caps.get(1).map(|m| m.as_str().trim().to_string()).unwrap_or_default();
            let step = Step {
                content,
                is_completed: true,
            };

            if let Some(ref mut stage) = current_stage {
                stage.steps.push(step);
            } else if let Some(ref mut phase) = current_phase {
                // Create a default stage if none exists
                if phase.stages.is_empty() {
                    phase.stages.push(Stage {
                        name: "Tasks".to_string(),
                        steps: Vec::new(),
                    });
                }
                if let Some(last_stage) = phase.stages.last_mut() {
                    last_stage.steps.push(step);
                }
            } else {
                // Collect orphan steps (no phase context yet)
                orphan_steps.push(step);
            }
            continue;
        }

        if let Some(caps) = unchecked_re.captures(line) {
            let content = caps.get(1).map(|m| m.as_str().trim().to_string()).unwrap_or_default();
            let step = Step {
                content,
                is_completed: false,
            };

            if let Some(ref mut stage) = current_stage {
                stage.steps.push(step);
            } else if let Some(ref mut phase) = current_phase {
                if phase.stages.is_empty() {
                    phase.stages.push(Stage {
                        name: "Tasks".to_string(),
                        steps: Vec::new(),
                    });
                }
                if let Some(last_stage) = phase.stages.last_mut() {
                    last_stage.steps.push(step);
                }
            } else {
                // Collect orphan steps (no phase context yet)
                orphan_steps.push(step);
            }
        }
    }

    // Save any remaining stage and phase
    if let Some(stage) = current_stage.take() {
        if let Some(ref mut phase) = current_phase {
            phase.stages.push(stage);
        }
    }

    if let Some(phase) = current_phase.take() {
        phases.push(phase);
    }

    // If we have orphan steps but no phases, create a phase from the file
    if !orphan_steps.is_empty() && phases.is_empty() {
        let phase_name = last_h1_title
            .unwrap_or_else(|| {
                // Use file name without extension as fallback
                file_name.trim_end_matches(".md")
                    .trim_end_matches(".markdown")
                    .to_string()
            });

        phases.push(Phase {
            name: phase_name,
            order: 0,
            status: "not-started".to_string(),
            stages: vec![Stage {
                name: "Tasks".to_string(),
                steps: orphan_steps,
            }],
            progress: 0.0,
        });
    }

    // Calculate progress for each phase
    for phase in &mut phases {
        let mut total_steps = 0;
        let mut completed_steps = 0;

        for stage in &phase.stages {
            for step in &stage.steps {
                total_steps += 1;
                if step.is_completed {
                    completed_steps += 1;
                }
            }
        }

        if total_steps > 0 {
            phase.progress = (completed_steps as f32 / total_steps as f32) * 100.0;

            // Determine status based on progress
            if phase.progress >= 100.0 {
                phase.status = "completed".to_string();
            } else if phase.progress > 0.0 {
                phase.status = "in-progress".to_string();
            } else {
                phase.status = "not-started".to_string();
            }
        }
    }

    phases
}

/// Parse project documentation files and extract structured information
#[tauri::command]
fn parse_project_docs(path: String) -> Result<ProjectDocumentation, String> {
    // First, discover all doc files
    let doc_files = discover_doc_files(path.clone())?;

    let mut all_phases: Vec<Phase> = Vec::new();
    let mut source_files: Vec<String> = Vec::new();

    // Parse each discovered file
    for doc_file in &doc_files {
        let content = std::fs::read_to_string(&doc_file.path)
            .map_err(|e| format!("Failed to read {}: {}", doc_file.path, e))?;

        let phases = parse_markdown_file(&content, &doc_file.name);

        if !phases.is_empty() {
            source_files.push(doc_file.relative_path.clone());
            all_phases.extend(phases);
        }
    }

    // Sort phases by order
    all_phases.sort_by(|a, b| a.order.cmp(&b.order));

    // Calculate overall progress
    let mut total_steps = 0;
    let mut completed_steps = 0;

    for phase in &all_phases {
        for stage in &phase.stages {
            for step in &stage.steps {
                total_steps += 1;
                if step.is_completed {
                    completed_steps += 1;
                }
            }
        }
    }

    let progress_percentage = if total_steps > 0 {
        (completed_steps as f32 / total_steps as f32) * 100.0
    } else {
        0.0
    };

    Ok(ProjectDocumentation {
        phases: all_phases,
        source_files,
        progress_percentage,
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_notification::init())
        .setup(|app| {
            // Set up logging in debug mode
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            // Build the application menu
            let app_submenu = SubmenuBuilder::new(app, "Project Watch")
                .item(&PredefinedMenuItem::about(app, Some("About Project Watch"), None)?)
                .separator()
                .item(&PredefinedMenuItem::services(app, None)?)
                .separator()
                .item(&PredefinedMenuItem::hide(app, Some("Hide Project Watch"))?)
                .item(&PredefinedMenuItem::hide_others(app, None)?)
                .item(&PredefinedMenuItem::show_all(app, None)?)
                .separator()
                .item(&PredefinedMenuItem::quit(app, Some("Quit Project Watch"))?)
                .build()?;

            let file_submenu = SubmenuBuilder::new(app, "File")
                .item(&PredefinedMenuItem::close_window(app, Some("Close Window"))?)
                .build()?;

            let edit_submenu = SubmenuBuilder::new(app, "Edit")
                .item(&PredefinedMenuItem::undo(app, None)?)
                .item(&PredefinedMenuItem::redo(app, None)?)
                .separator()
                .item(&PredefinedMenuItem::cut(app, None)?)
                .item(&PredefinedMenuItem::copy(app, None)?)
                .item(&PredefinedMenuItem::paste(app, None)?)
                .item(&PredefinedMenuItem::select_all(app, None)?)
                .build()?;

            let view_submenu = SubmenuBuilder::new(app, "View")
                .item(&PredefinedMenuItem::fullscreen(app, None)?)
                .build()?;

            let window_submenu = SubmenuBuilder::new(app, "Window")
                .item(&PredefinedMenuItem::minimize(app, None)?)
                .item(&PredefinedMenuItem::maximize(app, None)?)
                .separator()
                .item(&PredefinedMenuItem::close_window(app, None)?)
                .build()?;

            // Help menu with custom items
            let help_item = MenuItemBuilder::with_id("help", "Project Watch Help")
                .accelerator("CmdOrCtrl+?")
                .build(app)?;
            let getting_started_item = MenuItemBuilder::with_id("getting_started", "Getting Started")
                .build(app)?;
            let keyboard_shortcuts_item = MenuItemBuilder::with_id("keyboard_shortcuts", "Keyboard Shortcuts")
                .build(app)?;
            let report_issue_item = MenuItemBuilder::with_id("report_issue", "Report an Issue...")
                .build(app)?;

            let help_submenu = SubmenuBuilder::new(app, "Help")
                .item(&help_item)
                .item(&getting_started_item)
                .item(&keyboard_shortcuts_item)
                .separator()
                .item(&report_issue_item)
                .build()?;

            let menu = MenuBuilder::new(app)
                .item(&app_submenu)
                .item(&file_submenu)
                .item(&edit_submenu)
                .item(&view_submenu)
                .item(&window_submenu)
                .item(&help_submenu)
                .build()?;

            app.set_menu(menu)?;

            // Handle menu events
            app.on_menu_event(move |app_handle, event| {
                match event.id().as_ref() {
                    "help" => {
                        if let Some(window) = app_handle.get_webview_window("main") {
                            let _ = window.emit("navigate", "/help");
                        }
                    }
                    "getting_started" => {
                        if let Some(window) = app_handle.get_webview_window("main") {
                            let _ = window.emit("navigate", "/help/getting-started");
                        }
                    }
                    "keyboard_shortcuts" => {
                        if let Some(window) = app_handle.get_webview_window("main") {
                            let _ = window.emit("navigate", "/help/shortcuts");
                        }
                    }
                    "report_issue" => {
                        let _ = Command::new("open")
                            .arg("https://github.com/jmcconocha/project-watch/issues")
                            .spawn();
                    }
                    _ => {}
                }
            });

            // Create tray menu
            let show_item = MenuItemBuilder::with_id("show", "Show Project Watch").build(app)?;
            let quit_item = MenuItemBuilder::with_id("quit", "Quit").build(app)?;

            let tray_menu = Menu::with_items(app, &[&show_item, &quit_item])?;

            // Create tray icon
            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&tray_menu)
                .show_menu_on_left_click(false)
                .tooltip("Project Watch")
                .on_menu_event(|app, event| {
                    match event.id.as_ref() {
                        "show" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                        "quit" => {
                            app.exit(0);
                        }
                        _ => {}
                    }
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(app)?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            open_in_finder,
            open_in_terminal,
            open_in_editor,
            open_url,
            get_git_status,
            scan_folder_for_projects,
            discover_doc_files,
            parse_project_docs,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
