# Frontend GT-Garage

Aplicația React pentru site-ul GT-Garage. Ghidul complet de configurare, pornire locală și structură se află în [README-ul principal](../README.md).

## Comenzi

Din acest director:

```powershell
npm install
npm start
npm run build
npm test -- --watchAll=false
```

Configurează `REACT_APP_BACKEND_URL` în `frontend/.env`, de exemplu `http://localhost:8000`. În prezent nu există teste frontend; comanda `npm test` va raporta că nu a găsit teste până la adăugarea lor.
