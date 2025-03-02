export interface TikTokResponse {
  code: number;
  msg: string;
  data: {
    id: string;
    title: string;
    cover: string;
    play: string;
    wmplay: string;
    hdplay: string;
    music: string;
    music_info: {
      title: string;
      author: string;
      duration: number;
    };
    author: {
      id: string;
      unique_id: string;
      nickname: string;
      avatar: string;
    };
  };
}

export interface SearchResponse {
  code: number;
  msg: string;
  processed_time: number;
  data: {
    videos: Array<{
      video_id: string;
      region: string;
      title: string;
      cover: string;
      duration: number;
      play: string;
      wmplay: string;
      size: number;
      wm_size: number;
      music: string;
      music_info: {
        id: string;
        title: string;
        play: string;
        author: string;
        original: boolean;
        duration: number;
        album: string;
      };
      play_count: number;
      digg_count: number;
      comment_count: number;
      share_count: number;
      download_count: number;
      create_time: number;
      author: {
        id: string;
        unique_id: string;
        nickname: string;
        avatar: string;
      };
      id: string;
    }>;
    cursor: number;
    hasMore: boolean;
  };
}

export interface VideoData {
  thumbnail: string;
  author: string;
  authorNickname: string;
  authorAvatar: string;
  description: string;
  duration: string;
  noWatermark?: string;
  withWatermark?: string;
  audio?: string;
  hd?: string;
} 