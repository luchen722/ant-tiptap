type ImageResult = {
  complete: boolean;
  width: number;
  height: number;
  src: string;
};

interface ImageCache {
  [key: string]: ImageResult;
}

const IMAGE_CACHE: ImageCache = {};

export function resolveImg(src: string): Promise<ImageResult> {
  return new Promise((resolve, reject) => {
    const result: ImageResult = {
      complete: false,
      width: 0,
      height: 0,
      src,
    };

    if (!src) {
      reject(result);
      return;
    }

    if (IMAGE_CACHE[src]) {
      resolve({ ...IMAGE_CACHE[src] });
      return;
    }

    const img = new Image();

    img.onload = () => {
      result.width = img.width;
      result.height = img.height;
      result.complete = true;

      IMAGE_CACHE[src] = { ...result };
      resolve(result);
    };

    img.onerror = () => {
      reject(result);
    };

    img.src = src;
  });
}
export const enum ImageAlign {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
};
export const enum ImageDisplay {
  INLINE = 'inline',
  BREAK_TEXT = 'block',
  FLOAT_LEFT = 'left',
  FLOAT_RIGHT = 'right',
};
export const Display = {
  inline: ``,
  block: `display: block`,
  left: `float: left;margin-left: 0;margin-right: 12px`,
  right: `float: right;margin-left: 12px;margin-right: 0`,
};

export const Align = {
  left: 'margin-left: 0;margin-right: auto',
  center: 'margin-left: auto;margin-right: auto',
  right: 'margin-left: auto;margin-right: 0'
};
