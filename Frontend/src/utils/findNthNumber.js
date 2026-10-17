export const findNthNumber = (n) => {
  if (n < 1 || n > 50) {
    throw new Error("n must be between 1 and 50");
  }
  
  if (n <= 4) return n;
  
  let a = 1, b = 2, c = 3, d = 4;
  
  for (let i = 5; i <= n; i++) {
    let next = a + b + c + d;
    a = b;
    b = c;
    c = d;
    d = next;
  }
  
  return d;
};
