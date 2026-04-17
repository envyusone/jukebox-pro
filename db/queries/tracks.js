import db from "#db/client";

export async function createTrack(name, duration_ms) {
  const { rows: [track] } = await db.query(
    "INSERT INTO tracks (name, duration_ms) VALUES ($1, $2) RETURNING *",
    [name, duration_ms]
  );
  return track;
}

export async function getTracks() {
  const { rows: tracks } = await db.query("SELECT * FROM tracks");
  return tracks;
}

export async function getTrackById(id) {
  const { rows: [track] } = await db.query("SELECT * FROM tracks WHERE id = $1", [id]);
  return track;
}

export async function getTracksByPlaylistId(playlistId) {
  const sql = `
    SELECT tracks.* FROM tracks
    JOIN playlists_tracks ON tracks.id = playlists_tracks.track_id
    WHERE playlists_tracks.track_id = $1
  `;
  const { rows: tracks } = await db.query(sql, [playlistId]);
  return tracks;
}
