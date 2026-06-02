const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export async function getMovies() {
  const res = await fetch(`${BASE_URL}/api/movies`, { cache: "no-store" });
  return res.json();
}

export async function createMovie(payload) {
  const res = await fetch(`${BASE_URL}/api/movies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function login(payload) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function register(payload) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}
