# Entropy

Generate images of any character you know and love!

![Demo](https://github.com/bryantanjw/entropy/assets/34775928/99d1a6d2-8796-469b-99a1-54430a6bc2ca)

## Project Overview

Entropy is a cutting-edge platform for generating images of characters using advanced machine learning models. It's divided into three main parts:

1. **Client**: A Next.js application that serves as the user interface. It fetches content from Sanity and handles interactions, including image generation requests via external services like Replicate. [Setup Instructions](./client/README.md).

2. **Server**: Contains the prediction workflow for image generation, utilizing Cog for containerization. The core logic is in [`predict.py`](./server/predict.py), with the workflow defined in [`entropy_v2.json`](./server/workflows/entropy_v2.json). [Setup Instructions](./server/README.md).

3. **[Sanity Studio](https://sanity.io/)**: Manages the content displayed on the frontend, offering a customizable real-time editing environment.

Entropy leverages the latest in AI to bring your favorite characters to life in unique and creative ways.

[Support Entropy - Buy Me A Coffee](https://www.buymeacoffee.com/bryantan)

## Features

- Generate high resolution images of any character.
- Customizable image generation parameters.
- Upload custom LoRA models (.safetensors).

## Contributing

We welcome contributions and feedback to make Entropy even better 🤧.

## License

Entropy is released under the MIT License. See [LICENSE](./LICENSE) for more details.
