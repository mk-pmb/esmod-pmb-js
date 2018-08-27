import uc1st from 'lodash.upperfirst';

async function main(...input) {
  const prs = input.map(async s => uc1st(s));
  const arr = await Promise.all(prs);
  console.log(arr);
}

main('foo', 'bar');
