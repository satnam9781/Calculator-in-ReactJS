import React, { Component } from "react";

class Calculator extends Component {
  state = {
    buttons: [
      [
        { v: "C", c: "text-danger" },
        { v: "( )", c: "text-primary" },
        { v: "%", c: "text-primary" },
        { v: "÷", c: "text-primary" }
      ],
      [{ v: "1" }, { v: "2" }, { v: "3" }, { v: "×", c: "text-primary" }],
      [{ v: "4" }, { v: "5" }, { v: "6" }, { v: "–", c: "text-primary" }],
      [{ v: "7" }, { v: "8" }, { v: "9" }, { v: "+", c: "text-primary" }],
      [
        { v: "±" },
        { v: "0" },
        { v: "•" },
        { v: "=", c: "text-white bg-primary" }
      ]
    ],
    expression: "",
    result: 0,
    values: []
  };

  constructor() {
    super();

    // Perform actions, when a key is pressed from keyboard
    window.addEventListener("keydown", e => {
      let operators = ["+", "-", "/", "*", "%"];

      // If it is number key, pass it to "handleAction()"
      if (isNumber(e.key)) this.handleAction(e);
      // If it is backspace key, then call the backspace function
      else if (e.key === "Backspace") this.handleBackspace();
      // If it is dot(•) key, then pass the dot to "handleAction()"
      else if (e.key === ".") this.handleAction(e, "•");
      // If it is "=" key, pass it to "handleAction()"
      else if (e.key === "Enter") this.handleAction(e, "=");
      // If it is a symbol key, then verify the operator and pass it to "handleAction()"
      else if (operators.includes(e.key)) {
        this.handleAction(e, e.key);
      }
    });
  }

  // To remove a character when backspace is pressed
  handleBackspace = () => {
    let { expression, result, values } = this.state;

    // If last character is a number, a dot, or a minus sign, then remove the last character
    if (
      isNumber(lastChar(expression)) ||
      lastChar(expression) === "." ||
      lastChar(expression) === "-"
    ) {
      // Removing last 1 character
      expression = expression.slice(0, -1);

      // If the complete number has been removed, then remove it from array of values also
      if (
        values[values.length - 1].toString().length === 1 ||
        values[0] === "-"
      )
        values.pop();
      // Otherwise remove the last character from the last value in the array
      else
        values.push(
          values
            .pop()
            .toString()
            .slice(0, -1)
        );
    }

    // Otherwise, remove last 3 characters, because the last character is an operator, having two spaces around it
    else {
      expression = expression.slice(0, -3);
      values.pop();
    }

    // Print "-" as "-0" in result
    if (lastChar(expression) === "-") result = "-0";
    // Otherwise calculate the result
    else if (lastChar(expression) === " ")
      result = calculate(values.slice(0, values.length - 1));
    else if (expression === "") result = 0;
    else result = calculate(values);
    this.setState({ expression, result, values });
  };

  // To handle the actions when a button is pressed
  handleAction = (e, val) => {
    let operators = ["+", "–", "÷", "×", "%", "-", "/", "*"];
    let value;

    // Use argument value, if it is passed
    if (val) value = val;
    else {
      // Get the value of key pressed from keyboard
      if (e.type === "keydown") value = e.key;
      // or Get the value from the graphical buttons in calculator
      else value = e.target.innerHTML;
    }

    let { expression, result, values } = this.state;

    // If value is not a number
    if (isNaN(value)) {
      // If clear button is pressed
      if (value === "C") {
        // Clear all the data in variables
        this.setState({
          result: 0,
          expression: "",
          values: []
        });
        return;
      }

      // If an operator is pressed
      else if (operators.includes(value)) {
        // Store the operator in array and display it in expression
        if (
          isNumber(values[values.length - 1]) ||
          values[values.length - 1] === ")"
        ) {
          if (val) {
            values.push(val);
            expression += ` ${getSymbol(value)} `;
          } else {
            values.push(getOperator(value));
            expression += ` ${value} `;
          }
        } else {
          if (val && val !== values[value.length - 1]) {
            values.pop();
            values.push(value);
            expression = expression.slice(0, -3) + ` ${getSymbol(value)} `;
          } else if (value !== values[values.length - 1]) {
            values.pop();
            values.push(getOperator(value));
            expression = expression.slice(0, -3) + ` ${value} `;
          }
        }
      }

      // If dot(•) is pressed
      else if (value === "•") {
        // If last value is a number and is integer
        if (
          isNumber(lastChar(expression)) &&
          !isDecimal(values[values.length - 1])
        ) {
          // Then add the dot in number and display it in expression
          values.push(`${values.pop()}.`);
          expression += ".";
        }
      }

      // If "Equals to" is pressed
      else if (value === "=") {
        let res = document.getElementById("resultContainer").classList;
        let exp = document.getElementById("expressionContainer").classList;

        // Add CSS classes to perform slide up animation
        res.add("transition-4s");
        res.add("result-slide-up");
        exp.add("transition-2s");
        exp.add("slide-up");

        // Set result to 0, expression to result when the animation is completed
        setTimeout(() => {
          values = [Number(result)];
          expression = result.toString();
          result = 0;

          // After assigning values, remove the animation CSS classes
          res.remove("transition-4s");
          res.remove("result-slide-up");
          exp.remove("transition-2s");
          exp.remove("slide-up");
          this.setState({ expression, result, values });
          return;
        }, 400);
      }

      // If parenthesis are to be added
      else if (value === "( )") {
        let leftBracketCount = values.filter(i => i === "(").length;
        let rightBracketCount = values.filter(i => i === ")").length;
        let bracket = leftBracketCount === rightBracketCount ? "(" : ")";
        if (isNumber(values[values.length - 1])) values.push("*");
        values.push(bracket);
        expression += ` ${bracket} `;
      }
    }

    // If the value is a number
    else {
      // Add a new number or append the digits to current number
      if (lastChar(expression) === " ") values.push(value);
      else values.push(`${values.pop() || ""}${value}`);
      expression += value;

      // If values are already stored then perform the calculations and print result
      if (values.length) {
        result = calculate(values);
      } else {
        result = values[0];
      }
    }

    // if (result.toString().length > 10) {
    //   result = Number(result).toPrecision(12);
    // }

    // Now change the state of the application
    this.setState({ expression, result, values });
  };

  render() {
    return (
      <div className="container main-container">
        <div className="display-container px-3 pt-3 pb-1">
          <div className="expression-container" id="expressionContainer">
            <div className="expression" id="expression">
              {this.state.expression}
              <span className="blinking-cursor">|</span>
            </div>
          </div>
          <div className="result-container" id="resultContainer">
            <div className="result" id="result">
              {this.state.result}
            </div>
          </div>
        </div>
        <div className="backspace text-right pr-3 pb-0 pt-3">
          <button onClick={this.handleBackspace}>
            <i className="material-icons">backspace</i>
          </button>
        </div>
        <div className="buttons-container px-2 pt-0 pb-3">
          {this.state.buttons.map((row, i) => (
            <div key={i}>
              {" "}
              {row.map((btn, i) => (
                <button
                  key={i}
                  onClick={this.handleAction}
                  className={btn.c || ""}
                >
                  {btn.v}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="navigation-buttons row">
          <div className="col-4">
            <i className="material-icons">menu</i>
          </div>
          <div className="col-4">
            <i className="material-icons">check_box_outline_blank</i>
          </div>
          <div className="col-4">
            <i className="material-icons">arrow_back_ios</i>
          </div>
        </div>
      </div>
    );
  }
}

// Return "true" is the number is floating point number
function isDecimal(number) {
  return parseInt(number) !== Number(number);
}

// Returns the last character of the string
function lastChar(string) {
  return string.charAt(string.length - 1);
}

// To check the given values is number or not
function isNumber(value) {
  return !isNaN(parseInt(value));
}

// To return the result after applying the passed operator on two passed operands
function calculate(infixValues) {
  let postfix = infixToPostfix(infixValues);
  return evaluatePostfix(postfix);
}

// To check the priority of the operators
function priority(x) {
  if (x === "(") return 0;
  if (x === "+" || x === "-") return 1;
  if (x === "*" || x === "/") return 2;
}

// To convert the infix expression into postfix expression
function infixToPostfix(infix) {
  // For Conversion, Infix to Postfix algorithm is used
  let postfix = [],
    temp = [];
  infix.forEach(item => {
    if (isNumber(item)) postfix.push(item);
    else if (item === "(") temp.push(item);
    else if (item === ")") {
      let x;
      while ((x = temp.pop()) !== "(") postfix.push(x);
    } else {
      while (priority(temp[temp.length - 1]) >= priority(item))
        postfix.push(temp.pop());
      temp.push(item);
    }
  });
  while (temp.length) {
    let item = temp.pop();
    if (item !== "(") postfix.push(item);
  }

  return postfix;
}

// To evaluate a postfix expression
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

// Returns the original operator for a symbol
function getOperator(symbol) {
  let symbols = ["+", "–", "÷", "×"];
  let operators = ["+", "-", "/", "*"];
  return operators[symbols.indexOf(symbol)];
}

// Returns the original operator for a symbol
function getSymbol(operator) {
  let operators = ["+", "-", "/", "*"];
  let symbols = ["+", "–", "÷", "×"];
  return symbols[operators.indexOf(operator)];
}

export default Calculator;
