import { FileType } from '../types';

export function createQueue(queue: FileType[], concurrentLimit = 3) {
  const queueTokens = queue.map(x => x.token).slice(0, concurrentLimit);
  const uniqueSet = new Set([...queueTokens]);
  const currentQueue: FileType[] = [];

  uniqueSet.forEach(t => {
    const file = queue.find(x => x.token === t);
    if (file) {
      currentQueue.push(file);
    }
  });

  const newQueue = queue.filter(
    qItem => !currentQueue.find(cItem => cItem.hash === qItem.hash)
  );

  return { currentQueue, queue: newQueue };
}
