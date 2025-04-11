import { NodeIO } from '@gltf-transform/core';
import { KHRDracoMeshCompression } from '@gltf-transform/extensions';
import { draco, dedup, prune, textureCompress } from '@gltf-transform/functions';
import draco3d from 'draco3d';
import * as fs from 'fs';
import sharp from 'sharp';

// Configure I/O.
const io = new NodeIO()
  .registerExtensions([KHRDracoMeshCompression])
  .registerDependencies({
    'draco3d.decoder': await draco3d.createDecoderModule(), 
    'draco3d.encoder': await draco3d.createEncoderModule()
  });

// Read original file.
const document = await io.read('./scripts/0.glb');

// 对模型应用纹理压缩
await document.transform(
  // 去除重复数据
  dedup(),
  
  // 去除未使用的资源
  prune(),
  
  // 使用textureCompress，压缩和转换纹理为WebP
  textureCompress({
    encoder: sharp,         // 使用sharp编码器
    targetFormat: 'webp',   // 转换为WebP格式
    resize: [512, 512],     // 调整大小到512x512
    quality: 80             // 较高质量
  }),
  
  // Draco几何体压缩 - 中等参数
  draco({
    method: 'edgebreaker',
    encodeSpeed: 4,      // 压缩质量更好
    decodeSpeed: 5,      // 中等解码速度
    quantizePosition: 12, // 较高位置量化
    quantizeNormal: 10,   // 较高法线量化
    quantizeTexcoord: 10, // 较高纹理坐标量化
    quantizeColor: 8,     // 中等颜色量化
    quantizeGeneric: 8,   // 中等其他属性量化
    quantizationVolume: 'mesh'
  })
);

// 写入WebP纹理压缩版本
const compressedFile = './scripts/compressed_texture.glb';
await io.write(compressedFile, document);

// 输出文件大小
const originalSize = fs.statSync('./scripts/0.glb').size;
const compressedSize = fs.statSync(compressedFile).size;

console.log('\n压缩结果对比:');
console.log(`原始大小: ${(originalSize / 1024 / 1024).toFixed(2)} MB (${originalSize} 字节)`);
console.log(`纹理压缩版: ${(compressedSize / 1024 / 1024).toFixed(2)} MB (${compressedSize} 字节), 压缩率: ${(100 - (compressedSize / originalSize) * 100).toFixed(2)}%`);
