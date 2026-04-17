import db from "#db/client";

/** Creates a playlist owned by the provided user_id */
export async function createPlaylist(name, description, user_id) {
  const sql = `
  INSERT INTO playlists
    (name, description, user_id)
  VALUES
    ($1, $2, $3)
  RETURNING *
  `;
  const {
    rows: [playlist],
  } = await db.query(sql, [name, description, user_id]);
  return playlist;
}

/** Fetches only the playlists owned by the provided user_id */
export async function getPlaylists(user_id) {
  const sql = `
  SELECT *
  FROM playlists
  WHERE user_id = $1
  `;
  const { rows: playlists } = await db.query(sql, [user_id]);
  return playlists;
}

/** Fetches a specific playlist (the ownership check happens in the API) */
export async function getPlaylistById(id) {
  const sql = `
  SELECT *
  FROM playlists
  WHERE id = $1
  `;
  const {
    rows: [playlist],
  } = await db.query(sql, [id]);
  return playlist;
}

/** 
 * NEW: Fetches playlists owned by the user that contain a specific track 
 * Needed for: GET /tracks/:id/playlists
 */
export async function getPlaylistsByTrackAndUser(track_id, user_id) {
  const sql = `
  SELECT playlists.* 
  FROM playlists
  JOIN playlists_tracks ON playlists.id = playlists_tracks.playlist_id
  WHERE playlists_tracks.track_id = $1 AND playlists.user_id = $2
  `;
  const { rows: playlists } = await db.query(sql, [track_id, user_id]);
  return playlists;
}
