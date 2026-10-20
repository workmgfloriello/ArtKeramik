/* ================= CONFIGURAZIONE ================= 
   Qui aggiungi foto e video. Non serve toccare altro. */

/* FOTO DELLA GALLERIA: una riga per foto (metti i file nella cartella assets) */
var FOTO = [
   {src:"./assets/image.png"},
   {src:"./assets/camere.jpeg"},
   {src:"./assets/bagno2.jpg"},
   {src:"./assets/image2.png"},
   {src:"./assets/image3.png"},
   {src:"./assets/image4.png"},
   {src:"./assets/image5.png"},
];

/* VIDEO: una riga per video. Due modi:
   - file tuo:  {src:"./assets/lavoro1.mp4", poster:"./assets/lavoro1.jpg", de:"Titolo", it:"Titolo"},
     (poster = immagine di copertina, facoltativa)
   - YouTube:   {yt:"ID_DEL_VIDEO", de:"Titolo", it:"Titolo"},
     (ID = le lettere dopo v= nel link di YouTube)
   Finché la lista è vuota, la sezione Video non compare. */
var VIDEO = [
   {src:"./assets/vid1.mp4"},
   {src:"./assets/vid2.mp4"},
  // {yt:"dQw4w9WgXcQ", de:"Unser Team", it:"Il nostro team"},
];

/* FOTO DI ANTONIO (facoltativa), es. "./assets/antonio.jpg" */
var RITRATTO = "";

/* VIDEO O FOTO NELLO SLIDER INIZIALE: nell'index.html, ogni <div class="slide">
   ha data-img="" (foto di sfondo) e data-video="" (video di sfondo, senza audio). */