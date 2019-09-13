import React, { Component, } from 'react';
import {Link} from 'react-router-dom';
import { PageTitle } from '../../../components';
import { Tabs } from 'antd';
import NotApproved from './NotApproved';
import Approved from './Approval';
import Results from './Results';
import ApprovalRoute from './route';

// const TabPane = Tabs.TabPane;

class PlanApproval extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    
    return (
      
      <div className="plan-approval-list-page">
        
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane 
            tab={<Link to="/emergency/approval">未审批</Link>}
            key="1"
          >
            <PageTitle titles={['应急指挥','预案审批','未审批']} />
            
            <ApprovalRoute>
              <NotApproved />
            </ApprovalRoute>
          </Tabs.TabPane>
          <Tabs.TabPane tab="已审批"
            key="2"
          > 
            <PageTitle titles={['应急指挥','预案审批','已审批']} />
            <Approved />
          </Tabs.TabPane>
          <Tabs.TabPane tab="审批结果"
            key="3"
          >
            <PageTitle titles={['应急指挥','预案审批','审批结果']} />
            <Results />
          </Tabs.TabPane>
        </Tabs>
        
      </div>
      
    );
  }
}

export default PlanApproval;

