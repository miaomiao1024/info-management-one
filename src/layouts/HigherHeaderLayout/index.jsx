import React, { Component, } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Layout, Icon, Dropdown, Avatar } from 'antd';
//import axios from 'axios';

const { Header, } = Layout;
//const { SubMenu } = Menu; 
class HigherHeaderLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meuList: [
        {
          id: '1',
          name: "智能监测",
          url: '/monitor',
          children: [
            {
              id: '11',
              name: '实时监测',
              url: '/'
            }, {
              id: '12',
              name: "视频监控",
              url: '/monitor/video'
            },
            {
              id: '13',
              name: 'GIS地图',
              url: '/monitor/gis'
            },
            // {
            //   id:'14',
            //   name:'设备信息',
            //   url:'/monitor/device'
            // }
          ]
        },
        {
          id: '2',
          name: "巡检维护",
          url: '/inspection',
          children: [
            {
              id: '21',
              name: '巡检计划',
              url: '/inspection/plan'
            },
            {
              id: '22',
              name: '巡检人员信息',
              url: '/inspection/employee'
            },
            {
              id: '23',
              name: '巡检报告',
              url: '/inspection/calendar'
            },
            {
              id: '24',
              name: '巡检路线',
              url: '/inspection/pathway'
            }

          ]
        },
        {
          id: '3',
          name: "应急指挥",
          url: '/emergency',
          children: [
            // {
            //   id:'31',
            //   name:"告警处理",
            //   url:'/emergency/alarm'
            // },
            {
              id: '32',
              name: '应急资源',
              url: '/emergency/resource/material'
            },
            {
              id: '33',
              name: '应急预案',
              url: '/emergency/plan'
            },

            {
              id: '34',
              name: '预案审批',
              url: '/emergency/approval'
            },
          ]
        },
        {
          id: '4',
          name: "入廊作业",
          url: '/entrance',
          children: [
            {
              id: '41',
              name: '入廊申请',
              url: '/entrance/work'
            },
            {
              id: '42',
              name: '作业审批',
              url: '/entrance/approval'
            },
          ]
        }, {
          id: '5',
          name: "运营管理",
          url: '/pipe',
          children: [
            {
              id: '51',
              name: '管廊管理',
              url: '/pipe/management'
            },
            {
              id: '52',
              name: '管廊区域',
              url: '/pipe/area'
            },
            {
              id: '53',
              name: '操作日志',
              url: '/pipe/log'
            },
            {
              id: '54',
              name: '跳转Kibana',
              url: '/pipe/Kibana'
            },
          ]
        }
      ],
      modalVisible: false,
    };
  }

  //退出登录
  handleExit = () => {
    console.log(window.sessionStorage.getItem('username'))
    sessionStorage.clear()
    window.location.href = "http://39.104.189.84:30300/"
  };

  render() {
    const menu = (
      <Menu className={'menu'}>
        <Menu.Item key="logout">
          <Icon type="logout" onClick={this.handleExit} />退出登录
        </Menu.Item>
      </Menu>
    );

    return (
      <Header className="custom-header">
        <Link to="/"><div className={'logo'}>信息管理系统</div></Link>
        <div className={'userInfo'}>
          <Dropdown overlay={menu}
            placement="bottomRight"
          >
            <span>
              <Avatar className={'avatar-custom'}>
                <Icon type="user"
                  style={{ fontSize: '18px' }}
                />
              </Avatar>
              <span style={{ color: 'white' }}>{window.sessionStorage.getItem("username")}</span>
            </span>
          </Dropdown>
          <span style={{ color: 'white', margin: 15 }} onClick={() => this.props.onClicked({ showModule: false })}>返回上一级</span>
        </div>

        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[this.state.currentTabId,]}
          id="dropdownMenu"
        >
          {this.state.meuList && this.state.meuList.map((subMenu) => {
            return (
              <Menu.SubMenu
                className="custom-sub-menu"
                key={subMenu.id}
                title={<span>{subMenu.name}</span>}
              >
                {subMenu.children && subMenu.children.map(item =>
                  <Menu.Item key={item.id}>
                    <Link to={item.url}>{item.name}</Link>
                  </Menu.Item>
                )}
              </Menu.SubMenu>
            );
          })}
        </Menu>
      </Header>
    );
  }
}

export default HigherHeaderLayout;