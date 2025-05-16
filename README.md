# 🕹 Wii U Input Viewer (Client)

> **Cross-platform real-time viewer for Wii U controller and player data.**

This Python-based application connects to a Wii U running the [Data Viewer Server](https://github.com/Nyatlov/dataviewer-server-twwhd) plugin and displays controller input, Link's movement, and current map position in an interactive interface.
![image](https://github.com/user-attachments/assets/5ced81d9-386a-49cb-85dd-61d0f2d52b2a)
![image](https://github.com/user-attachments/assets/e0bab66b-5ec9-4eea-8598-8d14349c5b9f)

---

## ✨ Features

- 🎮 Visualizes GamePad and Pro Controller input in real-time
- 🌍 Displays Link’s position, speed, facing direction.
- 🗺 World map view with live cursor
- ⚡ Built with pywebview + HTML/CSS/JS frontend
- 🖥 Compatible with Windows, macOS, and Linux

---

## 🚀 Getting Started

### Option 1: Portable Executable (Recommended)

No Python required. Download and run the `.exe` from the [Releases](https://github.com/Nyatlov/dataviewer-server-twwhd/releases) page.

1. Launch the Wii U with the **Data Viewer Server** plugin enabled
2. Open the executable
3. Enter your Wii U’s IP address
4. Watch inputs and data stream in real-time

### Option 2: Run with Python (Dev Mode)

1. Install Python 3.9.13
2. On your PC, run the client:

    ```bash
    main.py
    ```

3. Enter your Wii U’s IP address when prompted.
4. Watch inputs and data stream in real-time.

---

## 🛠 Requirements

- Python 3.9
- `pywebview`
- Uses standard libraries: `socket`, `json`, `threading`, etc.

Install dependencies:

```bash
pip install pywebview
```
🧑‍💻 Author

Made with ❤️ by Me
