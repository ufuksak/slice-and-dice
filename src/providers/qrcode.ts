import { Decoder, Encoder, ErrorCorrectionLevel, QRByte, QRKanji } from '@nuintun/qrcode';
import jsQR, { Options } from 'jsqr';

export class QrCodeProvider {
  private qrcode: any;

  private qrcodeDecoder: any;

  timerCapture: null | NodeJS.Timeout;

  canvasElem: null | HTMLCanvasElement;

  gCtx: null | CanvasRenderingContext2D;

  stream: null | MediaStream;

  videoElem: null | HTMLVideoElement;

  getUserMediaHandler: null;

  defaultOption: Options;

  constructor() {
    this.qrcode = new Encoder();
    this.qrcodeDecoder = new Decoder();
    this.timerCapture = null;
    this.canvasElem = null;
    this.gCtx = null;
    this.stream = null;
    this.videoElem = null;
    this.getUserMediaHandler = null;
    this.defaultOption = { inversionAttempts: 'attemptBoth' };
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

  public async decode(link: string) {
    await this.qrcodeDecoder
      .scan(link)
      .then((result: { data: any }) => {
        console.log(result.data);
      })
      .catch((error: any) => {
        console.error(error);
      });
  }

  /**
   * Decodes an image from its src.
   * @param  {DOMElement} imageElem
   * @param  {Object} options     options (optional) - Additional options.
   *  inversionAttempts - (attemptBoth (default), dontInvert, onlyInvert, or invertFirst)
   *  refer to jsqr options: https://github.com/cozmo/jsQR
   */
  async decodeFromImage(img: HTMLImageElement | string, options: { crossOrigin?: string } = {}) {
    let imgDom: HTMLImageElement | null = null;
    const opts = {
      ...this.defaultOption,
      ...options,
    };

    if (typeof img === 'string') {
      imgDom = document.createElement('img');
      if (options.crossOrigin) {
        imgDom.crossOrigin = options.crossOrigin;
      }
      imgDom.src = img;
      const proms = () =>
        new Promise((resolve) => {
          imgDom!.onload = () => resolve(true);
        });
      await proms();
    } else if (+img.nodeType > 0) {
      if (!img.src) {
        throw new Error('The ImageElement must contain a src');
      }
      imgDom = img;
    }

    let code = null;
    if (imgDom) {
      code = this._decodeFromImageElm(imgDom, opts);
    }
    return code;
  }

  _decodeFromImageElm(imgObj: HTMLImageElement, options = {}) {
    const opts: Options = {
      ...this.defaultOption,
      ...options,
    };
    const imageData = this._createImageData(imgObj, imgObj.width, imgObj.height);

    const code = jsQR(imageData.data, imageData.width, imageData.height, opts);

    if (code) {
      return code;
    }

    return false;
  }

  _createImageData(target: CanvasImageSource, width: number, height: number) {
    if (!this.canvasElem) {
      this._prepareCanvas(width, height);
    }

    this.gCtx!.clearRect(0, 0, width, height);
    this.gCtx!.drawImage(target, 0, 0, width, height);

    return this.gCtx!.getImageData(0, 0, this.canvasElem!.width, this.canvasElem!.height);
  }

  _prepareCanvas(width: number, height: number) {
    if (!this.canvasElem) {
      this.canvasElem = document.createElement('canvas');
      this.canvasElem.style.width = `${width}px`;
      this.canvasElem.style.height = `${height}px`;
      this.canvasElem.width = width;
      this.canvasElem.height = height;
    }

    this.gCtx = this.canvasElem.getContext('2d');
  }
}
