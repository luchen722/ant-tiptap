import { Editor } from "@tiptap/vue-3";
import { Trans } from "@/i18n";
import { useModel } from "@/hooks";

let locale: any = {};
useModel.on('locale', (value) => {
  locale = value;
});
const i18nHandler = Trans.buildI18nHandler(locale);
const t = (...args: any[]): string => {
  return i18nHandler.apply(Trans, args);
};

// 文件转base64
export function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// 匹配word内容中所有图片
export function extractImageDataFromRtf(rtfData: any) {
  if (!rtfData) {
    return [];
  }

  const regexPictureHeader = /{\\pict[\s\S]+?(\\bliptag-?\d+)?(\\blipupi-?\d+)?{\\\*\\blipuid\s?[\da-fA-F]+[\s}]*?/;
  const regexPicture = new RegExp('(?:(' + regexPictureHeader.source + '))([\\da-fA-F\\s]+)\\}', 'g');
  // /(?:({\\pict[\s\S]+?(\\bliptag-?\d+)?(\\blipupi-?\d+)?{\\\*\\blipuid\s?[\da-fA-F]+[\s}]*?))([\da-fA-F\s]+)\}/g
  const images = rtfData.match(regexPicture);
  const result = [];
  if (images) {
    for (const image of images) {
      let imageType;

      if (image.includes('\\pngblip')) {
        imageType = 'image/png';
      } else if (image.includes('\\jpegblip')) {
        imageType = 'image/jpeg';
      }

      if (imageType) {
        result.push({
          hex: image.replace(regexPictureHeader, '').replace(/[^\da-fA-F]/g, ''),
          type: imageType
        });
      }
    }
  }

  return result;
}
// 将图片转成base64
export function replaceImagesFileSourceWithInlineRepresentation(imageElements: string[], imagesHexSources: string | any[]) {
  const srcs = [];
  console.log(imagesHexSources);

  // Assume there is an equal amount of image elements and images HEX sources so they can be matched accordingly based on existing order.
  if (imageElements.length === imagesHexSources.length) {
    for (let i = 0; i < imageElements.length; i++) {
      const newSrc = `data:${imagesHexSources[i].type};base64,${_convertHexToBase64(imagesHexSources[i].hex)}`;
      srcs.push(newSrc);
    }
  }
  return srcs;
}
function _convertHexToBase64(hexString: any) {
  return btoa(hexString.match(/\w{2}/g)?.map((char: string) => {
    return String.fromCharCode(parseInt(char, 16));
  }).join(''));
}

// base64转文件
export function base64ImgtoFile(dataurl: string, filename = 'file'): File | undefined {
  if (typeof dataurl !== 'string') {
    return;
  }
  // 将base64格式分割：['data:image/png;base64','XXXX']
  const arr = dataurl.split(',');
  // .*？ 表示匹配任意字符到下一个符合条件的字符 刚好匹配到：
  // image/png
  const mime = arr[0].match(/:(.*?);/)![1]; // image/png
  // [image,png] 获取图片类型后缀
  const suffix = mime.split('/')[1]; // png
  const bstr = atob(arr[1]); // atob() 方法用于解码使用 base-64 编码的字符串
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], `${filename}.${suffix}`, {
    type: mime
  });
}

/**
 * 获取本地缓存地址
 * @param base64
 * @return Promise
 */
export const getLocalTemplateUrl = (base64: any): Promise<string> => {
  return new Promise((resolve) => {
    const file = base64ImgtoFile(base64);
    if (file) {
      resolve(URL.createObjectURL(file));
    } else {
      resolve('');
    }
  });
};

export const handlePaste = async(editor: Editor, event: ClipboardEvent): Promise<boolean | undefined> => {
  event.preventDefault();
  const clipData = event.clipboardData;
  if (!clipData) return false;
  const uploadRequest = editor.extensionManager.extensions.find(ext => ext.name === 'image')?.options?.uploadRequest;
  let content = editor.getHTML();
  const images = Array.from(content.matchAll(/<img[^>]*src="((file:\/\/\/)[^"]*)"[^>]*>/g), match => match[1]);
  const result = false;
  const { files } = clipData;

  if (files.length > 0) {
    // 获取文件
    for (const file of files) {
      console.log(file);

      try {
        // 图片
        if (file.type.startsWith('image/')) {
          // 创建临时地址
          const localUrl = await getLocalTemplateUrl(await getBase64(file));
          // 上传图片
          if (uploadRequest) {
            const networkUrl = await uploadRequest(file);
            if (networkUrl) {
              URL.revokeObjectURL(localUrl); // 释放临时地址
              editor.commands.setImage({ src: networkUrl });
            }
          } else {
            editor.commands.setImage({ src: localUrl });
          }
        } else if (file.type.startsWith('video/')) {
          // 创建临时地址
          // const localUrl = URL.createObjectURL(file);
          // console.log(localUrl);
          // const { width, height } = await getVideoDimensions(localUrl)
          // 上传视频
          // if (props.handle_video_url) {
          //   const networkUrl = await props.handle_video_url(file);
          //   const content = editor.getHTML();
          //   URL.revokeObjectURL(localUrl); // 释放临时地址
          //   content.replace(localUrl, networkUrl);
          // } else {
          // editor.commands.setVideo({ src: localUrl, width: '100%', height: '100%' });
          // }
        }
      } catch (e) {
        console.log(e);
      }
    }
  } else {
    const rtf = clipData!.getData('text/rtf');
    if (rtf) {
      if (images.length > 0) {
        const base64List = replaceImagesFileSourceWithInlineRepresentation([...images], extractImageDataFromRtf(rtf));

        let localUrlList = [];

        if (uploadRequest) {
          const FileList = base64List.map(base64 => base64ImgtoFile(base64));
          const PromiseList = FileList.map(file => uploadRequest(file));
          localUrlList = await Promise.all(PromiseList);
        } else {
          localUrlList = base64List.map(base64 => {
            return getLocalTemplateUrl(base64);
          });
        }
        for (const image of images) {
          const index = images.indexOf(image);
          const url = await localUrlList[index];
          content = content.replace(image, url);
        }
      }

      // console.log(content);
      editor.commands.setContent(content);
    }
  }
  return result;
};
