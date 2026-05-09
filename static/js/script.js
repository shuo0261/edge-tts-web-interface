const translations = {
    zh: {
        metaTitle: '文字转语音 & 语音转文字工具',
        switchLanguage: '切换语言',
        toggleTheme: '切换主题',
        closePlayer: '关闭播放器',
        eyebrow: '本地语音工作台',
        title: '语音与文字转换工具',
        subtitle: '输入文字生成语音，也可以上传音频转写文本。',
        statLabel: '双向转换',
        tabTTS: '文字转语音',
        tabSTT: '语音转文字',
        labelInput: '输入文本',
        uploadTxt: '上传 TXT',
        textPlaceholder: '请输入要合成的内容...',
        labelFilename: '文件名',
        labelVoice: '选择语音',
        labelRate: '语速',
        labelPitch: '音调',
        labelVolume: '音量',
        labelAdvanced: '高级参数',
        labelSubtitle: '生成字幕',
        btnGenerate: '生成语音',
        btnPreview: '预览',
        done: '完成',
        downloadAudio: '下载音频',
        downloadSubtitle: '下载字幕',
        labelUploadTip: '点击或拖拽上传音频',
        supportAudio: '支持 WAV、MP3',
        labelFilenameOut: '输出文件名',
        btnConvert: '开始转换',
        btnClear: '清空重置',
        labelResult: '转换结果',
        saveText: '保存文本',
        noAudio: '请先生成语音',
        labelConsole: '运行日志',
        ready: '[系统] 已就绪...',
        processingTTS: '正在生成语音...',
        generatingPreview: '正在生成预览...',
        transcribing: '正在转写音频...',
        uploadRequired: '请上传文件',
        unsupportedFormat: '格式不支持（仅限 WAV、MP3）',
        langCode: 'CN',
        htmlLang: 'zh-CN'
    },
    en: {
        metaTitle: 'Text to Speech & Speech to Text Tool',
        switchLanguage: 'Switch language',
        toggleTheme: 'Toggle theme',
        closePlayer: 'Close player',
        eyebrow: 'Local voice workspace',
        title: 'Voice & Text Converter',
        subtitle: 'Generate speech from text, or upload audio and transcribe it.',
        statLabel: 'Two-way conversion',
        tabTTS: 'Text to Speech',
        tabSTT: 'Speech to Text',
        labelInput: 'Input Text',
        uploadTxt: 'Upload TXT',
        textPlaceholder: 'Enter the content to synthesize...',
        labelFilename: 'Filename',
        labelVoice: 'Select Voice',
        labelRate: 'Rate',
        labelPitch: 'Pitch',
        labelVolume: 'Volume',
        labelAdvanced: 'Advanced Settings',
        labelSubtitle: 'Generate subtitles',
        btnGenerate: 'Generate Speech',
        btnPreview: 'Preview',
        done: 'Completed',
        downloadAudio: 'Download Audio',
        downloadSubtitle: 'Download Subtitles',
        labelUploadTip: 'Click or drag audio here',
        supportAudio: 'Supports WAV and MP3',
        labelFilenameOut: 'Output Filename',
        btnConvert: 'Start Conversion',
        btnClear: 'Clear & Reset',
        labelResult: 'Transcription Result',
        saveText: 'Save Text',
        noAudio: 'Please generate audio first',
        labelConsole: 'Runtime Log',
        ready: '[System] Ready...',
        processingTTS: 'Processing TTS...',
        generatingPreview: 'Generating preview...',
        transcribing: 'Transcribing audio...',
        uploadRequired: 'Please upload a file',
        unsupportedFormat: 'Unsupported format (WAV and MP3 only)',
        langCode: 'EN',
        htmlLang: 'en',
    }
};

let sttDownloadUrl = null;

function getCurrentLang() {
    return localStorage.getItem('language') || 'zh';
}

function t(key) {
    const lang = getCurrentLang();
    return translations[lang][key] || translations.zh[key] || key;
}

function updateLanguage(lang) {
    const pack = translations[lang] || translations.zh;
    document.documentElement.lang = pack.htmlLang;
    document.title = pack.metaTitle;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.dataset.i18n;
        if (pack[key]) el.textContent = pack[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
        const key = el.dataset.i18nPlaceholder;
        if (pack[key]) el.placeholder = pack[key];
    });

    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
        const key = el.dataset.i18nTitle;
        if (pack[key]) el.title = pack[key];
    });

    const langDisplay = document.getElementById('current-lang-display');
    if (langDisplay) langDisplay.textContent = pack.langCode;

    document.querySelectorAll('#voice option').forEach((option) => {
        const label = option.dataset[`label${lang.charAt(0).toUpperCase()}${lang.slice(1)}`];
        if (label) option.textContent = label;
    });

    const consoleDiv = document.getElementById('console');
    if (consoleDiv && /^\[(System|系统)\]/.test(consoleDiv.innerText.trim())) {
        consoleDiv.innerText = pack.ready;
    }
}

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark-mode');
    document.getElementById('sun-display').style.display = 'none';
    document.getElementById('moon-display').style.display = 'inline';
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light-mode');
    document.getElementById('sun-display').style.display = 'inline';
    document.getElementById('moon-display').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function () {
    const themeBtn = document.getElementById('theme-toggle');
    const langBtn = document.getElementById('lang-toggle');

    if (localStorage.getItem('theme') === 'dark-mode') {
        enableDarkMode();
    } else {
        disableDarkMode();
    }

    themeBtn.addEventListener('click', function () {
        if (document.body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });

    langBtn.addEventListener('click', function () {
        const newLang = getCurrentLang() === 'zh' ? 'en' : 'zh';
        localStorage.setItem('language', newLang);
        updateLanguage(newLang);
    });

    const audioInput = document.getElementById('audio_file');
    const fileInfo = document.getElementById('file-info');
    const sttFilename = document.getElementById('stt-filename');

    audioInput.addEventListener('change', function () {
        if (this.files && this.files.length > 0) {
            fileInfo.classList.remove('d-none');
            sttFilename.textContent = this.files[0].name;
        } else {
            fileInfo.classList.add('d-none');
        }
    });

    updateLanguage(getCurrentLang());
});

function showConsole(message) {
    const consoleDiv = document.getElementById('console');
    new bootstrap.Collapse(document.getElementById('console-section'), { toggle: false }).show();
    consoleDiv.innerText = message;
    return consoleDiv;
}

function enableDownload(link, href, filename) {
    const toolbar = document.getElementById('download-toolbar');
    link.href = href;
    link.download = filename;
    link.classList.remove('disabled');
    link.removeAttribute('aria-disabled');
    if (toolbar && link.id === 'download-link') toolbar.classList.add('is-ready');
}

function disableDownload(link) {
    const toolbar = document.getElementById('download-toolbar');
    link.href = '#';
    link.removeAttribute('download');
    link.classList.add('disabled');
    link.setAttribute('aria-disabled', 'true');
    if (toolbar && link.id === 'download-link') toolbar.classList.remove('is-ready');
}

function formatDuration(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
    const totalSeconds = Math.floor(seconds);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const rest = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${rest}`;
}

function showAudioPlayer(fileUrl, fileName) {
    const audioPlayer = document.getElementById('audio-player');
    const audioOutput = document.getElementById('audio-output');
    const audioFilename = document.getElementById('audio-filename');
    const audioDuration = document.getElementById('audio-duration');
    const playbackUrl = `${fileUrl}${fileUrl.includes('?') ? '&' : '?'}t=${Date.now()}`;

    audioFilename.textContent = fileName;
    audioDuration.textContent = '00:00';
    audioOutput.src = playbackUrl;
    audioPlayer.style.display = 'block';

    audioOutput.addEventListener('loadedmetadata', function updateDuration() {
        audioDuration.textContent = formatDuration(audioOutput.duration);
        audioOutput.removeEventListener('loadedmetadata', updateDuration);
    });

    return playbackUrl;
}

function closeAudioPlayer() {
    const audioPlayer = document.getElementById('audio-player');
    const audioOutput = document.getElementById('audio-output');

    audioOutput.pause();
    audioPlayer.style.display = 'none';
}

function submitForm(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const outputFormat = formData.get('output_format') || 'mp3';
    const fileName = (formData.get('file_name') || '').trim() || 'test';
    const consoleDiv = showConsole(t('processingTTS'));

    document.getElementById('audio-player').style.display = 'none';
    disableDownload(document.getElementById('download-link'));
    disableDownload(document.getElementById('subtitle-link'));
    document.getElementById('subtitle-link').style.display = 'none';

    fetch('/', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            consoleDiv.innerText = data.console || data.message || '';
            if (data.result === 'success') {
                const downloadLink = document.getElementById('download-link');
                const subtitleLink = document.getElementById('subtitle-link');
                const downloadName = `${fileName}.${outputFormat}`;
                const playbackUrl = showAudioPlayer(data.file_url, downloadName);

                enableDownload(downloadLink, playbackUrl, downloadName);

                if (data.srt_url) {
                    subtitleLink.style.display = 'inline-block';
                    enableDownload(subtitleLink, data.srt_url, `${fileName}.srt`);
                } else {
                    subtitleLink.style.display = 'none';
                    disableDownload(subtitleLink);
                }
            } else {
                disableDownload(document.getElementById('download-link'));
                consoleDiv.innerText = data.message || data.console || 'Error';
            }
        })
        .catch(error => {
            consoleDiv.innerText = `Error: ${error.message}`;
        });
}

function playCurrentAudio() {
    const audioOutput = document.getElementById('audio-output');
    if (!audioOutput.src) {
        showConsole(t('noAudio'));
        return;
    }
    document.getElementById('audio-player').style.display = 'block';
    audioOutput.play();
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

    if (!audioInput.files || audioInput.files.length === 0) {
        fileError.textContent = t('uploadRequired');
        fileError.style.display = 'block';
        return;
    }

    if (!validateAudioFile(audioInput.files[0])) {
        fileError.textContent = t('unsupportedFormat');
        fileError.style.display = 'block';
        return;
    }

    fileError.style.display = 'none';
    const consoleDiv = showConsole(t('transcribing'));
    document.getElementById('stt-result').style.display = 'none';

    const formData = new FormData(event.target);
    fetch('/stt', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            consoleDiv.innerText = data.console;
            if (data.result === 'success') {
                const outputName = 'transcription';
                const sttDownloadLink = document.getElementById('stt-download-link');
                const textBlob = new Blob([data.transcription], { type: 'text/plain;charset=utf-8' });

                if (sttDownloadUrl) URL.revokeObjectURL(sttDownloadUrl);
                sttDownloadUrl = URL.createObjectURL(textBlob);

                document.getElementById('stt-result').style.display = 'block';
                document.getElementById('stt-output').value = data.transcription;
                sttDownloadLink.href = sttDownloadUrl;
                sttDownloadLink.download = `${outputName}.txt`;
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
    document.getElementById('file-error').style.display = 'none';
    document.getElementById('console').innerText = t('ready');

    if (sttDownloadUrl) {
        URL.revokeObjectURL(sttDownloadUrl);
        sttDownloadUrl = null;
    }
}
