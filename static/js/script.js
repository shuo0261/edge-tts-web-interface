document.addEventListener('DOMContentLoaded', function () {
    const themeBtn = document.getElementById('checkbox');
    const sunDisplay = document.getElementById('sun-display');
    const moonDisplay = document.getElementById('moon-display');
    const langBtn = document.getElementById('lang-toggle');
    const langDisplay = document.getElementById('current-lang-display');

    // 初始化主题
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark-mode') {
        enableDarkMode();
    } else {
        disableDarkMode();
    }

    // 主题切换点击事件
    themeBtn.addEventListener('click', function () {
        if (document.body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });

    function enableDarkMode() {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark-mode');
        sunDisplay.style.display = 'none';
        moonDisplay.style.display = 'inline';
    }

    function disableDarkMode() {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light-mode');
        sunDisplay.style.display = 'inline';
        moonDisplay.style.display = 'none';
    }

    // 语言切换点击事件
    langBtn.addEventListener('click', function () {
        const currentLang = localStorage.getItem('language') || 'zh';
        const newLang = currentLang === 'zh' ? 'en' : 'zh';
        localStorage.setItem('language', newLang);
        updateLanguage(newLang);
    });

    // 文件上传文件名显示逻辑 (STT)
    const audioInput = document.getElementById('audio_file');
    const fileInfo = document.getElementById('file-info');
    const sttFilename = document.getElementById('stt-filename');

    if (audioInput) {
        audioInput.addEventListener('change', function (e) {
            if (this.files && this.files.length > 0) {
                fileInfo.classList.remove('d-none');
                sttFilename.textContent = this.files[0].name;
            } else {
                fileInfo.classList.add('d-none');
            }
        });
    }
});

// 语言包配置
const translations = {
    zh: {
        title: '语音与文字转换工具',
        subtitle: '简单、高效、本地化的 AI 语音解决方案',
        tabTTS: '文字转语音',
        tabSTT: '语音转文字',
        labelInput: '输入文本',
        labelFilename: '文件名',
        labelVoice: '选择语音',
        labelRate: '语速',
        labelPitch: '音调',
        labelVolume: '音量',
        labelAdvanced: '高级参数',
        labelSubtitle: '生成字幕',
        btnGenerate: '生成语音',
        btnPreview: '预览',
        labelUploadTip: '点击 or 拖拽上传音频',
        labelFilenameOut: '输出文件名',
        btnConvert: '开始转换',
        btnClear: '清空重置',
        labelResult: '转换结果',
        labelConsole: '运行日志',
        langCode: 'CN'
    },
    en: {
        title: 'Voice & Text Converter',
        subtitle: 'Simple, efficient, local AI voice solution',
        tabTTS: 'Text to Speech',
        tabSTT: 'Speech to Text',
        labelInput: 'Input Text',
        labelFilename: 'Filename',
        labelVoice: 'Select Voice',
        labelRate: 'Rate',
        labelPitch: 'Pitch',
        labelVolume: 'Volume',
        labelAdvanced: 'Advanced',
        labelSubtitle: 'Subtitles',
        btnGenerate: 'Generate',
        btnPreview: 'Preview',
        labelUploadTip: 'Click or Drag Audio Here',
        labelFilenameOut: 'Output Filename',
        btnConvert: 'Convert',
        btnClear: 'Reset',
        labelResult: 'Result',
        labelConsole: 'Console Log',
        langCode: 'EN'
    }
};

function updateLanguage(lang) {
    const t = translations[lang];
    document.getElementById('current-lang-display').textContent = t.langCode;

    // 文本更新 (使用 safe querySelector 避免报错)
    safeSetText('.h3', t.title);
    safeSetText('.text-muted.small', t.subtitle);
    safeSetText('#tab-tts-text', t.tabTTS);
    safeSetText('#tab-stt-text', t.tabSTT);
    safeSetText('.label-text', t.labelInput);
    safeSetText('.label-filename', t.labelFilename);
    safeSetText('.label-voice', t.labelVoice);
    safeSetText('.label-rate', t.labelRate);
    safeSetText('.label-pitch', t.labelPitch);
    safeSetText('.label-volume', t.labelVolume);
    safeSetText('.label-advanced', t.labelAdvanced);
    safeSetText('.label-subtitle', t.labelSubtitle);

    // 按钮文字需要保留图标，所以操作 innerHTML
    const btnGen = document.querySelector('.btn-generate');
    if (btnGen) btnGen.innerHTML = `<i class="fas fa-magic me-2"></i>${t.btnGenerate}`;

    const btnPre = document.querySelector('.btn-preview');
    if (btnPre) btnPre.innerHTML = `<i class="fas fa-play me-2"></i>${t.btnPreview}`;

    safeSetText('.label-upload-tip', t.labelUploadTip);
    safeSetText('.label-filename-out', t.labelFilenameOut);

    const btnConv = document.querySelector('.btn-convert');
    if (btnConv) btnConv.innerHTML = `<i class="fas fa-language me-2"></i>${t.btnConvert}`;

    safeSetText('.btn-clear', t.btnClear);
    safeSetText('.label-result', t.labelResult);
    safeSetText('.label-console', t.labelConsole);
}

// 辅助函数：安全设置文本，防止元素不存在报错
function safeSetText(selector, text) {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
}

// 初始化语言
const savedLanguage = localStorage.getItem('language') || 'zh';
updateLanguage(savedLanguage);

/* ================== 下方是原始功能逻辑 (保持不变) ================== */

function submitForm(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const consoleDiv = document.getElementById('console');

    // 展开控制台
    new bootstrap.Collapse(document.getElementById('console-section'), { toggle: false }).show();

    consoleDiv.innerText = "Processing TTS...";
    document.getElementById('audio-player').style.display = 'none';

    fetch('/', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            consoleDiv.innerText = data.console;
            if (data.result === "success") {
                const audioPlayer = document.getElementById('audio-player');
                const audioOutput = document.getElementById('audio-output');
                const downloadLink = document.getElementById('download-link');
                const subtitleLink = document.getElementById('subtitle-link');

                audioOutput.src = data.file_url;
                audioPlayer.style.display = 'block';
                downloadLink.href = data.file_url;
                downloadLink.download = formData.get('file_name') + '.' + formData.get('output_format');

                if (data.srt_url) {
                    subtitleLink.href = data.srt_url;
                    subtitleLink.download = formData.get('file_name') + '.srt';
                    subtitleLink.style.display = 'inline-block';
                } else {
                    subtitleLink.style.display = 'none';
                }
            }
        })
        .catch(error => {
            consoleDiv.innerText = `Error: ${error.message}`;
        });
}

function previewAudio() {
    const text = document.getElementById('text').value.slice(0, 50);
    const formData = new FormData();
    formData.append('text', text);
    formData.append('file_name', 'preview');
    formData.append('voice', document.getElementById('voice').value);
    formData.append('output_format', 'mp3');

    const consoleDiv = document.getElementById('console');
    new bootstrap.Collapse(document.getElementById('console-section'), { toggle: false }).show();
    consoleDiv.innerText = "Generating preview...";

    fetch('/', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            consoleDiv.innerText = data.console;
            if (data.result === 'success') {
                const audioPlayer = document.getElementById('audio-player');
                const audioOutput = document.getElementById('audio-output');
                audioOutput.src = data.file_url;
                audioPlayer.style.display = 'block';
                audioOutput.play();
            }
        })
        .catch(error => {
            consoleDiv.innerText = `Error: ${error.message}`;
        });
}

function validateAudioFile(file) {
    const validExtensions = ['.wav', '.mp3'];
    const fileName = file.name.toLowerCase();
    return validExtensions.some(ext => fileName.endsWith(ext));
}

function submitSTT(event) {
    event.preventDefault();
    const audioInput = document.getElementById('audio_file');
    const fileError = document.getElementById('file-error');
    const consoleDiv = document.getElementById('console');

    if (!audioInput.files || audioInput.files.length === 0) {
        fileError.textContent = "请上传文件";
        fileError.style.display = 'block';
        return;
    }

    if (!validateAudioFile(audioInput.files[0])) {
        fileError.textContent = "格式不支持 (仅限 wav, mp3)";
        fileError.style.display = 'block';
        return;
    }

    fileError.style.display = 'none';
    new bootstrap.Collapse(document.getElementById('console-section'), { toggle: false }).show();
    consoleDiv.innerText = "Transcribing...";
    document.getElementById('stt-result').style.display = 'none';

    const formData = new FormData(event.target);
    fetch('/stt', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            consoleDiv.innerText = data.console;
            if (data.result === "success") {
                document.getElementById('stt-result').style.display = 'block';
                document.getElementById('stt-output').value = data.transcription;
            } else {
                consoleDiv.innerText = `Error: ${data.message}`;
            }
        })
        .catch(error => {
            consoleDiv.innerText = `Error: ${error.message}`;
        });
}

function clearSTTForm() {
    document.getElementById('stt-form').reset();
    document.getElementById('stt-result').style.display = 'none';
    document.getElementById('file-info').classList.add('d-none');
    document.getElementById('console').innerText = "Ready...";
}