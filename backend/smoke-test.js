const app = require('./index');

async function request(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`${options.method || 'GET'} ${path} failed: ${response.status} ${JSON.stringify(data)}`);
  }

  return data;
}

async function expectFailure(baseUrl, path, options, expectedStatus) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (response.status !== expectedStatus) {
    const data = await response.json();
    throw new Error(`Expected ${expectedStatus}, got ${response.status}: ${JSON.stringify(data)}`);
  }
}

async function runSmokeTest() {
  const server = app.listen(0);

  try {
    const { port } = server.address();
    const baseUrl = `http://127.0.0.1:${port}`;

    const admin = await request(baseUrl, '/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ login: 'admin', password: 'admin123' }),
    });
    const operator = await request(baseUrl, '/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ login: 'operator', password: 'operator123' }),
    });
    const adminHeaders = { Authorization: `Bearer ${admin.token}` };
    const operatorHeaders = { Authorization: `Bearer ${operator.token}` };

    await expectFailure(baseUrl, '/api/users', {
      headers: { 'x-user-role': 'admin' },
    }, 401);
    await expectFailure(baseUrl, '/api/incidents', {
      method: 'POST',
      headers: operatorHeaders,
      body: JSON.stringify({
        title: 'Forbidden operator incident',
        category: 'Контроль доступа',
        zone: 'Тестовая зона',
        threatLevel: 'Низкий',
        status: 'Открыт',
        operator: 'Тестовый оператор',
        description: 'This request must be rejected',
      }),
    }, 403);

    const initialIncidents = await request(baseUrl, '/api/incidents?limit=5&offset=0');
    const createdIncident = await request(baseUrl, '/api/incidents', {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        title: 'Smoke test incident',
        category: 'Контроль доступа',
        zone: 'Тестовая зона',
        threatLevel: 'Низкий',
        status: 'Открыт',
        operator: 'Тестовый оператор',
        description: 'Created by backend smoke test',
      }),
    });

    const loadedIncident = await request(baseUrl, `/api/incidents/${createdIncident.id}`);
    const statusUpdated = await request(baseUrl, `/api/incidents/${createdIncident.id}/status`, {
      method: 'PATCH',
      headers: operatorHeaders,
      body: JSON.stringify({ status: 'В обработке' }),
    });
    const updatedIncident = await request(baseUrl, `/api/incidents/${createdIncident.id}`, {
      method: 'PUT',
      headers: adminHeaders,
      body: JSON.stringify({
        ...loadedIncident,
        status: 'Закрыт',
      }),
    });
    const createdUser = await request(baseUrl, '/api/users', {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        login: `smoke_${Date.now()}`,
        password: 'test123',
        role: 'operator',
      }),
    });
    await request(baseUrl, `/api/users/${createdUser.id}`, {
      method: 'DELETE',
      headers: adminHeaders,
    });
    const deletedIncident = await request(baseUrl, `/api/incidents/${createdIncident.id}`, {
      method: 'DELETE',
      headers: adminHeaders,
    });
    const finalIncidents = await request(baseUrl, '/api/incidents?limit=5&offset=0');

    console.log('RBAC smoke test passed');
    console.log('Forged x-user-role header rejected');
    console.log('Operator admin action rejected');
    console.log(`Admin role: ${admin.role}`);
    console.log(`Operator role: ${operator.role}`);
    console.log(`Initial page count: ${initialIncidents.length}`);
    console.log(`Created incident id: ${createdIncident.id}`);
    console.log(`Operator status update: ${statusUpdated.status}`);
    console.log(`Admin full update: ${updatedIncident.status}`);
    console.log(`Delete message: ${deletedIncident.message}`);
    console.log(`Final page count: ${finalIncidents.length}`);
  } finally {
    server.close();
  }
}

runSmokeTest().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
