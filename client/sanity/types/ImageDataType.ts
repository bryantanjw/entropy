export type ImageDataType = {
  _id: string;
  title: string;
  ratio: string;
  image_url: string;
  prompt: string;
  negative_prompt: string;
  style: string;
  model: string;
  category: string;
  cfg_scale: number;
  steps: number;
  sampler: string;
  seed: number;
  tags: string[];
};
