import { Encoder, QRByte, QRKanji, ErrorCorrectionLevel } from '@nuintun/qrcode';

export class QrCodeProvider {
  private qrcode: any;

  constructor() {
    this.qrcode = new Encoder();
  }

  public async encode(name: string) {
    this.qrcode.setEncodingHint(true);
    this.qrcode.setErrorCorrectionLevel(ErrorCorrectionLevel.H);
    try {
      this.qrcode.write('你好世界\n');
      this.qrcode.write(new QRByte(`${name}\n`));
      this.qrcode.write(new QRKanji('こんにちは世界'));
      this.qrcode.make();
    } catch (error) {
      console.error(error);
    }
    console.log(this.qrcode.toDataURL());
  }
}
