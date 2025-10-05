import { QdrantClient } from '@qdrant/js-client-rest';
import { config } from '../config/index.js';
import { getLogger } from '../src/utils/errorLogger.js';
const logger = getLogger('logs/migrate.log');

const client = new QdrantClient({
  url: config.QDRANT_URL,
  apiKey: config.QDRANT_API_KEY,
});

const migrate = async () => {
  try {
    const exists = await client.collectionExists(config.QDRANT_COLLECTION_NAME);

    if ( exists.exists ) {
      console.log(`Collection '${config.QDRANT_COLLECTION_NAME}' already exists`);
    } else {
      await client.createCollection(config.QDRANT_COLLECTION_NAME, {
        vectors: {
          size: 768,
          distance: 'Cosine',
        },
        optimizers_config: { default_segment_number: 1 },
      });
      logger.info(`Collection '${config.QDRANT_COLLECTION_NAME}' created successfully`);
      console.log(`Collection '${config.QDRANT_COLLECTION_NAME}' created successfully`);
    }
  } catch (err) {
    logger.error(`Failed to create/check collection: ${err.stack}`);
    console.error(err.stack);
    process.exit(1);
  }

  process.exit(0);
};

migrate();
