import React, { Component, } from 'react';
import IndexView from '../routes';
import HeaderLayout from './HeaderLayout';
import { Layout,} from 'antd';
import './index.styl';
const { Content, } = Layout;


class Layouts extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <Layout className={'layout custom-layout'}>
        <HeaderLayout/>
        <Content className={'content-layout'}>
          <IndexView/>
        </Content>
      </Layout>
    );
  }
}

export default Layouts;

