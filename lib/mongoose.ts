import mongoose from "mongoose";

let isConnected = false; // Biến theo dõi trạng thái kết nối

export const connectToDB = async () => {
  // Đặt chế độ truy vấn cho Mongoose để ngăn các truy vấn trường không xác định.
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) return console.log("Missing MongoDB URL");

  if (isConnected) {
    console.log("MongoDB connection already established");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL);

    isConnected = true; // Đặt trạng thái kết nối thành true
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};
