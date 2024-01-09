import usuarios from "../json/usuarios.json";

export default function verificarCredenciales(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const { usuario, contraseña } = req.body;

    const usuarioEncontrado = usuarios.find(
      (u) => u.correo === usuario && u.contraseña === contraseña
    );

    if (usuarioEncontrado) {
      return res.status(200).json(usuarioEncontrado).end();
    } else {
      return res.status(401).end();
    }
  } catch (error) {
    console.error("Error en la verificación de credenciales:", error);
    return res.status(500).json({ error: "Hubo un error en el servidor." }).end();
  }
}
