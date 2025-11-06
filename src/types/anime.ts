export type Anime = {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  synopsis: string;
};

export type AnimeSearchResponse = {
  data: Anime[];
  pagination: {
    current_page: number;
    last_visible_page: number;
  };
};
