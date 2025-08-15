export interface InstagramUser {
  username: string;
  full_name?: string;
  profile_pic_url?: string;
}

export interface FollowersData {
  relationships_followers?: Array<{
    string_list_data: Array<{
      href: string;
      value: string;
      timestamp: number;
    }>;
  }>;
}

export interface FollowingData {
  relationships_following?: Array<{
    string_list_data: Array<{
      href: string;
      value: string;
      timestamp: number;
    }>;
  }>;
}

export interface ProcessedData {
  followers: string[];
  following: string[];
  notFollowingBack: string[];
  mutualFollowers: string[];
}

export type InputMethod = 'json' | 'text' | 'html';