import React from "react";
import Link from "next/link";
import Head from "next/head";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import CloseIcon from "@mui/icons-material/Close";

const NavigationBar = (props) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const listItems = [
    { text: "Inicio", icon: <HomeIcon />, href: "/AdminPrincipal" },
    { text: "Perfil", icon: <PersonIcon />, href: "/AdminDatosPersonales" },
    { text: "Bibliotecas", icon: <LibraryBooksIcon />, href: "/AdminResultados" },
  ];

  // Función para cerrar el menú lateral
  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const redirectToIndex = () => {
    window.location.href = "./";
  };

  return (
    <>
      <Head>
        <title>Administración</title>
      </Head>
      <AppBar position="static" style={{ backgroundColor: "#F3EDF7" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
            style={{ color: "#000", marginRight: "400px" }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            style={{ flexGrow: 1, textAlign: "center", color: "#000" }}
          >
            Administración
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="close"
            onClick={redirectToIndex}
            style={{ color: "#000", marginLeft: "400px" }}
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        <div
          role="presentation"
          onClick={toggleDrawer}
          onKeyDown={toggleDrawer}
        >
          <List>
            {listItems.map((item) => (
              <Link href={item.href} key={item.text}>
                <ListItem>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    style={{ borderBottom: "none", textAlign: "center" }}
                  />
                </ListItem>
              </Link>
            ))}
          </List>
        </div>
      </Drawer>

      <main>{props.content}</main>
    </>
  );
};

export default NavigationBar;
