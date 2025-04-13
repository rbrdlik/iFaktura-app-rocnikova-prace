/**
 * Získá všechny produkty vytvořené aktuálně přihlášeným uživatelem
 * Získá token z `localStorage`, pokud token neexistuje, vrátí `null`.
 * Pokud token existuje, pošle request na server.
 */
export const getAllProducts = async () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const req = await fetch("http://localhost:3000/product", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  const data = await req.json();

  return {
    status: req.status,
    message: data.message,
    payload: data.payload,
  };
};

/**
 * Získá specifický produkt vytvořený aktuálně přihlášeným uživatelem
 * Získá token z `localStorage`, pokud token neexistuje, vrátí `null`.
 * Pokud token existuje, pošle request na server.
 * @param {Object} id - ID produktu
 */
export const getProductById = async (id) => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const req = await fetch(`http://localhost:3000/product/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  const data = await req.json();

  return {
    status: req.status,
    message: data.message,
    payload: data.payload,
  };
};

/**
 * Vytvoří nový produkt
 * Získá token z `localStorage`, pokud token neexistuje, vrátí `null`.
 * Pokud token existuje, pošle request na server.
 * @param {Object} formData - Data produktu
 */
export const createProduct = async (formData) => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const req = await fetch("http://localhost:3000/product", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(formData),
  });

  const data = await req.json();

  return {
    status: req.status,
    message: data.message,
    payload: data.payload,
  };
};

/**
 * Upraví specifický produkt vytvořený aktuálně přihlášeným uživatelem
 * Získá token z `localStorage`, pokud token neexistuje, vrátí `null`.
 * Pokud token existuje, pošle request na server.
 * @param {Object} id - ID produktu
 * @param {Object} formData - Data produktu
 */
export const updateProduct = async (id, formData) => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const req = await fetch(`http://localhost:3000/product/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify(formData),
  });

  const data = await req.json();

  return {
    status: req.status,
    message: data.message,
    payload: data.payload,
  };
};

/**
 * Smaže specifický produkt vytvořený aktuálně přihlášeným uživatelem
 * Získá token z `localStorage`, pokud token neexistuje, vrátí `null`.
 * Pokud token existuje, pošle request na server.
 * @param {Object} id - ID produktu
 */
export const deleteProduct = async (id) => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const req = await fetch(`http://localhost:3000/product/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "DELETE",
  });

  const data = await req.json();

  return {
    status: req.status,
    message: data.message,
    payload: data.payload,
  };
};
