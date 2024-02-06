import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const playgroundFormSchema = z.object({
  checkpoint_model: z.string().default("Aniverse.safetensors"),
  input_prompt: z.string().min(1, { message: "Please type a prompt." }),
  negative_prompt: z
    .string()
    .default(
      "(worst quality:1.4), (low quality:1.4), simple background, bad anatomy"
    ),
  steps: z.number().min(1).max(80).default(30),
  sampler_name: z.string().default("dpmpp_2m"),
  seed: z.number().optional(),
  cfg: z.number().min(1.0).max(10.0).default(6.0),
  lora: z.string().optional(),
  custom_lora_file: z.record(z.any()).optional(), // only used to store the state for dropzone
  custom_lora: z.string().optional(),
  lora_strength: z.number().min(0.0).max(1.0).default(1.0),
  width: z.number().default(800),
  height: z.number().default(1200),
  batch_size: z.number().min(1).max(4).default(1),
  style: z.enum(["Digital", "Realism", "Anime"]).default("Digital"),
  upscale_factor: z.number().min(1).max(3).default(3),
});

export function usePlaygroundForm() {
  const form = useForm<z.infer<typeof playgroundFormSchema>>({
    resolver: zodResolver(playgroundFormSchema),
    defaultValues: {
      checkpoint_model: "Aniverse.safetensors",
      input_prompt: "",
      negative_prompt:
        "(worst quality:1.4), (low quality:1.4), simple background, bad anatomy",
      steps: 20,
      sampler_name: "dpmpp_2m",
      seed: 0,
      cfg: 7.0,
      lora: "",
      custom_lora_file: {},
      custom_lora: "",
      lora_strength: 1,
      width: 340,
      height: 512,
      batch_size: 3,
      upscale_factor: 3,
    },
  });

  return form;
}
