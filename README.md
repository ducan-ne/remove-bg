<h3 align="center">Remove-BG</h3>

<p align="center">
    Remove background directly in your browser, powered by WebGPU
    <br />
    <a href="https://bannerify.co/tools/remove-bg"><strong>Learn more »</strong></a>
    <br />
    <br />
    <a href="#introduction"><strong>Introduction</strong></a> ·
    <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
</p>

<p align="center">
  <a href="https://twitter.com/duc__an">
    <img src="https://img.shields.io/twitter/follow/duc__an?style=flat&label=%40duc__an&logo=twitter&color=0bf&logoColor=fff" alt="Twitter" />
  </a>
  <a href="https://news.ycombinator.com/item?id=41358490"><img src="https://img.shields.io/badge/Hacker%20News-200-%23FF6600" alt="Hacker News"></a>
</p>

<br/>

## Introduction

Remove background directly in your browser, powered by WebGPU, we use [RMBG V1.4](https://huggingface.co/briaai/RMBG-1.4) model from Hugging Face

Under the hood, it uses [transformer.js](https://huggingface.co/docs/transformers.js/index) to interact with the model

## Tech Stack

- Pnpm
- Vite
- Transformers.js
- NextUI
- React aria components
- Tailwind
- RMBG V1.4 model

## Troubleshooting

### Status "Error"
Try to put the  flag "--enable-unsafe-webgpu --enable-features=Vulkan" to your Chrome flags, read more about it [here](https://github.com/gpuweb/gpuweb/wiki/Implementation-Status#chromium-chrome-edge-etc)

## Contributing

- `pnpm install`
- `pnpm dev`

That's it
