const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Endpoint para cargar el archivo CSV
app.post('/upload', upload.single('file'), (req, res) => {
  const filePath = path.join(__dirname, req.file.path);
  const results = [];
  let idCounter = 1; // Contador para el campo "id"

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      const {
        Desc,
        cod,
        cost,
        price,
        priceA,
        priceB,
        priceC,
        PSMin,
        PPSMax,
        Fabriacante,
        Ubicación,
        provider,
        cat,
        Unidad,
        Sucursal
      } = row; // Ajusta los nombres de columnas según tu CSV

      // Crear objeto con la estructura deseada
      const item = {
        id: idCounter++,
        name: Desc,
        code: cod,
        cat: cat,
        provider: provider,
        cost: parseFloat(cost.replace('$', '')),
        price: parseFloat(price.replace('$', '')),
        priceA: parseFloat(priceA.replace('$', '')),
        priceB: parseFloat(priceB.replace('$', '')),
        priceC: parseFloat(priceC.replace('$', ''))
      };

      results.push(item);
    })
    .on('end', () => {
      fs.unlinkSync(filePath); // Elimina el archivo temporal
      res.status(200).json(results); // Devuelve el arreglo de objetos en la respuesta
    })
    .on('error', (err) => {
      console.error('Error al leer el archivo CSV:', err);
      res.status(500).json({ error: 'Error al procesar el archivo CSV' });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
