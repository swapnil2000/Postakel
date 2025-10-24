const API_BASE_URL = import.meta.env.VITE_API_URL;

// --- Auth ---
export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw await res.json();
  return await res.json();
}

// --- Menu CRUD ---
export async function fetchMenus(restaurantId: string, token: string) {
  const res = await fetch(
    `${API_BASE_URL}/menu/${restaurantId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function createMenuItem(restaurantId: string, token: string, item: any) {
  const res = await fetch(
    `${API_BASE_URL}/menu/${restaurantId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(item),
    }
  );
  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function updateMenuItem(restaurantId: string, token: string, itemId: string, item: any) {
  const res = await fetch(
    `${API_BASE_URL}/menu/${restaurantId}/${itemId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(item),
    }
  );
  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function deleteMenuItem(restaurantId: string, token: string, itemId: string) {
  const res = await fetch(
    `${API_BASE_URL}/menu/${restaurantId}/${itemId}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw await res.json();
  return await res.json();
}

// --- Orders ---
export async function fetchOrders(restaurantId: string, token: string) {
  const res = await fetch(
    `${API_BASE_URL}/orders/${restaurantId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function createOrder(restaurantId: string, token: string, order: any) {
  const res = await fetch(
    `${API_BASE_URL}/orders/${restaurantId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(order),
    }
  );
  if (!res.ok) throw await res.json();
  return await res.json();
}

// --- Staff CRUD ---
export async function fetchStaff(restaurantId: string, token: string) {
  const res = await fetch(
    `${API_BASE_URL}/staff/${restaurantId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function addStaff(restaurantId: string, token: string, staff: any) {
  const res = await fetch(
    `${API_BASE_URL}/staff/${restaurantId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(staff),
    }
  );
  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function updateStaff(restaurantId: string, token: string, staffId: string, staff: any) {
  const res = await fetch(
    `${API_BASE_URL}/staff/${restaurantId}/${staffId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(staff),
    }
  );
  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function deleteStaff(restaurantId: string, token: string, staffId: string) {
  const res = await fetch(
    `${API_BASE_URL}/staff/${restaurantId}/${staffId}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw await res.json();
  return await res.json();
}

// --- Table Management ---
export async function fetchTables(restaurantId: string, token: string) {
  const res = await fetch(
    `${API_BASE_URL}/tables/${restaurantId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function addTable(restaurantId: string, token: string, table: any) {
  const res = await fetch(
    `${API_BASE_URL}/tables/${restaurantId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(table),
    }
  );
  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function updateTable(restaurantId: string, token: string, tableId: string, table: any) {
  const res = await fetch(
    `${API_BASE_URL}/tables/${restaurantId}/${tableId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(table),
    }
  );
  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function deleteTable(restaurantId: string, token: string, tableId: string) {
  const res = await fetch(
    `${API_BASE_URL}/tables/${restaurantId}/${tableId}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw await res.json();
  return await res.json();
}

// --- Dashboard Stats ---
export async function fetchDashboard(restaurantId: string, token: string, dateFilter: string = 'today') {
  const res = await fetch(
    `${API_BASE_URL}/dashboard/${restaurantId}?dateFilter=${dateFilter}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw await res.json();
  return await res.json();
}
