import React from "react";

const Display = ({ expression, result }) => {
  return (
    <div className="display-container px-3 pt-3 pb-1">
      <Expression expression={expression} />
      <Result result={result} />
    </div>
  );
};

const Expression = ({ expression }) => {
  return (
    <div className="expression-container" id="expressionContainer">
      <div className="expression" id="expression">
        {expression}
        <span className="blinking-cursor">|</span>
      </div>
    </div>
  );
};

const Result = ({ result }) => {
  return (
    <div className="result-container" id="resultContainer">
      <div className="result" id="result">
        {result}
      </div>
    </div>
  );
};

export default Display;
