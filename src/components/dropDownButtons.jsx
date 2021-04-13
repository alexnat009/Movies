import React, { Component } from "react";
import DropDown from "./dropDownButton";
class DropDonwButtons extends Component {
  handleOrder = (paramLabel, columnLabel, order) => {
    const { history, setChanged } = this.props;
    history.push(
      `/movies?sort=${columnLabel.toLowerCase()}&by=${order.toLowerCase()}`
    );
    setChanged(paramLabel, order);
  };
  render() {
    const { getQueryStrings } = this.props;
    return (
      <React.Fragment>
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            sort columns
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            {getQueryStrings.map((col) => (
              <DropDown
                key={col.label}
                column={col.label}
                onAsc={() => this.handleOrder(col.column, col.label, "asc")}
                onDesc={() => this.handleOrder(col.column, col.label, "desc")}
              />
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default DropDonwButtons;
