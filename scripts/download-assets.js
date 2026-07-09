import fs from 'fs';
import path from 'path';
import https from 'https';

const assets = [
  {
    url: 'https://redling-hotel.com.ua/wp-content/themes/redling/assets/img/logo.svg',
    filepath: 'public/assets/img/logo.svg'
  },
  {
    url: 'https://redling-hotel.com.ua/wp-content/themes/redling/assets/img/side.jpg',
    filepath: 'public/assets/img/side.jpg'
  },
  {
    url: 'https://redling-hotel.com.ua/wp-content/themes/redling/assets/img/svg/down.svg',
    filepath: 'public/assets/img/svg/down.svg'
  },
  {
    url: 'https://redling-hotel.com.ua/wp-content/themes/redling/assets/img/xvisa.png.pagespeed.ic.V7TtmNMAru.png',
    filepath: 'public/assets/img/visa.png'
  },
  {
    url: 'https://redling-hotel.com.ua/wp-content/themes/redling/assets/img/xmaster.png.pagespeed.ic.jCLIIKTKDm.png',
    filepath: 'public/assets/img/master.png'
  },
  {
    url: 'https://redling-hotel.com.ua/wp-content/themes/redling/assets/img/xpb24.png.pagespeed.ic.Tjzaicx_Gl.png',
    filepath: 'public/assets/img/pb24.png'
  },
  {
    url: 'https://redling-hotel.com.ua/wp-content/themes/redling/assets/img/xcomodo.png.pagespeed.ic.AX_6zWNz15.png',
    filepath: 'public/assets/img/comodo.png'
  }
];

function download(url, filepath) {
  return new Promise((resolve, reject) => {
    // Ensure directory exists
    const dirname = path.dirname(filepath);
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }

    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filepath}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log('Starting asset downloads...');
  for (const asset of assets) {
    try {
      await download(asset.url, asset.filepath);
    } catch (err) {
      console.error(`Error downloading ${asset.url}:`, err.message);
    }
  }
  console.log('All downloads finished.');
}

main();
