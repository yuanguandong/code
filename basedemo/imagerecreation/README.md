# 图像超分辨率 - Real-ESRGAN Web 演示

基于 ONNX Runtime Web 的图像超分辨率应用，支持 WebGPU/WebNN 后端加速，实现 Real-ESRGAN 模型的 4x 图像增强功能。

## ✨ 特性

- 🚀 **高性能推理**: 优先使用 WebGPU/WebNN 后端，支持硬件加速
- 🎨 **现代化界面**: 采用苹果风格的简洁设计，响应式布局
- 🔄 **多种对比模式**: 支持并排对比和滑动对比两种查看方式
- 📊 **实时统计**: 显示处理时间、图像尺寸和执行后端信息
- 📱 **移动端友好**: 完全响应式设计，支持拖拽上传
- 🎯 **智能降级**: 模型加载失败时自动切换到演示模式

## 🛠️ 技术栈

- **前端框架**: Vue 3 + Composition API
- **构建工具**: Vite
- **AI 推理**: ONNX Runtime Web
- **图像处理**: Canvas API + 自定义图像处理工具
- **样式**: 原生 CSS + CSS Grid/Flexbox
- **包管理**: pnpm

## 🚀 快速开始

### 环境要求

- Node.js >= 16
- pnpm >= 7

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

### 生产构建

```bash
pnpm build
```

### 预览构建结果

```bash
pnpm preview
```

## 📁 项目结构

```
src/
├── components/
│   └── SuperResolution.vue    # 主要的超分辨率组件
├── utils/
│   ├── onnxInference.js       # ONNX 模型推理工具类
│   └── imageProcessor.js      # 图像处理工具类
├── App.vue                    # 根组件
└── main.js                    # 入口文件

public/
└── models/
    └── README.md              # 模型文件说明
```

## 🤖 模型配置

### Real-ESRGAN 模型下载

1. 访问 [Real-ESRGAN 官方仓库](https://github.com/xinntao/Real-ESRGAN)
2. 下载预训练的 ONNX 模型文件
3. 将模型文件重命名为 `real-esrgan-x4.onnx`
4. 放置在 `public/models/` 目录下

### 支持的模型格式

- **输入尺寸**: 512×512 像素
- **输出尺寸**: 2048×2048 像素（4倍超分）
- **格式**: ONNX 格式
- **精度**: FP32

## 🎯 功能说明

### 1. 图像上传
- 支持拖拽上传和点击选择
- 支持 JPG、PNG 等常见格式
- 自动图像质量评估

### 2. AI 增强处理
- 优先使用 WebGPU 后端进行硬件加速
- 自动降级到 WebGL 或 WASM 后端
- 实时显示处理进度和统计信息

### 3. 结果展示
- **并排对比**: 原图和增强图并排显示
- **滑动对比**: 滑动分割线查看效果差异
- **下载功能**: 一键下载增强后的高清图像
- **分享功能**: 支持原生分享 API

### 4. 性能监控
- 处理时间统计
- 执行后端信息
- 图像尺寸对比
- 内存使用优化

## 🔧 自定义配置

### ONNX Runtime 配置

在 `src/utils/onnxInference.js` 中可以配置：

```javascript
// 设置执行提供者优先级
const providers = ['webgpu', 'webnn', 'webgl', 'wasm']

// 配置 WebGPU 选项
ort.env.webgpu.powerPreference = 'high-performance'

// 配置 WASM 选项
ort.env.wasm.numThreads = navigator.hardwareConcurrency || 4
ort.env.wasm.simd = true
```

### Vite 配置

项目已配置了必要的 ONNX Runtime Web 支持：

```javascript
// vite.config.js
export default defineConfig({
  optimizeDeps: {
    exclude: ['onnxruntime-web']
  },
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    }
  }
})
```

## 🚀 部署说明

### 静态部署

构建后可直接部署到任何静态托管服务：

```bash
pnpm build
# 将 dist/ 目录内容部署到服务器
```

### CDN 优化

建议将模型文件托管到 CDN：

1. 上传模型文件到 CDN
2. 修改 `onnxInference.js` 中的模型 URL
3. 配置适当的缓存策略

## 🔍 浏览器兼容性

- **WebGPU**: Chrome 113+, Edge 113+
- **WebNN**: 实验性支持，需启用实验标志
- **WebGL**: 所有现代浏览器
- **WASM**: 所有现代浏览器

## 📝 开发说明

### 演示模式

当模型文件不存在时，应用会自动进入演示模式：

- 使用图像处理算法模拟超分效果
- 2x 分辨率提升（而非真正的 4x AI 增强）
- 保持界面功能完整可用

### 调试选项

```javascript
// 在控制台查看详细信息
console.log('模型信息:', onnxInference.getModelInfo())
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Real-ESRGAN](https://github.com/xinntao/Real-ESRGAN) - 优秀的图像超分辨率模型
- [ONNX Runtime](https://onnxruntime.ai/) - 高性能机器学习推理引擎
- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
