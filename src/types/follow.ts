export interface FollowResponse {
  id: number;
  status: FollowStatus;
  message: string;
}

export enum FollowStatus {
  ACCEPTED = "ACCEPTED",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
}

export interface Follow {
  id: number;
  follower_id: number;
  followed_id: number;
  status: FollowStatus;
  created_at: string;
  updated_at: string;
  follower: {
    id: number;
    username: string;
    full_name: string;
    profile_image: string;
  };
}
