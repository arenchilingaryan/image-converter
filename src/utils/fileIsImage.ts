import { imageExtension } from './constants';

export const fileIsImage = (mimetype: string) =>
  imageExtension.includes(mimetype);
