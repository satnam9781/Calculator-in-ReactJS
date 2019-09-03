function isDecimal(number) {
  return parseInt(number) !== Number(number);
}

function isNumber(value) {
  return !isNaN(parseInt(value));
}

function last(element) {
  if (typeof element === "object") return element[element.length - 1] || "";
  return element.toString().slice(-1) || "";
}

export { isDecimal, isNumber, last };
