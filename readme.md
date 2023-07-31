## Overview
- Producer send message from 0 to 99
- Consumer scalable to 4 node. Receive message from Message Broker Rabbit MQ (not duplicate).

## How to run ?
```
docker compose up -d
```

## Producer
- Can retry connection Rabbit MQ (in case rabbit start delay)
- Log message example : [x] Sent '{ item_id: '0', text: '0' }'

## Consumer
- Can retry connection Rabbit MQ (in case rabbit start delay)
- Log message example : [x] Received '{ item_id: '98', text: '98' }'

## Screenshot view status.
<img width="1389" alt="Screenshot 2023-08-01 at 01 29 56" src="https://github.com/trankyhoathanh/rabbitmq/assets/8115919/51a1fd0a-16e7-4977-8aae-42c5ec22dcfe">