const fs = require('fs');
const path = require('path');

// Copies all files from .next/server/chunks to .next/server so runtime require("./<id>.js") works
function copyChunks() {
  const repoRoot = path.resolve(__dirname, '..');
  const chunksDir = path.join(repoRoot, '.next', 'server', 'chunks');
  const targetDir = path.join(repoRoot, '.next', 'server');

  if (!fs.existsSync(chunksDir)) {
    console.error('Chunks dir not found:', chunksDir);
    process.exit(0);
  }

  const files = fs.readdirSync(chunksDir).filter(f => f.endsWith('.js'));
  if (files.length === 0) {
    console.log('No chunk files to copy');
    return;
  }

  for (const f of files) {
    const src = path.join(chunksDir, f);
    const dest = path.join(targetDir, f);
    try {
      fs.copyFileSync(src, dest);
      console.log('copied', f);
    } catch (err) {
      console.error('failed to copy', f, err.message);
    }
  }
}

if (require.main === module) {
  copyChunks();
}

module.exports = { copyChunks };
