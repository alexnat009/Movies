import React, { Component } from "react";
class DropDown extends Component {
  render() {
    const { column, onAsc, onDesc } = this.props;
    return (
      <React.Fragment>
        <span className="row ml-2">{column}</span>
        <span className="col-2">
          <button className="btn btn-primary btn-sm m-1" onClick={onAsc}>
            asc
          </button>
          <button className="btn btn-primary btn-sm m-1" onClick={onDesc}>
            desc
          </button>
        </span>
      </React.Fragment>
    );
  }
}

export default DropDown;
