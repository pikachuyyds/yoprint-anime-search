export type Anime = {
  mal_id: number;
  title: string;
  synopsis: string | null;

  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
    };
  };

  type: string | null;
  episodes: number | null;
  status: string | null;
  duration: string | null;
  score: number | null;

  studios: { mal_id: number; name: string }[];
  genres: { mal_id: number; name: string }[];

  trailer?: {
    embed_url?: string | null;
  };

  relations?: {
    relation: string;
    entry: { mal_id: number; name: string }[];
  }[];
};

export type AnimeSearchResponse = {
  data: Anime[];
  pagination: {
    current_page: number;
    last_visible_page: number;
  };
};
