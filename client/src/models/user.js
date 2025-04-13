/**
 * Registruje nového uživatele, pošle request na server, který uloží `formData` do databáze.
 * Uloží token do `localStorage`.
 * @param {Object} formData - Data obsahující informace o novém uživateli (jméno, příjmení, e-mail, heslo, atd..).
 */
export const registerUser = async (formData) => {
  const req = await fetch("http://localhost:3000/user/register", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(formData),
  });
  const data = await req.json();

  if (req.status === 201) {
    localStorage.setItem("token", data.token);
  }

  return {
    status: req.status,
    message: data.message,
    payload: data.payload,
    token: data.token,
  };
};

/**
 * Přihlásí uživatele, pošle request na server, který ověří správnost údajů.
 * Uloží token do `localStorage`.
 * @param {Object} formData - Data obsahující informace o uživateli (e-mail & heslo).
 */
export const loginUser = async (formData) => {
  const req = await fetch("http://localhost:3000/user/login", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(formData),
  });
  const data = await req.json();

  if (req.status === 200) {
    localStorage.setItem("token", data.token);
  }

  return {
    status: req.status,
    message: data.message,
    payload: data.payload,
    token: data.token,
  };
};

/**
 * Vezme data uživatele.
 * Získá token z `localStorage`, pokud token neexistuje, vrátí `null`.
 * Pokud token existuje, pošle request na server a ten vrátí data uživatele.
 */
export const getUser = async () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const req = await fetch("http://localhost:3000/user", {
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
 * Upraví data uživatele
 * Získá token z `localStorage`, pokud token neexistuje, vrátí `null`.
 * Pokud token existuje, pošle request na server a ten upraví data uživatele
 * @param {Object} id - ID uživatele, kterému chceme upravit data
 * @param {Object} formData - Data obsahující informace o uživateli (ičo, detailsName, street, city, atd..).
 */
export const updateUser = async (id, formData) => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const req = await fetch(`http://localhost:3000/user/${id}`, {
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
 * Zkontroluje správnost hesla
 * Získá token z `localStorage`, pokud token neexistuje, vrátí `null`.
 * Pokud token existuje, pošle request na server a ten porovná zadané heslo s uloženým heslem.
 * @param {Object} password -- Uživatelem zadané heslo k ověření
 * @returns
 */
export const verifyUserPassword = async (password) => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const req = await fetch("http://localhost:3000/user/verifyPassword", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ password: password }),
  });
  const data = await req.json();

  return {
    status: req.status,
    message: data.message,
    payload: data.payload,
  };
};

/**
 * Smaže uživatele
 * Získá token z `localStorage`, pokud token neexistuje, vrátí `null`.
 * Pokud token existuje, pošle request na server a ten smaže data uživatele
 * @param {Object} id - ID uživatele, kterému chceme upravit data
 */
export const deleteUser = async (id) => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const req = await fetch(`http://localhost:3000/user/${id}`, {
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
