根据您的请求，以下是根据中文文档翻译并调整后的完整英文版 README 文件，适用于英文用户，帮助他们清晰地理解和使用该应用。

---

# Edge TTS Web Interface

**[中文](README.md)** | **[English](README.en.md)**

---

This is a Flask-based web application that leverages Microsoft Edge's Text-to-Speech (TTS) engine to generate audio files from text input.

## Features

- Convert text to speech
- Support for multiple languages (e.g., Chinese [Mandarin, Cantonese, Taiwanese], English, Japanese, etc.)
- Real-time log display
- Audio file preview, online playback, and download
- Automatic cleanup of old files, retaining only the latest generated audio
- API support for generating audio via POST requests
- **Support for switching between Chinese and English languages**
- **Support for dark mode**

## Installation and Running

### Local Setup

1. **Clone the repository**:
   ```sh
   git clone https://github.com/shuo0261/edge-tts-web-interface.git
   ```
2. **Navigate to the project directory**:
   ```sh
   cd edge-tts-web-interface
   ```
3. **Install dependencies**:
   ```sh
   python -m pip install --upgrade pip
   pip install -r requirements.txt --no-cache-dir
   ```
4. **Run the application**:
   ```sh
   python app.py
   ```
5. **Access the app**:
   Open your browser and visit `http://localhost:2024`.

### Docker Deployment

1. **Clone the repository**:
   ```sh
   git clone https://github.com/shuo0261/edge-tts-web-interface.git
   ```
2. **Navigate to the project directory**:
   ```sh
   cd edge-tts-web-interface
   ```
3. **Build the Docker image**:
   ```dockerfile
   docker build -t edge-tts-web .
   ```
4. **Run the Docker container**:
   ```dockerfile
   docker run -d -p 2024:2024 --name edge-tts-web edge-tts-web
   ```
5. **Access the app**:
   Open your browser and visit `http://localhost:2024`.

   **Note**: To save generated audio files to your host machine, use volume mounting:
   ```dockerfile
   docker run -d -p 2024:2024 -v /path/on/host:/app/tts --name edge-tts-web edge-tts-web
   ```
   Replace `/path/on/host` with your desired host directory.

## Usage

### API Request

- **Endpoint**: Send a POST request to `/api/tts`.
- **Example Request**:
  ```json
  {
      "text": "Hello world",
      "file_name": "test",
      "voice": "amy"
  }
  ```
- **Response Format**:
  ```json
  {
      "result": "success",
      "console": "Log content",
      "file_url": "http://localhost:2024/download/test.mp3"
  }
  ```

### Web Usage

1. **Input Text**: Enter the text you want to convert into speech in the provided text box.
2. **Select Voice**: Choose a voice from the available options.
3. **Specify File Name**: Enter a file name (without an extension).
4. **Generate Audio**: Click the "Generate Speech" button.
5. **Wait**: Allow a moment for the audio to be generated.
6. **Play or Download**: Use the built-in player to listen to the audio or download the file.
7. **Preview**: Click "Preview Speech" to hear the first 50 characters of your text.

### Language Switching

- **How to Switch**: Click the language toggle button in the upper right corner (displayed as Chinese or English icons) to switch the interface between Chinese and English.

### Dark Mode

- **How to Toggle**: Click the theme switch button in the upper right corner (displayed as sun or moon icons) to switch between light and dark modes.

## Dependencies

- **Flask**: Web framework for the application
- **edge-tts**: Microsoft Edge's Text-to-Speech library
- **FFmpeg**:Multimedia framework for handling audio and video streams and files
- **vosk**:Offline speech recognition library powered by Kaldi

## Contribution

We welcome contributions! Feel free to submit issues or pull requests. For significant changes, please open an issue first to discuss your ideas.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

这份英文文档完整地描述了项目的功能、安装方法、使用说明以及语言切换和暗色模式的操作步骤，确保用户能够轻松上手并充分利用该应用。