import { useState } from "react";
import "./App.css";
import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as draco3d from "draco3d";

function App() {
  const [status, setStatus] = useState("");
  const [encodingMethod, setEncodingMethod] = useState<"edgebreaker" | "sequential">("sequential");

  // 更新状态显示
  const updateStatus = (message: string) => {
    setStatus(message);
    console.log("状态更新:", message);
  };

  // 递归查找第一个 Mesh 对象
  const findFirstMesh = (object: THREE.Object3D): THREE.Mesh | null => {
    console.log("检查对象:", object.type, object.name);

    if (object instanceof THREE.Mesh) {
      console.log("找到Mesh:", object.name);
      return object;
    }

    for (const child of object.children) {
      const mesh = findFirstMesh(child);
      if (mesh) {
        return mesh;
      }
    }

    return null;
  };

  // 处理文件上传和压缩
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    updateStatus("正在处理文件...");
    console.log("开始处理文件:", file.name);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        try {
          // 创建GLB加载器
          const loader = new GLTFLoader();

          // 加载GLB文件
          const gltf = (await new Promise((resolve, reject) => {
            loader.parse(arrayBuffer, "", resolve, reject);
          })) as GLTF;

          updateStatus("正在提取网格数据...");
          console.log("GLTF加载完成:", gltf);
          console.log("场景结构:", gltf.scene);

          // 递归查找第一个 Mesh 对象
          const mesh = findFirstMesh(gltf.scene);
          if (!mesh) {
            throw new Error("未找到可压缩的网格数据");
          }

          console.log("找到要压缩的网格:", mesh);
          const geometry = mesh.geometry;
          console.log("几何体信息:", {
            vertices: geometry.getAttribute("position").count,
            indices: geometry.index?.count,
            hasNormals: !!geometry.getAttribute("normal"),
            hasUVs: !!geometry.getAttribute("uv"),
          });

          // 准备网格数据
          const vertices = geometry.getAttribute("position").array as Float32Array;
          const indices = geometry.index ? geometry.index.array : null;
          const normals = geometry.getAttribute("normal")?.array as Float32Array;
          const uvs = geometry.getAttribute("uv")?.array as Float32Array;

          console.log("网格数据:", {
            verticesLength: vertices.length,
            indicesLength: indices?.length,
            normalsLength: normals?.length,
            uvsLength: uvs?.length,
          });

          // 创建 mesh 对象
          const meshData = {
            indices: indices ? new Uint32Array(indices) : new Uint32Array(0),
            vertices: new Float32Array(vertices),
            normals: normals ? new Float32Array(normals) : undefined,
            uvs: uvs ? new Float32Array(uvs) : undefined,
          };

          console.log("Mesh 对象创建完成:", {
            indicesLength: meshData.indices.length,
            verticesLength: meshData.vertices.length,
            normalsLength: meshData.normals?.length,
          });

          updateStatus("Mesh 数据已准备完成，请检查控制台输出");

          const encoderModule = await draco3d.createEncoderModule({
            wasmBinary: await fetch("/draco3d/draco_encoder.wasm").then((response) =>
              response.arrayBuffer()
            ),
          });
          const encoder = new encoderModule.Encoder();
          const meshBuilder = new encoderModule.MeshBuilder();
          const dracoMesh = new encoderModule.Mesh();

          const numFaces = indices ? indices.length / 3 : 0;
          const numPoints = vertices.length;
          meshBuilder.AddFacesToMesh(dracoMesh, numFaces, meshData.indices);

          meshBuilder.AddFloatAttributeToMesh(
            dracoMesh,
            encoderModule.POSITION,
            numPoints,
            3,
            meshData.vertices
          );
          if (meshData.normals) {
            meshBuilder.AddFloatAttributeToMesh(
              dracoMesh,
              encoderModule.NORMAL,
              numPoints,
              3,
              meshData.normals
            );
          }
          if (meshData.colors) {
            meshBuilder.AddFloatAttributeToMesh(
              dracoMesh,
              encoderModule.COLOR,
              numPoints,
              3,
              meshData.colors
            );
          }
          if (meshData.uvs) {
            meshBuilder.AddFloatAttributeToMesh(
              dracoMesh,
              encoderModule.TEX_COORD,
              numPoints,
              3,
              meshData.uvs
            );
          }

          if (encodingMethod === "edgebreaker") {
            encoder.SetEncodingMethod(encoderModule.MESH_EDGEBREAKER_ENCODING);
          } else if (encodingMethod === "sequential") {
            encoder.SetEncodingMethod(encoderModule.MESH_SEQUENTIAL_ENCODING);
          }

          const encodedData = new encoderModule.DracoInt8Array();
          // Use default encoding setting.
          const encodedLen = encoder.EncodeMeshToDracoBuffer(dracoMesh, encodedData);

          // 将 encodedData 转换为 Uint8Array
          const dracoBuffer = new Uint8Array(encodedLen);
          for (let i = 0; i < encodedLen; i++) {
            dracoBuffer[i] = encodedData.GetValue(i);
          }

          // 提取原始模型的材质和贴图信息
          const originalMaterial = mesh.material as THREE.Material;
          console.log("原始材质：", originalMaterial);
          
          // 检查材质类型并获取贴图信息
          const materialInfo = {
            name: "DefaultMaterial",
            pbrMetallicRoughness: {
              baseColorFactor: [0.8, 0.8, 0.8, 1.0],
              metallicFactor: 0.0,
              roughnessFactor: 1.0
            }
          };
          
          const textureBuffers = [];
          const textureBufferViews = [];
          const textures = [];
          const images = [];
          const samplers = [];
          
          // 检查材质和贴图
          if (originalMaterial instanceof THREE.MeshStandardMaterial) {
            // 基本颜色
            if (originalMaterial.color) {
              materialInfo.pbrMetallicRoughness.baseColorFactor = [
                originalMaterial.color.r,
                originalMaterial.color.g,
                originalMaterial.color.b,
                originalMaterial.opacity
              ];
            }
            
            // 金属度和粗糙度
            materialInfo.pbrMetallicRoughness.metallicFactor = originalMaterial.metalness || 0;
            materialInfo.pbrMetallicRoughness.roughnessFactor = originalMaterial.roughness || 1;
            
            // 处理贴图 - 基础颜色贴图
            if (originalMaterial.map) {
              // 获取贴图数据
              const imageData = await new Promise<ImageData>((resolve) => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d')!;
                const img = originalMaterial.map.image;
                
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                const imageData = ctx.getImageData(0, 0, img.width, img.height);
                resolve(imageData);
              });
              
              // 将贴图转换为 PNG 格式
              const imageCanvas = document.createElement('canvas');
              imageCanvas.width = imageData.width;
              imageCanvas.height = imageData.height;
              const imageCtx = imageCanvas.getContext('2d')!;
              imageCtx.putImageData(imageData, 0, 0);
              
              // 获取 PNG 数据
              const pngBlob = await new Promise<Blob>((resolve) => {
                imageCanvas.toBlob((blob) => resolve(blob!), 'image/png');
              });
              
              const pngArrayBuffer = await pngBlob.arrayBuffer();
              const pngBuffer = new Uint8Array(pngArrayBuffer);
              
              // 添加到纹理缓冲区
              const textureBufferIndex = textureBuffers.length;
              const imageIndex = images.length;
              const textureIndex = textures.length;
              
              // 添加缓冲区视图
              textureBufferViews.push({
                buffer: 0,
                byteOffset: dracoBuffer.byteLength + textureBuffers.reduce((sum, buf) => sum + buf.byteLength, 0),
                byteLength: pngBuffer.byteLength
              });
              
              // 添加图像
              images.push({
                mimeType: 'image/png',
                bufferView: textureBufferIndex + 1 // +1 因为第0个是Draco几何体
              });
              
              // 添加纹理
              textures.push({
                sampler: 0,
                source: imageIndex
              });
              
              // 添加采样器
              if (samplers.length === 0) {
                samplers.push({
                  magFilter: 9729, // LINEAR
                  minFilter: 9987, // LINEAR_MIPMAP_LINEAR
                  wrapS: 10497,    // REPEAT
                  wrapT: 10497     // REPEAT
                });
              }
              
              // 更新材质信息以引用纹理
              materialInfo.pbrMetallicRoughness.baseColorTexture = {
                index: textureIndex
              };
              
              // 存储纹理数据
              textureBuffers.push(pngBuffer);
            }
            
            // 处理法线贴图
            if (originalMaterial.normalMap) {
              // 获取法线贴图数据 - 类似处理方式
              // ...此处省略相似的代码...
              // 如果需要支持法线贴图，可以参照上面的代码添加
            }
          }
          
          // 创建一个完整的 GLB JSON 结构
          const glbJSON = {
            asset: {
              version: "2.0",
              generator: "Custom GLB Exporter with Draco"
            },
            scene: 0,
            scenes: [{
              nodes: [0]
            }],
            nodes: [{
              mesh: 0,
              name: "CompressedMesh"
            }],
            meshes: [{
              primitives: [{
                attributes: {
                  POSITION: 1
                },
                indices: 0,
                mode: 4, // TRIANGLES
                material: 0,
                extensions: {
                  KHR_draco_mesh_compression: {
                    bufferView: 0,
                    attributes: {
                      POSITION: 0
                    }
                  }
                }
              }],
              name: "DracoCompressedMesh"
            }],
            accessors: [
              {
                // 索引
                componentType: 5123, // UNSIGNED_SHORT
                count: mesh.geometry.index ? mesh.geometry.index.count : vertices.length / 3,
                type: "SCALAR",
                min: [0],
                max: [vertices.length / 3 - 1]
              },
              {
                // 顶点位置
                componentType: 5126, // FLOAT
                count: vertices.length / 3,
                type: "VEC3",
                min: [-1, -1, -1], // 使用默认边界
                max: [1, 1, 1]
              }
            ],
            materials: [materialInfo],
            bufferViews: [
              {
                buffer: 0,
                byteOffset: 0,
                byteLength: dracoBuffer.byteLength
              },
              ...textureBufferViews
            ],
            buffers: [{
              byteLength: dracoBuffer.byteLength + textureBuffers.reduce((sum, buf) => sum + buf.byteLength, 0)
            }],
            extensionsUsed: ["KHR_draco_mesh_compression"],
            extensionsRequired: ["KHR_draco_mesh_compression"],
            samplers: samplers,
            textures: textures,
            images: images
          };

          // 如果有法线和UV，添加到 attributes 和 draco 扩展中
          if (normals) {
            glbJSON.meshes[0].primitives[0].attributes.NORMAL = 2;
            glbJSON.meshes[0].primitives[0].extensions.KHR_draco_mesh_compression.attributes.NORMAL = 1;
            glbJSON.accessors.push({
              componentType: 5126, // FLOAT
              count: normals.length / 3,
              type: "VEC3"
            });
          }
          
          if (uvs) {
            glbJSON.meshes[0].primitives[0].attributes.TEXCOORD_0 = normals ? 3 : 2;
            glbJSON.meshes[0].primitives[0].extensions.KHR_draco_mesh_compression.attributes.TEXCOORD_0 = normals ? 2 : 1;
            glbJSON.accessors.push({
              componentType: 5126, // FLOAT
              count: uvs.length / 2,
              type: "VEC2"
            });
          }

          // 转换 JSON 为 Uint8Array，并确保 4 字节对齐
          const jsonString = JSON.stringify(glbJSON);
          const jsonBuffer = new TextEncoder().encode(jsonString);
          const jsonAlignedLength = Math.ceil(jsonBuffer.length / 4) * 4;
          const jsonPadded = new Uint8Array(jsonAlignedLength);
          jsonPadded.set(jsonBuffer);

          // 填充剩余空间为空格（32是空格的ASCII码）
          for (let i = jsonBuffer.length; i < jsonAlignedLength; i++) {
            jsonPadded[i] = 32;
          }

          // 计算总二进制数据大小（Draco压缩数据 + 所有贴图数据）
          const totalBinarySize = dracoBuffer.byteLength + textureBuffers.reduce((sum, buf) => sum + buf.byteLength, 0);
          const binaryAlignedLength = Math.ceil(totalBinarySize / 4) * 4;
          const binaryPadded = new Uint8Array(binaryAlignedLength);
          
          // 复制Draco压缩数据
          binaryPadded.set(dracoBuffer, 0);
          
          // 复制所有贴图数据
          let offset = dracoBuffer.byteLength;
          for (const textureBuffer of textureBuffers) {
            binaryPadded.set(textureBuffer, offset);
            offset += textureBuffer.byteLength;
          }

          // GLB 头部 (12 bytes) + JSON chunk 头部 (8 bytes) + JSON 数据 + 二进制块头部 (8 bytes) + 二进制数据
          const totalLength = 12 + 8 + jsonAlignedLength + 8 + binaryAlignedLength;
          
          // 创建最终的 GLB buffer
          const glbBuffer = new ArrayBuffer(totalLength);
          const glbView = new DataView(glbBuffer);
          offset = 0;

          // 写入 GLB 头部
          glbView.setUint32(offset + 0, 0x46546C67, true); // GLB magic "glTF"
          glbView.setUint32(offset + 4, 2, true); // GLB version
          glbView.setUint32(offset + 8, totalLength, true); // 总长度
          offset += 12;

          // 写入 JSON chunk
          glbView.setUint32(offset + 0, jsonAlignedLength, true); // JSON chunk length
          glbView.setUint32(offset + 4, 0x4E4F534A, true); // JSON chunk type "JSON"
          offset += 8;
          new Uint8Array(glbBuffer, offset, jsonAlignedLength).set(jsonPadded);
          offset += jsonAlignedLength;

          // 写入二进制块
          glbView.setUint32(offset + 0, binaryAlignedLength, true); // BIN chunk length
          glbView.setUint32(offset + 4, 0x004E4942, true); // BIN chunk type "BIN"
          offset += 8;
          new Uint8Array(glbBuffer, offset, binaryAlignedLength).set(binaryPadded);

          // 创建 Blob 并下载
          const blob = new Blob([glbBuffer], { type: 'model/gltf-binary' });
          const downloadUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = 'compressed_model.glb';
          
          // 触发下载
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // 清理 URL 对象
          URL.revokeObjectURL(downloadUrl);

          console.log("GLB 文件生成完成，总大小:", totalLength, "bytes");
          updateStatus(`压缩完成！GLB文件大小: ${(totalLength / 1024).toFixed(2)} KB`);

          // 清理内存
          encoderModule.destroy(dracoMesh);
          encoderModule.destroy(encoder);
          encoderModule.destroy(meshBuilder);
        } catch (error) {
          console.error("处理过程中出错：", error);
          updateStatus(`处理失败：${error instanceof Error ? error.message : "未知错误"}`);
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("文件读取错误：", error);
      updateStatus(`文件读取失败：${error instanceof Error ? error.message : "未知错误"}`);
    }
  };

  return (
    <div
      className='container'
      style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", textAlign: "center" }}
    >
      <h1>GLB Model Compressor with Draco3D</h1>
      <div
        className='encoding-method'
        style={{ marginBottom: "20px" }}
      >
        <label>
          编码方法：
          <select
            value={encodingMethod}
            onChange={(e) => setEncodingMethod(e.target.value as "edgebreaker" | "sequential")}
            style={{ marginLeft: "10px", padding: "5px" }}
          >
            <option value='sequential'>顺序编码</option>
            <option value='edgebreaker'>边缘破坏编码</option>
          </select>
        </label>
      </div>
      <div
        className='upload-area'
        style={{
          border: "2px dashed #ccc",
          padding: "20px",
          margin: "20px 0",
          borderRadius: "5px",
        }}
      >
        <input
          type='file'
          accept='.glb'
          onChange={handleFileUpload}
          style={{ margin: "20px 0" }}
        />
        <p>选择一个GLB模型文件进行压缩</p>
      </div>
      <div
        className='status'
        style={{ marginTop: "20px", color: "#666" }}
      >
        {status}
      </div>
    </div>
  );
}

export default App;
