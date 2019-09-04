import { isNumber } from "./utils";

function priority(x) {
  if (x === "(") return 0;
  if (x === "+" || x === "-") return 1;
  if (x === "*" || x === "/") return 2;
  if (x === "^") return 3;
}

function infixToPostfix(infix) {
  let postfix = [],
    stack = [];
  infix.forEach(item => {
    if (isNumber(item)) postfix.push(item);
    else if (item === "(") stack.push(item);
    else if (item === ")") {
      let x;
      while ((x = stack.pop()) !== "(") postfix.push(x);
    } else {
      while (priority(stack[stack.length - 1]) >= priority(item))
        postfix.push(stack.pop());
      stack.push(item);
    }
  });
  while (stack.length) {
    let item = stack.pop();
    if (item !== "(") postfix.push(item);
  }
  return postfix;
}

function evaluatePostfix(expression) {
  let result = [];
  expression.forEach(item => {
    if (isNumber(item)) result.push(Number(item));
    else {
      let a = result.pop();
      let b = result.pop();
      if (b !== undefined) {
        switch (item) {
          case "+":
            result.push(b + a);
            break;
          case "-":
            result.push(b - a);
            break;
          case "*":
            result.push(b * a);
            break;
          case "/":
            result.push(b / a);
            break;
          case "^":
            result.push(Math.pow(b, a));
            break;
          default:
            break;
        }
      } else {
        result.push(a);
      }
    }
  });

  return result.pop();
}

export default function evaluate(infix) {
  let postfix = infixToPostfix(infix);
  return evaluatePostfix(postfix) || 0;
}
