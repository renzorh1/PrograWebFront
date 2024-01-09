import fsPromises from 'fs/promises';
import path from 'path';

export default async function reservarLibro(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no soportado, solo POST' });
  } else {
    try {
      // Obtén los datos del cuerpo de la solicitud
      const { libro, fechaInicio, fechaFinal, idUsuario } = req.body;

      // Obtén la información del usuario desde donde sea que la tengas disponible (por ejemplo, un sistema de autenticación)
      const userInfo = obtenerInformacionDeUsuario(idUsuario); // Ajusta esto según cómo obtengas la información del usuario

      if (!userInfo) {
        return res.status(401).json({ success: false, message: 'Usuario no autenticado' });
      }

      // Define la ruta del archivo "reservas.json" dentro de la carpeta "api"
      const reservasFilePath = path.join(process.cwd(), 'api/reservas.json');

      // Lee las reservas existentes desde el archivo JSON o crea un array vacío si el archivo no existe
      let reservas = [];

      try {
        const fileContents = await fsPromises.readFile(reservasFilePath, 'utf-8');
        reservas = JSON.parse(fileContents);
      } catch (error) {
        // Si el archivo no existe o no se puede leer, lo dejamos como un array vacío
      }

      // Verifica si el usuario ya ha reservado el libro
      const yaReservado = reservas.some(reserva => reserva.libro.id === libro.id && reserva.idUsuario === idUsuario);

      if (!yaReservado) {
        // Realiza la reserva solo si el usuario no la ha realizado previamente
        const nuevaReserva = { cuenta: userInfo, libro, fechaInicio, fechaFinal };

        // Agrega la nueva reserva al array
        reservas.push(nuevaReserva);

        // Escribe el array actualizado en el archivo JSON
        await fsPromises.writeFile(reservasFilePath, JSON.stringify(reservas, null, 2), 'utf-8');

        console.log('Reserva realizada exitosamente:', nuevaReserva);
        res.status(200).json({ success: true, message: 'Reserva realizada exitosamente', data: nuevaReserva });
      } else {
        console.log('El libro ya ha sido reservado por este usuario:', libro);
        res.status(400).json({ success: false, message: 'El libro ya ha sido reservado por este usuario' });
      }
    } catch (error) {
      console.error('Error en la solicitud POST:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }
}
