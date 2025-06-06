const API_BASE_URL = "http://localhost:3000/api"; // ou ton vrai backend
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjcsInVzZXJuYW1lIjoic3lyaW5lc21hdGlpIiwiaWF0IjoxNzQ5MTQ2NDA2LCJleHAiOjE3NDkyMzI4MDZ9.6HcZb3b_mBLLh8enAx9hbun5asVgxKwk3m8poLetiGk"; // Remplace-le à la main pour l'instant

export const fetchWorkers = async () => {
  const res = await fetch(`${API_BASE_URL}/workers`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch workers");
  return res.json();
};

export const createWorker = async (data: FormData) => {
  const res = await fetch(`${API_BASE_URL}/workers`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
    body: data,
  });
  if (!res.ok) throw new Error("Failed to create worker");
  return res.json();
};

export const updateWorkerStatus = async (id: number, status: "ACTIVE" | "INACTIVE") => {
  const res = await fetch(`${API_BASE_URL}/workers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ employment_status: status }),
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
};
