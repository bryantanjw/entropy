import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const playgroundFormSchema = z.object({
  checkpoint_model: z.string().default("aniverse_v11.safetensors"),
  input_prompt: z
    .string()
    .default(
      "beautiful scenery nature glass bottle landscape, purple galaxy bottle"
    ),
  negative_prompt: z.string().default("text, watermark, ugly, blurry"),
  steps: z.number().default(30),
  seed: z.number().optional(),
  cfg: z.number().default(10),
  lora: z.string().default("Miss_Fortune.safetensors"),
  strength_model: z.number().default(1.0),
  width: z.number().default(512),
  height: z.number().default(512),
  batch_size: z.number().default(1),
});

export function usePlaygroundForm() {
  const form = useForm<z.infer<typeof playgroundFormSchema>>({
    resolver: zodResolver(playgroundFormSchema),
    defaultValues: {
      checkpoint_model: "aniverse_v11.safetensors",
      input_prompt:
        "beautiful scenery nature glass bottle landscape, purple galaxy bottle",
      negative_prompt: "text, watermark, ugly, blurry",
      steps: 30,
      seed: null,
      cfg: 10,
      lora: "Miss_Fortune.safetensors",
      strength_model: 1.0,
      width: 512,
      height: 512,
      batch_size: 1,
    },
  });

  return form;
}
