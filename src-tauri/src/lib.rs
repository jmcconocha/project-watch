use std::process::Command;
use serde::{Deserialize, Serialize};
use tauri::{
    menu::{Menu, MenuBuilder, MenuItemBuilder, SubmenuBuilder, PredefinedMenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager, Emitter,
};

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
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
