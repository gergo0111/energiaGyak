
import express from 'express';
import type { Request, Response } from 'express';
import mysql from 'mysql2/promise';

const app = express();
app.use(express.json());

// MySQL kapcsolat beállítása
const db = mysql.createPool({
	host: 'localhost',
	user: 'root', // módosítsd a saját beállításod szerint
	password: '', // módosítsd a saját beállításod szerint
	database: 'energiaGyak',
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});


// 1. POST /energy-drinks - Új energiaital hozzáadása
app.post('/energy-drinks', async (req: Request, res: Response) => {
	const { name, brand, caffeine, sugar_free } = req.body;
	const errors: Record<string, string>[] = [];

	// Validáció: kötelező mezők
	if (!name) errors.push({ name: "A 'name' mező megadása kötelező." });
	if (!brand) errors.push({ brand: "A 'brand' mező megadása kötelező." });
	if (caffeine === undefined) errors.push({ caffeine: "A 'caffeine' mező megadása kötelező." });

	// Típusellenőrzés
	if (caffeine !== undefined && typeof caffeine !== 'number') {
		errors.push({ caffeine: "A 'caffeine' mezőnek szám típusúnak kell lennie." });
	}
	if (sugar_free !== undefined && typeof sugar_free !== 'boolean') {
		errors.push({ sugar_free: "A 'sugar_free' mező csak true vagy false lehet." });
	}

	if (errors.length > 0) {
		return res.status(400).json({ errors });
	}

	try {
		const [result] = await db.execute(
			`INSERT INTO energy_drinks (name, brand, caffeine, sugar_free, created_at, updated_at)
			 VALUES (?, ?, ?, ?, NOW(), NOW())`,
			[name, brand, caffeine, sugar_free ?? false]
		);
		// @ts-ignore
		const drinkId = result.insertId;
		return res.status(201).json({ message: "Energiaital sikeresen hozzáadva", drinkId });
	} catch (err) {
		return res.status(500).json({ error: "Szerverhiba történt az energiaital mentése közben" });
	}
});


// 2. GET /energy-drinks - Energiaitalok listázása
app.get('/energy-drinks', async (req: Request, res: Response) => {
	try {
		const [rows] = await db.query('SELECT * FROM energy_drinks');
		return res.status(200).json(rows);
	} catch (err) {
		return res.status(500).json({ error: "Szerverhiba történt az energiaitalok lekérdezése közben" });
	}
});


// 3. DELETE /energy-drinks/:id - Energiaital törlése
app.delete('/energy-drinks/:id', async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const [result] = await db.execute('DELETE FROM energy_drinks WHERE id = ?', [id]);
		// @ts-ignore
		if (result.affectedRows === 0) {
			return res.status(404).json({ error: "Energiaital nem található." });
		}
		return res.status(200).json({ message: "Energiaital sikeresen törölve" });
	} catch (err) {
		return res.status(500).json({ error: "Szerverhiba történt az energiaital törlése közben" });
	}
});


// 4. PUT /energy-drinks/:id - Energiaital módosítása
app.put('/energy-drinks/:id', async (req: Request, res: Response) => {
	const { id } = req.params;
	const { name, brand, caffeine, sugar_free } = req.body;
	// Validáció
	if (!name || !brand || caffeine === undefined || sugar_free === undefined) {
		return res.status(400).json({ error: "Hiányzó vagy hibás mezők" });
	}
	if (typeof caffeine !== 'number' || typeof sugar_free !== 'boolean') {
		return res.status(400).json({ error: "Hiányzó vagy hibás mezők" });
	}
	try {
		const [result] = await db.execute(
			`UPDATE energy_drinks SET name=?, brand=?, caffeine=?, sugar_free=?, updated_at=NOW() WHERE id=?`,
			[name, brand, caffeine, sugar_free, id]
		);
		// @ts-ignore
		if (result.affectedRows === 0) {
			return res.status(404).json({ error: "Energiaital nem található." });
		}
		return res.status(200).json({ message: "Energiaital sikeresen frissítve" });
	} catch (err) {
		return res.status(500).json({ error: "Szerverhiba történt az energiaital módosítása közben" });
	}
});

// Szerver indítása
const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Szerver fut: http://localhost:${PORT}`);
});
