import app from "./app";
import "dotenv/config";
const PORT = process.env.PORT || 3001;

async function init() {
  try {
    app.listen(PORT, () => {
      console.log(`Express App Listening on Port ${PORT}`);
    });
  } catch (error) {
    console.error(`An error occurred: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}

export default init();
