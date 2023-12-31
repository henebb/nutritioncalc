const apiUrl = "https://fn-22plrgrwvmnok.azurewebsites.net/api";

let apiKey = "";

function updateApiKey(key) {
  apiKey = key;
}

async function getAllNutritions() {
  if (!apiKey) {
    return [];
  }
  const response = await fetch(`${apiUrl}/nutritions`, {
    method: "GET",
    cache: "no-store",
    headers: {
      "x-functions-key": apiKey,
    },
  });
  const json = await response.json();
  return json;
}

async function isIdAvailable(id) {
  if (!apiKey) {
    return false;
  }
  const response = await fetch(`${apiUrl}/nutritions/check/${id}`, {
    method: "GET",
    cache: "no-store",
    headers: {
      "x-functions-key": apiKey,
    },
  });
  const json = await response.json();
  return json.isAvailable;
}

async function upsertNutrition(nutrition) {
  if (!apiKey) {
    return false;
  }
  const response = await fetch(`${apiUrl}/nutritions/upsert`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "x-functions-key": apiKey,
    },
    body: JSON.stringify(nutrition),
  });

  const json = await response.json();
  return json;
}

export { getAllNutritions, upsertNutrition, isIdAvailable, updateApiKey };
