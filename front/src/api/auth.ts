export async function registerUser(data: any) {
  const response = await fetch('http://localhost:3000/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function loginUser(credentials: any) {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return response.json(); // Vai retornar o token JWT
}

export async function getProducts(token: string) {
  const response = await fetch('http://localhost:3000/products', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
}

export async function editProduct(id: number, data: any, token: string) {
  const response = await fetch(`http://localhost:3000/products/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deleteProduct(id: number, token: string) {
  const response = await fetch(`http://localhost:3000/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.ok;
}