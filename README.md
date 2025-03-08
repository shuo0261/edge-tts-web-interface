# Edge TTS Web Interface

 **[中文](README.md)**  | **[English](README.en.md)** 

---

这是一个基于Flask的Web应用，使用Microsoft Edge的文本转语音（TTS）引擎来生成音频文件。

## 功能

- 将文本转换为语音
- 支持多国语言转换（中文[包括普通话、粤语和台湾话]、英文、日文等）
- 实时日志显示
- 音频文件支持预览、在线播放和下载
- 自动清理旧文件，只保留最新生成的音频，旧音频会被自动替换
- 支持API，允许开发者通过POST请求生成音频

## 安装和运行

### 本地运行

1. 克隆仓库：
```sh
git clone https://github.com/shuo0261/edge-tts-web-interface.git
```
2. 进入项目目录：
```shell
cd edge-tts-web-interface
```
3. 安装依赖：
```python
python -m pip install --upgrade pip
pip install -r requirements.txt --no-cache-dir
```
4. 运行应用：
```python
python app.py
```
5. 在浏览器中访问 `http://localhost:2024`

### Docker 部署

1. 克隆仓库：
```sh
git clone https://github.com/shuo0261/edge-tts-web-interface.git
```
2. 进入项目目录：
```sh
cd edge-tts-web-interface
```
3. 构建 Docker 镜像：
```dockerfile
docker build -t edge-tts-web .
```
4. 运行 Docker 容器：
```dockerfile
docker run -d -p 2024:2024 --name edge-tts-web edge-tts-web
```
5. 在浏览器中访问 `http://localhost:2024`

注意：如果你想保存生成的音频文件到主机，可以使用卷挂载：
```dockerfile
docker run -d -p 2024:2024 -v /path/on/host:/app/tts --name edge-tts-web edge-tts-web
```
将 `/path/on/host` 替换为你想要保存文件的主机路径。

## 使用
### API接口请求
- 使用POST请求访问`/api/tts`，示例
```json
{
    "text": "Hello world",
    "file_name": "test",
    "voice": "amy"
}
```
- 返回格式
```json

```


### Web使用
1. 在文本框中输入要转换的文字
2. 选择所需的语音
3. 输入文件名（不包含扩展名）
4. 点击"生成语音"按钮
5. 等待音频生成完成
6. 使用内置播放器播放音频或下载生成的文件
7. 点击“预览语音”，可听到前50个字符的音频。

## 依赖

- Flask
- edge-tts

## 贡献

欢迎提交问题和拉取请求。对于重大更改，请先开issue讨论您想要更改的内容。

## 许可

此项目采用 MIT 许可证 - 详情请见 [LICENSE](LICENSE) 文件。