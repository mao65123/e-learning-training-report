import type { Context } from "@netlify/edge-functions";

const CREDENTIALS = {
  username: "aoiumi",
  password: "aoiumi",
};

export default async function handler(request: Request, context: Context) {
  const authorization = request.headers.get("authorization");

  if (authorization) {
    const [scheme, encoded] = authorization.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = atob(encoded);
      const [username, password] = decoded.split(":");
      if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
        return context.next();
      }
    }
  }

  return new Response("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Restricted"',
    },
  });
}

export const config = {
  path: "/*",
};
