import { NodeIO } from "@gltf-transform/core";
import { KHRDracoMeshCompression } from "@gltf-transform/extensions";
import { draco, weld, prune, dedup, textureCompress } from "@gltf-transform/functions";
import { createEncoderModule } from "draco3d";

export interface CompressGLBOptions {
  textureSize?: [number, number];
  textureQuality?: number;
  encodeSpeed?: number;
  decodeSpeed?: number;
  quantizePosition?: number;
  quantizeNormal?: number;
  quantizeTexcoord?: number;
  quantizeColor?: number;
  quantizeGeneric?: number;
}

/**
 * 压缩GLB文件
 * @param arrayBuffer 原始GLB文件的ArrayBuffer
 * @param options 压缩选项
 * @returns 压缩后的Uint8Array
 */
export const compressGLB = async (
  arrayBuffer: ArrayBuffer,
  options: CompressGLBOptions = {}
): Promise<Uint8Array> => {
  // 设置默认选项
  const {
    textureSize = [512, 512],
    textureQuality = 0.8,
    encodeSpeed = 4,
    decodeSpeed = 5,
    quantizePosition = 12,
    quantizeNormal = 10,
    quantizeTexcoord = 10,
    quantizeColor = 8,
    quantizeGeneric = 8,
  } = options;

  const uint8Array = new Uint8Array(arrayBuffer);

  // 加载wasm文件
  const encoderModule = await createEncoderModule({
    wasmBinary: await fetch("https://unpkg.com/draco3d@1.5.7/draco_encoder.wasm").then((res) =>
      res.arrayBuffer()
    ),
  });

  const io = new NodeIO().registerExtensions([KHRDracoMeshCompression]).registerDependencies({
    "draco3d.encoder": encoderModule,
  });

  const doc = await io.readBinary(uint8Array);

  await doc.transform(
    // 去除重复数据
    dedup(),
    // 移除未使用内容
    prune(),
    // 合并相似顶点
    weld(),
    // 使用textureCompress，压缩和转换纹理为WebP
    textureCompress({
      targetFormat: "webp", // 转换为WebP格式
      resize: textureSize, // 调整纹理大小
      quality: textureQuality, // 设置纹理质量
    }),
    // Draco 压缩
    draco({
      method: "edgebreaker",
      encodeSpeed,
      decodeSpeed,
      quantizePosition,
      quantizeNormal,
      quantizeTexcoord,
      quantizeColor,
      quantizeGeneric,
      quantizationVolume: "mesh",
    })
  );

  return await io.writeBinary(doc);
};

/**
 * 创建并下载压缩后的GLB文件
 * @param compressedData 压缩后的数据
 * @param fileName 下载的文件名
 */
export const downloadCompressedGLB = (compressedData: Uint8Array, fileName: string): void => {
  const blob = new Blob([compressedData.buffer], { type: "model/gltf-binary" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `compressed-${fileName || "model.glb"}`;
  a.click();
  URL.revokeObjectURL(url);
}; 