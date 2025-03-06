// Theme toggle logic
const themeToggle = document.getElementById('theme-toggle');

// Apply saved theme on load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
});

// Toggle theme on click
themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

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
            const url = data.file_url;
            
            audioSource.src = url;
            audioPlayer.querySelector('audio').load();
            downloadLink.href = url;
            downloadLink.download = formData.get('file_name') + '.mp3';
            audioPlayer.style.display = 'block';
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