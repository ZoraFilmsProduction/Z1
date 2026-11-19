# ZORA FILMS — GitHub + Cloudflare Pages

## Ovaj paket

- Verzija stranice: **Lovable v8 + V12 glatki Rooted in Minimalism i pouzdano automatsko ponavljanje mozaik-klipova**, nadograđena na cjeloviti V11 paket.
- Izvorni ZIP SHA-256: `39f8030034aa57d5c96982489e7e22e9eb59cf40602a79b050d6dd2518c3ed37`.
- Sve postojeće JavaScript, CSS, MP4, slikovne i font datoteke V11 paketa ostale su **bajtno nepromijenjene**.
- U odnosu na V11 dodane su dvije datoteke `public/assets/zora-targeted-fixes-v12.css` i `public/assets/zora-targeted-fixes-v12.js`, osam animiranih WebP rezervnih prikaza iz originalnih mozaik-klipova te dvije nove poveznice na te resurse u `public/index.html`.
- Na mobitelu bijela ploha, akvarel, naslov i odlomak koriste istu granicu prijelaza. Otkrivanje je glatko, tekst na bijelom postaje crn, a pri skrolanju natrag vraća se crna pozadina s bijelim tekstom.
- Sekcija Rooted in Minimalism sada koristi GPU-transformaciju bijele plohe umjesto pomicanja skupe maske preko cijelog zaslona. Zadržani su položaj, smjer, trajanje odziva, naslov i povratno skrolanje.
- Svih osam galerijskih videozapisa imaju `muted`, `autoplay`, `loop` i `playsinline`, aktivno pokretanje kad su vidljivi te kontrolu stvarne reprodukcije. Ako Safari, štedni način ili pravila preglednika odbiju pokretanje, automatski se prikaže animirani WebP iz istog klipa, koji se beskonačno ponavlja bez Play gumba. Izvorne MP4 datoteke nisu promijenjene.
- Početak i kraj otkrivanja koriste istu jednadžbu položaja skrolanja kao postojeća desktop verzija. Isključivo mobilna interpolacija uklanja trzanje pri skrolanju.
- GPU-korekcija prijelaza primjenjuje se samo na mobitelu; pouzdanije pokretanje mozaika vrijedi i na desktopu. Kompozicija, tipografija, veličine, razmaci i ostale animacije nisu mijenjani.
- Cijeli gotov statički build nalazi se unutar `public/`.
- `ORIGINAL-VERIFY-SHA256.txt` sadrži kontrolne zbrojeve svih datoteka ove završne verzije stranice.

## Struktura za postojeći GitHub repozitorij

```text
DEPLOY-ZORA-FILMS.md
ORIGINAL-VERIFY-SHA256.txt
public/
```

## Potpuna zamjena postojeće verzije

1. Raspakiraj ovaj ZIP.
2. U GitHub Desktopu otvori lokalni repozitorij `Zora-Guruji` (Repository → Show in Finder).
3. U toj mapi zamijeni **sva tri vidljiva postojeća elementa** istim elementima iz ovog ZIP-a.
4. **Ne briši skrivenu mapu `.git`** — ona čuva vezu s GitHub repozitorijem.
5. U GitHub Desktopu napravi **Commit to main → Push origin**.

Nemoj kopirati ZIP u mapu `public/`, niti stvarati dvostruku mapu `public/public/`.

## Postojeće postavke Cloudflare Pages

- Projekt: `zora-guruji`
- Produkcijska grana: `main`
- Framework preset: `None`
- Build command: `exit 0`
- Build output directory: `public`

Build je već gotov: ne treba `npm install`, `npm run build` ni promjena konfiguracije.
Ne mijenjaj DNS, domenu ili e-mail zapise.

## Neobavezna kontrola identičnosti

Iz korijena repozitorija:

```bash
sha256sum -c ORIGINAL-VERIFY-SHA256.txt
```

Provjera nije uvjet za deployment. Ovaj dokument i popis kontrolnih zbrojeva služe samo kao upute i dokaz o sadržaju.
