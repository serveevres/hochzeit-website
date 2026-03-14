// Hilfsskript zum Erstellen eines bcrypt-Passwort-Hashes für .env
// Ausführen: node hash-password.js deinPasswort

const bcrypt = require('bcryptjs');

const password = process.argv[2];
if (!password) {
  console.error('Bitte ein Passwort angeben: node hash-password.js deinPasswort');
  process.exit(1);
}

bcrypt.hash(password, 12).then(hash => {
  console.log('\nFüge folgende Zeile in deine .env Datei ein:\n');
  console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
});
