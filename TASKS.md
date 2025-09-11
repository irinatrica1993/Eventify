# Piano di sviluppo per Eventify

## Stato dei task
- 🔄 In corso
- ✅ Completato
- ⏳ In attesa
- ❌ Problemi

## Fase 1: Setup e configurazione iniziale

### Task 1.1: Configurazione del database MongoDB ⏳
- Accedi al tuo account MongoDB Atlas
- Crea un nuovo cluster se non ne hai già uno
- Configura un database chiamato "eventify"
- Crea le collezioni principali: users, events, participations
- Configura le regole di sicurezza e ottieni la stringa di connessione

### Task 1.2: Configurazione del backend (NestJS) ⏳
- Configura il file di ambiente (.env) con:
  - Stringa di connessione MongoDB
  - Chiave segreta per JWT
  - Credenziali OAuth per Google
- Configura il modulo principale per la connessione al database
- Imposta la struttura delle cartelle per i moduli auth, users, events, participations

### Task 1.3: Configurazione del frontend (React/Vite) ⏳
- Configura il file di ambiente (.env) con l'URL dell'API backend
- Imposta il router per la navigazione tra le pagine
- Configura il tema Material UI personalizzato
- Imposta il context per la gestione dell'autenticazione

## Fase 2: Implementazione dell'autenticazione

### Task 2.1: Modello utente e ruoli ⏳
- Definisci lo schema utente con campi: email, password, nome, ruolo, googleId (opzionale)
- Implementa i ruoli: user, organizer, admin
- Crea i DTO (Data Transfer Objects) per la registrazione e il login

### Task 2.2: Autenticazione con email/password ⏳
- Implementa l'endpoint di registrazione
- Implementa l'endpoint di login
- Configura la strategia JWT per l'autenticazione
- Implementa il middleware di autenticazione

### Task 2.3: Autenticazione con Google ⏳
- Registra l'applicazione su Google Cloud Console
- Ottieni le credenziali OAuth
- Implementa l'endpoint per l'autenticazione Google
- Gestisci il callback e la creazione/aggiornamento dell'utente

### Task 2.4: Interfaccia di autenticazione frontend ⏳
- Crea le pagine di login e registrazione
- Implementa i form con validazione
- Integra il pulsante di login con Google
- Gestisci il token JWT e lo stato di autenticazione

## Fase 3: Gestione degli eventi

### Task 3.1: Modello evento ⏳
- Definisci lo schema evento con campi: titolo, descrizione, data, luogo, immagine, organizzatore
- Crea i DTO per la creazione e l'aggiornamento degli eventi

### Task 3.2: CRUD eventi backend ⏳
- Implementa l'endpoint per la creazione di un evento
- Implementa l'endpoint per la lettura di tutti gli eventi/evento singolo
- Implementa l'endpoint per l'aggiornamento di un evento
- Implementa l'endpoint per l'eliminazione di un evento
- Aggiungi la verifica dei permessi (solo l'organizzatore può modificare/eliminare)

### Task 3.3: Interfaccia eventi frontend ⏳
- Crea la pagina di lista eventi
- Crea la pagina di dettaglio evento
- Implementa il form di creazione/modifica evento
- Aggiungi l'upload delle immagini
- Implementa la visualizzazione condizionale in base ai ruoli

## Fase 4: Gestione delle partecipazioni

### Task 4.1: Modello partecipazione ⏳
- Definisci lo schema partecipazione con campi: utente, evento, stato
- Crea i DTO per la gestione delle partecipazioni

### Task 4.2: API partecipazioni backend ⏳
- Implementa l'endpoint per iscriversi a un evento
- Implementa l'endpoint per annullare l'iscrizione
- Implementa l'endpoint per visualizzare i partecipanti (solo per organizzatore)
- Implementa l'endpoint per visualizzare gli eventi a cui un utente partecipa

### Task 4.3: Interfaccia partecipazioni frontend ⏳
- Aggiungi il pulsante di iscrizione nella pagina di dettaglio evento
- Crea la lista dei partecipanti per l'organizzatore
- Implementa la pagina "I miei eventi" per visualizzare le partecipazioni dell'utente

## Fase 5: Dashboard e pannello amministrativo

### Task 5.1: Dashboard utente ⏳
- Crea la pagina dashboard per visualizzare gli eventi a cui l'utente partecipa
- Implementa la visualizzazione degli eventi passati e futuri

### Task 5.2: Dashboard organizzatore ⏳
- Crea la pagina per visualizzare gli eventi creati dall'organizzatore
- Implementa la gestione dei partecipanti per ogni evento
- Aggiungi statistiche sugli eventi organizzati

### Task 5.3: Pannello amministrativo ⏳
- Crea un layout separato per l'area admin
- Implementa la lista utenti con funzionalità di blocco/eliminazione
- Implementa la lista eventi con possibilità di moderazione
- Crea una dashboard con statistiche generali

## Fase 6: Deploy e ottimizzazione

### Task 6.1: Preparazione per il deploy ⏳
- Configura le variabili d'ambiente per produzione
- Ottimizza le build per frontend e backend
- Implementa la gestione degli errori e il logging

### Task 6.2: Deploy frontend su Vercel ⏳
- Crea un account Vercel se non ne hai già uno
- Collega il repository GitHub
- Configura le variabili d'ambiente
- Esegui il deploy

### Task 6.3: Deploy backend su Railway/Render ⏳
- Crea un account sulla piattaforma scelta
- Collega il repository GitHub
- Configura le variabili d'ambiente
- Esegui il deploy

### Task 6.4: Test e ottimizzazione post-deploy ⏳
- Verifica che tutte le funzionalità funzionino in produzione
- Controlla le performance e ottimizza se necessario
- Implementa il monitoraggio degli errori
