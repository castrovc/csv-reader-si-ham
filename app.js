const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const path = require("path");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

// Endpoint para cargar el archivo CSV
app.post("/upload", upload.single("file"), (req, res) => {
  const filePath = path.join(__dirname, req.file.path);
  const results = [];
  let idCounter = 1; // Contador para el campo "id"

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      const {
        desc,
        cod,
        cost,
        price,
        priceA,
        priceB,
        priceC,
        provider,
        cat,
        quantity,
        entry,
        exit,
      } = row;

      const item = {
        id: idCounter,
        name: desc,
        code: idCounter++,
        cat: cat,
        provider: provider,
        cost: parseFloat(cost.replace("$", "")) || 0,
        price: parseFloat(price.replace("$", "")) || 0,
        priceA: parseFloat(priceA.replace("$", "")) || 0,
        priceB: parseFloat(priceB.replace("$", "")) || 0,
        priceC: parseFloat(priceC.replace("$", "")) || 0,
        stock: parseFloat(quantity) || 0,
      };

      results.push(item);
    })
    .on("end", () => {
      fs.unlinkSync(filePath);
      res.status(200).json(results);
    })
    .on("error", (err) => {
      console.error("Error al leer el archivo CSV:", err);
      res.status(500).json({ error: "Error al procesar el archivo CSV" });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
