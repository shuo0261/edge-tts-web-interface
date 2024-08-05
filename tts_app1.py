import os
import re
import logging
import subprocess
import shlex
from flask import Flask, request, render_template_string, jsonify, url_for, send_from_directory
from io import StringIO

print("服务器正在运行，请访问：http://127.0.0.1:2024")
app = Flask(__name__)

# 创建一个文件夹来存储生成的音频文件
app.config['TTS_FOLDER'] = 'tts'
os.makedirs(app.config['TTS_FOLDER'], exist_ok=True)

# 创建一个 StringIO 对象来捕获日志输出
log_stream = StringIO()
logging.basicConfig(level=logging.DEBUG, stream=log_stream)
logger = logging.getLogger(__name__)

voiceMap = {
    "xiaoxiao": "zh-CN-XiaoxiaoNeural",
    "xiaoyi": "zh-CN-XiaoyiNeural",
    "yunjian": "zh-CN-YunjianNeural",
    "yunxi": "zh-CN-YunxiNeural",
    "yunxia": "zh-CN-YunxiaNeural",
    "yunyang": "zh-CN-YunyangNeural",
    "xiaobei": "zh-CN-liaoning-XiaobeiNeural",
    "xiaoni": "zh-CN-shaanxi-XiaoniNeural",
    "hiugaai": "zh-HK-HiuGaaiNeural",
    "hiumaan": "zh-HK-HiuMaanNeural",
    "wanlung": "zh-HK-WanLungNeural",
    "hsiaochen": "zh-TW-HsiaoChenNeural",
    "hsioayu": "zh-TW-HsiaoYuNeural",
    "yunjhe": "zh-TW-YunJheNeural",
}

def getVoiceById(voiceId):
    return voiceMap.get(voiceId)

# 去除 HTML 标签
def remove_html(string):
    regex = re.compile(r'<[^>]+>')
    return regex.sub('', string)

def createAudio(text, file_path, voiceId):
    new_text = remove_html(text)
    logger.debug(f"Text without html tags: {new_text}")
    voice = getVoiceById(voiceId)
    if not voice:
        logger.error("Invalid voice ID")
        return "error params"

    logger.debug(f"File path: {file_path}")

    # 删除旧的音频文件 仅保留最新的音频文件 默认保留在同级目录tts文件夹内
    for filename in os.listdir(app.config['TTS_FOLDER']):
        if filename.endswith(".mp3"):
            os.remove(os.path.join(app.config['TTS_FOLDER'], filename))

    command = ["edge-tts", "--voice", str(voice), "--text",
               str(new_text), "--write-media", str(file_path)]
    logger.debug(f"Running command: {' '.join(map(shlex.quote, command))}")

    try:
        result = subprocess.run(
            command, check=True, capture_output=True, text=True)
        logger.debug(f"Command output: {result.stdout}")
        logger.debug(f"Command error output: {result.stderr}")
        if os.path.exists(file_path):
            logger.debug(f"File created successfully: {file_path}")
            return "success"
        else:
            logger.error(f"File not created: {file_path}")
            return "file not created"
    except subprocess.CalledProcessError as e:
        logger.error(
            f"Command failed with exit code {e.returncode}")
        logger.error(f"Command output: {e.stdout}")
        logger.error(f"Command error output: {e.stderr}")
        return "command failed"
    except Exception as e:
        logger.error(f"An unexpected error occurred: {str(e)}")
        return "unexpected error"

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        text = request.form['text']
        file_name = request.form['file_name']
        voice = request.form['voice']

        # 使用默认路径
        file_path = os.path.join(
            app.config['TTS_FOLDER'], f"{file_name}.mp3")

        result = createAudio(text, file_path, voice)

        # 获取日志内容
        log_stream.seek(0)
        logs = log_stream.read()

        if result == "success":
            file_url = url_for('download_file', filename=f"{file_name}.mp3", _external=True)
            return jsonify(result="success", file_url=file_url, console=logs)
        else:
            return jsonify(result=f"音频生成失败: {result}", console=logs)
        
    html = '''
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>文字转语音工具</title>

    <link rel="icon" href="{{ url_for('static', filename='favicon.ico') }}" type="image/x-icon"> 
    <link rel="shortcut icon" href="{{ url_for('static', filename='favicon.ico') }}" type="image/x-icon"> 

    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;

            display: flex;
            flex-direction: column;
            min-height: 100vh; /* 使主体内容至少占满屏幕高度 */
        }
        .content {
            flex: 1; /* 使内容区域能够扩展并填充剩余空间 */
        }
        footer {
            text-align: center;
            padding: 10px;
            background-color: #f0f0f0;
            margin-top: 20px;
        }
        h1 {
            color: #2c3e50;
            text-align: center;
            margin-bottom: 30px;
        }
        form {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        label {
            display: block;
            margin-bottom: 5px;
            color: #2c3e50;
        }
        textarea, input[type="text"], select {
            width: 100%;
            padding: 10px;
            margin-bottom: 20px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        textarea {
            height: 150px;
            resize: vertical;
        }
        input[type="submit"] {
            background-color: #3498db;
            color: #ffffff;
            padding: 12px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
        }
        input[type="submit"]:hover {
            background-color: #2980b9;
        }
        #result {
            margin-top: 20px;
            padding: 10px;
            border-radius: 4px;
            background-color: #ecf0f1;
            color: #2c3e50;
            text-align: center;
        }
        #console {
            margin-top: 20px;
            padding: 10px;
            border-radius: 4px;
            background-color: #ecf0f1;
            color: #2c3e50;
             white-space: pre-wrap; /* 保持控制台输出的格式 */
            max-height: 200px; /* 设置最大高度 */
            overflow-y: auto; /* 添加垂直滚动条 */
        }
    </style>
    <script>
        function submitForm(event) {
            event.preventDefault();
            const formData = new FormData(event.target);
            const resultDiv = document.getElementById('result');
            const consoleDiv = document.getElementById('console');
            resultDiv.innerText = '音频生成中...';
            consoleDiv.innerText = '';

            fetch('/', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                resultDiv.innerText = `音频生成结果: ${data.result}.`;
                consoleDiv.innerText = data.console; // 显示控制台信息
                if (data.result === "success") {
                    const audioPlayer = document.getElementById('audio-player');
                    const audioSource = document.querySelector('#audio-player audio source');
                    const downloadLink = document.getElementById('download-link');
                    const url = data.file_url;
                    audioSource.src = url;
                    audioPlayer.querySelector('audio').load();
                    downloadLink.href = url;
                    audioPlayer.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                resultDiv.innerText = `音频生成失败: ${error.message}`;
            });
        }
    </script>
</head>
<body>
    <div class="content">
        <h1>文字转语音工具</h1>
        <form id="tts-form" method="POST" onsubmit="submitForm(event)">
            <label for="text">要转换的文字：</label>
            <textarea name="text" id="text" rows="4" required></textarea>

            <label for="file_name">文件名（不含扩展名）：</label>
            <input type="text" name="file_name" id="file_name" required>

            <label for="voice">选择语音：</label>
            <select name="voice" id="voice" required>
                {% for voice_id, voice_name in voiceMap.items() %}
                <option value="{{ voice_id }}">{{ voice_name }}</option>
                {% endfor %}
            </select>

            <input type="submit" value="生成语音">
        </form>
        <div id="result"></div>
        <div id="console"></div>
        <div id="audio-player" style="display:none; margin-top: 20px;">
            <audio controls style="width: 100%; max-width: 400px;">
                <source src="#" type="audio/mpeg">
                你的浏览器不支持音频播放。
            </audio>
            <br>
            <a id="download-link" href="#" download="generated_audio.mp3"
               style="display: inline-block; margin-top: 10px; padding: 8px 16px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">下载音频</a>
        </div>
    </div>
    <footer>
        <p>© 2024 MOML TTS. All rights reserved.</p>
    </footer>
</body>
</html>
'''

    return render_template_string(html, voiceMap=voiceMap)

@app.route('/download/<filename>')
def download_file(filename):
    return send_from_directory(app.config['TTS_FOLDER'], filename, as_attachment=True)

if __name__ == "__main__":
    app.run(port=2024, host="0.0.0.0", debug=True)