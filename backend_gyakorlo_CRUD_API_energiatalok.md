# ☑️ REST API feladat: Energiaitalok kezelése

Készíts egy REST API-t Express.js segítségével, amely lehetővé teszi energiaitalok adatainak kezelését egy MySQL adatbázisban.

---

## 🔧 Adatbázis tábla: `energy_drinks`

| Mező neve    | Típus              | Kötelező | Megjegyzés             |
| ------------ | ------------------ | -------- | ---------------------- |
| `id`         | INT AUTO_INCREMENT | Igen     | Elsődleges kulcs       |
| `name`       | VARCHAR(100)       | Igen     | Energiaital neve       |
| `brand`      | VARCHAR(100)       | Igen     | Márka                  |
| `caffeine`   | FLOAT              | Igen     | Koffeintartalom mg-ban |
| `sugar_free` | BOOLEAN            | Nem      | Cukormentes-e          |
| `created_at` | DATETIME           | Igen     | Létrehozás ideje       |
| `updated_at` | DATETIME           | Igen     | Utolsó módosítás ideje |

---

## 📥 1. Energiaital hozzáadása

- **Végpont:** `POST /energy-drinks`
- **Leírás:** Új energiaital rögzítése az adatbázisban.
- **Beküldendő JSON:**

```json
{
  "name": "Monster Ultra",
  "brand": "Monster",
  "caffeine": 150,
  "sugar_free": true
}
```

- **Válasz (201 Created):**

```json
{
  "message": "Energiaital sikeresen hozzáadva",
  "drinkId": 17
}
```

- **Hibák:**

- `400 Bad Request`: Hiányzó kötelező mezők  
  Ha bármelyik kötelező mező (`name`, `brand`, `caffeine`, `sugar_free`) hiányzik, a válasz egy `errors` tömböt tartalmaz, minden hiányzó mezőre egyedi üzenettel.

**Példa – több mező hiányzik:**

```json
{
  "errors": [
    "name": "A 'name' mező megadása kötelező.",
    "caffeine": "A 'caffeine' mező megadása kötelező.",
    ...
  ]
}
```

- `400 Bad Request`: Érvénytelen adattípus  
  Ha a `caffeine` mező nem szám (pl. szövegként érkezik), vagy a `sugar_free` nem boolean típusú, típusellenőrzési hiba történik.

**Példa:**

```json
{
  "errors": [
    "caffeine": "A 'caffeine' mezőnek szám típusúnak kell lennie.",
    "sugar_free": "A 'sugar_free' mező csak true vagy false lehet.",
    ...
  ]
}
```

- `500 Internal Server Error`: Adatbázishiba  
  Hiba történik az adatbázisba írás közben.

**Példa:**

```json
{
  "error": "Szerverhiba történt az energiaital mentése közben"
}
```

---

## 📄 2. Energiaitalok listázása

- **Végpont:** `GET /energy-drinks`
- **Leírás:** Az összes energiaital kilistázása.

- **Válasz (200 OK):**

```json
[
  {
    "id": 1,
    "name": "Red Bull",
    "brand": "Red Bull GmbH",
    "caffeine": 80,
    "sugar_free": false,
    "created_at": "2025-10-01T10:15:00.000Z",
    "updated_at": "2025-10-01T10:15:00.000Z"
  },
  {
    "id": 2,
    "name": "Hell Energy",
    "brand": "Hell",
    "caffeine": 100,
    "sugar_free": true,
    "created_at": "2025-09-30T08:00:00.000Z",
    "updated_at": "2025-09-30T08:00:00.000Z"
  }
]
```

- `500 Internal Server Error`: Adatbázishiba  
  Hiba történik az adatbázisból lekérdezés közben.

**Példa:**

```json
{
  "error": "Szerverhiba történt az energiaitalok lekérdezése közben"
}
```
---

## 🗑️ 3. Energiaital törlése

- **Végpont:** `DELETE /energy-drinks/:id`
- **Leírás:** Megadott ID alapján törli az energiaitalt.

- **Válasz (200 OK):**

```json
{
  "message": "Energiaital sikeresen törölve"
}
```

- **Hibák:**
  - `404 Not Found`: Energiaital nem található
  - `500 Internal Server Error`: Törlési hiba

---

## ✏️ 4. Energiaital módosítása

- **Végpont:** `PUT /energy-drinks/:id`
- **Leírás:** Meglévő energiaital adatainak frissítése.

- **Beküldendő JSON:**

```json
{
  "name": "Monster Ultra Gold",
  "brand": "Monster",
  "caffeine": 160,
  "sugar_free": true
}
```

- **Válasz (200 OK):**

```json
{
  "message": "Energiaital sikeresen frissítve"
}
```

- **Hibák:**
  - `400 Bad Request`: Hiányzó vagy hibás mezők

**Példa:**

```json
{
  "error": "Hiányzó vagy hibás mezők"
}
```

  - `404 Not Found`: Energiaital nem található

**Példa:**

```json
{
  "error": "Energiaital nem található."
}
```

  - `500 Internal Server Error`: Módosítási hiba

**Példa:**

```json
{
  "error": "Szerverhiba történt az energiaital módosítása közben"
}
```

---

## 📌 Megjegyzések

- A `created_at` és `updated_at` mezők automatikusan `NOW()` értéket kapnak.
- A `sugar_free` mező alapértelmezetten `false` lehet, ha nem kerül megadásra.
- A végpontok minden esetben JSON választ adnak vissza.
- Tartsd be a megfelelő HTTP státuszkódokat a válaszokban!
