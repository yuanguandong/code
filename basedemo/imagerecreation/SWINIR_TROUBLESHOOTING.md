# 🔧 SwinIR模型问题排查指南

## 问题描述
用户遇到了SwinIR模型运行时的Slice操作错误：
```
[WebGPU] Kernel "[Slice] Slice_264" failed. 
Error: cannot get valid size from specified dimension range. 
Most likely the range contains negative values in them.
```

## 🔍 问题根因分析

### 1. Slice操作失败原因
- **维度计算错误**: Slice操作中的维度范围包含负值
- **输入尺寸不匹配**: 模型期望的输入与实际提供的不符
- **张量形状问题**: NCHW格式不正确或维度计算有误

### 2. SwinIR模型特殊要求
- **输入尺寸约束**: 很多深度学习模型要求输入是8或16的倍数
- **窗口分割**: SwinIR使用滑动窗口，对输入尺寸有特定要求
- **内存对齐**: WebGPU对张量内存布局要求更严格

## ⚡ 解决方案

### 1. 输入尺寸优化
```typescript
// 确保输入尺寸是8的倍数
if (isSwinIR) {
  inputSize = Math.max(64, Math.round(inputSize / 8) * 8)
  console.log(`SwinIR模型 - 调整输入尺寸为: ${inputSize}x${inputSize}`)
}
```

### 2. 增强的张量验证
```typescript
// 验证张量数据范围
if (rgbData.some(val => !isFinite(val) || val < 0 || val > 1)) {
  throw new Error('张量数据包含无效值')
}

// 验证张量形状
if (inputTensor.dims.some(dim => dim <= 0)) {
  throw new Error(`无效的张量形状: [${inputTensor.dims.join(', ')}]`)
}
```

### 3. SwinIR专用预处理
```typescript
if (isSwinIR) {
  // 轻微对比度增强，避免纯黑像素导致的维度问题
  r = Math.min(1.0, Math.max(0.0, r * 1.02))
  g = Math.min(1.0, Math.max(0.0, g * 1.02))
  b = Math.min(1.0, Math.max(0.0, b * 1.02))
}
```

### 4. 错误降级机制
```typescript
// WebGPU失败 → WebGL降级 → WASM降级
try {
  // WebGPU推理
  results = await this.session!.run(feeds)
} catch (error) {
  if (currentProvider === 'webgpu') {
    console.log('🔄 WebGPU失败，尝试降级到WebGL...')
    return await this.fallbackToWebGL(feeds)
  }
  // ... 更多降级逻辑
}
```

## 📊 修复前后对比

### 修复前问题
- ❌ 固定64x64输入可能不满足SwinIR要求
- ❌ 缺乏张量数据验证
- ❌ WebGPU失败时无降级机制
- ❌ 预处理未针对SwinIR优化

### 修复后改进
- ✅ 自适应输入尺寸调整（确保是8的倍数）
- ✅ 完整的张量验证和错误检查
- ✅ 智能执行后端降级策略
- ✅ SwinIR专用预处理优化
- ✅ 详细的调试日志输出

## 🛠️ 故障排除步骤

### 1. 检查输入张量
```javascript
// 在控制台查看张量信息
console.log('输入张量形状:', inputTensor.dims)
console.log('数据范围:', [Math.min(...rgbData), Math.max(...rgbData)])
```

### 2. 监控执行后端
```javascript
// 查看当前使用的执行后端
console.log('执行后端:', modelInfo.executionProviders[0])
```

### 3. 查看降级过程
```javascript
// 观察降级日志
// 🔄 WebGPU失败，尝试降级到WebGL...
// 🔧 WebGL降级会话创建成功
```

## 🎯 预期效果

修复后你应该看到：

1. **成功的输入预处理**:
   ```
   🔧 SwinIR模型 - 调整输入尺寸为: 128x128
   📊 输入张量形状: [1, 3, 128, 128], 数据范围: [0.000, 1.020]
   ```

2. **顺利的推理执行**:
   ```
   🚀 开始AI推理 (webgpu)...
   ✅ AI推理成功 (webgpu)，耗时: 1245.67ms
   ```

3. **或者成功的降级**:
   ```
   ❌ webgpu 推理失败: Slice_264 error
   🔄 WebGPU失败，尝试降级到WebGL...
   🔧 WebGL降级会话创建成功
   ✅ AI推理成功 (webgl)，耗时: 2341.23ms
   ```

## 💡 额外建议

### 1. 浏览器兼容性
- **Chrome 94+**: 最佳WebGPU支持
- **Firefox 110+**: 良好的WebGL支持
- **Safari 16.4+**: 基础WebGPU支持

### 2. 模型文件检查
确保SwinIR模型文件完整：
```bash
# 检查模型文件大小
ls -lh public/models/003_realSR_BSRGAN_DFO_s64w8_SwinIR-M_x4_GAN.onnx
```

### 3. 性能监控
- 监控内存使用：`performance.memory`
- 观察GPU利用率：开发者工具 → 性能
- 检查控制台错误：F12 → Console

现在SwinIR应该能稳定运行了！🎉

