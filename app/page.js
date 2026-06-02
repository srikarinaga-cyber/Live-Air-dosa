import fs from 'fs';
import path from 'path';
import Script from 'next/script';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bodyHtml = fs.readFileSync(path.join(__dirname, 'body.html'), 'utf8');

export default function Page() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      <Script src="/airdosa.js" strategy="afterInteractive" />
    </>
  );
}
