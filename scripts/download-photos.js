import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.join(__dirname, '..', 'public', 'assets', 'img', 'atmosphere');

// Ensure directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const photos = [
  { name: 'photo1.jpg', id: '1MXd2RnJX5RfEdyr-pIsHIrcZqUbyVtKO' },
  { name: 'photo2.jpg', id: '1hKwc0uZs0Mk7ly29u2GLmg7esCzJS3j4' },
  { name: 'photo3.jpg', id: '19GgkzghCkicX-0z9lWZ1wgDAE0wGOlre' },
  { name: 'photo4.jpg', id: '1M_4vBA09qb37-eS6IY9mwsdBmzhsvfri' },
  { name: 'photo5.jpg', id: '1JH2KCRxt-BoaV_-vrJpPpWuhwMMphXOQ' },
  { name: 'photo6.jpg', id: '11DoQ-OMKJNqBtYrpbra_AhdDImYHSKzO' },
  { name: 'photo7.jpg', id: '1ew0EEEaVVYmTPCWxNBHlKf3cwcFDC-H4' },
  { name: 'photo8.jpg', id: '1KLhT3ofwtum7QTvaQu7EKOV75H3xMUW8' },
  { name: 'photo9.jpg', id: '1EnHIqTsEmFigA_CGqyZznMNHuTt8JPAd' },
  { name: 'photo10.jpg', id: '19L40ubAb0eeRTfJhilgjwP9HwYFrEaAV' }
];

const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      const status = response.statusCode;
      // Handle all redirect codes (301, 302, 303, 307, 308)
      if (status >= 300 && status < 400 && response.headers.location) {
        file.close();
        fs.unlink(dest, () => {}); // delete empty file from first request
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (status !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        reject(new Error(`Failed to get '${url}' status code: ${status}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

const run = async () => {
  for (const photo of photos) {
    const destPath = path.join(targetDir, photo.name);
    const url = `https://docs.google.com/uc?export=download&id=${photo.id}`;
    console.log(`Downloading ${photo.name} from ID ${photo.id}...`);
    try {
      await downloadFile(url, destPath);
      console.log(`Successfully downloaded ${photo.name}`);
    } catch (err) {
      console.error(`Failed to download ${photo.name}:`, err.message);
    }
  }
  console.log('All downloads completed!');
};

run();
