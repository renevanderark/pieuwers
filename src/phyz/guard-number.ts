export const guardNumber = (newNum : number, maxNum : number, minNum : number) : number =>
  newNum > maxNum ? maxNum  : newNum < minNum ? minNum : newNum;
