import fs from 'fs';
import { config } from '../../config/index.js';
import { getLogger } from '../utils/errorLogger.js';

const logger = getLogger('logs/worker-utils.log');

/**
 * Check if there are pending items in the queue
 * @returns {boolean} True if queue has pending items
 */
export const hasQueueItems = () => {
  try {
    if (!fs.existsSync(config.QUEUE_FILE)) return false;
    
    const queueData = JSON.parse(fs.readFileSync(config.QUEUE_FILE, 'utf-8'));
    return Array.isArray(queueData) && queueData.length > 0;
  } catch (error) {
    logger.error('Error checking queue:', error);
    return false;
  }
};

/**
 * Get queue status information
 * @returns {Object} Queue status details
 */
export const getQueueStatus = () => {
  try {
    if (!fs.existsSync(config.QUEUE_FILE)) {
      return { items: 0, pending: 0, processing: 0 };
    }
    
    const queueData = JSON.parse(fs.readFileSync(config.QUEUE_FILE, 'utf-8'));
    if (!Array.isArray(queueData)) {
      return { items: 0, pending: 0, processing: 0 };
    }
    
    const pending = queueData.filter(item => item.status === 'pending').length;
    const processing = queueData.filter(item => item.status === 'processing').length;
    
    return {
      items: queueData.length,
      pending,
      processing
    };
  } catch (error) {
    logger.error('Error getting queue status:', error);
    return { items: 0, pending: 0, processing: 0, error: error.message };
  }
};