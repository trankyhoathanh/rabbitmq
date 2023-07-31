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
<img width="1389" alt="Tran Ky Hoa Thanh https://tranthanh92.com" src="https://github-production-user-asset-6210df.s3.amazonaws.com/8115919/257315937-67b68927-11d7-4bad-98f4-33e0141d6e25.png">