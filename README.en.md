# Edge TTS Web Interface

**[English](README.en.md)**  |  **[中文](README.md)** 

---

## Edge TTS Web Interface

This is a Flask-based web application that uses Microsoft Edge's Text-to-Speech (TTS) engine to generate audio files.

### Features

- Convert text to speech
- Support multi-language conversion (Chinese [including Mandarin, Cantonese, and Taiwanese], English, Japanese, etc.)
- Real-time log display
- Audio file support for preview, online playback, and download
- Automatically clean up old files, only retaining the latest generated audio, with old audio being automatically replaced
- Support API, allowing developers to generate audio through POST requests

## Installation and Running

### Local Running

1. Clone the repository:
   ```sh
   git clone https://github.com/shuo0261/edge-tts-web-interface.git
   ```

2. Enter the project directory:
   ```sh
   cd edge-tts-web-interface
   ```

3. Install dependencies:
   ```python
   python -m pip install --upgrade pip
   pip install -r requirements.txt --no-cache-dir
   ```

4. Run the application:
   ```python
   python app.py
   ```

5. Access `http://localhost:2024` in your browser

### Docker Deployment

1. Clone the repository:
   ```sh
   git clone https://github.com/shuo0261/edge-tts-web-interface.git
   ```

2. Enter the project directory:
   ```sh
   cd edge-tts-web-interface
   ```

3. Build the Docker image:
   ```dockerfile
   docker build -t edge-tts-web .
   ```

4. Run the Docker container:
   ```dockerfile
   docker run -d -p 2024:2024 --name edge-tts-web edge-tts-web
   ```

5. Access `http://localhost:2024` in your browser

Note: If you want to save the generated audio files to the host, you can use volume mounting:
```dockerfile
docker run -d -p 2024:2024 -v /path/on/host:/app/tts --name edge-tts-web edge-tts-web
```
Replace `/path/on/host` with the path on the host where you want to save the files.

## Usage

### API Interface Request

- Use a POST request to access `/api/tts`, example:
  ```json
  {
      "text": "Hello world",
      "file_name": "test",
      "voice": "amy"
  }
  ```

### Web Usage

1. Enter the text you want to convert in the text box
2. Select the desired voice
3. Enter the file name (without extension)
4. Click the "Generate Speech" button
5. Wait for the audio to be generated
6. Use the built-in player to play the audio or download the generated file
7. Click "Preview Speech" to hear the audio for the first 50 characters.

## Dependencies

- Flask
- edge-tts

## Contributions

Welcome to submit issues and pull requests. For significant changes, please open an issue to discuss the content you want to change.

## License

This project adopts the MIT License - see the [LICENSE](LICENSE) file for details.
