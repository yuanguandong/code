import React, { useState, useEffect, useRef, useCallback } from 'react'
import { onnxInference } from '../utils/onnxInference.ts'
import { ImageProcessor } from '../utils/imageProcessor.ts'
import type { 
  ProcessingStats, 
  ModelInfo, 
  FileChangeHandler, 
  DragEventHandler,
  ClickHandler
} from '../types/index.ts'
import './SuperResolution.css'

// 可用的AI模型
const AVAILABLE_MODELS = [
  {
    id: 'real-esrgan-x4',
    name: 'Real-ESRGAN x4',
    path: '/models/real-esrgan-x4.onnx',
    description: '通用超分辨率模型，适合各种图像类型',
    scaleFactor: 4,
    inputSize: 128
  },
  {
    id: 'swinir-real',
    name: 'SwinIR Real-ESRGAN',
    path: '/models/003_realSR_BSRGAN_DFO_s64w8_SwinIR-M_x4_GAN.onnx',
    description: 'SwinIR架构，擅长真实世界图像超分辨率',
    scaleFactor: 4,
    inputSize: 128, // 修改为128，很多SwinIR模型期望更大的输入
    minInputSize: 64 // 添加最小输入尺寸信息
  },
  {
    id: 'ultrasharp-4x',
    name: '4x-UltraSharp',
    path: '/models/4x-UltraSharp.onnx',
    description: '超锐化模型，适合提升图像细节',
    scaleFactor: 4,
    inputSize: 64
  }
]

const SuperResolution: React.FC = () => {
  // 状态管理
  const [modelReady, setModelReady] = useState<boolean>(false)
  const [loadingProgress, setLoadingProgress] = useState<number>(0)
  const [selectedModel, setSelectedModel] = useState<string>('swinir-real') // 默认选择SwinIR
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [originalImageElement, setOriginalImageElement] = useState<HTMLImageElement | null>(null)
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState<boolean>(false)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [processingStats, setProcessingStats] = useState<ProcessingStats | null>(null)
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null)
  const [showComparison, setShowComparison] = useState<boolean>(false)
  
  // 图片缩放状态
  const [originalScale, setOriginalScale] = useState<number>(1)
  const [originalPosition, setOriginalPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
  const [originalDragging, setOriginalDragging] = useState<boolean>(false)
  const [originalDragStart, setOriginalDragStart] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
  
  const [enhancedScale, setEnhancedScale] = useState<number>(1)
  const [enhancedPosition, setEnhancedPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
  const [enhancedDragging, setEnhancedDragging] = useState<boolean>(false)
  const [enhancedDragStart, setEnhancedDragStart] = useState<{ x: number, y: number }>({ x: 0, y: 0 })

  // refs
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 获取当前选择的模型配置
  const getCurrentModel = useCallback(() => {
    return AVAILABLE_MODELS.find(model => model.id === selectedModel) || AVAILABLE_MODELS[0]
  }, [selectedModel])

  // 初始化模型
  const initializeModel = useCallback(async (modelId?: string): Promise<void> => {
    const targetModel = modelId ? AVAILABLE_MODELS.find(m => m.id === modelId) : getCurrentModel()
    if (!targetModel) {
      throw new Error('未找到指定的模型配置')
    }

    const progressCallback = (progress: number): void => {
      setLoadingProgress(progress)
    }

    try {
      // 先检查模型文件是否存在
      const response = await fetch(targetModel.path, { method: 'HEAD' })
      if (!response.ok) {
        throw new Error(`模型文件不存在: ${targetModel.name}`)
      }
      
      console.log(`🚀 加载模型: ${targetModel.name}`)
      const success = await onnxInference.initialize(targetModel.path, progressCallback, targetModel)
      if (success) {
        setModelReady(true)
        const info = onnxInference.getModelInfo()
        const enhancedInfo: ModelInfo = { 
          ...info, 
          modelName: targetModel.name, 
          modelDescription: targetModel.description,
          scaleFactor: targetModel.scaleFactor,
          inputSize: targetModel.inputSize
        }
        setModelInfo(enhancedInfo)
        console.log('模型初始化成功:', targetModel.name)
      } else {
        throw new Error('ONNX Runtime 初始化失败')
      }
    } catch (err) {
      console.warn('模型初始化失败:', (err as Error).message)
      throw err
    }
  }, [selectedModel, getCurrentModel])

  // 切换模型
  const switchModel = useCallback(async (newModelId: string) => {
    if (newModelId === selectedModel && modelReady) {
      return // 已经是当前模型且已加载
    }

    setModelReady(false)
    setLoadingProgress(0)
    setError(null)
    
    // 释放当前模型资源
    onnxInference.dispose()
    
    setSelectedModel(newModelId)
    
    try {
      await initializeModel(newModelId)
    } catch (err) {
      setError(`模型切换失败: ${(err as Error).message}`)
    }
  }, [selectedModel, modelReady, initializeModel])

  // 组件挂载时初始化
  useEffect(() => {
    // 使用setTimeout避免阻塞组件挂载
    const timer = setTimeout(async () => {
      const currentModel = getCurrentModel()
      console.log(`🚀 尝试加载 ${currentModel.name} AI模型...`)
      
      // 直接尝试加载真实模型，不区分环境
      try {
        await initializeModel()
        console.log(`✅ ${currentModel.name} 模型加载成功！`)
      } catch (err) {
        console.warn('❌ AI模型加载失败，进入演示模式:', (err as Error).message)
        console.log('💡 提示: 请确保模型文件存在于 public/models/ 目录')
        
        // 模拟加载过程给用户提示
        for (let i = 0; i <= 100; i += 20) {
          setLoadingProgress(i)
          await new Promise(resolve => setTimeout(resolve, 200))
        }
        
        // 进入演示模式
        setModelReady(true)
        setModelInfo({
          isInitialized: false,
          executionProviders: ['demo'],
          demoMode: true,
          modelName: currentModel.name + ' (演示模式)',
          modelDescription: '模型文件未找到，使用传统图像处理算法模拟'
        })
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [initializeModel, getCurrentModel])

  // 清理资源
  useEffect(() => {
    return () => {
      if (onnxInference) {
        onnxInference.dispose()
      }
    }
  }, [])

  // 触发文件选择
  const triggerFileSelect = (): void => {
    fileInputRef.current?.click()
  }

  // 处理文件选择
  const handleFileSelect: FileChangeHandler = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      loadImage(file)
    }
  }

  // 处理拖拽
  const handleDrop: DragEventHandler = (event) => {
    event.preventDefault()
    setIsDragOver(false)
    
    const files = event.dataTransfer.files
    if (files.length > 0) {
      loadImage(files[0])
    }
  }

  const handleDragOver: DragEventHandler = (event) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (): void => {
    setIsDragOver(false)
  }

  // 加载图像
  const loadImage = async (file: File): Promise<void> => {
    try {
      // 使用ImageProcessor加载图像
      const imageElement = await ImageProcessor.loadImageFromFile(file)
      setOriginalImageElement(imageElement)
      
      // 创建预览用的DataURL
      const canvas = ImageProcessor.imageToCanvas(imageElement)
      setOriginalImage(canvas.toDataURL('image/jpeg', 0.9))
      
      // 清除之前的结果
      setEnhancedImage(null)
      setProcessingStats(null)
      
      // 评估图像质量
      const quality = ImageProcessor.assessImageQuality(imageElement)
      console.log('图像质量评估:', quality)
      
      // 保存质量信息以便后续使用
      setProcessingStats(prevStats => ({
        ...prevStats,
        imageQuality: quality
      } as ProcessingStats))
      
    } catch (err) {
      setError(`图像加载失败: ${(err as Error).message}`)
    }
  }

  // 增强图像
  const enhanceImage = async (): Promise<void> => {
    if (!originalImageElement) return
    
    setIsProcessing(true)
    setError(null)
    setProcessingStats(null)
    
    const startTime = performance.now()
    
    try {
      let result: string
      
      // 如果模型已初始化，执行真实的推理
      if (onnxInference.isInitialized) {
        result = await onnxInference.runInference(originalImageElement)
      } else {
        // 演示模式 - 使用图像处理技术模拟超分效果
        result = await simulateEnhancement()
      }
      
      setEnhancedImage(result)
      
      const endTime = performance.now()
      const processingTime = endTime - startTime
      
      // 计算增强后的尺寸
      let enhancedSize: string
      let processingStrategy: string
      
      if (modelInfo?.demoMode) {
        enhancedSize = `${originalImageElement.width * 2}x${originalImageElement.height * 2}`
        processingStrategy = '演示模式 - 简单放大'
      } else {
        // AI模式：根据原图比例计算增强尺寸
        const enhancementFactor = 4 // Real-ESRGAN通常是4倍增强
        const enhancedWidth = originalImageElement.width * enhancementFactor
        const enhancedHeight = originalImageElement.height * enhancementFactor
        enhancedSize = `${enhancedWidth}x${enhancedHeight} (4x 智能增强)`
        
        // 根据图像质量确定处理策略
        const quality = ImageProcessor.assessImageQuality(originalImageElement)
        if (quality.isHighQuality) {
          processingStrategy = '高质量混合增强'
        } else if (quality.qualityLevel === 'medium') {
          processingStrategy = '标准AI超分辨率'
        } else {
          processingStrategy = '深度AI去模糊增强'
        }
      }
      
      // 更新处理统计信息
      setProcessingStats({
        processingTime: processingTime.toFixed(2),
        modelInfo: modelInfo,
        originalSize: `${originalImageElement.width}x${originalImageElement.height}`,
        enhancedSize: enhancedSize,
        imageQuality: ImageProcessor.assessImageQuality(originalImageElement),
        processingStrategy: processingStrategy
      })
      
    } catch (err) {
      setError(`图像增强失败: ${(err as Error).message}`)
      console.error('增强失败:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  // 模拟增强效果
  const simulateEnhancement = (): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          if (!originalImageElement) {
            resolve(originalImage || '')
            return
          }

          // 将原图放大2倍作为演示
          const canvas = ImageProcessor.resizeImage(
            originalImageElement, 
            originalImageElement.width * 2, 
            originalImageElement.height * 2,
            true
          )
          
          // 应用一些图像增强效果
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            resolve(originalImage || '')
            return
          }

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data
          
          // 简单的对比度和锐化增强
          for (let i = 0; i < data.length; i += 4) {
            // 增强对比度
            data[i] = Math.min(255, Math.max(0, (data[i] - 128) * 1.2 + 128))     // R
            data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * 1.2 + 128)) // G
            data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * 1.2 + 128)) // B
          }
          
          ctx.putImageData(imageData, 0, 0)
          resolve(canvas.toDataURL('image/png'))
        } catch (err) {
          console.error('演示增强失败:', err)
          resolve(originalImage || '')
        }
      }, 2000)
    })
  }

  // 下载图像
  const downloadImage = (): void => {
    if (!enhancedImage) return
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    const filename = `enhanced-image-${timestamp}.png`
    
    ImageProcessor.downloadImage(enhancedImage, filename)
  }

  // 分享结果
  const shareResult = async (): Promise<void> => {
    if (!enhancedImage) return
    
    try {
      if (navigator.share) {
        // 将DataURL转换为Blob
        const response = await fetch(enhancedImage)
        const blob = await response.blob()
        const file = new File([blob], 'enhanced-image.png', { type: 'image/png' })
        
        await navigator.share({
          title: '图像超分辨率增强结果',
          text: '使用AI技术增强的高清图像',
          files: [file]
        })
      } else {
        // 降级到复制链接
        await navigator.clipboard.writeText(window.location.href)
        alert('链接已复制到剪贴板')
      }
    } catch (err) {
      console.error('分享失败:', err)
      // 降级到下载
      downloadImage()
    }
  }

  // 停止事件传播的点击处理器
  const stopPropagationClick: ClickHandler = (event) => {
    event.stopPropagation()
    triggerFileSelect()
  }

  // 原图缩放处理
  const handleOriginalWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    const newScale = Math.max(0.5, Math.min(5, originalScale + delta))
    setOriginalScale(newScale)
  }, [originalScale])

  const handleOriginalMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      setOriginalDragging(true)
      setOriginalDragStart({
        x: e.clientX - originalPosition.x,
        y: e.clientY - originalPosition.y
      })
      e.preventDefault()
    }
  }, [originalPosition])

  const handleOriginalMouseMove = useCallback((e: React.MouseEvent) => {
    if (originalDragging) {
      e.preventDefault()
      e.stopPropagation()
      setOriginalPosition({
        x: e.clientX - originalDragStart.x,
        y: e.clientY - originalDragStart.y
      })
    }
  }, [originalDragging, originalDragStart])

  const handleOriginalMouseUp = useCallback(() => {
    setOriginalDragging(false)
  }, [])

  // 增强图缩放处理
  const handleEnhancedWheel = useCallback((e: React.WheelEvent) => {
    e.nativeEvent.preventDefault()
    e.preventDefault()
    e.stopPropagation()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    const newScale = Math.max(0.5, Math.min(5, enhancedScale + delta))
    setEnhancedScale(newScale)
  }, [enhancedScale])

  const handleEnhancedMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      setEnhancedDragging(true)
      setEnhancedDragStart({
        x: e.clientX - enhancedPosition.x,
        y: e.clientY - enhancedPosition.y
      })
      e.preventDefault()
    }
  }, [enhancedPosition])

  const handleEnhancedMouseMove = useCallback((e: React.MouseEvent) => {
    if (enhancedDragging) {
      e.preventDefault()
      e.stopPropagation()
      setEnhancedPosition({
        x: e.clientX - enhancedDragStart.x,
        y: e.clientY - enhancedDragStart.y
      })
    }
  }, [enhancedDragging, enhancedDragStart])

  const handleEnhancedMouseUp = useCallback(() => {
    setEnhancedDragging(false)
  }, [])

  // 重置原图视图
  const resetOriginalView = () => {
    setOriginalScale(1)
    setOriginalPosition({ x: 0, y: 0 })
  }

  // 重置增强图视图
  const resetEnhancedView = () => {
    setEnhancedScale(1)
    setEnhancedPosition({ x: 0, y: 0 })
  }

  // 同步缩放
  const syncZoom = (scale: number) => {
    setOriginalScale(scale)
    setEnhancedScale(scale)
  }

  // 重置所有视图
  const resetAllViews = () => {
    resetOriginalView()
    resetEnhancedView()
  }

  return (
    <div className="super-resolution-container">
      <div className="header">
        <h1>图像超分辨率</h1>
        <p>基于多种AI模型的图像增强技术</p>
        
        {/* 模型选择器 */}
        <div className="model-selector">
          <h3>🤖 选择AI模型</h3>
          <div className="model-grid">
            {AVAILABLE_MODELS.map((model) => (
              <div 
                key={model.id}
                className={`model-card ${selectedModel === model.id ? 'selected' : ''} ${!modelReady && selectedModel === model.id ? 'loading' : ''}`}
                onClick={() => switchModel(model.id)}
              >
                <div className="model-header">
                  <h4>{model.name}</h4>
                  {selectedModel === model.id && modelReady && (
                    <span className="model-status active">✅ 已加载</span>
                  )}
                  {selectedModel === model.id && !modelReady && (
                    <span className="model-status loading">⏳ 加载中</span>
                  )}
                </div>
                <p className="model-description">{model.description}</p>
                <div className="model-specs">
                  <span>{model.scaleFactor}x 超分</span>
                  <span>{model.inputSize}x{model.inputSize} 输入</span>
                </div>
              </div>
            ))}
          </div>
          {modelInfo && (
            <div className="current-model-info">
              <span className="current-model-label">当前模型:</span>
              <span className="current-model-name">{modelInfo.modelName || '未知模型'}</span>
              {modelInfo.modelDescription && (
                <span className="current-model-desc">- {modelInfo.modelDescription}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="content">
        {/* 模型加载状态 */}
        {!modelReady && (
          <div className="loading-section">
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>正在加载AI模型...</p>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* 主界面 */}
        {modelReady && (
          <div className="main-interface">
            {/* 模式状态提示 */}
            {modelInfo?.demoMode && (
              <div className="demo-warning-banner">
                <div className="warning-content">
                  ⚠️ <strong>当前运行在演示模式</strong>
                  <span className="warning-detail">
                    只执行简单的2倍放大+对比度增强，不是真正的AI超分辨率
                  </span>
                  <div className="warning-action">
                    💡 查看 <code>REAL_AI_SETUP.md</code> 了解如何启用真正的AI模式
                  </div>
                </div>
              </div>
            )}
            
            {/* 图像上传区域 */}
            <div 
              className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={triggerFileSelect}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              
              {!originalImage ? (
                <div className="upload-placeholder">
                  <div className="upload-icon">📸</div>
                  <h3>选择或拖拽图像</h3>
                  <p>支持JPG、PNG格式</p>
                  <button className="upload-btn">选择图像</button>
                </div>
              ) : (
                <div className="image-preview">
                  <img src={originalImage} alt="Original" className="preview-image" />
                  <button 
                    className="change-image-btn" 
                    onClick={stopPropagationClick}
                  >
                    更换图像
                  </button>
                </div>
              )}
            </div>

                            {/* 处理控制 */}
            {originalImage && (
              <div className="controls">
                <button 
                  className="enhance-btn"
                  disabled={isProcessing}
                  onClick={enhanceImage}
                >
                  {isProcessing ? '处理中...' : '开始增强'}
                </button>
                
                {isProcessing && (
                  <div className="processing-indicator">
                    <div className="processing-spinner"></div>
                    <div className="processing-info">
                      <p>🤖 AI正在增强图像质量...</p>
                      {modelInfo && (
                        <div className="processing-details">
                          <span className="processing-model">
                            模型: {modelInfo.modelName || '未知'}
                          </span>
                          {modelInfo.executionProviders && modelInfo.executionProviders[0] && (
                            <span className={`processing-backend backend-${modelInfo.executionProviders[0]}`}>
                              执行后端: {
                                modelInfo.executionProviders[0] === 'webgpu' ? '🚀 WebGPU (GPU加速)' :
                                modelInfo.executionProviders[0] === 'webgl' ? '⚡ WebGL (GPU加速)' :
                                modelInfo.executionProviders[0] === 'wasm' ? '🔧 WebAssembly (CPU)' :
                                modelInfo.executionProviders[0]
                              }
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 处理统计信息 */}
            {processingStats && (
              <div className="stats-section">
                {/* 图像质量评估 */}
                {processingStats.imageQuality && (
                  <div className="quality-assessment">
                    <h4>📊 图像质量分析</h4>
                    <div className="quality-grid">
                      <div className="quality-item">
                        <span className="quality-label">清晰度评分</span>
                        <span className={`quality-value quality-${processingStats.imageQuality.qualityLevel}`}>
                          {processingStats.imageQuality.sharpnessScore?.toFixed(1)}/100
                        </span>
                      </div>
                      <div className="quality-item">
                        <span className="quality-label">质量等级</span>
                        <span className={`quality-badge quality-${processingStats.imageQuality.qualityLevel}`}>
                          {processingStats.imageQuality.qualityLevel === 'high' ? '🔥 高质量' : 
                           processingStats.imageQuality.qualityLevel === 'medium' ? '⚡ 中等' : '🔧 需要增强'}
                        </span>
                      </div>
                      <div className="quality-item">
                        <span className="quality-label">边缘密度</span>
                        <span className="quality-value">
                          {(processingStats.imageQuality.edgeDensity! * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="quality-item">
                        <span className="quality-label">对比度</span>
                        <span className="quality-value">
                          {processingStats.imageQuality.contrast?.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* 处理信息 */}
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">处理时间</span>
                    <span className="stat-value">{processingStats.processingTime}ms</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">原图尺寸</span>
                    <span className="stat-value">{processingStats.originalSize}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">增强尺寸</span>
                    <span className="stat-value">{processingStats.enhancedSize}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">处理策略</span>
                    <span className="stat-value strategy-value">
                      {processingStats.processingStrategy || '智能选择'}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">当前模式</span>
                    <span className={`stat-value ${processingStats.modelInfo?.demoMode ? 'demo-mode' : 'ai-mode'}`}>
                      {processingStats.modelInfo?.demoMode ? '🎮 演示模式' : '🤖 AI模式'}
                    </span>
                  </div>
                  {!processingStats.modelInfo?.demoMode && (
                    <div className="stat-item">
                      <span className="stat-label">执行后端</span>
                      <span className="stat-value">
                        {processingStats.modelInfo?.executionProviders?.[0] || 'unknown'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 结果展示 */}
            {enhancedImage && (
              <div className="result-section">
                <h3>增强结果</h3>
                
                {/* 对比模式切换 */}
                <div className="comparison-controls">
                  <button 
                    className={`comparison-toggle ${!showComparison ? 'active' : ''}`}
                    onClick={() => setShowComparison(false)}
                  >
                    📱 并排对比
                  </button>
                  <button 
                    className={`comparison-toggle ${showComparison ? 'active' : ''}`}
                    onClick={() => setShowComparison(true)}
                  >
                    🔄 滑动对比
                  </button>
                </div>

                {/* 并排对比模式 */}
                {!showComparison && (
                  <div className="comparison side-by-side">
                    <div className="image-container">
                      <div className="image-header">
                        <h4>原图</h4>
                        <div className="zoom-controls">
                          <span className="zoom-level">{Math.round(originalScale * 100)}%</span>
                          <button className="zoom-btn" onClick={resetOriginalView} title="重置">
                            ↻
                          </button>
                        </div>
                      </div>
                      <div 
                        className="zoomable-image-container"
                        onWheel={handleOriginalWheel}
                        onMouseDown={handleOriginalMouseDown}
                        onMouseMove={handleOriginalMouseMove}
                        onMouseUp={handleOriginalMouseUp}
                        onMouseLeave={handleOriginalMouseUp}
                        style={{ cursor: originalDragging ? 'grabbing' : 'grab' }}
                      >
                        <img 
                          src={originalImage || ''} 
                          alt="Original" 
                          className="result-image zoomable" 
                          style={{
                            transform: `translate(${originalPosition.x}px, ${originalPosition.y}px) scale(${originalScale})`,
                            transformOrigin: 'center center'
                          }}
                          draggable={false}
                        />
                        <div className="zoom-hint">滚轮缩放 • 拖拽移动</div>
                      </div>
                      <div className="image-info">
                        {originalImageElement?.width}×{originalImageElement?.height}
                      </div>
                    </div>
                    <div className="image-container">
                      <div className="image-header">
                        <h4>
                          增强后 
                          <span className="enhancement-badge">
                            {modelInfo?.demoMode ? '2x演示' : '4x AI增强'}
                          </span>
                        </h4>
                        <div className="zoom-controls">
                          <span className="zoom-level">{Math.round(enhancedScale * 100)}%</span>
                          <button className="zoom-btn" onClick={resetEnhancedView} title="重置">
                            ↻
                          </button>
                        </div>
                      </div>
                      <div 
                        className="zoomable-image-container"
                        onWheel={handleEnhancedWheel}
                        onMouseDown={handleEnhancedMouseDown}
                        onMouseMove={handleEnhancedMouseMove}
                        onMouseUp={handleEnhancedMouseUp}
                        onMouseLeave={handleEnhancedMouseUp}
                        style={{ cursor: enhancedDragging ? 'grabbing' : 'grab' }}
                      >
                        <img 
                          src={enhancedImage} 
                          alt="Enhanced" 
                          className="result-image zoomable" 
                          style={{
                            transform: `translate(${enhancedPosition.x}px, ${enhancedPosition.y}px) scale(${enhancedScale})`,
                            transformOrigin: 'center center'
                          }}
                          draggable={false}
                        />
                        <div className="zoom-hint">滚轮缩放 • 拖拽移动</div>
                      </div>
                      <div className="image-info">
                        {processingStats?.enhancedSize}
                      </div>
                    </div>
                  </div>
                )}

                {/* 滑动对比模式 */}
                {showComparison && (
                  <div className="comparison slider-mode">
                    <div className="slider-container">
                      <div className="slider-images">
                        <img src={originalImage || ''} alt="Original" className="slider-image original" />
                        <img src={enhancedImage} alt="Enhanced" className="slider-image enhanced" />
                      </div>
                      <div className="slider-divider"></div>
                    </div>
                    <div className="slider-labels">
                      <span>原图</span>
                      <span>增强后</span>
                    </div>
                  </div>
                )}

                {/* 缩放同步控制 */}
                {!showComparison && (
                  <div className="sync-controls">
                    <div className="sync-buttons">
                      <button className="sync-btn" onClick={() => syncZoom(1)} title="同步到100%">
                        1:1
                      </button>
                      <button className="sync-btn" onClick={() => syncZoom(2)} title="同步到200%">
                        2:1
                      </button>
                      <button className="sync-btn" onClick={() => syncZoom(3)} title="同步到300%">
                        3:1
                      </button>
                      <button className="sync-btn" onClick={resetAllViews} title="重置所有">
                        重置全部
                      </button>
                    </div>
                    <p className="sync-hint">💡 使用滚轮缩放，拖拽移动图片进行细节对比</p>
                  </div>
                )}

                {/* 操作按钮 */}
                <div className="action-buttons">
                  <button className="download-btn" onClick={downloadImage}>
                    📥 下载图像
                  </button>
                  <button className="share-btn" onClick={shareResult}>
                    📤 分享结果
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>关闭</button>
        </div>
      )}
    </div>
  )
}

export default SuperResolution
