function isDecimal(number) {
  return number.toString().includes(".");
}

function isNumber(value) {
  return !isNaN(parseInt(value));
}

function isOperator(operator) {
  const operators = ["+", "-", "/", "*", "^"];
  return operators.includes(operator);
}

function last(element) {
  if (typeof element === "object") return element[element.length - 1] || "";
  return element.toString().slice(-1) || "";
}

export { isDecimal, isNumber, isOperator, last };
