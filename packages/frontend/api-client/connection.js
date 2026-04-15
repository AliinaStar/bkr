import { EXPO_PUBLIC_API_URL } from "@env";

export async function checkHealth() {
  const response = await fetch(`${EXPO_PUBLIC_API_URL}/health`);
  return response.json();
}