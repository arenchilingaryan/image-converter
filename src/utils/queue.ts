import { Response } from 'express';
import { FileType } from '../types';
import { convert } from './convert';

class ActiveQueue {
  private static instance: ActiveQueue;
  private queue: FileType[] = [];
  private processing: { [key: string]: FileType[] } = {};
  private concurrentLimit = 3;

  private constructor() {}

  public static getInstance(): ActiveQueue {
    if (!ActiveQueue.instance) {
      ActiveQueue.instance = new ActiveQueue();
    }
    return ActiveQueue.instance;
  }

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

    const nextFile = this.queue.shift();

    if (nextFile) {
      if (
        !this.processing[nextFile.token] ||
        this.processing[nextFile.token].length === 0
      ) {
        this.processing[nextFile.token] = [nextFile];
        this.processFile(nextFile, outputType, res);
      } else {
        this.queue.push(nextFile);
        setTimeout(() => this.processNext(outputType, res), 1000);
      }
    }
  }

  private processFile(file: FileType, outputType: string, res: Response): void {
    setTimeout(() => {
      const files = this.processing[file.token];
      if (files) {
        files.shift();
        if (files.length === 0) {
          delete this.processing[file.token];
        }
      }
      convert(file, outputType as 'png' | 'jpeg' | 'gif' | 'webp', file.token);
      this.processNext(outputType, res);
    }, 1000);
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

export const queueService = ActiveQueue.getInstance();
