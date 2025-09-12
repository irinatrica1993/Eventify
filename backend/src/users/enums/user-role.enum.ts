// enum definisce i ruoli utente

export enum UserRole{
    USER ='user',              //utente base che può iscriversi a    eventi
    ORGANIZER='organizer',     //utente che può creare e gestire eventi,     vedere   la lista dei partecipanti 
    ADMIN='admin'              //utente admin che può gestire tutti gli utenti e gli eventi
}