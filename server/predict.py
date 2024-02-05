import subprocess
import threading
import time
import requests
from cog import BasePredictor, Input, Path
from typing import List
import os
import torch
import uuid
import json
import urllib
from urllib.parse import urlparse, unquote
import websocket
from urllib.error import URLError
from models import checkpoints, loras


class Predictor(BasePredictor):
    def setup(self):
        self.server_address = "127.0.0.1:8188"
        self.download_models()  # Uncomment this function call when you're adding new models
        self.start_server()

    def start_server(self):
        server_thread = threading.Thread(target=self.run_server)
        server_thread.start()

        while not self.is_server_running():
            time.sleep(1)  # Wait for 1 second before checking again

        print("Server is up and running!")

    def run_server(self):
        command = "python ./ComfyUI/main.py"
        server_process = subprocess.Popen(command, shell=True)
        server_process.wait()

    # hacky solution, will fix later
    def is_server_running(self):
        try:
            with urllib.request.urlopen("http://{}/history/{}".format(self.server_address, "123")) as response:
                return response.status == 200
        except URLError:
            return False

    def download_models(self):
        base_url = "https://huggingface.co/bryantanjw/entropy-lol/resolve/main/models"

        def download_models(model_type, model_names):
            print(f"Now downloading {model_type}")
            upscale_model_path = f"ComfyUI/models/upscale_models/RealESRGAN_x4plus.pth"
            if not os.path.exists(upscale_model_path):
                upscale_model_url = f"{base_url}/upscale_models/RealESRGAN_x4plus.pth"
                print(
                    f"Upscale model not found, downloading from {upscale_model_url}")
                urllib.request.urlretrieve(
                    upscale_model_url, upscale_model_path)
                print(f"\nDownloaded upscale model to {upscale_model_path}")
            else:
                print(
                    f"Upscale model {upscale_model_path} already exists, skipping download")
            for model_name in model_names:
                path = f"ComfyUI/models/{model_type}/{os.path.basename(model_name)}"
                if not os.path.exists(path):
                    url = f"{base_url}/{model_type}/{model_name}"
                    print(f"Model {path} not found, downloading from {url}")
                    urllib.request.urlretrieve(
                        url, path)
                    print(f"\nDownloaded model to {path}")
                else:
                    print(f"Model {path} already exists, skipping download")

        download_models("checkpoints", checkpoints)
        download_models("loras", loras)

    def queue_prompt(self, prompt, client_id):
        p = {"prompt": prompt, "client_id": client_id}
        data = json.dumps(p).encode('utf-8')
        req = urllib.request.Request(
            "http://{}/prompt".format(self.server_address), data=data)
        return json.loads(urllib.request.urlopen(req).read())

    def get_image(self, filename, subfolder, folder_type):
        data = {"filename": filename,
                "subfolder": subfolder, "type": folder_type}
        print(folder_type)
        url_values = urllib.parse.urlencode(data)
        with urllib.request.urlopen("http://{}/view?{}".format(self.server_address, url_values)) as response:
            return response.read()

    def get_images(self, ws, prompt, client_id):
        prompt_id = self.queue_prompt(prompt, client_id)['prompt_id']
        output_images = {}
        while True:
            out = ws.recv()
            if isinstance(out, str):
                message = json.loads(out)
                if message['type'] == 'executing':
                    data = message['data']
                    if data['node'] is None and data['prompt_id'] == prompt_id:
                        break  # Execution is done
            else:
                continue  # previews are binary data

        history = self.get_history(prompt_id)[prompt_id]
        for node_id in history['outputs']:
            node_output = history['outputs'][node_id]
            print("node output: ", node_output)

            if 'images' in node_output:
                for i, image in enumerate(node_output['images']):
                    image_data = self.get_image(
                        image['filename'], image['subfolder'], image['type'])
                    output_images[f"{i}"] = [image_data]

        return output_images

    def get_history(self, prompt_id):
        with urllib.request.urlopen("http://{}/history/{}".format(self.server_address, prompt_id)) as response:
            return json.loads(response.read())

    def predict(
        self,
        checkpoint_model: str = Input(
            description="Checkpoint Model",
            choices=checkpoints,
            default="Aniverse.safetensors"
        ),
        input_prompt: str = Input(
            description="Prompt"
        ),
        negative_prompt: str = Input(
            description="Negative Prompt", default="(worst quality:1.4), (low quality:1.4), simple background, bad anatomy"
        ),
        steps: int = Input(
            description="Inference Steps",
            default=20,
            ge=1,
            le=100
        ),
        sampler_name: str = Input(
            description="Sampler Name",
            choices=["dpmpp_2m", "euler_ancestral"],
            default="dpmpp_2m"
        ),
        seed: int = Input(
            description="Sampling seed, leave Empty for Random", default=None
        ),
        cfg: float = Input(
            description="CFG Scale",
            default=7.0,
            ge=1.0,
            le=20.0
        ),
        lora: str = Input(
            description="LoRA Model",
            choices=loras,
            default="gaming/Ahri.safetensors"
        ),
        custom_lora: str = Input(
            description="Link to LoRA file (.safetensors). Replicate doesn't allow .safetensors file uploads :(, but you can upload it on app.entropy.so.",
            default=None
        ),
        lora_strength: float = Input(
            description="LoRA Strength",
            default=1.0,
            ge=0.0,
            le=1.0
        ),
        width: int = Input(
            description="Image Width",
            default=340
        ),
        height: int = Input(
            description="Image Height",
            default=512
        ),
        batch_size: int = Input(
            description="Batch Size",
            default=1,
            ge=1,
            le=4
        ),
        upscale_factor: float = Input(
            description="Upscale Factor",
            default=3.0,
            ge=0.0,
            le=3.0
        )
    ) -> List[Path]:
        """Run a single prediction on the model"""
        if seed is None or seed == 0:
            seed = int.from_bytes(os.urandom(3), "big")
        print(f"Using seed: {seed}")

        # queue prompt
        img_output_path = self.get_workflow_output(
            checkpoint_model=checkpoint_model,
            input_prompt=input_prompt,
            negative_prompt=negative_prompt,
            lora=lora,
            steps=steps,
            sampler_name=sampler_name,
            seed=seed,
            cfg=cfg,
            width=width,
            height=height,
            batch_size=batch_size,
            lora_strength=lora_strength,
            custom_lora=custom_lora,
            upscale_factor=upscale_factor
        )
        return img_output_path

    def get_workflow_output(
        self,
        checkpoint_model,
        input_prompt, negative_prompt,
        lora,
        steps,
        sampler_name,
        seed,
        batch_size,
        width,
        height,
        cfg,
        lora_strength,
        custom_lora,
        upscale_factor
    ):
        # load config
        prompt = None
        workflow_config = "./workflows/entropy_v2.json"
        with open(workflow_config, 'r') as file:
            prompt = json.load(file)

        if not prompt:
            raise Exception('no workflow config found')

        # If custom_lora is provided, save it to the desired directory
        lora_to_use = lora
        lora_path = None
        if custom_lora is not None and custom_lora != "":
            lora_directory = "ComfyUI/models/loras"
            # Parse the filename from the presigned URL
            parsed_url = urlparse(custom_lora)
            path = parsed_url.path

            # Extract the filename from the path
            # Ensure to decode any percent-encoded characters
            filename = unquote(os.path.basename(path))

            # Construct the full path where the file will be saved
            lora_path = os.path.join(lora_directory, filename)
            print(f"Full path for saving file: {lora_path}")

            # Download the file
            response = requests.get(custom_lora)
            if response.status_code == 200:
                with open(lora_path, 'wb') as f:
                    f.write(response.content)
                print(f"File downloaded and saved successfully at {lora_path}")
                lora_to_use = lora_path
            else:
                raise Exception(
                    f"Failed to download LoRA file. Status code: {response.status_code}")

        # set input variables
        prompt["93:0"]["inputs"]["ckpt_name"] = checkpoint_model
        prompt["93:3"]["inputs"]["text"] = input_prompt
        prompt["93:4"]["inputs"]["text"] = negative_prompt
        prompt["93:2"]["inputs"]["lora_name"] = os.path.basename(lora_to_use)
        prompt["50"]["inputs"]["seed"] = seed
        prompt["50"]["inputs"]["steps"] = steps
        prompt["50"]["inputs"]["cfg"] = cfg
        prompt["50"]["inputs"]["sampler_name"] = sampler_name
        prompt["5"]["inputs"]["batch_size"] = batch_size
        prompt["5"]["inputs"]["width"] = width
        prompt["5"]["inputs"]["height"] = height
        prompt["93:2"]["inputs"]["strength_model"] = lora_strength
        prompt["41"]["inputs"]["upscale_factor"] = upscale_factor

        # start the process
        client_id = str(uuid.uuid4())
        ws = websocket.WebSocket()
        ws.connect(
            "ws://{}/ws?clientId={}".format(self.server_address, client_id))

        images = self.get_images(ws, prompt, client_id)
        print(f"{len(images)} images generated successfully")

        # Delete the custom_lora file after generating images
        if custom_lora:
            try:
                os.remove(lora_path)
                print(
                    f"Custom LoRA file {lora_path} deleted after generating images.")
            except OSError as e:
                print(f"Error: {e.strerror} - {e.filename}")

        image_paths = []
        for node_id in images:
            for image_data in images[node_id]:
                import io
                from PIL import Image
                image = Image.open(io.BytesIO(image_data))
                image.save("out-"+node_id+".png")
                image_paths.append(Path("out-"+node_id+".png"))

        return image_paths
