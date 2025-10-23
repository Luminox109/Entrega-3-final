import express from "express";
import { engine } from "express-handlebars";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Conexión a la base de datos
import connectMongoDB from "./config/db.js";
import productRouter from "./router/product.router.js";
import cartRouter from "./router/carts.router.js";
import viewsRouter from "./router/views.router.js";

// Cargar variables de entorno
dotenv.config();

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de Express
const app = express();
const PORT = 8080;

// Conectar con monguitoDB
connectMongoDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// Configuración de Handlebars
app.engine("handlebars", engine({
  helpers: {
    eq: (v1, v2) => v1 === v2,
    multiply: (a, b) => a * b
  }
}));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Rutas
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);

// Iniciar el servidor después de conectar a la base de datos
app.listen(PORT, () => {
  console.log("servidor creado correctamente!")
});