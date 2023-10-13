export const memoToString = (memo: string) => {
  // Get rid of the 0x at the front
  const hex = memo.replace("0x", "");
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    const charCode = parseInt(hex.substring(i, 2), 16);
    str += String.fromCharCode(charCode);
  }
  return str;
};
