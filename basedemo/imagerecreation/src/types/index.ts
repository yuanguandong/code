// 处理统计信息接口
export interface ProcessingStats {
  processingTime: string
  modelInfo: ModelInfo | null
  originalSize: string
  enhancedSize: string
  imageQuality?: ImageQuality
  processingStrategy?: string
}

// 模型信息接口
export interface ModelInfo {
  isInitialized: boolean
  executionProviders: string[]
  demoMode?: boolean
  inputNames?: string[]
  outputNames?: string[]
  inputShapes?: Record<string, number[]>
  outputShapes?: Record<string, number[]>
  modelName?: string
  modelDescription?: string
  scaleFactor?: number
  inputSize?: number
}

// 图像质量评估结果
export interface ImageQuality {
  width: number
  height: number
  sharpness: number
  megapixels: number
  // 新增的高级质量指标
  gradient?: number
  contrast?: number
  edgeDensity?: number
  sharpnessScore?: number
  qualityLevel?: 'low' | 'medium' | 'high'
  isHighQuality?: boolean
}

// 图像比较结果
export interface ImageComparison {
  averageDifference: number
  maxDifference: number
  similarity: number
  pixelCount: number
}

// ONNX 推理选项
export interface ONNXSessionOptions {
  executionProviders: string[]
  graphOptimizationLevel: 'disabled' | 'basic' | 'extended' | 'all'
  enableCpuMemArena: boolean
  enableMemPattern: boolean
  executionMode: 'sequential' | 'parallel'
}

// 事件处理器类型
export type FileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => void
export type DragEventHandler = (event: React.DragEvent<HTMLDivElement>) => void
export type ClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void
