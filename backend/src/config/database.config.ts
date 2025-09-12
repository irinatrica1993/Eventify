//importare dotenv per accedere alle variabili d'ambiente
import * as dotenv from 'dotenv';
dotenv.config();

//carica le variabili d'ambiente
dotenv.config();

//Configurazione del database
export const databaseConfig={
    uri:process.env.MONGODB_URI || "mongodb://localhost:27017/eventify",
    options:{
       // useNewUrlParser:true,
       // useUnifiedTopology:true
    }
}
