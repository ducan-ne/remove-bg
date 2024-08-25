import { AutoModel, AutoProcessor, env, RawImage } from "@huggingface/transformers"
import { toast } from "sonner"
import { getGPUTier } from 'detect-gpu';

// Since we will download the model from the Hugging Face Hub, we can skip the local model check
env.allowLocalModels = false
// Proxy the WASM backend to prevent the UI from freezing
env.backends.onnx.wasm.proxy = true
// env.backends.onnx.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.17.1/dist/"
// env.backends.onnx.wasm.numThreads = 1

const gpuTier = await getGPUTier();
const modelSettings: Parameters<typeof AutoModel.from_pretrained>[1] = {
  // Do not require config.json to be present in the repository
  config: { model_type: "custom" },
}
if (gpuTier?.fps) {
  modelSettings.device = "webgpu"
  modelSettings.dtype = "fp32"
}
const modelPromise = AutoModel.from_pretrained("briaai/RMBG-1.4", modelSettings)

const processorPromise = AutoProcessor.from_pretrained("briaai/RMBG-1.4", {
  // Do not require config.json to be present in the repository
  config: {
    do_normalize: true,
    do_pad: false,
    do_rescale: true,
    do_resize: true,
    image_mean: [0.5, 0.5, 0.5],
    feature_extractor_type: "ImageFeatureExtractor",
    image_std: [1, 1, 1],
    resample: 2,
    rescale_factor: 0.00392156862745098,
    size: { width: 1024, height: 1024 },
  },
})

modelPromise.then(() => {
  console.log("model loaded")
})
processorPromise.then(() => {
  console.log("processor loaded")
})
export async function removeBg(url: string) {
  const image = await RawImage.fromURL(url)

  // Set container width and height depending on the image aspect ratio
  const ar = image.width / image.height

  // Preprocess image
  let loadTimeout = setTimeout(() => {
    toast.info("First time loading the model, this might take a while...")
  }, 3e3)
  try {
    const processor = await processorPromise
    const { pixel_values } = await processor(image)

    // Predict alpha matte
    const model = await modelPromise
    const { output } = await model({ input: pixel_values })
    clearTimeout(loadTimeout)

    // Resize mask back to original size
    const mask = await RawImage.fromTensor(output[0].mul(255).to("uint8")).resize(
      image.width,
      image.height,
    )

    // Create new canvas
    const canvas = document.createElement("canvas")
    canvas.width = image.width
    canvas.height = image.height
    const ctx = canvas.getContext("2d")!

    // Draw original image output to canvas
    ctx.drawImage(image.toCanvas(), 0, 0)

    // Update alpha channel
    const pixelData = ctx.getImageData(0, 0, image.width, image.height)
    for (let i = 0; i < mask.data.length; ++i) {
      pixelData.data[4 * i + 3] = mask.data[i]
    }
    ctx.putImageData(pixelData, 0, 0)

    return canvas.toDataURL()
  } catch (e) {
    console.log("Error:", e)
    throw e
  } finally {
    clearTimeout(loadTimeout)
  }
}

export type ServerFunctions = {
  removeBg: typeof removeBg
}
