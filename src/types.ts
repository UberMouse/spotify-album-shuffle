import { z } from "zod";

export const SpotifyTokenSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  scope: z.string(),
  expires_in: z.string(),
  refresh_token: z.string(),
});
export type SpotifyToken = z.infer<typeof SpotifyTokenSchema>;

export type Paginate<T> = {
  items: T[];
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
};
