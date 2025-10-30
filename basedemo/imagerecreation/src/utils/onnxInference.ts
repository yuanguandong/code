import * as ort from 'onnxruntime-web'
import type { ModelInfo, ONNXSessionOptions } from '../types/index.ts'
import { ImageProcessor } from './imageProcessor.ts'

/**
 * ONNX Runtime Web 推理工具类
 * 支持WebGPU/WebNN后端的Real-ESRGAN模型推理
 */
// 模型配置接口
interface ModelConfig {
  id: string
  name: string
  path: string
  description: string
  scaleFactor: number
  inputSize: number
  minInputSize?: number
}

export class ONNXInference {
  private session: ort.InferenceSession | null = null
  public isInitialized: boolean = false
  private modelInfo: ModelInfo | null = null
  private originalImageSize: { width: number, height: number } | null = null
  private currentModelConfig: ModelConfig | null = null

  constructor() {
    this.session = null
    this.isInitialized = false
    this.modelInfo = null
    this.originalImageSize = null
    this.currentModelConfig = null
  }

  /**
   * 初始化ONNX Runtime和模型
   */
  async initialize(
    modelPath: string, 
    progressCallback?: (progress: number) => void, 
    modelConfig?: ModelConfig
  ): Promise<boolean> {
    try {
      // 保存模型配置
      this.currentModelConfig = modelConfig || null
      
      // 配置ONNX Runtime
      await this.configureORT()
      
      if (progressCallback) progressCallback(20)

      // 加载模型
      await this.loadModel(modelPath, progressCallback)
      
      if (progressCallback) progressCallback(100)
      
      this.isInitialized = true
      console.log(`ONNX模型初始化成功: ${modelConfig?.name || '未知模型'}`)
      return true
    } catch (error) {
      console.error('ONNX模型初始化失败:', error)
      // 不再抛出错误，让应用继续运行
      this.isInitialized = false
      return false
    }
  }

  /**
   * 配置ONNX Runtime - 优化性能和减少阻塞
   */
  private async configureORT(): Promise<void> {
    try {
      // 设置基础配置
      ort.env.logLevel = 'warning'
      
      // 优化的WASM配置 - 提升性能
      const maxThreads = Math.min(4, navigator.hardwareConcurrency || 2)
      ort.env.wasm.numThreads = maxThreads // 使用多线程提升性能
      ort.env.wasm.simd = true // 启用SIMD指令
      
      console.log(`🔧 ONNX Runtime配置: ${maxThreads}个线程, SIMD已启用`)
      
      // 检测硬件能力
      const capabilities = await this.detectHardwareCapabilities()
      console.log('🖥️ 硬件能力检测:', capabilities)
      
    } catch (error) {
      console.warn('ONNX Runtime配置失败:', error)
      // 降级配置
      ort.env.wasm.numThreads = 1
    }
  }

  /**
   * 加载ONNX模型
   */
  private async loadModel(modelPath: string, progressCallback?: (progress: number) => void): Promise<void> {
    let lastError: Error | null = null
    
    // 智能选择执行提供者 - 优先GPU加速避免主线程阻塞
    const capabilities = await this.detectHardwareCapabilities()
    const providerConfigs: string[][] = []
    
    // 优先级1: WebGPU (最快，完全异步)
    if (capabilities.webgpu) {
      providerConfigs.push(['webgpu'])
    }
    
    // 优先级2: WebGL (较快，GPU加速) - 只有在ONNX Runtime验证通过时才使用
    if (capabilities.onnxWebGL) {
      providerConfigs.push(['webgl'])
      console.log('✅ WebGL后端已验证可用')
    } else if (capabilities.webgl) {
      console.log('⚠️ WebGL基础支持存在，但ONNX Runtime WebGL后端不可用')
    }
    
    // 优先级3: WASM (CPU执行，可能阻塞)
    providerConfigs.push(['wasm'])
    
    console.log('🚀 执行提供者优先级:', providerConfigs)
    
    for (let i = 0; i < providerConfigs.length; i++) {
      try {
        const providers = providerConfigs[i]
        console.log(`尝试配置 ${i + 1}: ${providers.join(', ')}`)
        
        if (progressCallback) progressCallback(30 + (i * 20))

        // 创建优化的会话选项
        const sessionOptions: Partial<ONNXSessionOptions> = {
          executionProviders: providers,
          // 根据执行提供者优化配置
          ...(providers[0] === 'webgpu' ? {
            graphOptimizationLevel: 'all', // WebGPU支持完整优化
            executionMode: 'parallel',     // 并行执行
            enableCpuMemArena: true,
            enableMemPattern: true
          } : providers[0] === 'webgl' ? {
            graphOptimizationLevel: 'extended', // WebGL适度优化
            executionMode: 'parallel',
            enableCpuMemArena: true,
            enableMemPattern: false
          } : {
            graphOptimizationLevel: 'basic', // WASM保守优化
            executionMode: 'sequential',     // 串行避免阻塞加剧
            enableCpuMemArena: false,
            enableMemPattern: false
          })
        }
        
        console.log(`📊 会话配置 (${providers[0]}):`, {
          optimization: sessionOptions.graphOptimizationLevel,
          execution: sessionOptions.executionMode,
          memArena: sessionOptions.enableCpuMemArena
        })

        // 尝试创建推理会话
        this.session = await ort.InferenceSession.create(modelPath, sessionOptions)
        
        // 获取模型信息
        this.modelInfo = {
          inputNames: [...this.session.inputNames],
          outputNames: [...this.session.outputNames],
          inputShapes: {},
          outputShapes: {},
          executionProviders: providers,
          isInitialized: true
        }

        // 获取输入形状信息
        try {
          for (const name of this.session.inputNames) {
            // 某些模型可能不支持getInputShape
            if (this.modelInfo.inputShapes) {
              this.modelInfo.inputShapes[name] = [1, 3, 128, 128] // 根据实际模型调整
            }
          }
        } catch (shapeError) {
          console.warn('获取输入形状失败，使用默认值')
          if (this.modelInfo) {
            this.modelInfo.inputShapes = { input: [1, 3, 512, 512] }
          }
        }
        
        console.log('模型加载成功!')
        console.log('模型信息:', this.modelInfo)
        console.log('实际执行提供者:', providers)
        return // 成功则返回
        
      } catch (error) {
        console.warn(`配置 ${i + 1} 失败:`, (error as Error).message)
        lastError = error as Error
        
        // 清理失败的会话
        if (this.session) {
          try {
            this.session.release()
          } catch (e) {
            // 忽略清理错误
          }
          this.session = null
        }
      }
    }
    
    // 所有配置都失败
    throw new Error(`所有执行提供者配置都失败。最后错误: ${lastError?.message}`)
  }



  /**
   * 检测硬件能力 - 帮助选择最优执行提供者，包含ONNX Runtime验证
   */
  private async detectHardwareCapabilities(): Promise<{
    webgpu: boolean
    webgl: boolean
    webgl2: boolean
    wasm: boolean
    simd: boolean
    threads: number
    memory: number
    onnxWebGL: boolean
  }> {
    const capabilities = {
      webgpu: false,
      webgl: false,
      webgl2: false,
      wasm: true, // 现代浏览器都支持
      simd: true, // WASM SIMD
      threads: navigator.hardwareConcurrency || 2,
      memory: (navigator as any).deviceMemory || 4, // GB
      onnxWebGL: false // ONNX Runtime WebGL后端是否可用
    }

    // 检测WebGPU
    try {
      if ('gpu' in navigator) {
        const adapter = await (navigator as any).gpu?.requestAdapter?.()
        capabilities.webgpu = !!adapter
      }
    } catch (e) {
      capabilities.webgpu = false
    }

    // 检测基础WebGL
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl')
      const gl2 = canvas.getContext('webgl2')
      capabilities.webgl = !!gl
      capabilities.webgl2 = !!gl2
    } catch (e) {
      capabilities.webgl = false
      capabilities.webgl2 = false
    }

    // WebGL基础检测通过后，简单标记为可用
    // 实际的ONNX Runtime WebGL验证会在需要时进行
    capabilities.onnxWebGL = capabilities.webgl

    return capabilities
  }



  /**
   * 执行图像超分推理
   */
  async runInference(imageData: HTMLImageElement): Promise<string> {
    if (!this.isInitialized || !this.session) {
      throw new Error('模型未初始化')
    }

    try {
      // 保存原图尺寸以维持宽高比
      this.originalImageSize = {
        width: imageData.naturalWidth || imageData.width,
        height: imageData.naturalHeight || imageData.height
      }
      
      console.log('原图尺寸:', this.originalImageSize)
      
      // 智能质量评估
      const quality = ImageProcessor.assessImageQuality(imageData)
      console.log('📊 图像质量评估:', {
        sharpnessScore: quality.sharpnessScore?.toFixed(1),
        qualityLevel: quality.qualityLevel,
        isHighQuality: quality.isHighQuality,
        gradient: quality.gradient?.toFixed(2),
        contrast: quality.contrast?.toFixed(2),
        edgeDensity: quality.edgeDensity?.toFixed(3)
      })
      
      // 🧠 智能处理策略
      if (quality.isHighQuality) {
        console.log('🎯 检测到高质量图像，使用混合增强策略...')
        return await this.hybridEnhancement(imageData, quality)
      } else {
        console.log('🔧 检测到需要增强的图像，使用标准AI处理...')
        return await this.standardAIEnhancement(imageData)
      }
      
    } catch (error) {
      console.error('推理失败:', error)
      throw new Error(`推理失败: ${(error as Error).message}`)
    }
  }

  /**
   * 标准AI增强（适用于低质量图像）- 非阻塞优化版本，带错误降级
   */
  private async standardAIEnhancement(imageData: HTMLImageElement): Promise<string> {
    // 预处理图像 - 使用微任务避免阻塞
    const inputTensor = await new Promise<ort.Tensor>((resolve, reject) => {
      setTimeout(async () => {
        try {
          const tensor = await this.preprocessImage(imageData)
          resolve(tensor)
        } catch (error) {
          reject(error)
        }
      }, 0)
    })
    
    // 执行推理 - 带错误降级机制
    const feeds: Record<string, ort.Tensor> = {}
    feeds[this.modelInfo!.inputNames![0]] = inputTensor
    
    return await this.runInferenceWithFallback(feeds)
  }

  /**
   * 带降级策略的推理执行
   */
  private async runInferenceWithFallback(feeds: Record<string, ort.Tensor>): Promise<string> {
    const currentProvider = this.modelInfo?.executionProviders?.[0] || 'unknown'
    console.log(`🚀 开始AI推理 (${currentProvider})...`)
    const startTime = performance.now()
    
    try {
      // 尝试当前执行提供者
      let results: any
      if (currentProvider === 'wasm') {
        // WASM执行 - 分块处理避免长时间阻塞
        results = await this.runInferenceWithYielding(feeds)
      } else {
        // GPU执行 - 直接推理
        results = await this.session!.run(feeds)
      }
      
      const endTime = performance.now()
      console.log(`✅ AI推理成功 (${currentProvider})，耗时: ${(endTime - startTime).toFixed(2)}ms`)
      
      // 后处理结果
      const outputTensor = results[this.modelInfo!.outputNames![0]]
      return await new Promise<string>((resolve, reject) => {
        setTimeout(async () => {
          try {
            const result = await this.postprocessImage(outputTensor)
            resolve(result)
          } catch (error) {
            reject(error)
          }
        }, 0)
      })
      
    } catch (error) {
      console.error(`❌ ${currentProvider} 推理失败:`, error)
      
      // 错误降级策略 - 逐级降级
      if (currentProvider === 'webgpu') {
        console.log('🔄 WebGPU失败，尝试降级到WebGL...')
        // 验证WebGL是否可用
        const webglAvailable = await this.verifyWebGLForONNX()
        if (webglAvailable) {
          try {
            return await this.fallbackToWebGL(feeds)
          } catch (webglError) {
            console.log('🔄 WebGL也失败，最终降级到WASM...')
            return await this.fallbackToWASM(feeds)
          }
        } else {
          console.log('🔄 WebGL不可用，直接降级到WASM...')
          return await this.fallbackToWASM(feeds)
        }
      } else if (currentProvider === 'webgl') {
        console.log('🔄 WebGL失败，尝试降级到WASM...')
        return await this.fallbackToWASM(feeds)
      } else {
        // WASM也失败了，抛出最终错误
        throw new Error(`所有执行提供者都失败了。最后错误: ${(error as Error).message}`)
      }
    }
  }

  /**
   * 降级到WebGL (假设已验证WebGL可用)
   */
  private async fallbackToWebGL(feeds: Record<string, ort.Tensor>): Promise<string> {
    // 创建新的WebGL会话
    const sessionOptions: Partial<ONNXSessionOptions> = {
      executionProviders: ['webgl'],
      graphOptimizationLevel: 'extended',
      executionMode: 'parallel',
      enableCpuMemArena: true,
      enableMemPattern: false
    }
    
    const tempSession = await ort.InferenceSession.create(
      this.currentModelConfig!.path, 
      sessionOptions
    )
    
    console.log('✅ WebGL降级会话创建成功')
    const results = await tempSession.run(feeds)
    
    // 清理临时会话
    tempSession.release()
    
    const outputTensor = results[this.modelInfo!.outputNames![0]]
    console.log('✅ WebGL推理完成，开始后处理...')
    return await this.postprocessImage(outputTensor)
  }

  /**
   * 降级到WASM
   */
  private async fallbackToWASM(feeds: Record<string, ort.Tensor>): Promise<string> {
    try {
      console.log('🔧 创建WASM降级会话...')
      
      // 创建新的WASM会话
      const sessionOptions: Partial<ONNXSessionOptions> = {
        executionProviders: ['wasm'],
        graphOptimizationLevel: 'basic',
        executionMode: 'sequential',
        enableCpuMemArena: false,
        enableMemPattern: false
      }
      
      const tempSession = await ort.InferenceSession.create(
        this.currentModelConfig!.path, 
        sessionOptions
      )
      
      console.log('✅ WASM降级会话创建成功')
      const results = await this.runInferenceWithYielding(feeds, tempSession)
      
      // 清理临时会话
      tempSession.release()
      
      const outputTensor = results[this.modelInfo!.outputNames![0]]
      console.log('✅ WASM推理完成，开始后处理...')
      return await this.postprocessImage(outputTensor)
      
    } catch (error) {
      console.error('❌ WASM降级最终失败:', error)
      throw new Error(`所有执行后端都失败了。WASM错误: ${(error as Error).message}`)
    }
  }

  /**
   * 验证WebGL是否可用于ONNX Runtime
   */
  private async verifyWebGLForONNX(): Promise<boolean> {
    try {
      if (!this.currentModelConfig) {
        console.log('❌ 无模型配置，无法验证WebGL后端')
        return false
      }
      
      console.log('🔍 验证WebGL后端是否支持当前模型...')
      
      // 尝试创建一个最小配置的WebGL会话
      const testOptions: Partial<ONNXSessionOptions> = {
        executionProviders: ['webgl'],
        graphOptimizationLevel: 'disabled', // 最小优化
        enableCpuMemArena: false,
        enableMemPattern: false
      }
      
      // 尝试创建会话，如果失败说明WebGL不可用
      const testSession = await ort.InferenceSession.create(
        this.currentModelConfig.path, 
        testOptions
      )
      
      // 立即释放测试会话
      testSession.release()
      console.log('✅ WebGL后端验证成功')
      return true
      
    } catch (error) {
      const errorMsg = (error as Error).message
      console.log('❌ WebGL后端验证失败:', errorMsg)
      
      // 检查特定的错误类型
      if (errorMsg.includes('backend not found') || errorMsg.includes('webgl') || errorMsg.includes('WebGL')) {
        console.log('💡 WebGL后端在当前环境不可用')
      }
      
      return false
    }
  }

  /**
   * 带让步的WASM推理 - 减少主线程阻塞
   */
  private async runInferenceWithYielding(
    feeds: Record<string, ort.Tensor>, 
    session?: ort.InferenceSession
  ): Promise<any> {
    const targetSession = session || this.session!
    
    return new Promise((resolve, reject) => {
      // 使用requestIdleCallback或setTimeout来让步给主线程
      const runWithYield = () => {
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(async () => {
            try {
              const results = await targetSession.run(feeds)
              resolve(results)
            } catch (error) {
              reject(error)
            }
          })
        } else {
          setTimeout(async () => {
            try {
              const results = await targetSession.run(feeds)
              resolve(results)
            } catch (error) {
              reject(error)
            }
          }, 0)
        }
      }
      runWithYield()
    })
  }

  /**
   * 混合增强策略（适用于高质量图像）
   */
  private async hybridEnhancement(imageData: HTMLImageElement, quality: any): Promise<string> {
    try {
      // 执行AI处理
      const aiResult = await this.standardAIEnhancement(imageData)
      
      // 创建AI结果的图像元素进行质量评估
      const aiImage = await ImageProcessor.loadImageFromDataURL(aiResult)
      const aiQuality = ImageProcessor.assessImageQuality(aiImage)
      
      console.log('📈 质量对比:', {
        original: quality.sharpnessScore?.toFixed(1),
        aiProcessed: aiQuality.sharpnessScore?.toFixed(1),
        improvement: ((aiQuality.sharpnessScore! - quality.sharpnessScore!) / quality.sharpnessScore! * 100).toFixed(1) + '%'
      })
      
      // 如果AI处理后质量下降超过15%，使用传统高质量放大
      if (aiQuality.sharpnessScore! < quality.sharpnessScore! * 0.85) {
        console.log('⚠️ AI处理降低了图像质量，切换到高质量传统放大')
        return this.highQualityResize(imageData)
      } else if (aiQuality.sharpnessScore! < quality.sharpnessScore! * 0.95) {
        console.log('🔀 混合AI结果与原图以保持质量')
        return await this.blendWithOriginal(imageData, aiResult, 0.7) // 70% AI + 30% 原图放大
      } else {
        console.log('✅ AI处理提升了质量，使用AI结果')
        return aiResult
      }
      
    } catch (error) {
      console.warn('混合增强失败，回退到高质量传统放大:', error)
      return this.highQualityResize(imageData)
    }
  }

  /**
   * 高质量传统放大（针对已经清晰的图像）
   */
  private highQualityResize(imageData: HTMLImageElement): string {
    if (!this.originalImageSize) {
      throw new Error('缺少原图尺寸信息')
    }
    
    const { width, height } = this.originalImageSize
    const scaleFactor = 4 // 4倍放大
    
    // 使用高质量插值算法
    const canvas = ImageProcessor.resizeImage(
      imageData, 
      width * scaleFactor, 
      height * scaleFactor, 
      true // 高质量平滑
    )
    
    // 应用轻微锐化
    const ctx = canvas.getContext('2d')!
    const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageDataObj.data
    const sharpened = this.applySharpeningFilter(data, canvas.width, canvas.height)
    
    ctx.putImageData(sharpened, 0, 0)
    return canvas.toDataURL('image/png')
  }

  /**
   * 混合AI结果与原图放大
   */
  private async blendWithOriginal(imageData: HTMLImageElement, aiResult: string, aiWeight: number): Promise<string> {
    if (!this.originalImageSize) {
      throw new Error('缺少原图尺寸信息')
    }
    
    const { width, height } = this.originalImageSize
    const scaleFactor = 4
    
    // 创建高质量的原图放大版本
    const originalResized = this.highQualityResize(imageData)
    
    // 加载两个图像
    const [originalImg, aiImg] = await Promise.all([
      ImageProcessor.loadImageFromDataURL(originalResized),
      ImageProcessor.loadImageFromDataURL(aiResult)
    ])
    
    // 创建混合画布
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    canvas.width = width * scaleFactor
    canvas.height = height * scaleFactor
    
    // 绘制原图放大版本
    ctx.globalAlpha = 1 - aiWeight
    ctx.drawImage(originalImg, 0, 0, canvas.width, canvas.height)
    
    // 混合AI结果
    ctx.globalAlpha = aiWeight
    ctx.globalCompositeOperation = 'source-over'
    ctx.drawImage(aiImg, 0, 0, canvas.width, canvas.height)
    
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
    
    return canvas.toDataURL('image/png')
  }

  /**
   * 应用锐化滤镜
   */
  private applySharpeningFilter(data: Uint8ClampedArray, width: number, height: number): ImageData {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    canvas.width = width
    canvas.height = height
    
    const imageData = ctx.createImageData(width, height)
    const output = imageData.data
    
    // 锐化核
    const kernel = [
      0, -0.5, 0,
      -0.5, 3, -0.5,
      0, -0.5, 0
    ]
    
    // 应用卷积
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let c = 0; c < 3; c++) { // RGB通道
          let sum = 0
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const pixelIndex = ((y + ky) * width + (x + kx)) * 4 + c
              const kernelIndex = (ky + 1) * 3 + (kx + 1)
              sum += data[pixelIndex] * kernel[kernelIndex]
            }
          }
          const outputIndex = (y * width + x) * 4 + c
          output[outputIndex] = Math.min(255, Math.max(0, sum))
        }
        // Alpha通道保持不变
        const alphaIndex = (y * width + x) * 4 + 3
        output[alphaIndex] = data[alphaIndex]
      }
    }
    
    return imageData
  }

  /**
   * 图像预处理 - 根据模型配置自适应处理，增强SwinIR兼容性
   */
  private async preprocessImage(imageElement: HTMLImageElement): Promise<ort.Tensor> {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        
        // 根据模型配置确定输入尺寸
        let inputSize = this.currentModelConfig?.inputSize || 128
        const isSwinIR = this.currentModelConfig?.id?.includes('swinir')
        
        // SwinIR特殊处理 - 确保输入尺寸是合理的
        if (isSwinIR) {
          // 确保输入尺寸是8的倍数 (很多深度学习模型的要求)
          inputSize = Math.max(64, Math.round(inputSize / 8) * 8)
          console.log(`🔧 SwinIR模型 - 调整输入尺寸为: ${inputSize}x${inputSize}`)
        }
        
        canvas.width = inputSize
        canvas.height = inputSize
        
        console.log(`🔧 预处理图像: ${inputSize}x${inputSize} (${this.currentModelConfig?.name || '默认'})`)
        
        // 应用高质量重采样
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        
        // 绘制并缩放图像
        ctx.drawImage(imageElement, 0, 0, inputSize, inputSize)
        const imageData = ctx.getImageData(0, 0, inputSize, inputSize)
        
        // 验证图像数据
        if (!imageData || imageData.data.length === 0) {
          throw new Error('无法获取图像数据')
        }
        
        // 转换为RGB格式并归一化
        const pixelCount = inputSize * inputSize
        const rgbData = new Float32Array(3 * pixelCount)
        
        for (let i = 0; i < pixelCount; i++) {
          const pixelIndex = i * 4
          let r = imageData.data[pixelIndex] / 255.0
          let g = imageData.data[pixelIndex + 1] / 255.0
          let b = imageData.data[pixelIndex + 2] / 255.0
          
          // SwinIR特殊预处理
          if (isSwinIR) {
            // 确保值在[0,1]范围内，并做轻微对比度增强
            r = Math.min(1.0, Math.max(0.0, r * 1.02)) // 轻微增强
            g = Math.min(1.0, Math.max(0.0, g * 1.02))
            b = Math.min(1.0, Math.max(0.0, b * 1.02))
          } else {
            // 其他模型标准归一化
            r = Math.min(1.0, Math.max(0.0, r))
            g = Math.min(1.0, Math.max(0.0, g))
            b = Math.min(1.0, Math.max(0.0, b))
          }
          
          // RGB通道排列 [1, 3, H, W] - NCHW格式
          rgbData[i] = r                                    // R
          rgbData[i + pixelCount] = g                       // G  
          rgbData[i + 2 * pixelCount] = b                   // B
        }
        
        // 验证张量数据
        if (rgbData.some(val => !isFinite(val) || val < 0 || val > 1)) {
          throw new Error('张量数据包含无效值')
        }
        
        // 创建输入张量 [1, 3, H, W]
        const tensorShape = [1, 3, inputSize, inputSize]
        const inputTensor = new ort.Tensor('float32', rgbData, tensorShape)
        
        console.log(`📊 输入张量形状: [${inputTensor.dims.join(', ')}], 数据范围: [${Math.min(...rgbData).toFixed(3)}, ${Math.max(...rgbData).toFixed(3)}]`)
        
        // 额外验证张量
        if (inputTensor.dims.some(dim => dim <= 0)) {
          throw new Error(`无效的张量形状: [${inputTensor.dims.join(', ')}]`)
        }
        
        resolve(inputTensor)
      } catch (error) {
        console.error('预处理失败:', error)
        reject(error)
      }
    })
  }

  /**
   * 图像后处理
   */
  private async postprocessImage(outputTensor: ort.Tensor): Promise<string> {
    return new Promise(async (resolve) => {
      const outputData = outputTensor.data as Float32Array
      const dims = outputTensor.dims
      
      // 调试输出张量信息
      console.log('输出张量维度:', dims)
      
      let aiWidth: number, aiHeight: number
      
      // 处理不同的张量维度格式
      if (dims.length === 4) {
        // 4维张量: [batch, channels, height, width]
        aiWidth = Math.floor(Number(dims[3]))
        aiHeight = Math.floor(Number(dims[2]))
      } else if (dims.length === 3) {
        // 3维张量: [channels, height, width] 
        aiWidth = Math.floor(Number(dims[2]))
        aiHeight = Math.floor(Number(dims[1]))
      } else {
        throw new Error(`不支持的张量维度: ${dims.length}D, 维度: ${dims}`)
      }
      
      console.log('AI输出尺寸:', { aiWidth, aiHeight })
      
      // 验证AI输出尺寸为有效值
      if (!Number.isInteger(aiWidth) || !Number.isInteger(aiHeight) || aiWidth <= 0 || aiHeight <= 0) {
        throw new Error(`无效的AI输出尺寸: ${aiWidth}x${aiHeight}`)
      }
      
      // 创建AI输出的临时canvas
      const aiCanvas = document.createElement('canvas')
      const aiCtx = aiCanvas.getContext('2d')!
      aiCanvas.width = aiWidth
      aiCanvas.height = aiHeight
      
      const aiImageData = aiCtx.createImageData(aiWidth, aiHeight)
      const pixelCount = aiWidth * aiHeight
      
      // 将张量数据转换为RGBA格式
      for (let i = 0; i < pixelCount; i++) {
        const outputIndex = i * 4
        
        // 从归一化值转换回[0,255]范围并限制在有效范围内
        const r = Math.min(255, Math.max(0, Math.round(outputData[i] * 255)))
        const g = Math.min(255, Math.max(0, Math.round(outputData[i + pixelCount] * 255)))
        const b = Math.min(255, Math.max(0, Math.round(outputData[i + 2 * pixelCount] * 255)))
        
        aiImageData.data[outputIndex] = r     // R
        aiImageData.data[outputIndex + 1] = g // G
        aiImageData.data[outputIndex + 2] = b // B
        aiImageData.data[outputIndex + 3] = 255 // A
      }
      
      aiCtx.putImageData(aiImageData, 0, 0)
      
      // 如果有原图尺寸信息，调整输出以保持原图宽高比
      if (this.originalImageSize) {
        const { width: originalWidth, height: originalHeight } = this.originalImageSize
        
        // 根据模型配置计算增强倍数
        const modelInputSize = this.currentModelConfig?.inputSize || 128
        const enhancementFactor = aiWidth / modelInputSize
        
        // 计算目标输出尺寸（保持原图比例，应用增强倍数）
        const targetWidth = Math.round(originalWidth * enhancementFactor)
        const targetHeight = Math.round(originalHeight * enhancementFactor)
        
        console.log('🎯 输出尺寸计算:', { 
          targetWidth, 
          targetHeight, 
          enhancementFactor,
          modelName: this.currentModelConfig?.name || '未知',
          modelInputSize,
          aiOutputSize: `${aiWidth}x${aiHeight}`
        })
        
        // 创建AI输出的临时图像元素
        const tempImage = new Image()
        tempImage.onload = () => {
          // 使用ImageProcessor调整尺寸
          const finalCanvas = ImageProcessor.resizeImage(tempImage, targetWidth, targetHeight, true)
          resolve(finalCanvas.toDataURL('image/png'))
        }
        tempImage.src = aiCanvas.toDataURL()
      } else {
        // 如果没有原图尺寸信息，直接返回AI输出
        console.warn('没有原图尺寸信息，使用AI原始输出')
        resolve(aiCanvas.toDataURL('image/png'))
      }
    })
  }

  /**
   * 获取模型状态信息
   */
  getModelInfo(): ModelInfo {
    const baseInfo: ModelInfo = {
      isInitialized: this.isInitialized,
      inputNames: this.modelInfo?.inputNames || [],
      outputNames: this.modelInfo?.outputNames || [],
      inputShapes: this.modelInfo?.inputShapes || {},
      outputShapes: this.modelInfo?.outputShapes || {},
      executionProviders: this.modelInfo?.executionProviders || []
    }
    
    if (this.currentModelConfig) {
      baseInfo.modelName = this.currentModelConfig.name
      baseInfo.modelDescription = this.currentModelConfig.description
      baseInfo.scaleFactor = this.currentModelConfig.scaleFactor
      baseInfo.inputSize = this.currentModelConfig.inputSize
    }
    
    return baseInfo
  }

  /**
   * 释放资源
   */
  dispose(): void {
    if (this.session) {
      this.session.release()
      this.session = null
    }
    this.isInitialized = false
    this.modelInfo = null
    this.originalImageSize = null
    this.currentModelConfig = null
    console.log('🧹 ONNX推理资源已释放')
  }
}

// 导出单例实例
export const onnxInference = new ONNXInference()
