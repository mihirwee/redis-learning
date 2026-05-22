import Redis from 'ioredis';

const redis = new Redis();

async function startWorker() {
  while (true) {
    const job = await redis.rpop('emailQueue');

    if (job) {
      const data = JSON.parse(job);
      console.log('Processing email:', data);
    }

    await new Promise((res) => setTimeout(res, 1000));
  }
}

startWorker();
