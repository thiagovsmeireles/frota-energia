const fs = require('fs');
const path = require('path');

const backendPath = path.join(__dirname, 'backend');
const outputPath = path.join(__dirname, 'src', 'data', 'frota.json');

const BASE_URL = "https://419a-177-86-10-25.ngrok-free.app"; // Link gerado pelo Ngrok

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) { 
      results = results.concat(getFiles(fullPath));
    } else { 
      results.push(fullPath);
    }
  });
  return results;
}

function generateFrotaData() {
  const frotaData = {};

  if (!fs.existsSync(backendPath)) {
    console.error("Pasta backend não encontrada!");
    return;
  }

  const files = getFiles(backendPath);
  const regex = /[A-Z]{3}[-\s]?[0-9][A-Z0-9][0-9]{2}/i;

  files.forEach(fullPath => {
    const ext = path.extname(fullPath).toLowerCase();
    // Apenas os PDFs (CRLV-e)
    if (ext !== '.pdf') return;

    const fileName = path.basename(fullPath);
    const match = fileName.match(regex);
    if (!match) return;

    // Normaliza a placa
    const normalizedPlate = match[0].replace(/[-\s]/g, '').toUpperCase();
    
    // Determinar o ano baseado no nome do arquivo ou pasta
    let year = '2025';
    if (fullPath.includes('2026')) year = '2026';
    else if (fullPath.includes('2025')) year = '2025';

    // Cria caminho relativo da url
    // Ex: backend\2025\LOCADOS\arquivo.pdf -> 2025/LOCADOS/arquivo.pdf
    // Não precisamos incluir a palavra "backend" no relativo se usamos relativo a backendPath
    const relativePath = path.relative(backendPath, fullPath);
    const urlParts = relativePath.split(path.sep).map(p => encodeURIComponent(p));
    const finalUrl = `${BASE_URL}/backend/${urlParts.join('/')}`;

    const title = `CRLV-e ${year}`;
    const subtitle = `Licenciamento Digital Veicular - ${normalizedPlate}`;

    if (!frotaData[normalizedPlate]) {
      frotaData[normalizedPlate] = [];
    }

    frotaData[normalizedPlate].push({
      id: `${normalizedPlate}-${frotaData[normalizedPlate].length + 1}`,
      title,
      subtitle,
      url: finalUrl
    });
  });

  fs.writeFileSync(outputPath, JSON.stringify(frotaData, null, 2), 'utf-8');
  console.log('frota.json gerado com sucesso contendo apenas CRLV-e 2025/2026!');
}

generateFrotaData();
