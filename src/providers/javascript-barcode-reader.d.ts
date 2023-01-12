declare module 'javascript-barcode-reader' {
  export default function javascriptBarcodeReader({
    image,
    barcode,
    barcodeType,
    options,
  }: JavascriptBarcodeReader): Promise<string>;
}
