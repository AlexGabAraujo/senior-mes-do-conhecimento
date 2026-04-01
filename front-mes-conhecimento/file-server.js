/**
 * Servidor Node.js simples para salvar arquivos na pasta assets durante desenvolvimento
 * Execute: node file-server.js
 * O servidor rodará na porta 3001
 * 
 * Não requer dependências externas - usa apenas módulos nativos do Node.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const UPLOAD_DIR = path.join(__dirname, 'src', 'assets', 'uploads');

// Cria o diretório se não existir
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * Parse multipart/form-data manualmente
 */
function parseMultipart(req, callback) {
  const boundary = req.headers['content-type'].split('boundary=')[1];
  if (!boundary) {
    callback(new Error('No boundary found'));
    return;
  }

  let data = Buffer.alloc(0);

  req.on('data', chunk => {
    data = Buffer.concat([data, chunk]);
  });

  req.on('end', () => {
    try {
      const parts = data.toString('binary').split('--' + boundary);
      
      for (const part of parts) {
        if (part.includes('filename=')) {
          // Extrai o nome do arquivo
          const filenameMatch = part.match(/filename="(.+?)"/);
          const filename = filenameMatch ? filenameMatch[1] : 'upload.jpg';
          
          // Extrai o conteúdo do arquivo (após os headers)
          const fileStart = part.indexOf('\r\n\r\n') + 4;
          const fileEnd = part.lastIndexOf('\r\n');
          const fileContent = part.substring(fileStart, fileEnd);
          
          callback(null, {
            filename,
            content: Buffer.from(fileContent, 'binary')
          });
          return;
        }
      }
      
      callback(new Error('No file found'));
    } catch (err) {
      callback(err);
    }
  });
}

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/upload') {
    parseMultipart(req, (err, file) => {
      if (err) {
        console.error('❌ Erro ao processar upload:', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Erro ao processar upload' }));
        return;
      }

      // Gera nome único
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 10);
      const ext = path.extname(file.filename) || '.jpg';
      const fileName = `speaker-${timestamp}-${randomId}${ext}`;
      const destPath = path.join(UPLOAD_DIR, fileName);

      // Salva o arquivo
      fs.writeFile(destPath, file.content, (err) => {
        if (err) {
          console.error('❌ Erro ao salvar arquivo:', err.message);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Erro ao salvar arquivo' }));
          return;
        }

        const imagePath = `/assets/uploads/${fileName}`;
        console.log(`✅ Arquivo salvo: ${fileName}`);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          path: imagePath,
          message: 'Upload realizado com sucesso'
        }));
      });
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`🚀 File server rodando em http://localhost:${PORT}`);
  console.log(`📁 Salvando arquivos em: ${UPLOAD_DIR}`);
  console.log(`\n💡 Para usar:`);
  console.log(`   1. Mantenha este servidor rodando`);
  console.log(`   2. Inicie o frontend: npm start`);
  console.log(`   3. Crie uma palestra e selecione uma imagem\n`);
});
