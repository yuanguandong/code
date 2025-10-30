import React, { useState } from 'react';
import Pica from 'pica';

const ImageCompressor: React.FC = () => {
  const [compressedImageUrl, setCompressedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    try {
      const pica = new Pica();

      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 调整图像大小到 512px 宽度
        const width = 512;
        const height = (image.height / image.width) * width;
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(image, 0, 0, width, height);

        // 使用 Pica 将图像压缩为 WebP
        const compressedBlob = await pica.toBlob(canvas, 'image/webp', { quality: 0.8 });
        const compressedImageUrl = URL.createObjectURL(compressedBlob);
        setCompressedImageUrl(compressedImageUrl);
        setIsProcessing(false);
      };
    } catch (error) {
      console.error('压缩失败:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">图片压缩器</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />
      {isProcessing && <p>压缩中，请稍候...</p>}
      {compressedImageUrl && (
        <div>
          <h3 className="mt-4">压缩后的图片：</h3>
          <img src={compressedImageUrl} alt="Compressed" style={{ width: '100%' }} />
        </div>
      )}
    </div>
  );
};

export default ImageCompressor;