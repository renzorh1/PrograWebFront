import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const isClient = typeof window !== "undefined";

  const storedUser = isClient ? localStorage.getItem("usuario") : null;
  const initialUser = storedUser ? JSON.parse(storedUser) : {
    id: null,
    nombres: "USUARIO",
    apellidos: "",
    doc_iden: "",
    numero: "",
    correo: "",
    contraseña: "",
    rol: "",
    foto: "/public/admin.jpg",
  };

  const [usuario, setUsuario] = useState(initialUser);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("usuario", JSON.stringify(usuario));
      console.log("=======================");
      console.log(usuario);
    }
  }, [usuario, isClient]);
  
  return (
    <UserContext.Provider value={[usuario, setUsuario]}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserProvider() {
  return useContext(UserContext);
}
