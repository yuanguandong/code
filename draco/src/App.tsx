import React, { useState } from "react";
import { compressGLB, downloadCompressedGLB } from "./utils/compressGLB";

const GLBCompressor = () => {
  const [fileName, setFileName] = useState<string>("");
  const [compressedData, setCompressedData] = useState<Uint8Array | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // 使用提取出的压缩函数
      const compressedUint8Array = await compressGLB(arrayBuffer);
      setCompressedData(compressedUint8Array);
    } catch (err) {
      console.error("压缩失败", err);
      setError(err instanceof Error ? err.message : "压缩过程中发生未知错误");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedData || !fileName) return;
    downloadCompressedGLB(compressedData, fileName);
  };

  return (
    <div className='p-4 max-w-xl mx-auto'>
      <h2 className='text-xl font-bold mb-4'>GLB 文件压缩器</h2>
      <input
        type='file'
        accept='.glb'
        onChange={handleFileChange}
        className='mb-4'
      />

      {isProcessing && <p>压缩中，请稍候...</p>}

      {error && <p className='text-red-500 mb-4'>错误: {error}</p>}

      {compressedData && (
        <button
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
          onClick={handleDownload}
        >
          下载压缩后的 GLB
        </button>
      )}
    </div>
  );
};

export default GLBCompressor;
