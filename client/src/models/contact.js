/**
 * Získá všechny kontakty vytvořené aktuálně přihlášeným uživatelem
 * Získá token z `localStorage`, pokud token neexistuje, vrátí `null`.
 * Pokud token existuje, pošle request na server.
 */
export const getAllContacts = async () => {
    const token = localStorage.getItem("token");

    if (!token) return null;

    const req = await fetch("http://localhost:3000/contact", {
        headers: {
            Authorization: `Bearer ${token}`, 
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: "GET"
    })

    const data = await req.json();

    return {
        status: req.status,
        message: data.message,
        payload: data.payload
    };
}

/**
 * Získá specifický kontakt vytvořený aktuálně přihlášeným uživatelem
 * Získá token z `localStorage`, pokud token neexistuje, vrátí `null`.
 * Pokud token existuje, pošle request na server.
 * @param {Object} id - ID kontaktu
 */
export const getContactById = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) return null;

    const req = await fetch(`http://localhost:3000/contact/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`, 
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: "GET"
    })

    const data = await req.json();

    return {
        status: req.status,
        message: data.message,
        payload: data.payload
    };
}

/**
 * Vytvoří nový kontakt
 * Získá token z `localStorage`, pokud token neexistuje, vrátí `null`.
 * Pokud token existuje, pošle request na server.
 * @param {Object} formData - Data kontaktu
 */
export const createContact = async (formData) => {
    const token = localStorage.getItem("token");

    if (!token) return null;

    const req = await fetch("http://localhost:3000/contact", {
        headers: {
            Authorization: `Bearer ${token}`, 
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(formData)  
    })

    const data = await req.json();

    return {
        status: req.status,
        message: data.message,
        payload: data.payload
    };
}

/**
 * Upraví specifický kontakt vytvořený aktuálně přihlášeným uživatelem
 * Získá token z `localStorage`, pokud token neexistuje, vrátí `null`.
 * Pokud token existuje, pošle request na server.
 * @param {Object} id - ID kontaktu
 * @param {Object} formData - Data kontaktu
 */
export const updateContact = async (id, formData) => {
    const token = localStorage.getItem("token");

    if (!token) return null;

    const req = await fetch(`http://localhost:3000/contact/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`, 
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: "PUT",
        body: JSON.stringify(formData)  
    })

    const data = await req.json();

    return {
        status: req.status,
        message: data.message,
        payload: data.payload
    };
}

/**
 * Smaže specifický kontakt vytvořený aktuálně přihlášeným uživatelem
 * Získá token z `localStorage`, pokud token neexistuje, vrátí `null`.
 * Pokud token existuje, pošle request na server.
 * @param {Object} id - ID kontaktu
 */
export const deleteContact = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) return null;

    const req = await fetch(`http://localhost:3000/contact/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`, 
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: "DELETE"
    })

    const data = await req.json();

    return {
        status: req.status,
        message: data.message,
        payload: data.payload
    };
}