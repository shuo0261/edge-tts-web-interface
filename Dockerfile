# 使用官方 Python 3.9 轻量镜像作为基础
FROM python:3.9-slim

# 设置工作目录
WORKDIR /app

# 复制依赖文件并安装
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# 安装系统依赖（edge-tts 需要 ffmpeg 支持音频处理）
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# 复制项目文件到容器
COPY . /app

# 创建存储生成音频文件的目录（可选，代码中已有动态创建逻辑）
RUN mkdir -p /app/tts

# 暴露端口 2024
EXPOSE 2024

# 运行 Flask 应用
CMD ["python", "app.py"]