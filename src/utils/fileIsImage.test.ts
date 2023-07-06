import { fileIsImage } from './fileIsImage';

describe('fileIsImage', () => {
  it('should return true for valid image mimetypes', () => {
    const validMimetypes = [
      'image/png',
      'image/jpeg',
      'image/gif',
      'image/webp',
    ];

    validMimetypes.forEach(mimetype => {
      expect(fileIsImage(mimetype)).toBeTruthy();
    });
  });

  it('should return false for invalid image mimetypes', () => {
    const invalidMimetypes = [
      'text/plain',
      'application/json',
      'image/svg+xml',
    ];

    invalidMimetypes.forEach(mimetype => {
      expect(fileIsImage(mimetype)).toBeFalsy();
    });
  });
});
