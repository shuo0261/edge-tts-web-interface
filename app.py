import os
import re
import logging
import subprocess
import shlex
from flask import Flask, request, render_template, jsonify, url_for, send_from_directory
from io import StringIO

app = Flask(__name__)

app.config['TTS_FOLDER'] = 'tts'
os.makedirs(app.config['TTS_FOLDER'], exist_ok=True)

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
    "amy": "en-US-AmyNeural",
    "nanami": "ja-JP-NanamiNeural",
    "luna": "es-ES-LunaNeural",
}

def getVoiceById(voiceId):
    return voiceMap.get(voiceId)

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

    for filename in os.listdir(app.config['TTS_FOLDER']):
        if filename.endswith(".mp3"):
            os.remove(os.path.join(app.config['TTS_FOLDER'], filename))

    command = ["edge-tts", "--voice", str(voice), "--text",
               str(new_text), "--write-media", str(file_path)]
    logger.debug(f"Running command: {' '.join(map(shlex.quote, command))}")

    try:
        result = subprocess.run(
            command, check=True, capture_output=True, text=True)
        if os.path.exists(file_path):
            logger.debug(f"File created successfully: {file_path}")
            return "success"
        else:
            logger.error(f"File not created: {file_path}")
            return "file not created"
    except subprocess.CalledProcessError as e:
        logger.error(f"Command failed with exit code {e.returncode}")
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
        file_path = os.path.join(app.config['TTS_FOLDER'], f"{file_name}.mp3")

        result = createAudio(text, file_path, voice)
        log_stream.seek(0)
        logs = log_stream.read()

        if result == "success":
            # 使用 request.host_url 动态生成完整 URL
            base_url = request.host_url.rstrip('/')
            file_url = f"{base_url}{url_for('download_file', filename=f'{file_name}.mp3')}"
            return jsonify(result="success", file_url=file_url, console=logs)
        else:
            return jsonify(result=f"音频生成失败: {result}", console=logs)

    return render_template('index.html', voiceMap=voiceMap)

@app.route('/download/<filename>')
def download_file(filename):
    return send_from_directory(app.config['TTS_FOLDER'], filename, as_attachment=True)

@app.route('/api/tts', methods=['POST'])
def api_tts():
    data = request.get_json()
    text = data.get('text')
    file_name = data.get('file_name', 'output')
    voice = data.get('voice')
    file_path = os.path.join(app.config['TTS_FOLDER'], f"{file_name}.mp3")
    result = createAudio(text, file_path, voice)
    
    if result == "success":
        # 使用 request.host_url 动态生成完整 URL
        base_url = request.host_url.rstrip('/')
        file_url = f"{base_url}{url_for('download_file', filename=f'{file_name}.mp3')}"
        return jsonify({"status": "success", "file_url": file_url})
    return jsonify({"status": "error", "message": result}), 400

if __name__ == "__main__":
    print("服务器正在运行，请访问：http://127.0.0.1:2024")
    app.run(port=2024, host="0.0.0.0", debug=True)