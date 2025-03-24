# Edge TTS Web Interface

**[中文](README.md)** | **[English](README.en.md)**

---

This is a Flask-based web application that uses Microsoft Edge's Text-to-Speech (TTS) engine to generate audio files and also supports Speech-to-Text (STT) functionality.

## Features

- **Text-to-Speech (TTS)**:
  - Convert text into speech
  - Support for multiple languages (Chinese [including Mandarin, Cantonese, and Taiwanese], English, Japanese, Spanish, etc.)
  - Support for customizing speech parameters (such as speaking rate, pitch, volume)
  - Support for SSML input
  - Generated audio supports multiple formats (MP3 by default, can be converted to WAV, etc.)
  - Option to generate subtitle files (in SRT format)
  - Real-time log display
  - Audio files support preview, online playback, and download
  - Automatically clean up old files, only keeping the latest generated audio and subtitles
  - Support generating audio through the API interface (`/api/tts`)

- **Speech-to-Text (STT)**:
  - Support uploading audio files and converting them into text (based on the Vosk model)
  - Requires the audio to be in mono 16kHz WAV format (non-WAV files will be automatically converted)

- **Interface Features**:
  - Support for switching between Chinese and English
  - Support for dark mode

## Installation and Running

### Prerequisites

- **FFmpeg**: Used for audio processing and format conversion. The code will automatically detect and attempt to install it (for Linux, macOS, Windows).
- **Vosk Model**: Used for the STT functionality. You need to manually download `vosk-model-small-cn-0.22.zip` and extract it to the `vosk-model-small-cn-0.22` folder in the root directory of the project.
  - Download address: `https://alphacephei.com/vosk/models/vosk-model-small-cn-0.22.zip`

### Running Locally

1. Clone the repository:
   ```sh
   git clone https://github.com/shuo0261/edge-tts-web-interface.git
   ```
2. Navigate to the project directory:
   ```sh
   cd edge-tts-web-interface
   ```
3. Install dependencies:
   ```sh
   python -m pip install --upgrade pip
   pip install -r requirements.txt --no-cache-dir
   ```
4. Download and extract the Vosk model to the `vosk-model-small-cn-0.22` folder.
5. Run the application:
   ```sh
   python app.py
   ```
6. Access `http://localhost:2024` in your browser.

### Docker Deployment

1. Clone the repository:
   ```sh
   git clone https://github.com/shuo0261/edge-tts-web-interface.git
   ```
2. Navigate to the project directory:
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
5. Access `http://localhost:2024` in your browser.

**Note**: If you want to save the generated audio files to the host machine, you can use volume mounting:
   ```dockerfile
   docker run -d -p 2024:2024 -v /path/on/host:/app/tts --name edge-tts-web edge-tts-web
   ```
   Replace `/path/on/host` with the path on your host machine where you want to save the files.

## Usage

### API Interface Requests

#### `/api/tts` - Text-to-Speech
- **Method**: POST
- **Request Format**: JSON
- **Example**:
  ```json
  {
      "text": "Hello, world",
      "file_name": "test",
      "voice": "amy",
      "output_format": "mp3"
  }
  ```
- **Parameter Explanation**:
  - `text` (Required): The text to be converted
  - `file_name` (Optional): The output file name (default is `output`)
  - `voice` (Optional): The type of voice (default is `xiaoxiao`, see the supported voices list below)
  - `output_format` (Optional): The output audio format (default is `mp3`)
- **Return Format**:
  - Success:
    ```json
    {
        "result": "success",
        "file_url": "http://localhost:2024/download/test.mp3"
    }
    ```
  - Failure:
    ```json
    {
        "result": "error",
        "message": "Error message"
    }
    ```

#### `/stt` - Speech-to-Text
- **Method**: POST
- **Request Format**: multipart/form-data, with the uploaded field named `audio_file`
- **Requirement**: The audio file must be in mono 16kHz WAV format (other formats will be automatically converted)
- **Return Format**:
  - Success:
    ```json
    {
        "result": "success",
        "transcription": "Transcribed text",
        "console": "Log content"
    }
    ```
  - Failure:
    ```json
    {
        "result": "error",
        "message": "Error message",
        "console": "Log content"
    }
    ```

### Web Usage

1. **Text-to-Speech**:
   - Enter the text to be converted in the text box (supports uploading `.txt` files)
   - Select the voice (such as `xiaoxiao`)
   - Enter the file name (without the extension)
   - Optional: Adjust the speaking rate (`rate`), pitch (`pitch`), volume (`volume`), or enter SSML
   - Optional: Check the box to generate subtitles (SRT)
   - Click the "Generate Speech" button
   - After generation is complete, you can play or download the audio file

2. **Speech-to-Text**:
   - Upload the audio file to the `/stt` page
   - Wait for the processing to complete and view the conversion result

### List of Supported Voices
| ID         | Voice Name                  | Language       |
|------------|-----------------------------|----------------|
| xiaoxiao   | zh-CN-XiaoxiaoNeural        | Chinese (Mandarin) |
| xiaoyi     | zh-CN-XiaoyiNeural          | Chinese (Mandarin) |
| yunjian    | zh-CN-YunjianNeural         | Chinese (Mandarin) |
| yunxi      | zh-CN-YunxiNeural           | Chinese (Mandarin) |
| yunxia     | zh-CN-YunxiaNeural          | Chinese (Mandarin) |
| yunyang    | zh-CN-YunyangNeural         | Chinese (Mandarin) |
| xiaobei    | zh-CN-liaoning-XiaobeiNeural | Chinese (Liaoning dialect) |
| xiaoni     | zh-CN-shaanxi-XiaoniNeural   | Chinese (Shaanxi dialect) |
| hiugaai    | zh-HK-HiuGaaiNeural         | Chinese (Cantonese) |
| hiumaan    | zh-HK-HiuMaanNeural         | Chinese (Cantonese) |
| wanlung    | zh-HK-WanLungNeural         | Chinese (Cantonese) |
| hsiaochen  | zh-TW-HsiaoChenNeural       | Chinese (Taiwanese) |
| hsioayu    | zh-TW-HsiaoYuNeural         | Chinese (Taiwanese) |
| yunjhe     | zh-TW-YunJheNeural          | Chinese (Taiwanese) |
| amy        | en-US-AmyNeural             | English        |
| nanami     | ja-JP-NanamiNeural          | Japanese       |
| luna       | es-ES-LunaNeural            | Spanish        |

### Switching between Chinese and English
- Click the language switch button in the upper right corner (Chinese or English icon) to switch the page language.

### Dark Mode
- Click the theme switch button in the upper right corner (sun or moon icon) to switch between dark and light modes.

## Dependencies

- Flask
- edge-tts
- FFmpeg
- vosk
- werkzeug
- requests

## Contribution

You are welcome to submit issues and pull requests. For major changes, please open an issue to discuss what you want to change first.

## License

This project is licensed under the MIT license - for details, please see the [LICENSE](LICENSE) file. 