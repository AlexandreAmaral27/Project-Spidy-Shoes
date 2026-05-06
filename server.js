const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ===== DATABASE =====
const db = new sqlite3.Database("loja.db");

db.run(`
CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    preco INTEGER,
    imagem TEXT
)
`);

// ===== ROTAS =====

// GET produtos
app.get("/produtos", (req, res) => {
    db.all("SELECT * FROM produtos", [], (err, rows) => {
        res.json(rows);
    });
});

// ADD produto
app.post("/produtos", (req, res) => {
    const { nome, preco, imagem } = req.body;

    db.run(
        "INSERT INTO produtos (nome, preco, imagem) VALUES (?, ?, ?)",
        [nome, preco, imagem],
        function(err) {
            res.json({ id: this.lastID });
        }
    );
});

// DELETE produto
app.delete("/produtos/:id", (req, res) => {
    db.run("DELETE FROM produtos WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
});

// ===== START =====
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});