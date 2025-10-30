import type { ImageQuality, ImageComparison } from '../types/index.ts'

/**
 * 图像处理工具类
 * 提供图像加载、预处理、后处理等功能
 */
export class ImageProcessor {
  /**
   * 从文件加载图像
   */
  static async loadImageFromFile(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('不是有效的图像文件'))
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = () => reject(new Error('图像加载失败'))
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error('文件读取失败'))
      reader.readAsDataURL(file)
    })
  }

  /**
   * 从DataURL加载图像
   */
  static async loadImageFromDataURL(dataUrl: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('图像加载失败'))
      img.src = dataUrl
    })
  }

  /**
   * 调整图像尺寸
   */
  static resizeImage(
    image: HTMLImageElement, 
    targetWidth: number, 
    targetHeight: number, 
    smooth: boolean = true
  ): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    
    canvas.width = targetWidth
    canvas.height = targetHeight
    
    // 设置图像平滑
    ctx.imageSmoothingEnabled = smooth
    ctx.imageSmoothingQuality = 'high'
    
    // 绘制调整后的图像
    ctx.drawImage(image, 0, 0, targetWidth, targetHeight)
    
    return canvas
  }

  /**
   * 保持宽高比的图像缩放
   */
  static resizeImageKeepAspect(
    image: HTMLImageElement, 
    maxWidth: number, 
    maxHeight: number
  ): HTMLCanvasElement {
    const { width, height } = image
    const aspectRatio = width / height
    
    let newWidth: number, newHeight: number
    
    if (aspectRatio > 1) {
      // 宽度大于高度
      newWidth = Math.min(maxWidth, width)
      newHeight = newWidth / aspectRatio
    } else {
      // 高度大于宽度
      newHeight = Math.min(maxHeight, height)
      newWidth = newHeight * aspectRatio
    }
    
    return this.resizeImage(image, newWidth, newHeight)
  }

  /**
   * 图像中心裁剪
   */
  static centerCrop(image: HTMLImageElement, targetSize: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    
    canvas.width = targetSize
    canvas.height = targetSize
    
    const { width, height } = image
    const size = Math.min(width, height)
    const startX = (width - size) / 2
    const startY = (height - size) / 2
    
    ctx.drawImage(
      image,
      startX, startY, size, size,
      0, 0, targetSize, targetSize
    )
    
    return canvas
  }

  /**
   * 图像填充到指定尺寸
   */
  static padImage(
    image: HTMLImageElement, 
    targetWidth: number, 
    targetHeight: number, 
    fillColor: string = 'black'
  ): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    
    canvas.width = targetWidth
    canvas.height = targetHeight
    
    // 填充背景
    ctx.fillStyle = fillColor
    ctx.fillRect(0, 0, targetWidth, targetHeight)
    
    // 计算居中位置
    const { width, height } = image
    const x = (targetWidth - width) / 2
    const y = (targetHeight - height) / 2
    
    ctx.drawImage(image, x, y)
    
    return canvas
  }

  /**
   * 获取图像像素数据
   */
  static getImagePixelData(
    image: HTMLImageElement, 
    targetWidth?: number, 
    targetHeight?: number
  ): ImageData {
    const canvas = targetWidth && targetHeight 
      ? this.resizeImage(image, targetWidth, targetHeight)
      : this.imageToCanvas(image)
    
    const ctx = canvas.getContext('2d')!
    return ctx.getImageData(0, 0, canvas.width, canvas.height)
  }

  /**
   * 将图像转换为Canvas
   */
  static imageToCanvas(image: HTMLImageElement): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    
    canvas.width = image.width || image.naturalWidth
    canvas.height = image.height || image.naturalHeight
    
    ctx.drawImage(image, 0, 0)
    
    return canvas
  }

  /**
   * Canvas转换为Blob
   */
  static async canvasToBlob(
    canvas: HTMLCanvasElement, 
    format: string = 'image/png', 
    quality: number = 0.9
  ): Promise<Blob | null> {
    return new Promise((resolve) => {
      canvas.toBlob(resolve, format, quality)
    })
  }

  /**
   * 下载图像
   */
  static downloadImage(dataUrl: string, filename: string = 'enhanced-image.png'): void {
    const link = document.createElement('a')
    link.download = filename
    link.href = dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  /**
   * 高级图像质量评估
   */
  static assessImageQuality(image: HTMLImageElement): ImageQuality {
    const canvas = this.imageToCanvas(image)
    const ctx = canvas.getContext('2d')!
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    
    let totalVariance = 0
    let totalGradient = 0
    let totalContrast = 0
    let pixelCount = 0
    let edgeCount = 0
    
    const width = canvas.width
    const height = canvas.height
    
    // 改进的质量评估：结合多个指标
    for (let y = 0; y < height - 1; y++) {
      for (let x = 0; x < width - 1; x++) {
        const i = (y * width + x) * 4
        const rightI = (y * width + (x + 1)) * 4
        const downI = ((y + 1) * width + x) * 4
        
        // 当前像素灰度
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
        
        // 右侧像素灰度
        const rightGray = 0.299 * data[rightI] + 0.587 * data[rightI + 1] + 0.114 * data[rightI + 2]
        
        // 下方像素灰度
        const downGray = 0.299 * data[downI] + 0.587 * data[downI + 1] + 0.114 * data[downI + 2]
        
        // 计算梯度（边缘强度）
        const gradientX = Math.abs(gray - rightGray)
        const gradientY = Math.abs(gray - downGray)
        const gradient = Math.sqrt(gradientX * gradientX + gradientY * gradientY)
        
        totalGradient += gradient
        totalVariance += gradientX + gradientY
        
        // 边缘检测
        if (gradient > 20) { // 阈值可以调整
          edgeCount++
        }
        
        // 对比度计算
        const maxVal = Math.max(gray, rightGray, downGray)
        const minVal = Math.min(gray, rightGray, downGray)
        totalContrast += (maxVal - minVal)
        
        pixelCount++
      }
    }
    
    const averageVariance = totalVariance / pixelCount
    const averageGradient = totalGradient / pixelCount
    const averageContrast = totalContrast / pixelCount
    const edgeDensity = edgeCount / pixelCount
    
    // 综合清晰度评分（0-100）
    const sharpnessScore = Math.min(100, (averageGradient * 2 + averageContrast * 0.5 + edgeDensity * 100))
    
    // 质量分类
    let qualityLevel: 'low' | 'medium' | 'high'
    if (sharpnessScore < 15) {
      qualityLevel = 'low' // 模糊图像，适合AI增强
    } else if (sharpnessScore < 35) {
      qualityLevel = 'medium' // 中等质量，可以AI增强
    } else {
      qualityLevel = 'high' // 高质量，AI增强可能降质
    }
    
    return {
      width: canvas.width,
      height: canvas.height,
      sharpness: averageVariance,
      megapixels: (canvas.width * canvas.height) / 1000000,
      // 新增的质量指标
      gradient: averageGradient,
      contrast: averageContrast,
      edgeDensity: edgeDensity,
      sharpnessScore: sharpnessScore,
      qualityLevel: qualityLevel,
      isHighQuality: qualityLevel === 'high'
    }
  }

  /**
   * 图像格式转换
   */
  static convertImageFormat(
    canvas: HTMLCanvasElement, 
    format: string = 'image/png', 
    quality: number = 0.9
  ): string {
    return canvas.toDataURL(format, quality)
  }

  /**
   * 批量处理图像
   */
  static async batchProcess<T>(
    images: HTMLImageElement[], 
    processor: (image: HTMLImageElement, index: number) => Promise<T>
  ): Promise<(T | null)[]> {
    const results: (T | null)[] = []
    
    for (let i = 0; i < images.length; i++) {
      try {
        const result = await processor(images[i], i)
        results.push(result)
      } catch (error) {
        console.error(`批量处理第${i}张图像失败:`, error)
        results.push(null)
      }
    }
    
    return results
  }

  /**
   * 图像比较
   */
  static compareImages(image1: HTMLImageElement, image2: HTMLImageElement): ImageComparison | { error: string } {
    const canvas1 = this.imageToCanvas(image1)
    const canvas2 = this.imageToCanvas(image2)
    
    if (canvas1.width !== canvas2.width || canvas1.height !== canvas2.height) {
      return { error: '图像尺寸不匹配' }
    }
    
    const ctx1 = canvas1.getContext('2d')!
    const ctx2 = canvas2.getContext('2d')!
    
    const data1 = ctx1.getImageData(0, 0, canvas1.width, canvas1.height).data
    const data2 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height).data
    
    let totalDiff = 0
    let maxDiff = 0
    
    for (let i = 0; i < data1.length; i += 4) {
      const rDiff = Math.abs(data1[i] - data2[i])
      const gDiff = Math.abs(data1[i + 1] - data2[i + 1])
      const bDiff = Math.abs(data1[i + 2] - data2[i + 2])
      
      const pixelDiff = (rDiff + gDiff + bDiff) / 3
      totalDiff += pixelDiff
      maxDiff = Math.max(maxDiff, pixelDiff)
    }
    
    const pixelCount = data1.length / 4
    const averageDiff = totalDiff / pixelCount
    
    return {
      averageDifference: averageDiff,
      maxDifference: maxDiff,
      similarity: 1 - (averageDiff / 255),
      pixelCount
    }
  }
}
