import React, { Component, } from 'react';
import { PageTitleCreate } from '@src/components';
import { Form, Input, Button, message, Row, Col } from 'antd';
import axios from 'axios';
import AMap from 'AMap'
import './index.styl'

const { TextArea } = Input;
let user_id = window.sessionStorage.getItem("user_id")
let marker
let number = 0
class PipeManagementNew extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pipeDetail: {},
      startPoint: [],
      endPoint: [],
    };

  }
  componentDidMount() {
    const { match: { params: { id } } } = this.props
    console.log(id)
    if (id) {
      axios.get(`/api/v1/info/pipeGallery?Id=${id}&user_id=${user_id}`)
        .then((res) => {
          console.log(res.data)
          this.setState({ pipeDetail: res.data })
        })
        .catch((err) => {
          console.log(err);
        });
    }
    this.initMap()
  }
  componentWillUnmount() {
    marker = 0
    number = 0
  }
  initMap = () => {
    this.map = new AMap.Map('mapManagement', {
      zoom: 11,//级别
      center: [116.397428, 39.90923],//中心点坐标
      viewMode: '3D'//使用3D视图
    });
    //监听双击事件
    this.map.on('dblclick', (e) => {
      console.log(`您点击了地图的[${e.lnglat.getLng()},${e.lnglat.getLat()}]`)
      const lnglatXY = [e.lnglat.getLng(), e.lnglat.getLat()]
      this.setState({ startPoint: lnglatXY })
      if (number < 2) {
        this.addMarker(lnglatXY)
      } else {
        marker.setPosition(lnglatXY)
      }
    })
  }
  //高德地图打点
  addMarker = (lnglat) => {
    let startIcon = new AMap.Icon({
      size: new AMap.Size(25, 34),// 图标尺寸
      image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',// 图标的取图地址
      imageSize: new AMap.Size(135, 40),// 图标所用图片大小
      imageOffset: new AMap.Pixel(-9, -3)// 图标取图偏移量
    });
    let endIcon = new AMap.Icon({
      size: new AMap.Size(25, 34),
      image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
      imageSize: new AMap.Size(135, 40),
      imageOffset: new AMap.Pixel(-95, -3)
    });
    marker = new AMap.Marker({
      map: this.map,
      position: lnglat,
      icon: number === 0 ? startIcon : endIcon,
    });
    marker.setMap(this.map);
    number++
  }

  //创建管廊信息
  handleSubmit = (e) => {
    e.preventDefault()
    const {
      form,
      history,
      match: { params: { id } },
    } = this.props
    const { getFieldValue } = form;
    const values = form.getFieldsValue()
    // if(!getFieldValue('number')){
    //   message.error('请输入管廊编号')
    // }
    if (!getFieldValue('name')) {
      message.error('请输入管廊名称')
    }
    if (!getFieldValue('length')) {
      message.error('请输入管廊长度')
    }
    if (!getFieldValue('unit')) {
      message.error('请选择所属单位')
    }
    if (!getFieldValue('startpoint')) {
      message.error('请输入起点')
    }
    if (!getFieldValue('endpoint')) {
      message.error('请输入终点')
    }
    if (!getFieldValue('description')) {
      message.error('请输入说明描述')
    }
    values.drawpoint = [this.state.startPoint, this.state.endPoint]
    console.log(values)
    if (id) {
      values.id = id
      axios.put('/api/v1/info/pipeGallery?user_id=' + user_id, values)
        .then(function (response) {
          if (response.status === 200) {
            message.info('编辑成功')
            history.push('/pipe/management')
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      console.log(values)
      axios.post('/api/v1/info/pipeGallery?user_id=' + user_id, values)
        .then(function (response) {
          if (response.status === 200) {
            message.info('创建成功')
            history.push('/pipe/management')
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }

  }
  render() {
    const createFormItemLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    }
    const {
      form: { getFieldDecorator },
      match: { params: { id } }
    } = this.props

    const { pipeDetail } = this.state
    return (
      <div className="pipe-management">
        {id ?
          <PageTitleCreate titles={['管廊管理', '编辑']} jump={'/pipe/management'} />
          :
          <PageTitleCreate titles={['管廊管理', '新建']} jump={'/pipe/management'} />
        }
        <Row>
          <Col span={12}>
            <Form
              onSubmit={this.handleSubmit}
            >
              <Form.Item
                {...createFormItemLayout}
                label="管廊名称"
              >
                {getFieldDecorator('name', {
                  initialValue: id && pipeDetail.name,
                  rules: [{
                    required: true,
                    message: "请输入管廊名称",
                  }]
                })(
                  <Input placeholder="请输入管廊名称" />
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="管廊长度"
              >
                {getFieldDecorator('length', {
                  initialValue: id && pipeDetail.length,
                  rules: [{
                    required: true,
                    message: "请输入管廊长度",
                  }]
                })(<Input placeholder="请输入管廊长度" />)}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="所属单位"
              >
                {getFieldDecorator('unit', {
                  initialValue: id && pipeDetail.unit,
                  rules: [{
                    required: true,
                    message: "请输入所属单位",
                  }]
                })(<Input placeholder="请输入所属单位" />)}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="管廊起点"
              >
                {getFieldDecorator('startpoint', {
                  initialValue: id && pipeDetail.startpoint,
                  rules: [{
                    required: true,
                    message: "请输入起点",
                  }]
                })(
                  <div className="path-way-border-input">
                    <Input placeholder="请输入起点" />
                  </div>
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="管廊终点"
              >
                {getFieldDecorator('endpoint', {
                  initialValue: id && pipeDetail.endpoint,
                  rules: [{
                    required: true,
                    message: "请输入终点",
                  }]
                })(
                  <div className="path-way-border-input">
                    <Input placeholder="请输入终点" />

                  </div>
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="说明描述"
              >
                {getFieldDecorator('description', {
                  initialValue: id && pipeDetail.description,
                  rules: [{
                    required: true,
                    message: "请输入说明描述",
                  }]
                })(<TextArea rows={4} placeholder="请输入说明描述" />)}
              </Form.Item>
              <section className="operator-container">
                <div style={{ textAlign: "center" }}>
                  <Button
                    htmlType="submit"
                    type="primary"
                    size="default"
                  >{id ? '编辑' : '新建'}
                  </Button>
                  <Button
                    style={{ marginLeft: "28px" }}
                    size="default"
                    onClick={() => {
                      const {
                        history,
                      } = this.props
                      history.push('/pipe/management')
                    }}
                  >取消
                  </Button>
                </div>
              </section>
            </Form>
          </Col>
          <Col span={1}>
            <div className="path-way-line-up"></div>
            <div className="path-way-line-down"></div>
          </Col>
          <Col span={9}>
            <div className="path-way-border">
              <div style={{ width: '100%', height: '300px' }} id="mapManagement"></div>
            </div>
          </Col>
        </Row>
      </div>

    );
  }
}

export default Form.create()(PipeManagementNew);