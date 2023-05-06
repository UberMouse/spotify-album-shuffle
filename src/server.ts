import querystring from "querystring";

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fetch from "node-fetch";

import { SpotifyToken } from "./types";

dotenv.config();

function encodeFormData(data: Record<string, string>): string {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const router = express.Router();
router.get("/login", async (_req, res) => {
  const scope = `user-modify-playback-state
    user-read-playback-state
    user-read-currently-playing
    user-library-modify
    user-library-read
    user-top-read
    playlist-read-private
    playlist-modify-public`;

  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: process.env.CLIENT_ID,
        scope: scope,
        redirect_uri: process.env.SERVER_REDIRECTURI,
      })
  );
});
router.get("/logged", async (req, res) => {
  const body = {
    grant_type: "authorization_code",
    code: req.query.code as string,
    redirect_uri: process.env.SERVER_REDIRECTURI!,
    client_id: process.env.CLIENT_ID!,
    client_secret: process.env.CLIENT_SECRET!,
  };

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: encodeFormData(body),
  });
  const data: SpotifyToken = await response.json();

  const query = querystring.stringify(data);
  res.redirect(`${process.env.CLIENT_REDIRECTURI}?${query}`);
});
router.get("/refresh", async (req, res) => {
  const refresh_token = req.query.refresh_token as string;
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.CLIENT_ID! + ":" + process.env.CLIENT_SECRET!
        ).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: encodeFormData({
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    }),
  });

  res.send(await response.text());
});

app.use("/api", cors(), router);
app.listen(process.env.PORT ?? 8888, () => {
  console.log(`Server running at http://localhost:${process.env.PORT ?? 8888}`);
});
