import express from "express";
const router = express.Router();

import {
  createPlaylist,
  getPlaylistById,
  getPlaylists, 
} from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { getTracksByPlaylistId } from "#db/queries/tracks";
import requireUser from "#middleware/requireUser"; 

router.use(requireUser);

router.get("/", async (req, res, next) => {
  try {
    const playlists = await getPlaylists(req.user.id); 
    res.send(playlists);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).send("Request body requires: name, description");
  }

  try {
    const playlist = await createPlaylist(name, description, req.user.id);
    res.status(201).send(playlist);
  } catch (error) {
    next(error);
  }
});

router.param("id", async (req, res, next, id) => {
  try {
    const playlist = await getPlaylistById(id);
    if (!playlist) return res.status(404).send("Playlist not found.");

    if (playlist.user_id !== req.user.id) {
      return res.status(403).send("Forbidden");
    }

    req.playlist = playlist;
    next();
  } catch (error) {
    next(error);
  }
});


router.get("/:id", (req, res) => {
  res.send(req.playlist);
});

router.get("/:id/tracks", async (req, res, next) => {
  try {
    const tracks = await getTracksByPlaylistId(req.playlist.id);
    res.send(tracks);
  } catch (error) {
    next(error);
  }
});

router.post("/:id/tracks", async (req, res, next) => {
  const { trackId } = req.body;
  if (!trackId) return res.status(400).send("Request body requires: trackId");

  try {
    const playlistTrack = await createPlaylistTrack(req.playlist.id, trackId);
    res.status(201).send(playlistTrack);
  } catch (error) {
    next(error);
  }
});

export default router;
