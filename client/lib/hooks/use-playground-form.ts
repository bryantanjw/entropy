import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const playgroundFormSchema = z.object({
  motion_module: z.string().min(1, {
    message: "Model version is empty.",
  }),
  prompt: z.string().min(1, {
    message: "Prompt is empty.",
  }),
  path: z.string().min(1, {
    message: "Model path is empty.",
  }),
  negativePrompt: z.string().optional(),
  inferenceStep: z.number().optional(),
  guidance: z.number().optional(),
  seed: z.number().optional(),
});

export function usePlaygroundForm() {
  const form = useForm<z.infer<typeof playgroundFormSchema>>({
    resolver: zodResolver(playgroundFormSchema),
    defaultValues: {
      motion_module: "mm_sd_v15_v2",
      prompt: "",
      path: "toonyou_beta3.safetensors",
      negativePrompt: "ugly, disfigured, low quality, blurry, nsfw",
      inferenceStep: 25,
      guidance: 7.5,
      seed: 255224557,
    },
  });

  return form;
}
