const Database = require('better-sqlite3');
const fs = require('fs');

const db = new Database('data/threadless.db');

// Executa o schema automaticamente
const schema = fs.readFileSync('src/db/schema.sql', 'utf8');
db.exec(schema);

module.exports = db;
