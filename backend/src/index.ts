import "./config/envConfig" 
import app from "./app"
import dbConnect from "./utils/dbConnect";

const PORT = process.env.PORT || 5000;

dbConnect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error("Server failed to start")
  return;
})

