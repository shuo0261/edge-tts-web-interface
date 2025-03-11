document.addEventListener('DOMContentLoaded', function() {
	const checkbox = document.getElementById('checkbox');
	const sunDisplay = document.getElementById('sun-display');
	const moonDisplay = document.getElementById('moon-display');
	const savedLanguage = localStorage.getItem('language') || 'zh';

	// 检查本地存储中的主题偏好
	const currentTheme = localStorage.getItem('theme');
	if (currentTheme === 'dark-mode') {
		document.body.classList.add('dark-mode');
		checkbox.style.transform = 'scale(1.5)';
		sunDisplay.style.display = 'none';
		moonDisplay.style.display = 'inline';
		// 切换语言
		if (savedLanguage === 'zh') {
			document.getElementById('cn-light').style.display = 'none';
			document.getElementById('en-light').style.display = 'none';
			document.getElementById('cn-dark').style.display = 'none';
			document.getElementById('en-dark').style.display = 'inline';
		} else {
			document.getElementById('cn-light').style.display = 'none';
			document.getElementById('en-light').style.display = 'none';
			document.getElementById('cn-dark').style.display = 'inline';
			document.getElementById('en-dark').style.display = 'none';
		}
	} else {
		document.body.classList.remove('dark-mode');
		checkbox.style.transform = 'scale(1.5)';
		sunDisplay.style.display = 'inline';
		moonDisplay.style.display = 'none';
		// 切换语言
		if (savedLanguage === 'zh') {
			document.getElementById('cn-light').style.display = 'none';
			document.getElementById('en-light').style.display = 'inline';
			document.getElementById('cn-dark').style.display = 'none';
			document.getElementById('en-dark').style.display = 'none';
		} else {
			document.getElementById('cn-light').style.display = 'inline';
			document.getElementById('en-light').style.display = 'none';
			document.getElementById('cn-dark').style.display = 'none';
			document.getElementById('en-dark').style.display = 'none';
		}
	}

	checkbox.addEventListener('click', function() {
		if (document.body.classList.contains('dark-mode')) {
			document.body.classList.remove('dark-mode');
			localStorage.setItem('theme', 'light-mode');
			sunDisplay.style.display = 'inline';
			moonDisplay.style.display = 'none';
		// 切换语言
		if (savedLanguage === 'zh') {
			document.getElementById('cn-light').style.display = 'none';
			document.getElementById('en-light').style.display = 'inline';
			document.getElementById('cn-dark').style.display = 'none';
			document.getElementById('en-dark').style.display = 'none';
		} else {
			document.getElementById('cn-light').style.display = 'inline';
			document.getElementById('en-light').style.display = 'none';
			document.getElementById('cn-dark').style.display = 'none';
			document.getElementById('en-dark').style.display = 'none';
		}
		} else {
			document.body.classList.add('dark-mode');
			localStorage.setItem('theme', 'dark-mode');
			sunDisplay.style.display = 'none';
			moonDisplay.style.display = 'inline';
			// 切换语言
			if (savedLanguage === 'zh') {
				document.getElementById('cn-light').style.display = 'none';
				document.getElementById('en-light').style.display = 'none';
				document.getElementById('cn-dark').style.display = 'none';
				document.getElementById('en-dark').style.display = 'inline';
			} else {
				document.getElementById('cn-light').style.display = 'none';
				document.getElementById('en-light').style.display = 'none';
				document.getElementById('cn-dark').style.display = 'inline';
				document.getElementById('en-dark').style.display = 'none';
			}
		}
	});
});
// 语言切换
const translations = {
	zh: {
		title: '文字转语音 & 语音转文字工具',
		description: '简单高效的语音与文字转换解决方案',
		ttsTitle: '文字转语音',
		sttTitle: '语音转文字',
		textLabel: '要转换的文字：',
		textPlaceholder: '请输入要转换为语音的文本内容...',
		uploadTextLabel: '上传文本文件（可选）：',
		fileNameLabel: '文件名（不含扩展名）：',
		fileNamePlaceholder: '生成文件的名称',
		voiceLabel: '选择语音：',
		rateLabel: '语速：',
		pitchLabel: '音调：',
		volumeLabel: '音量：',
		rateLabelif:'例如: +20% or -10%',
		rateLabelif2:'-50% 到 +50%',
		ssmlLabel: 'SSML（可选）：',
		ssmlPlaceholder: '输入SSML代码，留空则使用纯文本',
		outputFormatLabel: '输出格式：',
		generateSubtitles: '生成字幕（SRT格式）',
		generateButton: '生成语音',
		previewButton: '预览语音',
		uploadAudioLabel: '上传音频文件：',
		uploadAudioTip: '支持 WAV、MP3 格式的音频文件（仅限中文语音）',
		outputFileNameLabel: '输出文件名（不含扩展名）：',
		outputFileNamePlaceholder: '生成文本文件的名称',
		convertButton: '转换文字',
		clearButton: '清空表单',
		consoleTitle: '控制台',
		consolePlaceholder: '等待操作...',
		audioTitle: '生成的语音',
		downloadAudio: '下载音频',
		downloadSubtitles: '下载字幕',
		sttResultTitle: '转换的文字',
		downloadText: '下载文本',
		footer: '© 2025 MOML 文字转语音 & 语音转文字工具 | Powered by xAI',
	},
	en: {
		title: 'Text to Speech & Speech to Text Tool',
		description: 'A simple and efficient solution for converting speech and text',
		ttsTitle: 'Text to Speech',
		sttTitle: 'Speech to Text',
		textLabel: 'Text to convert:',
		textPlaceholder: 'Please enter the text content to convert to speech...',
		uploadTextLabel: 'Upload text file (optional):',
		fileNameLabel: 'File name (without extension):',
		fileNamePlaceholder: 'Name of the generated file',
		voiceLabel: 'Select voice:',
		rateLabel: 'Rate:',
		pitchLabel: 'Pitch:',
		volumeLabel: 'Volume:',
		rateLabelif:'For example: +20% or -10%',
		rateLabelif2:'-50% to +50%',
		ssmlLabel: 'SSML (optional):',
		ssmlPlaceholder: 'Enter SSML code, leave blank to use plain text',
		outputFormatLabel: 'Output format:',
		generateSubtitles: 'Generate subtitles (SRT format)',
		generateButton: 'Generate Speech',
		previewButton: 'Preview Speech',
		uploadAudioLabel: 'Upload audio file:',
		uploadAudioTip: 'Supports WAV, MP3 format audio files (Chinese speech only)',
		outputFileNameLabel: 'Output file name (without extension):',
		outputFileNamePlaceholder: 'Name of the generated text file',
		convertButton: 'Convert to Text',
		clearButton: 'Clear Form',
		consoleTitle: 'Console',
		consolePlaceholder: 'Waiting for operation...',
		audioTitle: 'Generated Speech',
		downloadAudio: 'Download Audio',
		downloadSubtitles: 'Download Subtitles',
		sttResultTitle: 'Converted Text',
		downloadText: 'Download Text',
		footer: '© 2025 MOML Text to Speech & Speech to Text Tool | Powered by xAI',
	}
};

// 更新页面文本
function updateLanguage(lang) {
	document.querySelector('title').textContent = translations[lang].title;
	document.querySelector('.header h1').textContent = translations[lang].title;
	document.querySelector('.header p').textContent = translations[lang].description;
	document.querySelector('.container .feature-heading1 h3').textContent = translations[lang].ttsTitle;
	document.querySelector('.container .feature-heading  h3').textContent = translations[lang].sttTitle;
	document.querySelector('.container label[for="text"]').textContent = translations[lang].textLabel;
	document.querySelector('.container textarea#text').placeholder = translations[lang].textPlaceholder;
	document.querySelector('.container label[for="text_file"]').textContent = translations[lang].uploadTextLabel;
	document.querySelector('.container label[for="file_name"]').textContent = translations[lang].fileNameLabel;
	document.querySelector('.container input#file_name').placeholder = translations[lang].fileNamePlaceholder;
	document.querySelector('.container label[for="voice"]').textContent = translations[lang].voiceLabel;
	document.querySelector('.container label[for="rate"]').textContent = translations[lang].rateLabel;
	document.querySelector('.container label[for="pitch"]').textContent = translations[lang].pitchLabel;
	document.querySelector('.container label[for="volume"]').textContent = translations[lang].volumeLabel;
	
	document.querySelector('.container input#rateLabelif').textContent = translations[lang].rateLabelif;
	//document.querySelector('.container label[for="volume"]').textContent = translations[lang].volumeLabel;
	
	document.querySelector('.container label[for="ssml"]').textContent = translations[lang].ssmlLabel;
	document.querySelector('.container textarea#ssml').placeholder = translations[lang].ssmlPlaceholder;
	document.querySelector('.container label[for="output_format"]').textContent = translations[lang].outputFormatLabel;
	document.querySelector('.container label[for="generate_subtitles"]').textContent = translations[lang]
		.generateSubtitles;
	document.querySelector('.action-row1 button[type="submit"]').textContent = translations[lang]
		.generateButton;
	document.querySelector('.action-row1 button[type="button"]').textContent = translations[lang].previewButton;
	document.querySelector('.container label[for="audio_file"]').textContent = translations[lang].uploadAudioLabel;
	document.querySelector('.container .form-text').textContent = translations[lang].uploadAudioTip;
	document.querySelector('.container label[for="output_file_name"]').textContent = translations[lang]
		.outputFileNameLabel;
	document.querySelector('.container input#output_file_name').placeholder = translations[lang]
		.outputFileNamePlaceholder;
	document.querySelector('.action-row2 button[type="submit"]').textContent = translations[lang].convertButton;
	document.querySelector('.action-row2 button[type="button"]').textContent = translations[lang].clearButton;
	document.querySelector('#console-section h3').textContent = translations[lang].consoleTitle;
	document.querySelector('#console').textContent = translations[lang].consolePlaceholder;
	document.querySelector('#audio-player h3').textContent = translations[lang].audioTitle;
	document.querySelector('#download-link').textContent = translations[lang].downloadAudio;
	document.querySelector('#subtitle-link').textContent = translations[lang].downloadSubtitles;
	document.querySelector('#stt-result h3').textContent = translations[lang].sttResultTitle;
	document.querySelector('#stt-download-link').textContent = translations[lang].downloadText;
	document.querySelector('footer p').textContent = translations[lang].footer;
}


document.getElementById('cn-light').addEventListener('click', function() {
	console.log('cn');
	localStorage.setItem('language', 'zh');
	updateLanguage('zh');

	document.getElementById('cn-light').style.display = 'none';
	document.getElementById('en-light').style.display = 'inline';

});

document.getElementById('en-light').addEventListener('click', function() {
	console.log('en');
	localStorage.setItem('language', 'en');
	updateLanguage('en');
	document.getElementById('cn-light').style.display = 'inline';
	document.getElementById('en-light').style.display = 'none';
});
document.getElementById('cn-dark').addEventListener('click', function() {
	console.log('cn');
	localStorage.setItem('language', 'zh');
	updateLanguage('zh');
	document.getElementById('cn-dark').style.display = 'none';
	document.getElementById('en-dark').style.display = 'inline';
});

document.getElementById('en-dark').addEventListener('click', function() {
	console.log('en');
	localStorage.setItem('language', 'en');
	updateLanguage('en');
	document.getElementById('cn-dark').style.display = 'inline';
	document.getElementById('en-dark').style.display = 'none';
});

// 初始化语言
const savedLanguage = localStorage.getItem('language') || 'zh';
document.getElementById('language-select').value = savedLanguage;
updateLanguage(savedLanguage);

// 原有功能
function submitForm(event) {
	event.preventDefault();
	const formData = new FormData(event.target);
	const consoleDiv = document.getElementById('console');
	const consoleSection = document.getElementById('console-section');

	consoleDiv.innerText = '音频生成中...';
	consoleSection.style.display = 'block';
	document.getElementById('audio-player').style.display = 'none';
	document.getElementById('subtitle-link').style.display = 'none';
	document.getElementById('stt-result').style.display = 'none';

	fetch('/', {
			method: 'POST',
			body: formData
		})
		.then(response => response.json())
		.then(data => {
			if (data.result === "success") {
				const audioPlayer = document.getElementById('audio-player');
				const audioOutput = document.getElementById('audio-output');
				const downloadLink = document.getElementById('download-link');
				const subtitleLink = document.getElementById('subtitle-link');
				const url = data.file_url;

				audioOutput.src = url;
				audioPlayer.style.display = 'block';
				downloadLink.href = url;
				downloadLink.download = formData.get('file_name') + '.' + formData.get('output_format');

				if (data.srt_url) {
					subtitleLink.href = data.srt_url;
					subtitleLink.download = formData.get('file_name') + '.srt';
					subtitleLink.style.display = 'inline-block';
				}
			}
			consoleDiv.innerText = data.console;
		})
		.catch(error => {
			consoleDiv.innerText = `音频生成失败: ${error.message}`;
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
	const consoleSection = document.getElementById('console-section');
	consoleDiv.innerText = '预览生成中...';
	consoleSection.style.display = 'block';

	fetch('/', {
			method: 'POST',
			body: formData
		})
		.then(response => response.json())
		.then(data => {
			if (data.result === 'success') {
				const audioPlayer = document.getElementById('audio-player');
				const audioOutput = document.getElementById('audio-output');
				const url = data.file_url;
				audioOutput.src = url;
				audioPlayer.style.display = 'block';
			}
			consoleDiv.innerText = data.console;
		})
		.catch(error => {
			consoleDiv.innerText = `预览生成失败: ${error.message}`;
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
	consoleDiv.innerText = '转录中...';
	consoleSection.style.display = 'block';
	document.getElementById('audio-player').style.display = 'none';
	document.getElementById('stt-result').style.display = 'none';

	fetch('/stt', {
			method: 'POST',
			body: formData
		})
		.then(response => response.json())
		.then(data => {
			if (data.result === "success") {
				const sttResult = document.getElementById('stt-result');
				const sttOutput = document.getElementById('stt-output');
				sttOutput.value = data.transcription;
				sttResult.style.display = 'block';
			} else {
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
				consoleDiv.innerText = errorMessage;
			}
			consoleDiv.innerText = data.console;
		})
		.catch(error => {
			consoleDiv.innerText = `转录失败: ${error.message}`;
		});
}

function clearSTTForm() {
	document.getElementById('stt-form').reset();
	document.getElementById('stt-result').style.display = 'none';
	document.getElementById('console').innerText = translations[savedLanguage].consolePlaceholder;
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