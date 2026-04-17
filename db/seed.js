import db from "#db/client";
import bcrypt from "bcrypt";

import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";
// Ensure you have this query function created!
import { createUser } from "#db/queries/users"; 

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  console.log("Clearing tables...");
  await db.query("TRUNCATE users, playlists, tracks, playlists_tracks RESTART IDENTITY CASCADE");

  // 1. Seed at least 2 users with hashed passwords
  console.log("Seeding users...");
  const users = [];
  const password = await bcrypt.hash("password123", 10);
  
  users.push(await createUser("alice", password));
  users.push(await createUser("bob", password));

  // 2. Seed some tracks (need at least 10 for the requirements)
  console.log("Seeding tracks...");
  const tracks = [];
  for (let i = 1; i <= 20; i++) {
    const track = await createTrack(`Track ${i}`, i * 60000);
    tracks.push(track);
  }

  // 3. Seed at least 1 playlist for each user
  console.log("Seeding playlists...");
  for (const user of users) {
    const playlist = await createPlaylist(
      `${user.username}'s Favorites`, 
      `A playlist for ${user.username}`, 
      user.id // Pass the new required user_id
    );

    // 4. Each playlist must contain at least 5 tracks
    console.log(`Adding 5 tracks to ${user.username}'s playlist...`);
    for (let i = 0; i < 5; i++) {
      const trackIndex = (user.id - 1) * 5 + i;
      await createPlaylistTrack(playlist.id, tracks[trackIndex].id);
    }
  }
}
