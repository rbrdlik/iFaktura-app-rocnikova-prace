
## Co je iFaktura?

**iFaktura** je webová aplikace pro vytváření faktur a jejich export do formátu PDF. 

## ❔ Jak aplikace funguje
1. **Registrace a přihlášení**
Uživatel si vytvoří účet a přihlásí se do aplikace. 

2. **Nastavení údajů**
Po přihlášení si uživatel musí nastavit své fakturační údaje (Jméno/Název firmy, IČO, Adresa atd.)

3. **Vytvoření kontaktu odběratele**
Pro vytvoření faktury je nejprve nutno vytvořit alespoň jednoho odběratele.

4. **Vytvoření šablon položek (nepovinné)**
Uživatel si může vytvořit šablony čašto používaných položek pro snadnější opakované použití.

## 🛠️ Instalace

### Požadavky
- [MongoDB](https://www.mongodb.com/)
- [Node.js](https://nodejs.org/en)

### Postup instalace

1. **Klonování repozitáře**
```bash
git clone https://github.com/rbrdlik/iFaktura-app-rocnikova-prace.git
cd ifaktura
```

2. **Backend (server)**
```bash
cd server
npm install
```

- Vytvořte složku `uploads` ve složce `server`
- Vytvořte soubor `.env` a přidejte následující:

```env
MONGODB_URL=""  # URL MongoDB clusteru
TOKEN_KEY=""    # Libovolný tajný klíč pro JWT
```

3. **Frontend (client)**

```bash
cd ../client
npm install
```

4. **Spuštění aplikace**

- Spuštění backendu:
```bash
cd ../server
npm start
```

- Spustění frontendu:
```bash
cd ../client
npm run dev
```
- A otevřít na http://localhost:5173

