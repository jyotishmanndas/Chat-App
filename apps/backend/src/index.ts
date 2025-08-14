import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import roomRoutes from "./routes/room.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", userRoutes);
app.use("/room", roomRoutes);

app.listen(3000, () => {
    console.log("Server is running on the port 3001");
});