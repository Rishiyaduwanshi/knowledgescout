import { QdrantClient } from "@qdrant/js-client-rest";
import { config } from "../config/index.js";

const connectQdrant = async () => {
  try {
    const qdrant = new QdrantClient({
      url: config.QDRANT_URL,
      apiKey: config.QDRANT_API_KEY,
    });

    const health = await qdrant.getHealthCheck();

    if (health.status === "ok") {
      console.log("Qdrant DB connected successfully ✅");
    } else {
      console.error("Qdrant health check failed ❌", health);
      process.exit(1);
    }

    return qdrant;
  } catch (error) {
    console.error("Qdrant connection error 😢", error);
    process.exit(1);
  }
};

connectQdrant();

export default connectQdrant;
