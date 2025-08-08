const bcrypt = require('bcrypt');

async function generateHash(password) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  console.log(`Password: ${password}`);
  console.log(`Hash: ${hash}\n`);
}

(async () => {
  await generateHash('I@mABas1cCl!3nt');     // Basic Client
  await generateHash('I@mAnEmpl0y33');       // Happy Employee
  await generateHash('I@mAnAdm!n1strat0r');  // Manager User
})();
