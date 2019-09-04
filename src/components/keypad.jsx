import React, { Component } from "react";

class Keypad extends Component {
  getClasses = (row, col) => {
    const { keyColors } = this.props;
    const classes = {
      td: "text-danger",
      tp: "text-primary",
      tw: "text-white",
      bp: "bg-primary"
    };
    return keyColors[row][col]
      .split(" ")
      .map(c => classes[c])
      .join(" ");
  };

  render() {
    const { keys, onAction, onBackspace } = this.props;
    return (
      <React.Fragment>
        <BackspaceButton onBackspace={onBackspace} />

        <div className="keypad px-2 pt-0 pb-3">
          {keys.map((row, rowIndex) => (
            <div key={rowIndex}>
              {row.map((key, keyIndex) => (
                <button
                  key={keyIndex}
                  onClick={onAction}
                  className={this.getClasses(rowIndex, keyIndex)}
                >
                  {key}
                </button>
              ))}
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  }
}

const BackspaceButton = ({ onBackspace }) => {
  return (
    <div className="backspace text-right pr-3 pb-0 pt-3">
      <button onClick={onBackspace}>
        <i className="material-icons">backspace</i>
      </button>
    </div>
  );
};

export default Keypad;
