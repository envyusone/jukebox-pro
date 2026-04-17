import express from "express";
const router = express.Router();
import { getTracks, getTrackById } from "#db/queries/tracks";
import { getPlaylistsByTrackAndUser } from "#db/queries/playlists";
import requireUser from "#middleware/requireUser";

router.get("/", async (req, res, next) => {
  try {
    const tracks = await getTracks();
    res.send(tracks);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const track = await getTrackById(req.params.id);
    if (!track) return res.status(404).send("Track not found.");
    res.send(track);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/playlists", requireUser, async (req, res, next) => {
  try {
    const track = await getTrackById(req.params.id);
    if (!track) return res.status(404).send("Track not found."); // Required 404 test
    
    const playlists = await getPlaylistsByTrackAndUser(track.id, req.user.id);
    res.send(playlists);
  } catch (error) {
    next(error);
  }
});

export default router;
