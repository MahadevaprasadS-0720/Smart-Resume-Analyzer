#!/usr/bin/env python3
"""
Smart Resume Analyzer - Unified Full-Stack Runner
Launches both Backend (FastAPI :8000) and Frontend (Vite :5173),
and automatically opens the complete app in your default browser.
"""

import os
import sys
import time
import subprocess
import webbrowser
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend"


def print_banner():
    print("=" * 65)
    print("   SMART RESUME ANALYZER - UNIFIED FULL-STACK LAUNCHER")
    print("=" * 65)
    print(f" Root Directory: {ROOT_DIR}")
    print(f" Backend Directory: {BACKEND_DIR}")
    print(f" Frontend Directory: {FRONTEND_DIR}")
    print("=" * 65)


def check_and_setup_backend():
    print("\n[1/3] Checking Backend Environment...")
    venv_python = (
        BACKEND_DIR / "venv" / "Scripts" / "python.exe"
        if sys.platform == "win32"
        else BACKEND_DIR / "venv" / "bin" / "python"
    )

    if not venv_python.exists():
        print("  • Virtual environment not found. Creating venv...")
        subprocess.run([sys.executable, "-m", "venv", str(BACKEND_DIR / "venv")], check=True)
        print("  • Installing backend dependencies from requirements.txt...")
        pip_cmd = (
            str(BACKEND_DIR / "venv" / "Scripts" / "pip.exe")
            if sys.platform == "win32"
            else str(BACKEND_DIR / "venv" / "bin" / "pip")
        )
        subprocess.run([pip_cmd, "install", "-r", str(BACKEND_DIR / "requirements.txt")], check=True)
        print("  [OK] Backend environment created successfully.")
    else:
        print("  [OK] Backend environment ready.")

    return str(venv_python)


def check_and_setup_frontend():
    print("\n[2/3] Checking Frontend Environment...")
    node_modules = FRONTEND_DIR / "node_modules"
    npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"

    if not node_modules.exists():
        print("  • Installing frontend node modules...")
        try:
            subprocess.run([npm_cmd, "install"], cwd=str(FRONTEND_DIR), check=True, shell=(sys.platform == "win32"))
            print("  [OK] Frontend dependencies installed.")
        except Exception as e:
            print(f"  [WARN] Note on npm install: {e}")
    else:
        print("  [OK] Frontend environment ready.")


def launch_servers(venv_python):
    print("\n[3/3] Launching Full-Stack Application...")

    # Start FastAPI Backend
    print("  • Starting FastAPI Backend on http://localhost:8000 ...")
    backend_proc = subprocess.Popen(
        [venv_python, "run.py"],
        cwd=str(BACKEND_DIR),
        shell=(sys.platform == "win32"),
    )

    # Start Vite Frontend
    print("  • Starting Vite Frontend on http://localhost:5173 ...")
    npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
    frontend_proc = subprocess.Popen(
        [npm_cmd, "run", "dev"],
        cwd=str(FRONTEND_DIR),
        shell=(sys.platform == "win32"),
    )

    # Wait 2 seconds and open browser
    time.sleep(2.5)
    app_url = "http://localhost:5173"
    print("\n" + "=" * 65)
    print(f"   APP RUNNING LIVE AT:  {app_url}")
    print("   API DOCS (SWAGGER):   http://localhost:8000/docs")
    print("=" * 65)
    print(" Press Ctrl+C in this terminal to stop both servers.\n")

    webbrowser.open(app_url)

    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\nStopping servers...")
        backend_proc.terminate()
        frontend_proc.terminate()
        print("All servers stopped successfully.")


if __name__ == "__main__":
    print_banner()
    python_bin = check_and_setup_backend()
    check_and_setup_frontend()
    launch_servers(python_bin)
