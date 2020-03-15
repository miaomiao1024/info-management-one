import React, { Component, } from 'react';
import './index.styl'

class Kibana extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.handleToSearch = this.handleToSearch.bind(this);
  }
  componentDidMount() {
    this.handleToSearch()
  }
  handleToSearch() {
    window.location.href = 'http://10.112.12.81:5601/'
  }
  render() {
    return (
      <div className="Kibana">
        <p>Kibana加载中......</p>
      </div>
    );
  }
}

export default Kibana;