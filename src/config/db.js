import mongoose from "mongoose";

const connectMongoDB = async () => {
    // Lógica para conectar a MongoDB
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("La conexion a mongoDB fue exitosa");        
    } catch (error) {
                console.error("Error al conectar a MongoDB:", error);

    }
};

export default connectMongoDB;