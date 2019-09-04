import React from "react";

const NavigationButtons = () => {
  const icons = ["menu", "check_box_outline_blank", "arrow_back_ios"];
  return (
    <div className="navigation-buttons row">
      {icons.map((icon, index) => (
        <div key={index} className="col-4">
          <i className="material-icons">{icon}</i>
        </div>
      ))}
    </div>
  );
};

export default NavigationButtons;
