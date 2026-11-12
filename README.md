# GT-Garage

Site web pentru un atelier auto, cu prezentarea serviciilor, formular de contact, programări online și panou de administrare.

## Funcționalități

- Pagina publică cu servicii, informații despre atelier și date de contact.
- Formular pentru solicitări de informații.
- Programări cu selectarea serviciului, datei, orei și datelor mașinii.
- Calendar care dezactivează duminicile și intervalele blocate de administrator.
- Panou administrativ pentru programări, mesaje și servicii.
- Autentificare admin cu parolă, cookie-uri HTTP-only și limitarea încercărilor de autentificare.
- Notificări prin e-mail pentru programări și mesaje, prin integrarea configurată în backend.

## Tehnologii

- Frontend: React, React Router, Tailwind CSS și CRACO.
- Backend: FastAPI, Motor și MongoDB.
- Autentificare: JWT în cookie-uri HTTP-only și parole hash-uite cu bcrypt.

## Cerințe

- Python 3.10 sau mai nou.
- Node.js și npm (Node 18 LTS recomandat pentru CRA).
- O instanță MongoDB locală sau la distanță.

## Configurare

### Backend

Creează `backend/.env` (nu îl adăuga în Git) și configurează:

```dotenv
MONGO_URL=mongodb://localhost:27017
DB_NAME=gt_garage
JWT_SECRET=replace-with-a-long-random-secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-a-unique-password-of-at-least-12-characters
EMAIL_FROM_NAME=GT-Garage
EMERGENT_EMAIL_KEY=replace-with-email-integration-key
OWNER_EMAIL=admin@example.com
```

`MONGO_URL`, `DB_NAME`, `JWT_SECRET`, `FIELD_ENCRYPTION_KEY`, `ADMIN_PASSWORD`, `EMAIL_FROM_NAME` și `EMERGENT_EMAIL_KEY` sunt necesare pentru funcționarea configurației curente. `OWNER_EMAIL` este opțional; fără el nu se trimit notificări administrative pentru mesaje și programări.

### Criptarea câmpurilor sensibile

Backendul criptează în MongoDB, cu Fernet, marca, modelul, numărul de înmatriculare, anul fabricației, e-mailul și telefonul din programări, precum și e-mailul și telefonul din mesajele de contact. Backendul folosește valorile lizibile pentru răspunsurile panoului de administrare și notificările necesare. Numele, mesajul liber și câmpul `vehicle` din solicitările de contact nu sunt incluse în această listă.

Generează local cheia fără să o afișezi în terminal:

```powershell
python backend\generate_field_encryption_key.py
```

Scriptul adaugă `FIELD_ENCRYPTION_KEY` în `backend/.env` numai dacă nu există deja și refuză să înlocuiască o cheie existentă. Fișierul `.env` este exclus din Git. În producție, configurează aceeași cheie în managerul de secrete al mediului care rulează backendul — nu în frontend și nu în codul repository-ului. Pierderea sau schimbarea cheii fără decriptarea și recriptarea datelor face aceste câmpuri irecuperabile.

Dacă cheia a fost expusă și nu există date criptate cu ea, o poți înlocui local fără să fie afișată:

```powershell
python backend\generate_field_encryption_key.py --rotate
```

Nu folosi `--rotate` dacă date au fost deja criptate cu cheia veche; ele trebuie mai întâi decriptate și recriptate cu cheia nouă.

Pentru a cripta și datele salvate înainte de această modificare:

1. Fă un backup verificat al bazei de date.
2. Configurează `FIELD_ENCRYPTION_KEY` pentru backend și pentru procesul de migrare, folosind aceeași valoare.
3. Publică versiunea nouă a backendului și frontendului, ca aplicația să cripteze noile înregistrări și să recunoască datele vechi.
4. Din directorul proiectului, cu `MONGO_URL`, `DB_NAME` și cheia setate pentru baza de date țintă, rulează mai întâi simularea:
   ```powershell
   python backend\migrate_sensitive_data.py
   ```
5. Dacă numărul de documente raportat este cel așteptat și backupul este disponibil, aplică migrarea:
   ```powershell
   python backend\migrate_sensitive_data.py --apply
   ```

Migrarea este reluabilă și mută vechiul câmp `mileage` al programărilor în `vehicle_plate`. Păstrează cheia în siguranță împreună cu backupurile; nu o schimba și nu o pierde.

Parola admin trebuie să aibă între 12 și 72 de octeți UTF-8. La pornire, backendul setează parola contului admin din `ADMIN_PASSWORD`; schimbarea valorii din fișier schimbă parola la următoarea pornire. Folosește o parolă aleatorie, unică și păstreaz-o într-un manager de parole.

Opțional, configurează `CORS_ORIGINS` ca listă de origini separate prin virgulă și `FRONTEND_URL` pentru domeniul frontendului. În producție, folosește HTTPS și setează `COOKIE_SECURE=true`. Pentru `COOKIE_SAMESITE=none`, `COOKIE_SECURE=true` este obligatoriu.

### Frontend

Creează `frontend/.env`:

```dotenv
REACT_APP_BACKEND_URL=http://localhost:8000
```

Adresa trebuie să fie originea backendului, fără sufixul `/api`.

## Pornire locală

Deschide două terminale din directorul proiectului.

Terminalul 1 — backend:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn server:app --reload --host 127.0.0.1 --port 8000
```

Terminalul 2 — frontend:

```powershell
cd frontend
npm install
npm start
```

Frontendul este disponibil la `http://localhost:3000`, iar API-ul la `http://localhost:8000/api`.

## Comenzi utile

Din `frontend/`:

```powershell
npm start
npm run build
npm test -- --watchAll=false
```

Din `backend/`:

```powershell
python -m uvicorn server:app --reload
python -m pytest
```

În configurația actuală nu există încă fișiere de test automat în `frontend/src` sau `tests/`. Comenzile de test sunt incluse pentru când vor fi adăugate teste.

## Structura proiectului

```text
backend/       API FastAPI, autentificare, acces MongoDB și notificări
frontend/      Aplicația React și fișierele publice
scripts/       Utilitare locale pentru proiect
tests/         Pachet pregătit pentru teste backend
```

Fișierele `.env`, build-ul frontendului, datele locale din `.emergent/` și `memory/`, rapoartele generate din `test_reports/pytest/` și `test_result.md` sunt excluse din Git.

## Arhivarea proiectului

Pentru a crea o arhivă fără dependențe instalate, build-uri sau fișiere `.env`:

```powershell
python scripts\make_project_zip.py
```

Arhiva `project.zip` este creată în directorul rădăcină și nu trebuie publicată dacă include date pe care nu dorești să le distribui.
