# 🕹 Wii U Input Viewer (Client)

> **Cross-platform real-time viewer for Wii U controller and player data.**

This Python-based application connects to a Wii U running the [Data Viewer Server](https://github.com/Nyatlov/dataviewer-server-twwhd) plugin and displays controller input, Link's movement, and current map position in an interactive interface.

---

## ✨ Features

- 🎮 Visualizes GamePad and Pro Controller input in real-time
- 🌍 Displays Link’s position, speed, facing direction.
- 🗺 World map view with live cursor
- ⚡ Built with pywebview + HTML/CSS/JS frontend
- 🖥 Compatible with Windows, macOS, and Linux

---

## 🚀 Getting Started

1. Launch the Wii U with the **Data Viewer Server** plugin enabled.
2. On your PC, run the client:

    ```bash
    main.py
    ```

3. Enter your Wii U’s IP address when prompted.
4. Watch inputs and data stream in real-time.

---

## 🛠 Requirements

- Python 3.8+
- `pywebview`
- Uses standard libraries: `socket`, `json`, `threading`, etc.

Install dependencies:

```bash
pip install pywebview
```
🧑‍💻 Author

Made with ❤️ by Me
