import fsPromises from 'fs/promises';

export default async function registroAPIFile(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no soportado, solo POST' });
  } else {
    try {
      const { nombres, apellidos, doc_iden, numero, correo, contraseña } = req.body;

      // Leer el archivo JSON existente (si existe)
      let data = [];
      try {
        const fileContents = await fsPromises.readFile('./src/pages/json/usuarios.json', 'utf-8');
        data = JSON.parse(fileContents);
      } catch (error) {
        // Si el archivo no existe o no se puede leer, lo dejamos como un array vacío
      }

      // Calcular el próximo ID basado en la longitud actual del array
      const nextId = data.length > 0 ? data[data.length - 1].id + 1 : 1;

      const formData = {
        id: nextId,
        nombres,
        apellidos,
        doc_iden,
        numero,
        correo,
        contraseña,
        rol: 'alumno',
        foto: '/alumno.jpg',
      };

      // Agregar los nuevos datos al array
      data.push(formData);

      // Escribir el array actualizado en el archivo JSON
      await fsPromises.writeFile('./src/pages/json/usuarios.json', JSON.stringify(data, null, 2), 'utf-8');

      res.status(200).json({ success: true, message: 'Registro exitoso', data: formData });
    } catch (error) {
      console.error('Error en la solicitud POST:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }
}


