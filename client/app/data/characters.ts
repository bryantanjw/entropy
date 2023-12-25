export interface Character {
  name: string;
  image1: {
    src: string;
    imagePosition: string;
  };
  image2: {
    src: string;
    imagePosition: string;
  };
  category: string;
  origin: string;
  tags: string[];
}

export const featured: Character[] = [
  {
    name: "KDA ALL OUT Ahri",
    origin: "League of Legends",
    category: "Gaming",
    tags: ["kda all out", "ahri", "lol", "league of legends"],
    image1: {
      src: "https://cdn.sanity.io/images/6jp747p1/production/85a71bfa66e3801205d4c9db56efc896cf985231-1024x1536.jpg",
      imagePosition: "object-top",
    },
    image2: {
      src: "https://cdn.sanity.io/images/6jp747p1/production/d67fd618abb246b52a71338e7b9cb4e9e15fba70-1024x1504.jpg",
      imagePosition: "object-top",
    },
  },
  {
    name: "Miss Fortune",
    origin: "League of Legends",
    category: "Gaming",
    tags: ["miss fortune", "lol", "league of legends"],
    image1: {
      src: "https://cdn.sanity.io/images/6jp747p1/production/12e67fc858f6c8f8c478f6af9e8ba3b42fa48496-1024x1536.jpg",
      imagePosition: "object-top",
    },
    image2: {
      src: "https://cdn.sanity.io/images/6jp747p1/production/402784951d8a7deb1b63407c020ddbb8ad2857a9-800x1200.png",
      imagePosition: "object-top",
    },
  },
  {
    name: "Cyberpunk Egderunners Lucy",
    origin: "Cyberpunk Edgerunners",
    category: "Anime",
    tags: ["cyberpunk edgerunners", "lucy", "anime"],
    image1: {
      src: "https://cdn.sanity.io/images/6jp747p1/production/74de0c23824fad978fb2493b71c498f016d4d57e-1024x1536.jpg",
      imagePosition: "object-top",
    },
    image2: {
      src: "https://cdn.sanity.io/images/6jp747p1/production/11f6f29dfa1b9416727808f98d40cd02e4bee1d0-1024x1536.jpg",
      imagePosition: "object-top",
    },
  },
  {
    name: "Coven Evelynn",
    origin: "League of Legends",
    category: "Gaming",
    tags: ["coven", "evelynn", "lol", "league of legends"],
    image1: {
      src: "https://cdn.sanity.io/images/6jp747p1/production/333b31205ba3b661397608bf3cc7e133688ba102-1024x1536.jpg",
      imagePosition: "object-center",
    },
    image2: {
      src: "https://cdn.sanity.io/images/6jp747p1/production/333b31205ba3b661397608bf3cc7e133688ba102-1024x1536.jpg",
      imagePosition: "object-center",
    },
  },
];
