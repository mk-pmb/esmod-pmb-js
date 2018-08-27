import lc1st from 'lodash.lowerfirst';

async function main(...input) {
  const prs = input.map(async s => lc1st(s));
  const arr = await Promise.all(prs);
  console.log(arr);
}

main('foo', 'bar');
