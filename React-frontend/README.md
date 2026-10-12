# Album Collection

Interfaccia React per consultare artisti, album e generi. I componenti React si trovano in `src/`; l'applicazione parla con il backend Spring tramite l'indirizzo configurato in `VITE_EXPRESS_API_SERVER`.

## Struttura del frontend

- `src/App.jsx` dichiara le rotte e distingue le pagine pubbliche dalle pagine riservate agli amministratori.
- `src/layout/AppLayout.jsx` compone intestazione, contenuto della rotta, sfondo animato e footer.
- `src/context/` condivide nel tree React il ruolo ricavato dal JWT.
- `src/pages/` contiene le schermate: ciascuna pagina carica o salva dati e coordina i componenti visuali.
- `src/components/` contiene moduli, schede e parti condivise come header e sfondo musicale.
- `src/utils/apiFetch.js` aggiunge il JWT alle richieste API quando è presente nel browser.
- `src/index.css` contiene regole globali, disposizione del fondale e animazioni.

## Comandi definiti in `package.json`

`package.json` è JSON, quindi non supporta commenti al suo interno. Le descrizioni dei suoi script sono riportate qui:

- `npm run dev` avvia il server Vite per lo sviluppo locale.
- `npm run build` crea la versione compilata dentro `dist/`.
- `npm run lint` esegue ESLint sui sorgenti e segnala problemi di stile o uso del codice.
- `npm run preview` serve localmente la versione già compilata.

`package-lock.json` è generato da npm e fissa le versioni precise delle dipendenze: non si modifica a mano né si inseriscono commenti.
