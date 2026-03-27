import { ServiceBusClient } from '@azure/service-bus';
import dotenv from 'dotenv';
dotenv.config();

// Service Bus connection string
const connectionString = process.env.sbconnectionString;

// Queue name
const queueName = process.env.deletequeueName;

// Service Bus client instance
let serviceBusClient = null;

/**
 * Get Service Bus client instance
 * @returns {ServiceBusClient} Service Bus client
 */
function getServiceBusClient() {
  if (!serviceBusClient) {
    serviceBusClient = new ServiceBusClient(connectionString);
  }
  return serviceBusClient;
}

/**
 * Send message to Service Bus queue
 * @param {Object} messageBody - The message body to send
 * @param {string} messageId - Optional message ID
 * @returns {Promise<void>}
 */
export async function sendServiceBusMessage(messageBody, messageId = null) {
  const serviceBusClient = getServiceBusClient();
  const sender = serviceBusClient.createSender(queueName);

  try {
    const message = {
      body: messageBody,
      messageId: messageId || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      contentType: 'application/json',
      subject: 'PostDeleted'
    };

    await sender.sendMessages(message);
    console.log('✅ Message sent to Service Bus:', message.messageId);
  } catch (error) {
    console.error('❌ Error sending message to Service Bus:', error);
    throw error;
  } finally {
    await sender.close();
  }
}

/**
 * Receive messages from Service Bus queue
 * @param {Function} messageHandler - Function to handle received messages
 * @param {Object} options - Receiver options
 * @returns {Promise<void>}
 */
export async function receiveServiceBusMessages(messageHandler, options = {}) {
  const serviceBusClient = getServiceBusClient();
  const receiver = serviceBusClient.createReceiver(queueName, {
    receiveMode: 'peekLock',
    ...options
  });

  try {
    console.log('🔄 Starting message receiver...');

    while (true) {
      const messages = await receiver.receiveMessages(1, { maxWaitTimeInMs: 5000 });

      if (messages.length > 0) {
        const message = messages[0];

        try {
          await messageHandler(message);
          await receiver.completeMessage(message);
          console.log('✅ Message processed and completed:', message.messageId);
        } catch (error) {
          console.error('❌ Error processing message:', error);
          await receiver.abandonMessage(message);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error in message receiver:', error);
  } finally {
    await receiver.close();
  }
}

/**
 * Close Service Bus client connection
 * @returns {Promise<void>}
 */
export async function closeServiceBusClient() {
  if (serviceBusClient) {
    await serviceBusClient.close();
    serviceBusClient = null;
    console.log('🔌 Service Bus client closed');
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await closeServiceBusClient();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeServiceBusClient();
  process.exit(0);
});