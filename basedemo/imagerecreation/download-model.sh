#!/bin/bash

# Real-ESRGAN 模型下载脚本
# 自动下载并配置Real-ESRGAN ONNX模型

echo "🚀 开始下载Real-ESRGAN模型文件..."

# 创建模型目录
mkdir -p public/models

# 模型下载地址（第三方ONNX转换版本）
MODEL_URLS=(
    "https://github.com/instant-high/real-esrgan-onnx/releases/download/v0.1.0/RealESRGAN_x4plus.onnx"
    "https://huggingface.co/spaces/Akuparagus/Real-ESRGAN/resolve/main/RealESRGAN_x4plus.onnx"
    "https://github.com/Sg4Dylan/ESRGAN-ONNX/releases/download/v1.0/RealESRGAN_x4plus.onnx"
)

# 尝试下载模型
for url in "${MODEL_URLS[@]}"; do
    echo "📥 尝试从 $url 下载..."
    
    if curl -L --progress-bar -o public/models/real-esrgan-x4.onnx.tmp "$url"; then
        mv public/models/real-esrgan-x4.onnx.tmp public/models/real-esrgan-x4.onnx
        echo "✅ 模型下载成功！"
        
        # 验证文件大小
        file_size=$(ls -lh public/models/real-esrgan-x4.onnx | awk '{print $5}')
        echo "📦 文件大小: $file_size"
        
        # 验证文件类型
        if file public/models/real-esrgan-x4.onnx | grep -q "data"; then
            echo "✅ 模型文件验证通过"
            echo ""
            echo "🎉 Real-ESRGAN模型安装完成！"
            echo "💡 现在可以重新启动开发服务器体验真正的AI超分辨率了："
            echo "   pnpm dev"
            echo ""
            echo "🔍 模型信息:"
            echo "   - 位置: public/models/real-esrgan-x4.onnx"
            echo "   - 类型: Real-ESRGAN x4 超分辨率模型"
            echo "   - 倍数: 4倍放大"
            echo "   - 大小: $file_size"
            exit 0
        else
            echo "❌ 下载的文件可能损坏"
            rm -f public/models/real-esrgan-x4.onnx
        fi
    else
        echo "❌ 从 $url 下载失败"
        rm -f public/models/real-esrgan-x4.onnx.tmp
    fi
done

echo ""
echo "❌ 自动下载失败，请手动下载："
echo ""
echo "⚠️ 注意：官方Real-ESRGAN仓库只提供PyTorch格式(.pth)，不提供ONNX格式！"
echo ""
echo "🔗 可用的ONNX模型来源："
echo "1. 第三方转换版本: https://github.com/instant-high/real-esrgan-onnx/releases"
echo "2. Hugging Face: https://huggingface.co/spaces/Akuparagus/Real-ESRGAN"
echo "3. 下载任一ONNX模型文件"
echo "4. 重命名为: real-esrgan-x4.onnx"
echo "5. 放置到: public/models/ 目录"
echo ""
echo "🔧 或者自己转换官方模型："
echo "1. 下载官方.pth模型: https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth"
echo "2. 使用官方转换脚本转为ONNX格式"
echo "3. 详见: https://github.com/sophgo/sophon-demo/blob/release/sample/Real-ESRGAN/docs/export_onnx_guide.md"
