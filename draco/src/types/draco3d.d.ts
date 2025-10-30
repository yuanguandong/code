declare module 'draco3d' {
  export interface EncoderModule {
    Encoder: new () => Encoder;
    Mesh: new () => Mesh;
    MeshBuilder: new () => MeshBuilder;
    DracoInt8Array: new (size: number) => DracoInt8Array;
    MESH_SEQUENTIAL_ENCODING: number;
    MESH_EDGEBREAKER_ENCODING: number;
    POSITION: number;
    NORMAL: number;
    TEX_COORD: number;
    COLOR: number;
    destroy: (obj: Encoder | Mesh | MeshBuilder) => void;
  }

  export interface Encoder {
    SetEncodingMethod: (method: number) => void;
    SetQuantization: (attribute: number, bits: number) => void;
    EncodeMeshToDracoBuffer: (mesh: Mesh, buffer: DracoInt8Array) => number;
  }

  export interface Mesh {
    num_points: number;
    num_faces: number;
    AddFloatAttributeArray: (attribute: number, numPoints: number, numComponents: number, data: Float32Array) => number;
    AddFace: (indices: number[]) => void;
  }

  export interface MeshBuilder {
    AddFacesToMesh: (mesh: Mesh, numFaces: number, indices: Uint32Array) => void;
    AddFloatAttributeToMesh: (
      mesh: Mesh,
      attributeType: number,
      numPoints: number,
      numComponents: number,
      data: Float32Array
    ) => void;
  }

  export interface DracoInt8Array {
    buffer: ArrayBuffer;
    GetValue: (index: number) => number;
  }

  export interface EncoderModuleOptions {
    wasmBinary: ArrayBuffer;
    onModuleLoaded?: () => void;
  }

  export function createEncoderModule(options: EncoderModuleOptions): Promise<EncoderModule>;
} 