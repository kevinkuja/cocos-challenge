import app from "./app";
import { pool } from "./config/db";

const PORT = process.env.PORT || 3000;

pool
  .connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => console.error("Error connecting to database:", error));
