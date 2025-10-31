# 📊 Data Management Guide

## Come Funziona la Gestione dei Dati in Eventify

### 🗄️ Database (MongoDB Atlas)

**Tutti i dati degli utenti e degli eventi sono salvati nel cloud su MongoDB Atlas:**

- ✅ **Utenti**: Email, password (hashate), nome, ruolo
- ✅ **Eventi**: Titolo, descrizione, date, location, categoria, stato
- ✅ **Partecipazioni**: Relazioni tra utenti e eventi

**Vantaggi:**
- I dati persistono anche se spegni il computer
- Accessibili da qualsiasi dispositivo
- Backup automatici di MongoDB Atlas
- Scalabile per migliaia di utenti

### 🖼️ Immagini degli Eventi

**Le immagini sono gestite in modo diverso in sviluppo e produzione:**

#### Sviluppo (Locale)
```
backend/uploads/
├── .gitkeep                    # File vuoto per preservare la cartella
├── uuid-1.png                  # ❌ NON committate su Git
├── uuid-2.jpeg                 # ❌ NON committate su Git
└── ...
```

**Come funziona:**
1. L'utente carica un'immagine dal frontend
2. Il backend salva il file in `backend/uploads/`
3. Genera un nome univoco (UUID) per evitare conflitti
4. Salva l'URL nel database: `http://localhost:3000/uploads/uuid.png`
5. Il frontend mostra l'immagine usando quell'URL

**Importante:**
- ⚠️ Le immagini NON sono committate su Git (vedi `.gitignore`)
- ⚠️ Se cloni il progetto, la cartella `uploads/` sarà vuota
- ⚠️ Gli eventi nel database avranno URL che puntano a file inesistenti

#### Produzione (Cloud Storage)

**Per un'applicazione reale, devi usare un servizio cloud:**

**Opzioni consigliate:**
1. **Cloudinary** (più semplice)
   - Upload diretto dal frontend
   - Trasformazioni immagini automatiche
   - CDN globale incluso
   - Piano gratuito generoso

2. **AWS S3** (più professionale)
   - Storage scalabile
   - Integrazione con CloudFront (CDN)
   - Più controllo ma più complesso

3. **Firebase Storage**
   - Facile integrazione
   - Buon piano gratuito

**Come migrare a Cloudinary (esempio):**

```bash
# Installa SDK
npm install cloudinary multer-storage-cloudinary
```

```typescript
// backend/src/upload/upload.service.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Usa Cloudinary invece di multer locale
```

### 🔄 Workflow Completo

```
┌─────────────┐
│   Frontend  │
│  (React)    │
└──────┬──────┘
       │ 1. Upload immagine
       ▼
┌─────────────┐
│   Backend   │
│  (NestJS)   │
└──────┬──────┘
       │ 2. Salva file
       ▼
┌─────────────┐       ┌─────────────┐
│   Uploads/  │       │   MongoDB   │
│   (Locale)  │       │   (Cloud)   │
└─────────────┘       └──────┬──────┘
                             │ 3. Salva URL
                             ▼
                      ┌─────────────┐
                      │   Event     │
                      │  Document   │
                      │ {           │
                      │  imageUrl:  │
                      │  "http://..." │
                      │ }           │
                      └─────────────┘
```

### 🚀 Per il Deploy

**Quando metti l'app in produzione:**

1. **Database**: Già pronto (MongoDB Atlas è cloud)
2. **Backend**: Deploy su Railway/Render
3. **Frontend**: Deploy su Vercel/Netlify
4. **Immagini**: 
   - ❌ NON usare storage locale
   - ✅ Configura Cloudinary o S3
   - ✅ Aggiorna il codice di upload

### 📝 Esempio: Cosa Succede con Git

**Scenario:**
1. Tu crei 10 eventi con immagini
2. Fai commit e push su GitHub
3. Un recruiter clona il tuo repository

**Risultato:**
- ✅ Il codice funziona perfettamente
- ✅ Il database ha tutti gli eventi (MongoDB Atlas)
- ⚠️ Le immagini non ci sono (cartella `uploads/` vuota)
- ⚠️ Gli eventi mostrano immagini "rotte" (URL non validi)

**Soluzione per demo:**
- Opzione 1: Usa Cloudinary (immagini nel cloud)
- Opzione 2: Aggiungi immagini placeholder
- Opzione 3: Documenta nel README che le immagini sono locali

### 🎯 Best Practices per Portfolio

**Per impressionare i recruiter:**

1. **README chiaro** ✅ (fatto!)
   - Spiega l'architettura
   - Documenta le API
   - Mostra screenshot

2. **Demo live** 🚀
   - Deploy su Vercel + Railway
   - Usa Cloudinary per le immagini
   - Aggiungi dati di esempio

3. **Codice pulito** ✅
   - TypeScript ovunque
   - Commenti dove necessario
   - Struttura modulare

4. **Sicurezza** ✅
   - `.env` non committato
   - Password hashate
   - JWT per autenticazione

### 🔧 Comandi Utili

```bash
# Vedere cosa è ignorato da Git
git check-ignore backend/uploads/*

# Vedere lo stato del repository
git status

# Vedere i file tracciati
git ls-files

# Pulire la cartella uploads (locale)
rm -rf backend/uploads/*.{png,jpg,jpeg}
```

### ❓ FAQ

**Q: Perché le immagini non sono su Git?**
A: Perché Git è per il codice, non per file binari grandi. Le immagini dovrebbero stare su un CDN.

**Q: Come faccio a testare l'app se le immagini non ci sono?**
A: Carica nuove immagini dopo aver clonato, oppure usa un servizio cloud.

**Q: Posso committare le immagini per demo?**
A: Tecnicamente sì, ma è una cattiva pratica. Meglio usare Cloudinary.

**Q: Il database è condiviso?**
A: Sì, se usi lo stesso MongoDB URI. Per demo, crea un database separato.

---

💡 **Tip per il colloquio**: Spiega che hai separato storage locale (dev) da cloud (prod) per seguire le best practices. Questo mostra che capisci l'architettura cloud-native!
