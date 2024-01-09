import fsPromises from 'fs/promises';

export default async function insertarLibro(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no soportado, solo POST' });
  } else {
    try {
      const nuevoLibro = req.body;
      let data = [];
      try {
        const fileContents = await fsPromises.readFile('libros.json', 'utf-8');
        data = JSON.parse(fileContents);
      } catch (error) {
        // Si el archivo no existe o no se puede leer, lo dejamos como un array vacío
      }

      data.push(nuevoLibro);

      await fsPromises.writeFile('libros.json', JSON.stringify(data, null, 2), 'utf-8');

      res.status(200).json({ success: true, message: 'Libro guardado exitosamente', data: nuevoLibro });
    } catch (error) {
      console.error('Error en la solicitud POST:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }
}
