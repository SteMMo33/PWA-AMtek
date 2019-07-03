# PWA AMtek

L'intento è quello di creare una PWA in grado di comunicare con il websocket a bordo
delle macchine AMtek.

Funzionamento socket in JS

Pagina prodotti
Pagina vuoti

Collegamento in modalità ADM/APP con richiesta dei dati.
Richiesta numero colonne.
Richiesta info del prodotto X.

No modalità offline o dati in cache

## Server
Come server ho usato quello interno a VsCode ma configurato con il file ./.vscode/settings.json in modo da avere la root del sito = ./public



## Passaggi
* Ho creato e registrato l'app web 'pwa-amtek' seguendo le istruzioni nella console di Firebase
* Ho aggiunto un hosting ed incollato il codice js relativo all'inclusione SDK Firebase

* ho fatto deploy del progetto da linea di comando:
firebase deploy --only hosting:pwa-amtek
L'app è finita sotto il progetto 'myfirstpws-37305'

* ho installato l'app sul cellulare puntando il browser sull'indirizzo web del hosting. L'app si è installata tra le applicazioni normali ed ha creato un'icona sul desktop.
Indirizzo: https://pwa-amtek.web.app/

* Modificato il progetto ed eseguito il deploy
* L'app si è aggiornata sul cellulare senza notifica

Inserimento libreria js Materialize


## Firebase

Comando per il deploy:

```
firebase deploy
```

