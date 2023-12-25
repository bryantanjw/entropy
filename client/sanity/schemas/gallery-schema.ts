const STYLES = [
  { title: "Anime", value: "anime" },
  { title: "Realism", value: "realism" },
  { title: "3D", value: "3d" },
  { title: "Digital", value: "digital" },
];

const CATEGORIES = [
  { title: "Anime", value: "anime" },
  { title: "Gaming", value: "gaming" },
  { title: "Music Artists", value: "music-artists" },
  { title: "Hollywood", value: "hollywood" },
  { title: "Comics", value: "comics" },
  { title: "Cartoon", value: "cartoon" },
  { title: "Cinematic", value: "cinematic" },
];

const RATIOS = [
  { title: "Portrait", value: "portrait" },
  { title: "Landscape", value: "landscape" },
  { title: "Square", value: "square" },
];

const gallerySchema = {
  title: "Gallery",
  name: "gallery",
  type: "document",
  fields: [
    {
      title: "Image Title",
      name: "title",
      type: "string",
      validation: (Rule: any) => [
        Rule.required().error("Image Title is required"),
        Rule.min(3).error("Title must be between 3 and 50 characters"),
        Rule.max(50).warning("Shorter titles are usually better"),
      ],
    },
    {
      title: "Image Ratio",
      name: "ratio",
      type: "string",
      initialValue: "portrait",
      options: {
        list: RATIOS,
        layout: "radio",
      },
      validation: (Rule: any) =>
        Rule.required().error("Image Ratio is required"),
    },
    {
      title: "Image Style",
      name: "style",
      type: "string",
      initialValue: "anime",
      options: {
        list: STYLES,
      },
      validation: (Rule: any) =>
        Rule.required().error("Image Style is required"),
    },
    {
      title: "Image Category",
      name: "category",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: CATEGORIES,
      },
      validation: (Rule: any) =>
        Rule.required().error("At least one category is required"),
    },
    {
      title: "Image Origin",
      name: "origin",
      type: "string",
      description: "e.g., League of Legends, Genshin Impact, etc.",
    },
    {
      title: "Image",
      name: "image",
      type: "image",
      option: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required().error("Image is required"),
      fields: [
        {
          title: "Prompt",
          name: "prompt",
          type: "text",
          validation: (Rule: any) => [
            Rule.required().error("Prompt is required"),
          ],
        },
        {
          title: "Negative prompt",
          name: "negative_prompt",
          type: "text",
        },
        {
          title: "Model",
          name: "model",
          type: "string",
        },
        {
          title: "Inference steps",
          name: "steps",
          type: "string",
          validation: (Rule: any) => [
            Rule.required().error("Inference steps is required"),
          ],
        },
        {
          title: "Seed",
          name: "seed",
          type: "number",
          validation: (Rule: any) => [
            Rule.required().error("Seed is required"),
          ],
        },
        {
          title: "CFG scale",
          name: "cfg_scale",
          type: "number",
          initialValue: 7,
          validation: (Rule: any) => [
            Rule.required().error("CFG scale is required"),
          ],
        },
        {
          title: "Sampler",
          name: "sampler",
          type: "string",
          validation: (Rule: any) => [
            Rule.required().error("Sampler is required"),
          ],
        },
        {
          title: "Clip skip",
          name: "clip_skip",
          type: "number",
          initialValue: 2,
        },
        {
          title: "Image source",
          description: "e.g., Civitati, Replicate.",
          name: "civilai_link",
          type: "string",
        },
        {
          title: "Alt Text",
          name: "alt",
          type: "string",
          options: {
            source: "title",
            maxLength: 50,
          },
          validation: (Rule: any) => [
            Rule.min(3).error("Alt text must be between 3 and 50 characters"),
            Rule.max(50).warning("Shorter alt text are usually better"),
          ],
        },
      ],
    },
    {
      title: "Image Tags",
      name: "tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
      validation: (Rule: any) =>
        Rule.required().error("At least one tag is required"),
    },
    {
      title: "Tags String",
      name: "tagsString",
      type: "string",
      hidden: true,
      options: {
        source: (data) => data.tags.join(" "),
      },
    },
  ],
};

export default gallerySchema;
