const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function handleResponse(response) {
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    let message = 'Request failed';
    try {
      const data = JSON.parse(text);
      message = data?.error || message;
    } catch {
      if (text) message = text;
    }
    throw new Error(message);
  }
  if (response.status === 204) return null;
  return response.json();
}

export async function getItems() {
  const res = await fetch(`${BASE_URL}/api/items`);
  return handleResponse(res);
}

export async function createItem(title) {
  const res = await fetch(`${BASE_URL}/api/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  return handleResponse(res);
}

export async function updateItem(id, title) {
  const res = await fetch(`${BASE_URL}/api/items/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  return handleResponse(res);
}

export async function deleteItem(id) {
  const res = await fetch(`${BASE_URL}/api/items/${id}`, { method: 'DELETE' });
  return handleResponse(res);
}
