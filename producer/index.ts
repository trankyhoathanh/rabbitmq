import * as amqp from "amqplib";

const queue = "product_inventory";

const maxRetryAttempts = 10;
const retryDelayMs = 5000; // 5 seconds

async function connectWithRetry() {
  let retryCount = 0;
  while (retryCount < maxRetryAttempts) {
    try {
      let connection: any;

      const protocol = process.env.AMQP_PROTOCOL || 'amqp';
      const hostname = process.env.AMQP_HOSTNAME || 'localhost';
      const port = process.env.AMQP_PORT?.toString() || '50672';
      const username = process.env.AMQP_USERNAME || 'user';
      const password = process.env.AMQP_PASSWORD || 'password';
  
      console.log(`${protocol} ${hostname} ${port} ${username} ${password}`);
  
      connection = await amqp.connect({
        protocol: protocol,
        hostname: hostname,
        port: parseInt(port),
        username: username,
        password: password
      });
      const channel = await connection.createChannel();
  
      await channel.assertQueue(queue, { durable: false });
  
      for (let i = 0; i < 100; i++) {
        const text_send = {
          item_id: i.toString(),
          text: i.toString()
        }
  
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(text_send)));
        console.log(" [x] Sent '%s'", text_send);
      }
      
      await channel.close();

      break; // Connection successful, exit the loop
    } catch (error) {
      retryCount++;
      console.error(`Connection attempt ${retryCount} failed: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, retryDelayMs)); // Wait before retrying
    }
  }
  if (retryCount === maxRetryAttempts) {
    console.error('Max retry attempts reached. Could not connect to RabbitMQ.');
    // Handle the error or take necessary actions when the maximum retry attempts are reached.
  }
}

connectWithRetry();