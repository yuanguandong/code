# 🚀 AI模型性能优化指南

## 问题分析

用户反馈："这三个模型都是通过wasm运行的吗？怎么感觉前端会阻塞住一会呢？"

### 原来的问题
1. **执行提供者配置不当**: 优先使用WASM，导致CPU密集计算阻塞主线程
2. **线程配置保守**: `numThreads = 1` 限制了并行性能
3. **执行模式串行**: `executionMode: 'sequential'` 无法充分利用硬件
4. **图优化被禁用**: `graphOptimizationLevel: 'disabled'` 降低了推理效率

## 🔧 性能优化方案

### 1. 智能执行提供者选择
```typescript
// 优先级重新排序 - GPU优先，避免主线程阻塞
const providerConfigs: string[][] = []

// 优先级1: WebGPU (最快，完全异步，不阻塞主线程)
if (capabilities.webgpu) {
  providerConfigs.push(['webgpu'])
}

// 优先级2: WebGL (GPU加速，较少阻塞)  
if (capabilities.webgl2 || capabilities.webgl) {
  providerConfigs.push(['webgl'])
}

// 优先级3: WASM (CPU执行，可能阻塞 - 最后选择)
providerConfigs.push(['wasm'])
```

### 2. 自适应硬件配置
```typescript
// 根据硬件能力动态调整线程数
const maxThreads = Math.min(4, navigator.hardwareConcurrency || 2)
ort.env.wasm.numThreads = maxThreads

// 硬件能力检测
- WebGPU支持检测
- WebGL/WebGL2能力评估  
- CPU核心数获取
- 设备内存估算
```

### 3. 差异化执行策略
```typescript
// WebGPU配置 - 最佳性能
{
  graphOptimizationLevel: 'all',
  executionMode: 'parallel',
  enableCpuMemArena: true,
  enableMemPattern: true
}

// WebGL配置 - 平衡性能
{
  graphOptimizationLevel: 'extended', 
  executionMode: 'parallel',
  enableCpuMemArena: true,
  enableMemPattern: false
}

// WASM配置 - 保守但稳定
{
  graphOptimizationLevel: 'basic',
  executionMode: 'sequential', 
  enableCpuMemArena: false,
  enableMemPattern: false  
}
```

### 4. 非阻塞推理处理
```typescript
// WASM执行使用让步策略
if (currentProvider === 'wasm') {
  results = await this.runInferenceWithYielding(feeds)
} else {
  // GPU执行直接推理（不阻塞主线程）
  results = await this.session!.run(feeds)  
}
```

### 5. 微任务分片处理
```typescript
// 预处理使用微任务避免阻塞
const inputTensor = await new Promise<ort.Tensor>((resolve) => {
  setTimeout(async () => {
    const tensor = await this.preprocessImage(imageData)
    resolve(tensor)
  }, 0)
})

// 后处理同样分片
return await new Promise<string>((resolve) => {
  setTimeout(async () => {
    const result = await this.postprocessImage(outputTensor)
    resolve(result)
  }, 0)
})
```

## 📊 性能提升效果

### 执行后端性能对比
| 执行后端 | 性能 | 主线程阻塞 | 兼容性 | 推荐场景 |
|---------|------|-----------|--------|----------|
| **WebGPU** | ⚡⚡⚡⚡⚡ | ❌ 无阻塞 | 🔶 较新浏览器 | 最佳性能 |
| **WebGL** | ⚡⚡⚡⚡ | 🔶 轻微阻塞 | ✅ 广泛支持 | 平衡选择 |
| **WASM** | ⚡⚡ | ⚠️ 明显阻塞 | ✅ 完全兼容 | 兜底方案 |

### SwinIR模型特别优化
```typescript
// 64x64输入尺寸 (而非128x128)
const inputSize = this.currentModelConfig?.inputSize || 128

// 针对SwinIR的预处理优化
const isSwinIR = this.currentModelConfig?.id?.includes('swinir')
if (isSwinIR) {
  // 保持[0,1]范围，无需额外归一化
  r = Math.min(1.0, Math.max(0.0, r))
  g = Math.min(1.0, Math.max(0.0, g)) 
  b = Math.min(1.0, Math.max(0.0, b))
}
```

## 🎯 用户体验改进

### 1. 实时后端显示
```typescript
// 处理过程中显示当前执行后端
执行后端: {
  modelInfo.executionProviders[0] === 'webgpu' ? '🚀 WebGPU (GPU加速)' :
  modelInfo.executionProviders[0] === 'webgl' ? '⚡ WebGL (GPU加速)' :
  modelInfo.executionProviders[0] === 'wasm' ? '🔧 WebAssembly (CPU)' :
  modelInfo.executionProviders[0]
}
```

### 2. 模型信息透明化
- 显示当前选择的AI模型
- 实时显示执行后端类型
- 展示硬件加速状态

## 💡 使用建议

### 1. 最佳体验配置
- **现代浏览器**: Chrome 94+, Firefox 110+, Safari 16.4+
- **推荐GPU**: 支持WebGPU的独立显卡或集成显卡
- **内存要求**: 4GB+ 系统内存

### 2. 故障排除
```javascript
// 在浏览器控制台查看执行后端
console.log('当前执行后端:', modelInfo.executionProviders[0])

// 硬件能力检测结果
console.log('硬件能力:', await detectHardwareCapabilities())
```

### 3. 性能监控
- 推理时间显示在统计信息中
- 控制台输出详细性能日志
- 实时显示当前使用的执行后端

## 🚀 预期效果

通过这些优化，你应该能观察到：

1. **WebGPU模式**: 几乎无感的流畅体验，推理速度最快
2. **WebGL模式**: 轻微延迟但依然流畅，GPU加速明显
3. **WASM模式**: 虽然仍有短暂阻塞，但已大幅减少

模型现在会根据你的硬件能力自动选择最优的执行方式！🎉

