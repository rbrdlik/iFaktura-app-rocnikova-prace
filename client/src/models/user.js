/**
 * Registruje nového uživatele, pošle request na server, který uloží `formData` do databáze.
 * Uloží token do `localStorage`.
 * @param {Object} formData - Data obsahující informace o novém uživateli (jméno, příjmení, e-mail, heslo, atd..).
 */
export const registerUser = async (formData) => {
    const req = await fetch("http://localhost:3000/user/register", {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(formData)
    });
    const data = await req.json();

    if(req.status === 201){
        localStorage.setItem("token", data.token)
    }

    return{
        status: req.status,
        message: data.message,
        payload: data.payload
    }
}

/**
 * Přihlásí uživatele, pošle request na server, který ověří správnost údajů.
 * Uloží token do `localStorage`.
 * @param {Object} formData - Data obsahující informace o uživateli (e-mail & heslo).
 */
export const loginUser = async (formData) => {
    const req = await fetch("http://localhost:3000/user/login", {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(formData)
    });
    const data = await req.json();

    if(req.status === 200){
        localStorage.setItem("token", data.token)
    }

    return{
        status: req.status,
        message: data.message,
        payload: data.payload
    }
}