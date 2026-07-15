export interface NavigatorUABrandVersion {
  readonly brand: string;
  readonly version: string;
}

export interface NavigatorUAData {
  readonly brands: readonly NavigatorUABrandVersion[];
  readonly mobile: boolean;
  readonly platform: string;
  getHighEntropyValues(hints: string[]): Promise<Record<string, unknown>>;
}

export interface BluetoothDevice {
  readonly id: string;
  readonly name?: string;
}

export interface Bluetooth {
  requestDevice(options?: {
    acceptAllDevices?: boolean;
    optionalServices?: string[];
  }): Promise<BluetoothDevice>;
}

export interface USBDevice {
  readonly serialNumber?: string;
  readonly vendorId: number;
  readonly productId: number;
  readonly productName?: string;
}

export interface USB {
  requestDevice(options?: {
    filters?: unknown[];
  }): Promise<USBDevice>;
}

export interface SerialPortInfo {
  readonly usbVendorId?: number;
  readonly usbProductId?: number;
}

interface SerialPort {
  getInfo(): SerialPortInfo;
}

export interface Serial {
  requestPort(): Promise<SerialPort>;
}

interface GPULimits {
  readonly [key: string]: number | undefined;
  readonly maxTextureDimension1D?: number;
  readonly maxTextureDimension2D?: number;
  readonly maxTextureDimension3D?: number;
  readonly maxTextureArrayLayers?: number;
  readonly maxBindGroups?: number;
  readonly maxDynamicUniformBuffersPerPipelineLayout?: number;
  readonly maxDynamicStorageBuffersPerPipelineLayout?: number;
  readonly maxSampledTexturesPerShaderStage?: number;
  readonly maxSamplersPerShaderStage?: number;
  readonly maxStorageBuffersPerShaderStage?: number;
  readonly maxStorageTexturesPerShaderStage?: number;
  readonly maxUniformBuffersPerShaderStage?: number;
  readonly maxUniformBufferBindingSize?: number;
  readonly maxStorageBufferBindingSize?: number;
  readonly minUniformBufferOffsetAlignment?: number;
  readonly minStorageBufferOffsetAlignment?: number;
  readonly maxVertexBuffers?: number;
  readonly maxVertexAttributes?: number;
  readonly maxVertexBufferArrayStride?: number;
  readonly maxInterStageShaderComponents?: number;
  readonly maxComputeWorkgroupStorageSize?: number;
  readonly maxComputeInvocationsPerWorkgroup?: number;
  readonly maxComputeWorkgroupSizeX?: number;
  readonly maxComputeWorkgroupSizeY?: number;
  readonly maxComputeWorkgroupSizeZ?: number;
  readonly maxComputeWorkgroupsPerDimension?: number;
}

interface GPUSupportedFeatures {
  readonly size: number;
  has(value: string): boolean;
  [Symbol.iterator](): IterableIterator<string>;
  forEach(callbackfn: (value: string, key: string, parent: GPUSupportedFeatures) => void): void;
}

interface GPUAdapter {
  readonly name: string;
  readonly features: GPUSupportedFeatures;
  readonly limits: GPULimits;
  requestDevice(descriptor?: unknown): Promise<GPUDevice>;
}

interface GPUBuffer {
  getMappedRange(offset?: number, size?: number): ArrayBuffer;
  unmap(): void;
  destroy(): void;
}

interface GPUDevice {
  readonly limits: GPULimits;
  createShaderModule(descriptor: { code: string }): unknown;
  createBuffer(descriptor: {
    size: number;
    usage: number;
    mappedAtCreation?: boolean;
  }): GPUBuffer;
  createTexture(descriptor: unknown): unknown;
  createSampler(descriptor?: unknown): unknown;
  createBindGroupLayout(descriptor: unknown): unknown;
  createPipelineLayout(descriptor: unknown): unknown;
  createComputePipeline(descriptor: unknown): unknown;
  createBindGroup(descriptor: unknown): unknown;
  createCommandEncoder(descriptor?: unknown): unknown;
  destroy(): void;
}

export interface GPU {
  requestAdapter(options?: { powerPreference?: 'high-performance' | 'low-power' }): Promise<GPUAdapter | null>;
}

declare global {
  interface Screen {
    isExtended?: boolean;
  }

  interface NetworkInformation extends EventTarget {
    readonly downlink?: number;
    readonly effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
    readonly rtt?: number;
    readonly saveData?: boolean;
    readonly type?: 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown';
    readonly downlinkMax?: number;
  }

  interface Navigator {
    brave?: {
      isBrave: () => Promise<boolean>;
    };
    userAgentData?: NavigatorUAData;
    deviceMemory?: number;
    connection?: NetworkInformation;
    mozConnection?: NetworkInformation;
    webkitConnection?: NetworkInformation;
    standalone?: boolean;
    gpu?: GPU;
    bluetooth?: Bluetooth;
    usb?: USB;
    xr?: unknown;
    nfc?: unknown;
    windowControlsOverlay?: unknown;
    hid?: unknown;
    serial?: Serial;
    presentation?: unknown;
    globalPrivacyControl?: boolean;
    webdriver?: boolean;
    ml?: unknown;
  }

  interface Sensor extends EventTarget {
    readonly activated: boolean;
    readonly hasReading: boolean;
    readonly timestamp?: number;
    start(): void;
    stop(): void;
  }

  interface Magnetometer extends Sensor {
    readonly x: number;
    readonly y: number;
    readonly z: number;
  }

  interface AmbientLightSensor extends Sensor {
    readonly illuminance: number;
  }

  interface LinearAccelerationSensor extends Sensor {
    readonly x: number;
    readonly y: number;
    readonly z: number;
  }

  interface GravitySensor extends Sensor {
    readonly x: number;
    readonly y: number;
    readonly z: number;
  }

  interface AbsoluteOrientationSensor extends Sensor {
    readonly quaternion: [number, number, number, number];
  }

  interface Window {
    ai?: {
      canCreateTextSession: () => Promise<string>;
    };
    webkitAudioContext?: typeof AudioContext;
    GPUTextureUsage?: {
      STORAGE_BINDING?: number;
      COPY_SRC?: number;
      COPY_DST?: number;
      RENDER_ATTACHMENT?: number;
    };
    GPUBufferUsage?: {
      UNIFORM?: number;
      COPY_DST?: number;
      STORAGE?: number;
    };
    model?: unknown;
    Magnetometer?: new (options?: { frequency?: number }) => Magnetometer;
    AmbientLightSensor?: new (options?: { frequency?: number }) => AmbientLightSensor;
    LinearAccelerationSensor?: new (options?: { frequency?: number }) => LinearAccelerationSensor;
    GravitySensor?: new (options?: { frequency?: number }) => GravitySensor;
    AbsoluteOrientationSensor?: new (options?: { frequency?: number }) => AbsoluteOrientationSensor;
  }
}
