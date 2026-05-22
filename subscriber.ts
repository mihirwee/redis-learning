import Redis from 'ioredis';
// Simple Redis Pub/Sub example
const sub = new Redis();
sub.subscribe('chatChannel', (err, count) => {
  if (err) {
    console.error('Failed to subscribe: ', err);
  }
});

sub.on('message', (channel, message) => {
  console.log(`Received message from ${channel}: ${message}`);
});
