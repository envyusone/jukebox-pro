import { getUserById } from "#db/queries/users";
import { verifyToken } from "#utils/jwt";

export default async function getUserFromToken(req, res, next) {
  const authHeader = req.get("authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];
  
  try {
    const payload = verifyToken(token);
    
    if (payload && payload.id) {
      const user = await getUserById(payload.id);
      if (user) {
        req.user = user; 
      }
    }
    next();
  } catch (error) {
    next();
  }
}
