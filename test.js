const bcrypt = require('bcryptjs');

const result = async () => {
  const password = '$2a$10$m.LqguHbxRa4UKzCw.t6mudaRPZrethCZsSS9FpZMuttaM476T5.C';
  const t = await bcrypt.compare('foobar', password);
  return t;
};

console.log(await result());
