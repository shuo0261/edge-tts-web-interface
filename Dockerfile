# 使用官方Python运行时作为父镜像
FROM python:3.9-slim

# 设置工作目录
WORKDIR /app

# 复制当前目录内容到容器的/app目录
COPY . /app

# 安装所需的包
RUN pip install --no-cache-dir flask edge-tts

# 安装系统依赖（如果edge-tts需要的话）
RUN apt-get update && apt-get install -y \
    # 在这里添加所需的系统包
    && rm -rf /var/lib/apt/lists/*

# 创建存储生成音频文件的目录
RUN mkdir -p /app/tts

# 暴露端口2024
EXPOSE 2024

# 运行app.py
CMD ["python", "app.py"]