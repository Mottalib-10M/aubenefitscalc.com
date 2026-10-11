# Écrire ou étoffer une page de « AU Benefits Calc » (aubenefitscalc.com)

Notice pour les agents qui écrivent une page. À lire en entier avant d'écrire, avec
`~/Documents/GitHub/RECETTE-SITE.md` (§0, §6, §6.5, §7, §9, §9.3, §11, §17.4, §21, §26).

Le site : un calculateur qui additionne, pour **un foyer australien**, tout ce que Centrelink verse en même temps :
Family Tax Benefit A et B, Child Care Subsidy, Rent Assistance et le paiement principal de chaque adulte
(JobSeeker, Youth Allowance, Austudy, Parenting Payment, Age Pension, Carer Payment), plus Parental Leave Pay.
**Anglais australien seul**, sous `/en/`. Dollars australiens (`$`), virgule des milliers, « per fortnight ».
Éditeur : la société **Radif Partners** (jamais un nom de personne, jamais de photo, ni INSEAD, ni Mines, ni
LinkedIn). Aucun lien vers un autre site du portefeuille (`_trame/domaines-ovh.txt`) : jamais auspaycalculator.com,
stampdutyaustralia.com, finalpayau.com, ni taxineo.

L'angle (à garder sur chaque page) : **le foyer combiné**. Services Australia a un estimateur par prestation, les
indépendants calculent une prestation à la fois ; nous montrons comment les prestations s'enchaînent (un paiement
de soutien au revenu supprime le test de revenu du FTB ; le Rent Assistance n'est versé qu'une fois, via le FTB A
quand il y a des enfants ; le revenu du conjoint réduit JobSeeker mais pas la CCS, etc.).

## Une page = un fichier

`src/content/pages/<id>.ts` avec `definePage({...})`. Le cœur lit ces fichiers seul : routes, menus, pied de page,
sitemap, schémas, llms.txt, liens internes. **Ne touchez à aucun autre fichier** (ni `src/lib`, ni `src/components`,
ni `src/data`, ni les minis) : un besoin va dans votre compte rendu.

Le plan complet (id, slug, groupe, type, requête visée) est dans `src/lib/planned.ts` ; votre page doit y figurer
avec exactement le même `id`, `slug`, `group` et `kind` (le test le vérifie).

**Modèles à lire avant d'écrire** (structure seulement, **jamais les phrases**) :

- pilier avec calculateur : `src/content/pages/family-tax-benefit-calculator.ts` ;
- guide avec mini-simulateur : `src/content/pages/family-tax-benefit-part-a.ts` ;
- foyer travaillé (case) : `src/content/pages/single-parent-two-children-renting.ts`.

## Les champs

| Champ | Règle |
|---|---|
| `id`, `group`, `kind`, `slug` | = `src/lib/planned.ts`. `id` = nom du fichier. |
| `order` | place dans le menu du groupe (10, 20, 30…). |
| `nav`, `card` | libellé de menu (court) ; une phrase pour les cartes « Read next ». |
| `title` | **50 à 60 caractères**, contient 2026 (ou « 2026-27 »), **terme-clé en tête** (« JobSeeker Income Test 2026: … »). Jamais en tête : Calculator, How, What, Can…, ni Australia/Australian. Pas de tiret cadratin, pas d'espace avant `:`. Unique. |
| `description` | **150 à 160 caractères**, contient l'année et au moins un chiffre **calculé** (kit). Unique. |
| `h1` | sans année de préférence. `intro` : une phrase. |
| `resume` | **UN** paragraphe de **120 mots ou plus** (viser 130 à 180) : la réponse directe à la requête, chiffres compris (kit). Sur un pilier et un foyer il est replié après la première phrase : la première phrase porte le message, et la deuxième ne commence pas par un chiffre. |
| `tool` | piliers seulement : `ftb`, `ccs`, `ra`, `jsp`, `ya`, `austudy`, `pp`, `pension`, `carer`, `ppl`. |
| `preset` | foyers (`kind: 'case'`) seulement : l'objet `Household` du foyer (voir plus bas). |
| `mini` / `miniArg` | guides seulement : le mini-simulateur imposé par le tableau d'affectation. |
| `faqs` | piliers 6 à 8, autres 3 à 5 (jusqu'à 8 si long). **Vraies questions telles qu'on les tape**, réponses de **45 à 85 mots** (le test accepte 42 à 88), avec le chiffre, la condition et la source. **Une question n'existe qu'une fois sur tout le site** (accueil compris). |
| `body(h)` | HTML (`h2`, `h3`, `p`, `ul`, `ol`, `h.table`, `h.box`). **Guides : 1 000 mots ou plus de prose hors tableaux** (le test exige 900, `check-seo` 1 200 sur la page entière, réponse et FAQ comprises). **Piliers : 450 mots ou plus. Foyers : 380 mots ou plus.** Deux à cinq `<h2>` propres à la page. |
| `related` | 3 à 6 ids existants ou planifiés (`home`, `method`, `about` aussi). |
| `sources` | clés de `src/data/params-2026.json > sources` (piliers 3 ou plus, autres 2 ou plus). Elles s'affichent en fin de page. |

## La règle des chiffres (non négociable, RECETTE §17.4 point 7)

Aucun taux, seuil, montant ou date qui existe dans `params-2026.json` n'est tapé en dur : il se lit (`P.x.y`) ou se
calcule avec le kit. Le test `no figure of the parameter file typed by hand` refuse un montant à centimes du fichier
écrit en clair. Une **hypothèse d'exemple** (« a rent of $520 », « earnings of $26,000 ») peut s'écrire
`h.aud(26000)`. Un pourcentage de loi qui n'est pas un paramètre (20 %, 30 %, 75 cents, 40 cents) peut s'écrire.
**Un chiffre absent du fichier ne s'écrit pas** : pas de montant de Work Bonus, pas de taux du maintenance income
test, pas de seuil parental de Youth Allowance pour 2026, pas de date de paiement, pas de Pharmaceutical Allowance,
pas de Remote Area Allowance, pas de seuil de Commonwealth Seniors Health Card. Si vous en avez besoin, dites-le dans
le compte rendu. Les textes officiels copiés sont dans `research/` (lisez-les pour les règles : âges, conditions,
exemples) ; une règle tirée de `research/` se cite avec la clé de source correspondante.

### Le kit (`import { ... } from '../../lib/kit'`, aussi passé au corps sous `h.`)

- Paramètres : `P` (voir `src/data/params-2026.json` : `P.ftb.*`, `P.ra_family.*`, `P.ra_ss.single|sharer|couple.*`,
  `P.ccs.*`, `P.pension.*`, `P.pps.*`, `P.benefit.jsp.*`, `P.benefit.ppp.*`, `P.benefit.*`, `P.ya.*`, `P.carer.*`,
  `P.deeming.*`, `P.ppl.*`, `P.rates_date` = 2026-09-20, `P.fy_start` = 2026-07-01, `P.next_indexation` = 2027-03-20).
- Conversions : `faFortnight(annuel)` (FTB et RA famille : annuel ÷ 365 × 14), `ssFortnight(annuel)` (÷ 26), `ssAnnual(pf)` (× 26).
- FTB : `ftbA({ ages, ati, incomeSupport?, rentPf?, couple? })` → `{ fortnight, annual, annualNoSupplement, supplementPaid, method, method1, method2, raPaidAnnual, reductionMethod1, supplementEligible }` ;
  `ftbB({ ages, couple, primaryAti, secondaryAti?, incomeSupport? })` → `{ fortnight, annual, annualNoSupplement, supplementPaid, eligible, reason, standard }` ;
  `ftbACutoffs(ages)` → `{ baseReachedAt, nilAt }` ; `ftbBCutoff(youngestAge)` ; `method1Reduction(ati)`, `method2Reduction(ati)`.
- CCS : `ccsStandardPct(ati)`, `ccsHigherPct(ati)` (null au-dessus du seuil), `hourlyCap(type, schoolAge)` (`'cbdc'|'fdc'|'oshc'`),
  `subsidisedHours(activityHoursPf, firstNations?)`, `ccsFamily({ ati, activityHoursPf, children: [{ age, daysPerWeek, hoursPerDay, dailyFee, type }] })`
  → `{ hours, standardPct, higherPct, children[{ pct, higher, subsidyPerHour, subsidisedHoursUsed, hoursPf, feesPf, subsidyPf, paidPf, gapPf }], feesPf, subsidyPf, withheldPf, paidPf, gapPf }`.
- Rent Assistance : `raFamilyAnnual(rentPf, couple, nChildren)`, `raFamilyLimits(couple, n)` → `{ thresholdAnnual, maxAnnual, rentForMaxAnnual }`,
  `raSingleRate(rentPf, 'single'|'sharer'|'couple')` (par quinzaine), `raSsRow(status)` → `{ threshold, max, min_rent_for_max }`.
- Paiements (par quinzaine) : `jobseeker({ couple, children, incomePf, partnerIncomePf?, partnerOnPension?, over55NineMonths?, rentPf?, sharer?, homeowner?, assets?, includeRa? })`,
  `parentingPayment({ couple, youngest, children, incomePf, partnerIncomePf?, homeowner?, assets? })`,
  `youthAllowance({ situation, student, austudy?, incomePf, partnerIncomePf?, rentPf?, sharer?, includeRa?, age? })`
  (`situation` : `'under18_home'|'over18_home'|'away'|'single_children'|'partnered_no_children'|'partnered_children'`)
  → tous `{ rate, maxRate, basic, es, ra, incomeReduction, partnerReduction, assetsOk, cutOut, note }` ;
  `pension({ couple, pensioners?, homeowner, incomePf, financialAssets?, otherAssets?, rentPf?, payment? })`
  → `{ rate, ratePerPerson, maxRate, ra, deemedPf, incomeTested, assetsTested, test, assetsFreeArea, incomeCutOut, assetsCutOut }` (montants de couple combinés, `ratePerPerson` = chacun) ;
  `deemedIncome(financialAssets, 'single'|'couple')` (annuel) ; `benefitIncomeReduction(incomePf, 'standard'|'principalCarer'|'student'|'yaJobseeker')` ;
  `benefitCutOut(maxRate, mode)` ; `partnerIncomeFreeArea()` ; `carerAllowance(familyIncome)` ; `benefitAssetLimit(homeowner, couple)`.
- PPL : `ppl({ partnered, ownAti, partnerAti?, workTest, daysClaimed? })` → `{ eligible, reason, maxDays, days, weeks, daily, total, reservedForPartner }`.
- Foyer : `household(Household)` → `{ lines[{ key, label, fortnight, annual, note }], fortnightTotal, endOfYear, annualTotal, ati, incomeSupport, ftbA, ftbB, ccs, warnings }`.
  Clés des lignes : `pension-you`, `pension-your partner`, `JobSeeker Payment-you`, `Parenting Payment (single)-you`, `Youth Allowance-you`, `ftb-a`, `ftb-b`, `ccs`…
- Formats : `aud(n)` ($1,234, sans centimes), `audx(n)` (centimes si le chiffre officiel en a), `aud2(n)`, `pct(1.75)` → « 1.75% », `num`, `day(iso)` → « 20 September 2026 », `listOf([...])`.
- Dans `body(h)` en plus : `h.a(id, texte)` (lien interne ; id inconnu = test en échec), `h.table(entêtes, lignes, légende, alignements)`,
  `h.src(clé, texte?)` (lien officiel de params), `h.box(titre, html)`, `h.mini(kind, arg)` (un mini de plus dans le corps, facultatif).

### Le type `Household` (foyers)

```ts
{ couple: boolean, you: { age, payment: 'none'|'jobseeker'|'parenting'|'youth'|'austudy'|'age'|'carer', incomeAnnual, yaSituation? },
  partner?: { … }, children: [{ age, careDays?, careHours?, careFee?, careType? }], rentPf, homeowner, sharer?,
  otherAssets?, financialAssets?, activityHoursPf? }
```

### Les mini-simulateurs existants (`src/lib/minis/`)

ftbPartA (arg `{ income, young, teens }`), ftbPartB (`{ couple, youngest, secondary, primary }`), ftbIncomeTest (`{ ages, income }`),
ftbSupplement (`{ income, kids }`), ftbRates, ftbTeen, ccsPct (`{ income }`), ccsHours, ccsHigher (`{ income }`), ccsCap,
ccsWithholding, raFamily, raSingle, raCouple, jspRates, jspIncome, jspPartner, yaStudent, pps, ppp, pplIncome,
pensionRates, assetsTest, incomeTest, deeming, carerAllowance, rateFinder, compareTests, indexation, supplements.
Un guide reçoit **le mini du tableau d'affectation** ; il peut en insérer un second dans le corps avec `h.mini(...)`.

## Faits établis (lus le 2026-10-11 dans `research/`)

- Indexation des pensions, JobSeeker, Parenting Payment, Rent Assistance : **20 mars et 20 septembre** ; Youth Allowance,
  Austudy, Carer Allowance : **1er janvier** ; FTB, CCS, seuils de revenus et d'actifs des pensions, PPL : **1er juillet**.
- Âges : JobSeeker de 22 ans à l'âge de la pension (67) ; Youth Allowance 16 à 21 ans (chercheur d'emploi), 16 à 24 ans
  (étudiant, apprenti) ; Austudy 25 ans et plus ; PPS benjamin de moins de 14 ans ; PPP benjamin de moins de 6 ans.
- FTB A : enfant FTB = au moins 35 % de garde ; 16 à 19 ans seulement en secondaire à temps plein ; le supplément A
  n'est versé qu'avec un revenu familial de 80 000 $ ou moins ; méthode 1 et méthode 2, le plus élevé est payé.
- FTB B : nul pour un couple dont le benjamin a 13 ans ou plus (sauf grands-parents) ; enfant de 16 ans et plus ignoré
  sauf en secondaire et jusqu'à la fin de l'année civile de ses 18 ans ; nul les jours de Parental Leave Pay.
- Soutien au revenu (pension, allocation) : FTB A et B sans test de revenu (FA Guide 3.1.4.40, 6.4.2.20).
- CCS : 72 heures par quinzaine pour toute famille depuis le 5 janvier 2026 (« 3-day guarantee »), 100 heures au-delà
  de 48 heures d'activité, avec une exemption, ou pour un enfant aborigène ou des îles du détroit de Torres ;
  taux majoré pour le deuxième enfant et les suivants de 5 ans ou moins ; retenue par défaut de 5 % ; caps horaires
  différents avant et après l'âge scolaire (l'enfant est « scolaire » dès 6 ans ou dès l'année avant la 1re année).
- Rent Assistance : jamais versé deux fois ; avec enfants via le FTB A (méthode 1), sans enfants avec la pension ou
  l'allocation ; couple de pensionnés = moitié chacun ; pensionné + allocataire = tout au pensionné.
- Assets test : les allocations (JobSeeker, YA, Austudy, PP) s'arrêtent au-delà du seuil ; les pensions perdent
  19,50 $ par an pour chaque tranche de 250 $ (3 $ par quinzaine pour 1 000 $), combinés pour un couple.
- Income test pension : 50 cents par dollar au-dessus du seuil (25 cents chacun pour un couple) ; PPS : 40 cents ;
  allocations : 50 cents entre 150 et 256 $, 60 cents au-delà ; parent isolé principal (JobSeeker) : 40 cents ;
  revenu du conjoint au-delà de son propre point de sortie : 60 cents.
- Deeming au 20 septembre 2026 : 1,75 % puis 3,75 % ; seuils du 1er juillet 2026.
- Carer Allowance : montant fixe, revenu familial de 250 000 $ au plus (seuil non indexé).
- Parental Leave Pay (enfant né ou adopté à partir du 1er juillet 2026) : 130 jours, dont 20 réservés au second
  parent quand le demandeur est en couple (110 jours pour lui) ; taux journalier = 7,6 × salaire minimum horaire.

## Ton et langue

- **Anglais australien** : « per fortnight », « centre », « Centrelink », « Services Australia », « adjusted taxable income »,
  « income free area », « taper », « deeming », « principal carer », « reconciliation », « CRN » à éviter.
- Voix humaine, phrases de longueur variable, **le chiffre d'abord**. Interdits (le test les refuse) : tiret cadratin « — »,
  « it's important to note », « dive into », « delve », « whether you're… », « navigate the », « Moreover », « Additionally »,
  « Furthermore », « in today's world ». Pas de triplets en série, pas de conclusion qui résume, pas d'émoji.
- **Local réel** : Services Australia, Centrelink, myGov, ATO, financial counsellors, community legal centres ; exemples
  de loyers et de salaires plausibles en Australie, écrits comme hypothèses.
- **Vérité** : jamais de chiffre ou de règle non sourcés ; pas d'avis juridique (« Services Australia decides »).
- **Unicité** (§6) : `check-unique` compare toutes les pages, chiffres neutralisés, seuil 30 %, fenêtre des 12 000 premiers
  caractères. Écrire ce qui n'appartient qu'à la page, avec **un vocabulaire propre** ; aucune tournure reprise d'une
  autre page ni d'un autre site du portefeuille (`check-portefeuille`). Ne recopiez pas les phrases des modèles.

## Contrôles (à lancer avant de rendre la main)

```bash
cd ~/Documents/GitHub/a-publier/Mottalib-10M/aubenefitscalc.com
ALLOW_PLANNED=1 PAGE_FILES=jobseeker-income-test,age-pension-rates npx vitest run tests/pages.test.ts   # vos pages
```

Puis le build et tous les contrôles de la factory :

```bash
export NODE_PATH=$(npm root -g):$PWD/node_modules
npm run build && npx vitest run
python3 scripts/check-seo.py . && python3 scripts/check-trame.py . && python3 scripts/check-simulateurs.py .
python3 scripts/check-unique.py dist && python3 scripts/check-portefeuille.py . && python3 scripts/check-regles.py .
node scripts/check-legal.mjs . && node scripts/check-sources.mjs . && python3 scripts/check-cookies.py .
node scripts/check-contraste.mjs dist && node scripts/check-saisie.mjs dist --max=60 && node scripts/check-nombres.mjs dist
node scripts/typo-nbsp.mjs dist --check && python3 scripts/check-liens.py dist && node scripts/check-url-propre.mjs dist
node scripts/check-layout.mjs dist > /tmp/layout-au.log 2>&1   # long
```

Serveur local : `npx astro preview --port 4409` ; l'arrêter par `lsof -ti tcp:4409 | xargs kill`.

## Limites connues

- **guides.dss.gov.au** est derrière une protection anti-robot : `check-sources.mjs` signale ses pages « bloquées aux robots » (403).
  Elles se lisent avec un navigateur sans tête lancé une fois par page (voir `research/` : chaque section citée y est copiée,
  relue le 2026-10-11). Une page qui répondrait 404 dans un navigateur serait, elle, morte.
- **servicesaustralia.gov.au** ne répondait pas depuis la machine de construction (connexion coupée) : le site cite à la place
  l'Operational Blueprint de Services Australia (`operational.servicesaustralia.gov.au`), qui répond, et les guides du DSS.
- Non modélisés (et annoncés comme tels sur les pages) : garde partagée, maintenance income test, test parental de la Youth
  Allowance dépendante, Work Bonus, Pharmaceutical Allowance, Remote Area Allowance, Energy Supplement dans le FTB (fermé en 2017),
  taux transitoires des pensions, tests du bénéficiaire des soins (Carer Payment), work test du PPL (posé en question).
- Le calculateur du foyer n'ajoute pas le Carer Allowance ni le Parental Leave Pay au total (pages dédiées).

## Ce qu'on ne fait pas

- Ne pas toucher au cœur (`src/lib`, `src/components`, `src/data`, `src/pages`, `scripts`, `tests`) ni à un autre site, ni à `_trame` ou à la RECETTE.
- Pas de git, pas de dépôt, pas de DNS, pas de Chrome, pas de serveur local.

## Mise à jour annuelle

Tout est dans `src/data/params-2026.json`, avec la section du guide en `_source`. À chaque date d'indexation :
relire les sections citées (copies dans `research/`), changer la valeur, relancer `npx vitest run` (les tests rejouent
les exemples officiels), puis `npm run build` et les contrôles. Les textes ne contiennent aucun chiffre en dur.
