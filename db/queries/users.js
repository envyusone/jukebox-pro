import db from "#db/client";

/** Creates a new user */
export async function createUser(username, password) {
  const sql = `
    INSERT INTO users (username, password)
    VALUES ($1, $2)
    RETURNING id, username
  `;
  const { rows: [user] } = await db.query(sql, [username, password]);
  return user;
}

/** Finds a user by username for login verification */
export async function getUserByUsername(username) {
  const sql = `SELECT * FROM users WHERE username = $1`;
  const { rows: [user] } = await db.query(sql, [username]);
  return user;
}

/** Finds a user by ID for the auth middleware */
export async function getUserById(id) {
  const sql = `SELECT id, username FROM users WHERE id = $1`;
  const { rows: [user] } = await db.query(sql, [id]);
  return user;
}
