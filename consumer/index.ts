import * as amqp from "amqplib";

const queue = "product_inventory";

const maxRetryAttempts = 10;
const retryDelayMs = 5000; // 5 seconds

async function connectWithRetry() {
  let retryCount = 0;
  while (retryCount < maxRetryAttempts) {
    try {
      const protocol = process.env.AMQP_PROTOCOL || 'amqp';
      const hostname = process.env.AMQP_HOSTNAME || 'localhost';
      const port = process.env.AMQP_PORT?.toString() || '50672';
      const username = process.env.AMQP_USERNAME || 'user';
      const password = process.env.AMQP_PASSWORD || 'password';

      console.log(`${protocol} ${hostname} ${port} ${username} ${password}`);
      
      const connection = await amqp.connect({
        protocol: protocol,
        hostname: hostname,
        port: parseInt(port),
        username: username,
        password: password
      });
      const channel = await connection.createChannel();

      process.once("SIGINT", async () => {
        await channel.close();
        await connection.close();
      });

      await channel.assertQueue(queue, { durable: false });
      await channel.consume(
        queue,
        (message) => {
          if (message) {
            console.log(
              " [x] Received '%s'",
              JSON.parse(message.content.toString())
            );
          }
        },
        { noAck: true }
      );

      console.log(" [*] Waiting for messages. To exit press CTRL+C");

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
