/**
 * Získá všechny faktury vytvořené aktuálně přihlášeným uživatelem
 * Získá token z `localStorage`, pokud token neexistuje, vrátí `null`.
 * Pokud token existuje, pošle request na server.
 */
export const getAllInvoices = async () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const req = await fetch("http://localhost:3000/invoice", {
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
 * Získá specifickou fakturu vytvořenou aktuálně přihlášeným uživatelem
 * Získá token z `localStorage`, pokud token neexistuje, vrátí `null`.
 * Pokud token existuje, pošle request na server.
 * @param {Object} id - ID faktury
 */
export const getInvoiceById = async (id) => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const req = await fetch(`http://localhost:3000/invoice/${id}`, {
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
 * Vytvoří novou fakturu
 * Získá token z `localStorage`, pokud token neexistuje, vrátí `null`.
 * Pokud token existuje, pošle request na server.
 * @param {Object} formData - Data faktury
 */
export const createInvoice = async (formData) => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const req = await fetch("http://localhost:3000/invoice", {
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
 * Upraví specifickou fakturu vytvořenou aktuálně přihlášeným uživatelem
 * Získá token z `localStorage`, pokud token neexistuje, vrátí `null`.
 * Pokud token existuje, pošle request na server.
 * @param {Object} id - ID faktury
 * @param {Object} formData - Data faktury
 */
export const updateInvoice = async (id, formData) => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const req = await fetch(`http://localhost:3000/invoice/${id}`, {
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
 * Smaže specifickou fakturu vytvořenou aktuálně přihlášeným uživatelem
 * Získá token z `localStorage`, pokud token neexistuje, vrátí `null`.
 * Pokud token existuje, pošle request na server.
 * @param {Object} id - ID faktury
 */
export const deleteInvoice = async (id) => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const req = await fetch(`http://localhost:3000/invoice/${id}`, {
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
