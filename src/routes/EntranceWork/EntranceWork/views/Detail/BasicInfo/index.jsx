import React, { Component } from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';
import '../index.styl';
export default class extends Component {
  static propTypes = {

  }
  constructor(props) {
    super(props)
    this.state = { index: 0 }
    this.infos = [{
      title: '活动范围',
      dataIndex: 'activity_range',
      render: record => record.activity_range,
    }, {
      title: '排序',
      key: 'tagId',
      render: record => record.tagId,
    }, {
      title: '工期',
      key: 'duration',
      render: record => record.duration,
    }, {
      title: '创建时间',
      key: 'date',
      render: record => moment(parseInt(record.date)).format('YYYY-MM-DD HH:mm:ss'),
    }, {
      title: '施工人员数量',
      dataIndex: 'work_number',
      render: record => record.work_number,
    }, {
      title: '评价',
      key: 'evaluation',
      render: record => record.evaluation,
    }]
  }
  render() {
    const { data } = this.props
    console.log(data)
    const arr = []
    arr.push(data)
    const detailInfo = (cur, datas) => {
      let result = [];
      if (cur.render) {
        result.push(cur.render(datas))
      } else {
        result = Object.prototype.toString.call(datas[cur.dataIndex]) === '[object Object]'
          ? datas[cur.dataIndex].name
          : datas[cur.dataIndex]
      }
      return result
    }
    return (
      <div className="label-container">
        {/* <Row gutter={60}>
          {
            this.infos.map(cur => (
              <Col span={12}
                key={cur.id}
              >
                <div>
                  {cur.title &&
                    <span className="title">{cur.title}</span>
                  }
                  {cur.title &&
                    <span>:&nbsp;</span>
                  }
                  <span className="content">{detailInfo(cur,arr)}</span>
                </div>
              </Col>
            ))
          }
        </Row> */}
        <Row gutter={60}>
          <Col span={12}>
            <span className="title">活动范围 </span>
            <span>:&nbsp;</span>
            <span className="content"> {data.activity_range}</span>
          </Col>
          <Col span={12}>
            <span className="title">排序 </span>
            <span>:&nbsp;</span>
            <span className="content"> 22</span>
          </Col>
          <Col span={12}>
            <span className="title">工期 </span>
            <span>:&nbsp;</span>
            <span className="content"> {data.duration} 天</span>
          </Col>
          <Col span={12}>
            <span className="title">创建时间 </span>
            <span>:&nbsp;</span>
            <span className="content"> {moment(parseInt(data.date)).format('YYYY-MM-DD HH:mm:ss')}</span>
          </Col>
          <Col span={12}>
            <span className="title">施工人员数量 </span>
            <span>:&nbsp;</span>
            <span className="content"> {data.work_number} 人</span>
          </Col>
          <Col span={12}>
            <span className="title">评价 </span>
            <span>:&nbsp;</span>
            <span className="content"> {data.evaluation === null ? data.evaluation : '暂无评价'}</span>
          </Col>
        </Row>
      </div>
    )
  }
}