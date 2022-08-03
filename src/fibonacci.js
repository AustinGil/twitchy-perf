export default function (iterations) {
  let n1 = 0,
    n2 = 1,
    nextTerm,
    r = 0;

  for (let i = 1; i <= iterations; i++) {
    r += n1;
    nextTerm = n1 + n2;
    n1 = n2;
    n2 = nextTerm;
  }
  return r;
}
