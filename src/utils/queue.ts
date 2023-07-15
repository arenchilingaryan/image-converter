import { Response } from 'express';
import { FileType } from '../types';
import { convert } from './convert';
import { createQueue } from './createWorkThread';

class ActiveQueue {
  private queue: FileType[] = [];
  private processing: { [key: string]: FileType[] } = {};
  private concurrentLimit = 3;

  constructor() {}

  public getUserData(token?: string): FileType[] {
    return this.queue.filter(file => file.token === token);
  }

  public add(items: FileType[], outputType: string, res: Response): void {
    const filteredItems = items.filter(item => !this.isExistFile(item));
    this.queue.push(...filteredItems);

    this.processNext(outputType, res);
  }

  private processNext(outputType: string, res: Response): void {
    if (
      this.queue.length === 0 ||
      this.getProcessingCount() >= this.concurrentLimit
    ) {
      return;
    }

    const { currentQueue, queue } = createQueue(this.queue);
    this.queue = queue;
    for (const item of currentQueue) {
      convert(
        item,
        outputType as 'png' | 'jpeg' | 'gif' | 'webp',
        item.token,
        newFile => {
          this.queue.push(newFile);
        }
      );
    }

    if (queue.filter(x => x.status === 'waiting').length > 0) {
      this.processNext(outputType, res);
    }
  }

  public isExistFile(fileData: FileType): boolean {
    const file = this.queue.find(
      file =>
        file.token === fileData.token &&
        file.hash === fileData.hash &&
        file.width === fileData.width &&
        file.height === fileData.height &&
        file.name === fileData.name &&
        file.inType === fileData.inType &&
        file.outType === fileData.outType
    );
    return !!file;
  }

  private getProcessingCount(): number {
    return Object.values(this.processing).reduce(
      (total, files) => total + files.length,
      0
    );
  }
}

export const queueService = new ActiveQueue();
