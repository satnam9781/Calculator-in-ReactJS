import React, { Component } from "react";
import Display from "./Display";
import Keypad from "./Keypad";
import NavigationButtons from "./NavigationButtons";
import { isDecimal, isNumber, last } from "./utils/utils";
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
      let operators = ["+", "-", "/", "*", "^"];
      if (isNumber(e.key)) this.handleAction(e);
      else if (e.key === "Backspace") this.handleBackspace();
      else if (e.key === ".") this.handleAction(e, "•");
      else if (e.key === "Enter") this.handleAction(e, "=");
      else if (operators.includes(e.key)) {
        this.handleAction(e, e.key);
      }
    });
  }

  handleBackspace = () => {
    let { values } = this.state;
    if (isNumber(last(values)) || last(values).endsWith(".")) {
      if (last(values).length === 1 || values[0] === "-") values.pop();
      else values.push(values.pop().slice(0, -1));
    } else {
      values.pop();
    }
    this.setState({ values });
    this.updateState();
  };

  handleAction = (e, val) => {
    let operators = ["+", "–", "÷", "×", "%", "-", "/", "*", "^", "xⁿ"];
    let value;

    if (val) value = val;
    else {
      if (e.type === "keydown") value = e.key;
      else value = e.target.innerHTML;
    }

    let { result, values } = this.state;

    if (isNaN(value)) {
      if (value === "C") {
        this.setState({
          result: 0,
          expression: "",
          values: []
        });
        return;
      } else if (operators.includes(value) && values.length) {
        if (isNumber(last(values)) || last(values) === ")") {
          if (val) {
            values.push(val);
          } else {
            values.push(this.getOperator(value));
          }
        } else {
          if (val && val !== last(values)) {
            values.pop();
            values.push(value);
          } else if (value !== last(values)) {
            values.pop();
            values.push(this.getOperator(value));
          }
        }
      } else if (value === "•") {
        if (isNumber(last(values)) && !isDecimal(last(values))) {
          values.push(`${values.pop()}.`);
        }
      } else if (value === "=") {
        let res = document.getElementById("resultContainer").classList;
        let exp = document.getElementById("expressionContainer").classList;
        res.add("transition-4s", "result-slide-up");
        exp.add("transition-2s", "slide-up");
        setTimeout(() => {
          res.remove("transition-4s", "result-slide-up");
          exp.remove("transition-2s", "slide-up");
          this.setState({
            values: [result],
            expression: result.toString(),
            result: 0
          });
          return;
        }, 400);
      } else if (value === "( )") {
        let leftBracketCount = values.filter(i => i === "(").length;
        let rightBracketCount = values.filter(i => i === ")").length;
        let bracket = leftBracketCount === rightBracketCount ? "(" : ")";

        if (isNumber(last(values)) && bracket === "(") values.push("*");
        values.push(bracket);
      } else if (value === "±") {
        if (isNumber(last(values))) {
          if (last(values).toString()[0] !== "-") {
            let lastNumber = values.pop();
            values.push("(", `-${lastNumber}`);
          } else {
            let lastNumber = Math.abs(values.pop());
            values.pop();
            values.push(lastNumber);
          }
          this.updateState();
        }
      }
    } else {
      if (!isNumber(last(values))) {
        if (last(values) === ")") values.push("*");
        values.push(value);
      } else values.push(`${values.pop() || ""}${value}`);
    }

    this.setState({ result, values });
    this.updateState();
  };

  printExpression(values) {
    let expression = "";
    values.forEach(item => {
      if (isNumber(item)) expression += item.toString();
      else expression += ` ${this.getSymbol(item)} `;
    });
    return expression;
  }

  getOperator(symbol) {
    let symbols = ["+", "–", "÷", "×", "xⁿ"];
    let operators = ["+", "-", "/", "*", "^"];
    return operators[symbols.indexOf(symbol)];
  }

  getSymbol(operator) {
    let operators = ["+", "-", "/", "*", "^"];
    let symbols = ["+", "–", "÷", "×", "^"];
    return symbols[operators.indexOf(operator)] || operator;
  }

  updateState() {
    let { result, values } = this.state;
    if (!isNumber(last(values)))
      result = evaluate(values.slice(0, values.length - 1));
    else if (!values.length) result = 0;
    else result = evaluate(values);

    this.setState({ result, expression: this.printExpression(values) });
  }

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