import mongoose from "mongoose";

const db_Connection = async () => {
  await mongoose
    .connect(process.env.CONNECTION_URL_HOST)
    .then(() => {
      console.log("Connected to database");
    })
    .catch((error) => {
      console.log("connection database failed: " + error.message);
    });
};

export default db_Connection;
