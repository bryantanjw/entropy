# Entropy txt2img Cog model

This is an implementation of a ComfyUI LoRA workflow as a Cog model. [Cog packages machine learning models as standard containers.](https://github.com/replicate/cog)

First, download the pre-trained weights:

    cog run script/download-weights

Then, you can run predictions:

    cog predict r8.im/bryantanjw/entropy-lol@sha256:c5ee23596b3f22ba9a58242c0ae34d264e4eb6f599386a1577b37ed0243a1870 \
    -i 'cfg=7' \
    -i 'lora="gaming/Ahri.safetensors"' \
    -i 'steps=30' \
    -i 'width=720' \
    -i 'height=1080' \
    -i 'batch_size=4' \
    -i 'input_prompt="masterpiece, (detailed, highres, best quality), 1girl, IncrsAhri, braid, fox tail, multiple tails, korean clothes, skirt, blurry, blurry background, arms behind back, seductive smile,"' \
    -i 'sampler_name="dpmpp_2m"' \
    -i 'lora_strength=1' \
    -i 'negative_prompt="(worst quality:1.4), (low quality:1.4),"' \
    -i 'checkpoint_model="Aniverse.safetensors"'
  

The workflow used for this repo is found under:

    workflow/entropy_workflow.json

## Example:

"masterpiece, (detailed, highres, best quality), 1girl, IncrsAhri, braid, fox tail, multiple tails, korean clothes, skirt, blurry, blurry background, arms behind back, seductive smile"

![output.png](https://cdn.sanity.io/images/6jp747p1/production/098ab44b01901d5a02fd996e43bc1e0f9956b08b-720x1080.png)
