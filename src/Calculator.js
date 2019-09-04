import React, { Component } from "react";
import Display from "./components/display";
import Keypad from "./components/keypad";
import NavigationButtons from "./components/navigationButtons";
import { isDecimal, isNumber, isOperator, last } from "./utils/utils";
import evaluate from "./utils/evaluate";

class Calculator extends Component {
  state = {
    keys: [
      ["C", "( )", "xⁿ", "÷"],
      ["1", "2", "3", "×"],
      ["4", "5", "6", "–"],
      ["7", "8", "9", "+"],
      ["±", "0", "•", "="]
    ],
    keyColors: [
      ["td", "tp", "tp", "tp"],
      ["", "", "", "tp"],
      ["", "", "", "tp"],
      ["", "", "", "tp"],
      ["", "", "", "tw bp"]
    ],
    expression: "",
    result: 0,
    values: []
  };

  constructor() {
    super();

    window.addEventListener("keydown", e => {
      if (isNumber(e.key)) this.handleAction(e);
      else if (e.key === "Backspace") this.handleBackspace();
      else if (e.key === ".") this.pushDot();
      else if (e.key === "Enter") this.calculate();
      else if (isOperator(e.key)) {
        this.handleAction(e, e.key);
      }
    });
  }

  handleAction = (e, key) => {
    let { values } = this.state;
    let value = key
      ? key
      : e.type === "keydown"
      ? e.key
      : this.getOperator(e.target.innerHTML);

    if (isNumber(value)) {
      this.pushDigit(value);
    } else {
      if (value === "C") {
        this.handleClear();
        return false;
      } else if (isOperator(value) && values.length) {
        this.pushOperator(value);
      } else if (value === "=") {
        this.calculate();
      } else if (value === "•") {
        this.pushDot();
      } else if (value === "( )") {
        this.handleBrackets();
      } else if (value === "±") {
        this.handlePlusMinus();
      }
    }
    this.updateState();
  };

  handleBackspace = () => {
    let { values } = this.state;
    if (isNumber(last(values)) || last(values).endsWith(".")) {
      if (last(values).length === 1 || values[0] === "-") values.pop();
      else values.push(values.pop().toString().slice(0, -1));
    } else {
      values.pop();
    }
    this.setState({ values });
    this.updateState();
  };

  handleClear = () => {
    this.setState({
      result: 0,
      expression: "",
      values: []
    });
  };

  pushOperator = operator => {
    let { values } = this.state;
    if (isOperator(last(values)) && !last(values).match(/\(|\)/)) {
      values.pop();
    }
    if (operator !== last(values) && last(values) !== "(")
      values.push(operator);
    this.setState({ values });
  };

  pushDot = () => {
    let { values } = this.state;
    if (isNumber(last(values)) && !isDecimal(last(values))) {
      values.push(`${values.pop()}.`);
    }
    this.setState({ values });
  };

  calculate = () => {
    const { result } = this.state;
    let res = document.getElementById("resultContainer").classList;
    let exp = document.getElementById("expressionContainer").classList;
    res.add("transition-4s", "result-slide-up");
    exp.add("transition-2s", "slide-up");
    setTimeout(() => {
      res.remove("transition-4s", "result-slide-up");
      exp.remove("transition-2s", "slide-up");
      let final = result === Infinity ? "0" : result.toString();
      this.setState({
        values: [final],
        expression: final,
        result: 0
      });
      return;
    }, 400);
  };

  handleBrackets = () => {
    let { values } = this.state;
    let leftCount = values.filter(i => i === "(").length;
    let rightCount = values.filter(i => i === ")").length;
    let bracket = leftCount === rightCount ? "(" : ")";

    if (isNumber(last(values)) && bracket === "(") values.push("*");
    if (!last(values).match(/\(|\)/) || rightCount < leftCount) values.push(bracket);
    if (isOperator(values[values.length - 2]) && bracket === ")") values.pop();
    this.setState({ values });
  };

  handlePlusMinus = () => {
    let { values } = this.state;
    if (isNumber(last(values))) {
      if (last(values).toString()[0] !== "-") {
        let lastNumber = values.pop();
        values.push("(", `-${lastNumber}`);
      } else {
        let lastNumber = Math.abs(values.pop());
        values.pop();
        values.push(lastNumber);
      }
    }
    this.setState({ values });
  };

  pushDigit = value => {
    let { values } = this.state;
    if (!isNumber(last(values))) {
      if (last(values) === ")") values.push("*");
      values.push(value);
    } else values.push(`${values.pop() || ""}${value}`);

    this.setState({ values });
  };

  printExpression = values => {
    let expression = "";
    values.forEach(item => {
      if (isNumber(item)) expression += item.toString();
      else expression += ` ${this.getSymbol(item)} `;
    });
    return expression;
  };

  getOperator = symbol => {
    let symbols = ["+", "–", "÷", "×", "xⁿ"];
    let operators = ["+", "-", "/", "*", "^"];
    return operators[symbols.indexOf(symbol)] || symbol;
  };

  getSymbol = operator => {
    let operators = ["+", "-", "/", "*", "^"];
    let symbols = ["+", "–", "÷", "×", "^"];
    return symbols[operators.indexOf(operator)] || operator;
  };

  updateState = () => {
    let { result, values } = this.state;
    if (last(values) === "(")
      result = evaluate(values.slice(0, values.length - 2));
    else if (!isNumber(last(values)))
      result = evaluate(values.slice(0, values.length - 1));
    else if (!values.length) result = 0;
    else result = evaluate(values);

    if(result.toString().length > 9)
    result = Number(result).toExponential(3);

    this.setState({ result, expression: this.printExpression(values) });
  };

  render() {
    const { expression, result, keys, keyColors } = this.state;
    return (
      <div className="container main-container">
        <Display expression={expression} result={result} />
        <Keypad
          keys={keys}
          keyColors={keyColors}
          onAction={this.handleAction}
          onBackspace={this.handleBackspace}
        />
        <NavigationButtons />
      </div>
    );
  }
}

export default Calculator;
