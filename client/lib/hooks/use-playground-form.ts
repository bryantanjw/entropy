import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const playgroundFormSchema = z.object({
  checkpoint_model: z.string().default("Aniverse.safetensors"),
  input_prompt: z.string(),
  negative_prompt: z
    .string()
    .default("lowres, worst quality, ugly, blurry, bad fingers"),
  steps: z.number().min(1).max(100).default(30),
  sampler_name: z.string().default("dpmpp_2m"),
  seed: z.number().optional(),
  cfg: z.number().min(1.0).max(30.0).default(10.0),
  lora: z.string().optional(),
  custom_lora: z.string().optional(),
  lora_strength: z.number().min(0.0).max(1.0).default(1.0),
  width: z.number().default(800),
  height: z.number().default(1200),
  batch_size: z.number().min(1).max(4).default(1),
});

export function usePlaygroundForm() {
  const form = useForm<z.infer<typeof playgroundFormSchema>>({
    resolver: zodResolver(playgroundFormSchema),
    defaultValues: {
      checkpoint_model: "Aniverse.safetensors",
      input_prompt: "",
      negative_prompt: "lowres, worst quality, ugly, blurry, bad fingers",
      steps: 25,
      sampler_name: "dpmpp_2m_sde",
      seed: 69420,
      cfg: 7.0,
      lora: "",
      custom_lora: "",
      lora_strength: 1,
      width: 720,
      height: 1080,
      batch_size: 1,
    },
  });

  return form;
}
