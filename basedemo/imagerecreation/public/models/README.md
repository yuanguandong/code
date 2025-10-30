# 模型文件目录

这个目录用于存放ONNX模型文件。

## Real-ESRGAN 模型下载

由于模型文件较大，需要单独下载：

1. 访问 [Real-ESRGAN 官方仓库](https://github.com/xinntao/Real-ESRGAN)
2. 下载预训练的ONNX模型文件
3. 将模型文件重命名为 `real-esrgan-x4.onnx`
4. 放置在此目录下

## 支持的模型格式

- Real-ESRGAN x4 超分辨率模型
- 输入尺寸: 512x512
- 输出尺寸: 2048x2048 (4倍超分)

## 注意事项

- 模型文件通常为几十MB到几百MB
- 建议使用CDN或云存储托管大型模型文件
- 首次加载模型需要下载时间，请耐心等待
