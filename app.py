import os
import re
import logging
import subprocess
import shlex
import platform
import sys
import requests
from flask import Flask, request, render_template, jsonify, url_for, send_from_directory
from io import StringIO
from werkzeug.utils import secure_filename
from vosk import Model, KaldiRecognizer
import wave

app = Flask(__name__)

app.config['TTS_FOLDER'] = 'tts'
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['TTS_FOLDER'], exist_ok=True)
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

FFMPEG_BIN_DIR = os.path.abspath(os.path.join("ffmpeg", "ffmpeg-master-latest-win64-gpl", "bin"))
FFMPEG_EXE = os.path.join(FFMPEG_BIN_DIR, "ffmpeg.exe")
FFPROBE_EXE = os.path.join(FFMPEG_BIN_DIR, "ffprobe.exe")

log_stream = StringIO()
logging.basicConfig(level=logging.DEBUG, stream=log_stream)
logger = logging.getLogger(__name__)

VOSK_MODEL_PATH = "vosk-model-small-cn-0.22"

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

voiceChoices = {
    "xiaoxiao": {"zh": "晓晓（中国大陆）", "en": "Xiaoxiao (Mainland China)"},
    "xiaoyi": {"zh": "晓伊（中国大陆）", "en": "Xiaoyi (Mainland China)"},
    "yunjian": {"zh": "云健（中国大陆）", "en": "Yunjian (Mainland China)"},
    "yunxi": {"zh": "云希（中国大陆）", "en": "Yunxi (Mainland China)"},
    "yunxia": {"zh": "云夏（中国大陆）", "en": "Yunxia (Mainland China)"},
    "yunyang": {"zh": "云扬（中国大陆）", "en": "Yunyang (Mainland China)"},
    "xiaobei": {"zh": "晓北（中国辽宁）", "en": "Xiaobei (Liaoning, China)"},
    "xiaoni": {"zh": "晓妮（中国陕西）", "en": "Xiaoni (Shaanxi, China)"},
    "hiugaai": {"zh": "晓佳（中国香港）", "en": "HiuGaai (Hong Kong, China)"},
    "hiumaan": {"zh": "晓曼（中国香港）", "en": "HiuMaan (Hong Kong, China)"},
    "wanlung": {"zh": "云龙（中国香港）", "en": "WanLung (Hong Kong, China)"},
    "hsiaochen": {"zh": "晓臻（中国台湾）", "en": "HsiaoChen (Taiwan, China)"},
    "hsioayu": {"zh": "晓雨（中国台湾）", "en": "HsiaoYu (Taiwan, China)"},
    "yunjhe": {"zh": "云哲（中国台湾）", "en": "YunJhe (Taiwan, China)"},
    "amy": {"zh": "Amy（美国）", "en": "Amy (United States)"},
    "nanami": {"zh": "Nanami（日本）", "en": "Nanami (Japan)"},
    "luna": {"zh": "Luna（西班牙）", "en": "Luna (Spain)"},
}

def getVoiceById(voiceId):
    return voiceMap.get(voiceId)

def normalize_file_name(file_name, default_name):
    safe_name = secure_filename((file_name or "").strip())
    return safe_name or default_name

def remove_html(string):
    regex = re.compile(r'<[^>]+>')
    return regex.sub('', string)

def reset_logs():
    log_stream.seek(0)
    log_stream.truncate(0)

def get_ffmpeg_command():
    return FFMPEG_EXE if os.path.exists(FFMPEG_EXE) else "ffmpeg"

def get_ffprobe_command():
    return FFPROBE_EXE if os.path.exists(FFPROBE_EXE) else "ffprobe"

def delete_file_if_exists(file_path):
    if file_path and os.path.exists(file_path):
        os.remove(file_path)

def is_valid_audio_file(file_path):
    if not os.path.exists(file_path) or os.path.getsize(file_path) < 512:
        return False

    try:
        result = subprocess.run(
            [
                get_ffprobe_command(),
                "-v", "error",
                "-show_entries", "format=duration",
                "-of", "default=noprint_wrappers=1:nokey=1",
                file_path,
            ],
            check=True,
            capture_output=True,
            text=True,
        )
        duration = float((result.stdout or "0").strip() or 0)
        return duration > 0
    except Exception as e:
        logger.error(f"音频校验失败: {e}")
        return False

def check_ffmpeg_installed():
    try:
        subprocess.run([get_ffmpeg_command(), "-version"], check=True, capture_output=True, text=True)
        logger.info("FFmpeg 已安装")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        logger.warning("FFmpeg 未安装")
        return False

def install_ffmpeg():
    system = platform.system().lower()
    logger.info(f"检测到操作系统: {system}")
    if system == "linux":
        try:
            if subprocess.call(["apt-get", "--version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE) == 0:
                subprocess.run(["sudo", "apt-get", "update"], check=True)
                subprocess.run(["sudo", "apt-get", "install", "-y", "ffmpeg"], check=True)
                logger.info("FFmpeg 已通过 apt-get 安装")
            else:
                logger.error("不支持的 Linux 包管理器，请手动安装 FFmpeg")
                return False
            return True
        except subprocess.CalledProcessError as e:
            logger.error(f"FFmpeg 安装失败: {e}")
            return False
    elif system == "darwin":
        try:
            if subprocess.call(["brew", "--version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE) != 0:
                logger.info("Homebrew 未安装，正在安装...")
                subprocess.run(['/bin/bash', '-c', '$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)'], check=True)
            subprocess.run(["brew", "install", "ffmpeg"], check=True)
            logger.info("FFmpeg 已通过 Homebrew 安装")
            return True
        except subprocess.CalledProcessError as e:
            logger.error(f"FFmpeg 安装失败: {e}")
            return False
    elif system == "windows":
        try:
            ffmpeg_url = "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip"
            ffmpeg_zip = "ffmpeg.zip"
            ffmpeg_dir = "ffmpeg"
            logger.info("正在下载 FFmpeg...")
            response = requests.get(ffmpeg_url)
            with open(ffmpeg_zip, "wb") as f:
                f.write(response.content)
            import zipfile
            with zipfile.ZipFile(ffmpeg_zip, 'r') as zip_ref:
                zip_ref.extractall(ffmpeg_dir)
            os.remove(ffmpeg_zip)
            ffmpeg_path = os.path.abspath(os.path.join(ffmpeg_dir, "ffmpeg-master-latest-win64-gpl", "bin"))
            os.environ["PATH"] += os.pathsep + ffmpeg_path
            logger.info(f"FFmpeg 已安装到 {ffmpeg_path}")
            return True
        except Exception as e:
            logger.error(f"FFmpeg 安装失败: {e}")
            return False
    else:
        logger.error(f"不支持的操作系统: {system}")
        return False

def ensure_ffmpeg():
    if not check_ffmpeg_installed():
        logger.info("正在尝试自动安装 FFmpeg...")
        if install_ffmpeg():
            logger.info("FFmpeg 安装成功")
        else:
            logger.error("FFmpeg 安装失败，请手动安装")
            sys.exit(1)

def generate_srt(text, audio_file, file_name):
    srt_path = os.path.join(app.config['TTS_FOLDER'], f"{file_name}.srt")
    lines = text.split('\n')
    duration = 5
    with open(srt_path, 'w', encoding='utf-8') as f:
        for i, line in enumerate(lines, 1):
            if line.strip():
                start_time = f"00:00:{(i-1)*2:02d},000"
                end_time = f"00:00:{i*2:02d},000"
                f.write(f"{i}\n{start_time} --> {end_time}\n{line.strip()}\n\n")
    return srt_path

def convert_audio_format(input_file, output_format):
    output_file = input_file.replace('.mp3', f'.{output_format}')
    command = [get_ffmpeg_command(), "-i", input_file, "-y", output_file]
    try:
        subprocess.run(command, check=True, capture_output=True, text=True)
        if is_valid_audio_file(output_file):
            return output_file
        logger.error("转换后的音频文件无效")
        delete_file_if_exists(output_file)
        return None
    except subprocess.CalledProcessError as e:
        logger.error(f"Audio conversion failed: {e.stderr or e}")
        return None

def createAudio(text, file_path, voiceId, rate=None, pitch=None, volume=None, ssml=None, output_format="mp3"):
    voice = getVoiceById(voiceId)
    if not voice:
        logger.error("Invalid voice ID")
        return "error", None, "无效的语音参数"

    for filename in os.listdir(app.config['TTS_FOLDER']):
        if filename.endswith((".mp3", ".wav", ".srt")):
            os.remove(os.path.join(app.config['TTS_FOLDER'], filename))

    command = [sys.executable, "-m", "edge_tts", "--voice", voice]
    new_text = remove_html(ssml if ssml else text)
    command.extend(["--text", new_text])
    if rate:
        command.extend(["--rate", str(rate)])
    if pitch:
        command.extend(["--pitch", str(pitch)])
    if volume:
        command.extend(["--volume", str(volume)])
    temp_file = file_path if output_format == "mp3" else file_path.replace(f".{output_format}", ".mp3")
    command.extend(["--write-media", temp_file])
    logger.debug(f"Running command: {' '.join(map(shlex.quote, command))}")

    try:
        result = subprocess.run(command, check=True, capture_output=True, text=True)
        if result.stdout:
            logger.debug(result.stdout)
        if result.stderr:
            logger.debug(result.stderr)

        if is_valid_audio_file(temp_file):
            logger.debug(f"File created successfully: {temp_file}")
            if output_format != "mp3":
                final_file = convert_audio_format(temp_file, output_format)
                if final_file:
                    os.remove(temp_file)
                    return "success", final_file, ""
                delete_file_if_exists(temp_file)
                return "error", None, "音频格式转换失败"
            return "success", temp_file, ""
        else:
            delete_file_if_exists(temp_file)
            logger.error(f"File not created or invalid: {temp_file}")
            return "error", None, "语音文件生成失败，未得到有效音频"
    except subprocess.CalledProcessError as e:
        delete_file_if_exists(temp_file)
        error_output = e.stderr or e.stdout or str(e)
        logger.error(f"Command failed with exit code {e.returncode}: {error_output}")
        return "error", None, f"语音生成失败：{error_output.strip()}"
    except Exception as e:
        delete_file_if_exists(temp_file)
        logger.error(f"An unexpected error occurred: {str(e)}")
        return "error", None, f"语音生成异常：{str(e)}"

def speech_to_text(audio_file):
    if not os.path.exists(VOSK_MODEL_PATH):
        logger.error("Vosk 模型未找到，请确保 vosk-model-small-cn-0.22 已解压到项目根目录")
        return "模型未找到"

    model = Model(VOSK_MODEL_PATH)
    rec = KaldiRecognizer(model, 16000)

    with wave.open(audio_file, "rb") as wf:
        if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getframerate() != 16000:
            logger.error("音频格式必须为单声道 16kHz WAV")
            return "音频格式错误"
        
        transcription = ""
        while True:
            data = wf.readframes(4000)
            if len(data) == 0:
                break
            if rec.AcceptWaveform(data):
                result = rec.Result()
                transcription += eval(result).get("text", "") + " "
            else:
                partial = rec.PartialResult()
                logger.debug(f"部分结果: {partial}")
        
        final_result = rec.FinalResult()
        transcription += eval(final_result).get("text", "")
        return transcription.strip()

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        reset_logs()
        text = request.form.get('text', '')
        file_name = request.form.get('file_name', '')
        voice = request.form['voice']
        rate = request.form.get('rate')
        pitch = request.form.get('pitch')
        volume = request.form.get('volume')
        ssml = request.form.get('ssml')
        output_format = request.form.get('output_format', 'mp3')
        generate_subtitles = 'generate_subtitles' in request.form

        file_name = normalize_file_name(file_name, "test")
        file_path = os.path.join(app.config['TTS_FOLDER'], f"{file_name}.{output_format}")

        if 'text_file' in request.files:
            file = request.files['text_file']
            if file and file.filename.endswith('.txt'):
                text = file.read().decode('utf-8')

        if not (text or "").strip() and not (ssml or "").strip():
            return jsonify({"result": "error", "message": "请输入要转换的文字", "console": "请输入要转换的文字"}), 400

        result, final_file, message = createAudio(text, file_path, voice, rate, pitch, volume, ssml, output_format)
        log_stream.seek(0)
        logs = log_stream.read()

        base_url = request.host_url.rstrip('/')
        response_data = {"result": result, "console": logs, "message": message}

        if result == "success":
            file_url = f"{base_url}{url_for('download_file', filename=os.path.basename(final_file))}"
            response_data["file_url"] = file_url
            if generate_subtitles:
                srt_path = generate_srt(text, final_file, file_name)
                srt_url = f"{base_url}{url_for('download_file', filename=f'{file_name}.srt')}"
                response_data["srt_url"] = srt_url

        status_code = 200 if result == "success" else 500
        return jsonify(response_data), status_code

    return render_template('index.html', voiceChoices=voiceChoices)

@app.route('/api/tts', methods=['POST'])
def tts():
    data = request.get_json()
    text = data.get('text', '')
    file_name = data.get('file_name', '')
    voice = data.get('voice', 'xiaoxiao')
    output_format = data.get('output_format', 'mp3')

    file_name = normalize_file_name(file_name, "test")
    file_path = os.path.join(app.config['TTS_FOLDER'], f"{file_name}.{output_format}")
    result, final_file, message = createAudio(text, file_path, voice)
    
    if result == "success":
        file_url = url_for('download_file', filename=os.path.basename(final_file), _external=True)
        return jsonify({"result": "success", "file_url": file_url})
    else:
        return jsonify({"result": "error", "message": message}), 500

@app.route('/stt', methods=['POST'])
def stt():
    if 'audio_file' not in request.files:
        return jsonify({"result": "error", "message": "未上传音频文件"}), 400
    
    audio_file = request.files['audio_file']
    if audio_file.filename == '':
        return jsonify({"result": "error", "message": "文件名为空"}), 400
    
    original_filename = secure_filename(audio_file.filename)
    base_name = os.path.splitext(original_filename)[0] if os.path.splitext(original_filename)[1] else original_filename
    audio_path = os.path.join(app.config['UPLOAD_FOLDER'], original_filename)
    audio_file.save(audio_path)

    # 如果音频不是 WAV 格式，转换为 WAV
    if not original_filename.lower().endswith('.wav'):
        wav_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{base_name}_converted.wav")
        try:
            subprocess.run([get_ffmpeg_command(), "-i", audio_path, "-ac", "1", "-ar", "16000", wav_path, "-y"], check=True, capture_output=True, text=True)
            os.remove(audio_path)
            audio_path = wav_path
        except subprocess.CalledProcessError as e:
            logger.error(f"FFmpeg 转换失败: {e.stderr}")
            return jsonify({"result": "error", "message": "音频转换失败", "console": log_stream.getvalue()}), 500

    transcription = speech_to_text(audio_path)
    log_stream.seek(0)
    logs = log_stream.read()

    if transcription.startswith("模型未找到") or transcription.startswith("音频格式错误"):
        return jsonify({"result": "error", "message": transcription, "console": logs}), 400
    
    # 清理临时文件
    if os.path.exists(audio_path):
        os.remove(audio_path)

    return jsonify({"result": "success", "transcription": transcription, "console": logs})

@app.route('/download/<filename>')
def download_file(filename):
    return send_from_directory(app.config['TTS_FOLDER'], filename, as_attachment=True)

if __name__ == "__main__":
    ensure_ffmpeg()
    if not os.path.exists(VOSK_MODEL_PATH):
        print(f"请下载 vosk-model-small-cn-0.22.zip 并解压到 {VOSK_MODEL_PATH}")
        print("下载地址: https://alphacephei.com/vosk/models/vosk-model-small-cn-0.22.zip")
        sys.exit(1)
    print("服务器正在运行，请访问：http://127.0.0.1:2024")
    app.run(port=2024, host="0.0.0.0", debug=True)
