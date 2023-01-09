import { Encoder, QRByte, QRKanji, ErrorCorrectionLevel, Decoder } from '@nuintun/qrcode';
import { readFileSync } from 'fs';
import { normalize } from 'path';
import * as QRCode from 'qrcode';
import Jimp from 'jimp';
import { BarcodeReaders } from '../constants';
import jsQR from 'jsqr';
import javascriptBarcodeReader from 'javascript-barcode-reader';

export const barcodeFormats = Object.values(BarcodeReaders);

/**
 * Decodes a buffer containing a QR code into an ascii string.
 */
export const qrtoa = async (buffer: Buffer): Promise<string> => {
  const image = await Jimp.read(buffer);
  const result = jsQR(new Uint8ClampedArray(image.bitmap.data), image.bitmap.width, image.bitmap.height);
  if (!result) {
    return Promise.reject(new Error('Failed to parse qr_code'));
  }
  return result.data;
};
/**
 * Decodes a buffer containing a QR code into an ascii string.
 */
export const bctoa = async (buffer: Buffer, format?: BarcodeReaders, reportFormat = false): Promise<string> => {
  const image = await Jimp.read(buffer);
  let code;
  for (const barcode of format ? [format] : barcodeFormats) {
    code = await javascriptBarcodeReader({
      barcode,
      image: {
        data: new Uint8ClampedArray(image.bitmap.data),
        width: image.bitmap.width,
        height: image.bitmap.height,
      },
    });
    if (code) {
      if (reportFormat) {
        process.stdout.write(`barcode="${barcode}"\n`);
      }
      break;
    }
  }
  if (!code) {
    return Promise.reject(new Error(`Failed to parse barcode as "${format}"`));
  }
  return code;
};

export class QrCodeProvider {
  private qrcode: any;

  private qrcodeDecoder: any;

  constructor() {
    this.qrcode = new Encoder();
    this.qrcodeDecoder = new Decoder();
  }

  async atoqr(ascii: string, output: 'dataUrl' | string = 'dataUrl'): Promise<any> {
    if (output === 'dataUrl') {
      return QRCode.toDataURL(ascii);
    }
    return QRCode.toFile(output, ascii);
  }

  public async encodeDecodeMain(command: string, qr_code: string, format_type: string, ascii_code: string) {
    switch (command) {
      case 'decode': {
        const dataUrlOrFile = qr_code as string;
        const format = format_type as 'qrcode' | 'barcode' | BarcodeReaders;
        const [, content] = dataUrlOrFile.match(/^data:image\/(?:jpeg|png|bmp|tiff|gif);base64,(.+)$/) || [];
        const isDataUrl = !!content;
        const buffer = isDataUrl ? Buffer.from(content, 'base64') : readFileSync(normalize(dataUrlOrFile));
        if (format === 'qrcode') {
          const ascii = await qrtoa(buffer);
          process.stdout.write(ascii);
        } else {
          const reportFormat = format === 'barcode';
          const ascii = await bctoa(buffer, format === 'barcode' ? undefined : format, reportFormat);
          process.stdout.write(ascii);
        }
        break;
      }
      case 'encode': {
        const ascii = ascii_code as string;
        const file: string | undefined = 'dataUrl';
        const qrCode = await this.atoqr(ascii, file);
        process.stdout.write(qrCode);
        break;
      }
    }
  }
}
