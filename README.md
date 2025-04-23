![Logo](https://raw.githubusercontent.com/rbrdlik/iFaktura-app-rocnikova-prace/refs/heads/main/client/src/assets/logo/IFakturaLogoWhite.png?token=GHSAT0AAAAAADBRHCW3WY3NQLYZBE24NCZQ2AIXWQA)

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
cd iFaktura-app-rocnikova-prace
```

2. **Otevření ve Visual Studio Code**
- Spusťe VS Code ve složce projektu:

```bash
code .
```
- V rámci VS Code si otevři dvě terminálová okna (např. dva GitBash panely) – jeden pro backend a druhý pro frontend.

3. **Backend (server)**
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

4. **Frontend (client)**

```bash
cd ../client
npm install
```

5. **Spuštění aplikace**

- Spuštění backendu:
```bash
cd server
npm start
```

- Spustění frontendu:
```bash
cd client
npm run dev
```

- Otevření aplikace: 
http://localhost:5173

