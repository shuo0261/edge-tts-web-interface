function submitForm(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const resultDiv = document.getElementById('result');
    const resultText = document.getElementById('result-text');
    const consoleDiv = document.getElementById('console');
    const consoleSection = document.getElementById('console-section');
    
    resultDiv.className = 'alert alert-info';
    resultText.innerText = '音频生成中...';
    resultDiv.style.display = 'block';
    consoleDiv.innerText = '';
    consoleSection.style.display = 'none';
    document.getElementById('audio-player').style.display = 'none';
    document.getElementById('srt-link').style.display = 'none';
    document.getElementById('stt-result').style.display = 'none';

    fetch('/', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === "success") {
            resultDiv.className = 'alert alert-success';
            resultText.innerText = '音频生成成功！';
            
            const audioPlayer = document.getElementById('audio-player');
            const audioSource = document.querySelector('#audio-player audio source');
            const downloadLink = document.getElementById('download-link');
            const srtLink = document.getElementById('srt-link');
            const url = data.file_url;
            
            audioSource.src = url;
            audioPlayer.querySelector('audio').load();
            downloadLink.href = url;
            downloadLink.download = formData.get('file_name') + '.' + formData.get('output_format');
            audioPlayer.style.display = 'block';

            if (data.srt_url) {
                srtLink.href = data.srt_url;
                srtLink.download = formData.get('file_name') + '.srt';
                srtLink.style.display = 'inline-block';
            }
        } else {
            resultDiv.className = 'alert alert-danger';
            resultText.innerText = data.result;
        }
        consoleDiv.innerText = data.console;
        consoleSection.style.display = 'block';
    })
    .catch(error => {
        resultDiv.className = 'alert alert-danger';
        resultText.innerText = `音频生成失败: ${error.message}`;
    });
}

function previewAudio() {
    const text = document.getElementById('text').value.slice(0, 50);
    const formData = new FormData();
    formData.append('text', text);
    formData.append('file_name', 'preview');
    formData.append('voice', document.getElementById('voice').value);
    formData.append('output_format', 'mp3');
    
    const resultDiv = document.getElementById('result');
    const resultText = document.getElementById('result-text');
    resultDiv.className = 'alert alert-info';
    resultText.innerText = '预览生成中...';
    resultDiv.style.display = 'block';

    fetch('/', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === 'success') {
            resultDiv.className = 'alert alert-success';
            resultText.innerText = '预览生成成功！';
            const audioPlayer = document.getElementById('audio-player');
            const audioSource = document.querySelector('#audio-player audio source');
            const url = data.file_url;
            audioSource.src = url;
            audioPlayer.querySelector('audio').load();
            audioPlayer.style.display = 'block';
        } else {
            resultDiv.className = 'alert alert-danger';
            resultText.innerText = data.result;
        }
    });
}

function validateAudioFile(file) {
    const validExtensions = ['.wav', '.mp3'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => fileName.endsWith(ext));
    return isValid;
}

function submitSTT(event) {
    event.preventDefault();
    
    const audioInput = document.getElementById('audio_file');
    const fileError = document.getElementById('file-error');
    const resultDiv = document.getElementById('result');
    const resultText = document.getElementById('result-text');
    const consoleDiv = document.getElementById('console');
    const consoleSection = document.getElementById('console-section');
    
    // 文件验证
    if (!audioInput.files || audioInput.files.length === 0) {
        fileError.textContent = '请上传一个音频文件！';
        fileError.style.display = 'block';
        audioInput.classList.add('is-invalid');
        return;
    }

    const file = audioInput.files[0];
    if (!validateAudioFile(file)) {
        fileError.textContent = '请上传有效的音频文件（支持 .wav 或 .mp3 格式）！';
        fileError.style.display = 'block';
        audioInput.classList.add('is-invalid');
        return;
    }

    // 清除错误状态
    fileError.style.display = 'none';
    audioInput.classList.remove('is-invalid');

    const formData = new FormData(event.target);
    resultDiv.className = 'alert alert-info';
    resultText.innerText = '转录中...';
    resultDiv.style.display = 'block';
    consoleDiv.innerText = '';
    consoleSection.style.display = 'none';
    document.getElementById('audio-player').style.display = 'none';
    document.getElementById('stt-result').style.display = 'none';

    fetch('/stt', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === "success") {
            resultDiv.className = 'alert alert-success';
            resultText.innerText = '转录成功！';
            const transcriptionArea = document.getElementById('transcription');
            transcriptionArea.value = data.transcription;
            document.getElementById('stt-result').style.display = 'block';
        } else {
            resultDiv.className = 'alert alert-danger';
            // 根据后端返回的具体错误显示提示
            let errorMessage = '转录失败';
            switch (data.message) {
                case '未上传音频文件':
                    errorMessage = '请上传一个音频文件！';
                    break;
                case '文件名为空':
                    errorMessage = '文件名不能为空！';
                    break;
                case '音频转换失败':
                    errorMessage = '音频转换失败，请检查文件格式是否正确！';
                    break;
                case '模型未找到':
                    errorMessage = 'Vosk 模型未找到，请联系管理员！';
                    break;
                case '音频格式错误':
                    errorMessage = '音频格式错误，必须为单声道 16kHz WAV！';
                    break;
                default:
                    errorMessage = data.message || '未知错误，请查看日志';
            }
            resultText.innerText = errorMessage;
        }
        consoleDiv.innerText = data.console;
        consoleSection.style.display = 'block';
    })
    .catch(error => {
        resultDiv.className = 'alert alert-danger';
        resultText.innerText = `转录失败: ${error.message}`;
    });
}

// 监听文件输入变化，实时验证
document.getElementById('audio_file').addEventListener('change', function() {
    const fileError = document.getElementById('file-error');
    const audioInput = this;
    
    if (audioInput.files.length > 0 && !validateAudioFile(audioInput.files[0])) {
        fileError.style.display = 'block';
        audioInput.classList.add('is-invalid');
    } else {
        fileError.style.display = 'none';
        audioInput.classList.remove('is-invalid');
    }
});