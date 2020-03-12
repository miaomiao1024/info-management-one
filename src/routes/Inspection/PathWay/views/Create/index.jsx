import React, { Component } from 'react';
import { PageTitleCreate } from '@src/components';
import { Button, Form, Input, Select, message, Row, Col } from 'antd';
import axios from 'axios';
import AMap from 'AMap'
import './index.styl'
const { TextArea } = Input;
const { Option } = Select;
let marker
let number = 0
var user_id = window.sessionStorage.getItem("user_id")
class InspectionRouteNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      planWayDetail: {},
      pipeBelong: [],
      areaBelong: [],
      startPoint: []
    };
  }
  componentDidMount() {
    this.getpipeBelong();
    this.getAreaBelong();
    const { match: { params: { id } } } = this.props
    console.log(id)
    if (id) {
      axios.get(`/api/v1/info/inspectionPath?id=${id}&user_id=${user_id}`)
        .then((res) => {
          this.setState({ planWayDetail: res.data })
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
    this.map = new AMap.Map('mapArea', {
      zoom: 11,//级别
      center: [116.397428, 39.90923],//中心点坐标
      viewMode: '3D'//使用3D视图
    });
    //监听双击事件
    this.map.on('dblclick', (e) => {
      console.log(`您点击了地图的[${e.lnglat.getLng()},${e.lnglat.getLat()}]`)
      const lnglatXY = [e.lnglat.getLng(), e.lnglat.getLat()]
      this.setState({ startPoint: lnglatXY })
      //控制单次打点
      // if (!marker) {
      //   this.addMarker(lnglatXY)
      // } else {
      //   marker.setPosition(lnglatXY)
      // }
      // 控制两次打点
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

  //创建巡检路线信息
  handleSubmit = (e) => {
    e.preventDefault()
    const {
      form,
      history,
      match: { params: { id } },
    } = this.props
    const { getFieldValue } = form;
    const values = form.getFieldsValue()
    if (!getFieldValue('area_belong')) {
      message.error('请选择所属区域')
    }
    if (!getFieldValue('pipe_belong')) {
      message.error('请选择所属管廊')
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
    if (id) {
      values.id = id
      axios.put('/api/v1/info/inspectionPath?user_id=' + user_id, values)
        .then(function (response) {
          if (response.status === 200) {
            console.log("bianji")
            message.info('编辑成功')
            history.push('/inspection/pathway')
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      console.log(values)
      axios.post('/api/v1/info/inspectionPath?user_id=' + user_id, values)
        .then(function (response) {
          if (response.status === 200) {
            message.info('创建成功')
            history.push('/inspection/pathway')
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }

  }

  //获取管廊信息
  getpipeBelong = () => {
    console.log(user_id)
    axios.get(`/api/v1/info/pipeGalleryAll?user_id=${user_id}`)
      .then((res) => {
        if (res && res.status === 200) {
          const pipeArr = res.data.AllPipes
          const pipe = []
          const children = []
          pipeArr.forEach(function (item) {
            pipe.push(item.name)
          })
          for (var i = 0; i < pipe.length; i++)
            children.push(<Option value={pipe[i]}>{pipe[i]}</Option>)
          this.setState({ pipeBelong: children })
        }
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  //获取区域信息
  getAreaBelong = () => {
    axios.get(`/api/v1/info/galleryAreaAll?user_id=${user_id}`)
      .then((res) => {
        if (res && res.status === 200) {
          const pipeArr = res.data.AllArea
          const pipe = []
          const children = []
          pipeArr.forEach(function (item) {
            pipe.push(item.name)
          })
          for (var i = 0; i < pipe.length; i++)
            children.push(<Option value={pipe[i]}>{pipe[i]}</Option>)
          this.setState({ areaBelong: children })
        }
      })
      .catch(function (error) {
        console.log(error);
      });

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

    const { planWayDetail, pipeBelong, areaBelong } = this.state
    return (
      <div className="path-way-create">
        {id ?
          <PageTitleCreate titles={['巡检路线', '编辑']} jump={'/inspection/pathway'} />
          :
          <PageTitleCreate titles={['巡检路线', '新建']} jump={'/inspection/pathway'} />
        }
        <Row>
          <Col span={12}>
            <Form
              onSubmit={this.handleSubmit}
            >
              <Form.Item
                {...createFormItemLayout}
                label="所属管廊"
              >
                {getFieldDecorator('pipe_gallery', {
                  initialValue: id && planWayDetail.pipe_belong,
                  rules: [{
                    required: true,
                    message: "请选择所属管廊",
                  }]
                })(
                  <Select
                    placeholder="请选择所属管廊"
                    allowClear
                  >
                    {pipeBelong}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="所属区域"
              >
                {getFieldDecorator('area', {
                  initialValue: id && planWayDetail.area_belong,
                  rules: [{
                    required: true,
                    message: "请选择所属区域",
                  }]
                })(
                  <Select placeholder="请选择所属区域" allowClear>
                    {areaBelong}
                  </Select>
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="线路起点"
              >
                {getFieldDecorator('startpoint', {
                  initialValue: id && planWayDetail.startpoint,
                  rules: [{
                    required: true,
                    message: "请输入线路起点",
                  }]
                })(
                  <Input placeholder="请输入起点" allowClear />
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="线路终点"
              >
                {getFieldDecorator('endpoint', {
                  initialValue: id && planWayDetail.endpoint,
                  rules: [{
                    required: true,
                    message: "请输入线路终点",
                  }]
                })(
                  <Input placeholder="请输入终点" allowClear />
                )}
              </Form.Item>
              <Form.Item
                {...createFormItemLayout}
                label="说明描述"
              >
                {getFieldDecorator('description', {
                  initialValue: id && planWayDetail.description,
                  rules: [{
                    required: true,
                    message: "请输入说明描述",
                  }]
                })(
                  <TextArea rows={4} placeholder="请输入说明描述..." />
                )}
              </Form.Item>
              <section>
                <div className="operator-container">
                  <Button
                    htmlType="submit"
                    type="primary"
                  >{id ? '编辑' : '新建'}
                  </Button>
                  <Button style={{ marginLeft: "28px" }}>保存
                  </Button>
                  <Button
                    style={{ marginLeft: "28px" }}
                    onClick={() => {
                      const {
                        history,
                      } = this.props
                      history.push('/inspection/pathway')
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
              <div style={{ width: '100%', height: '300px' }} id="mapArea"></div>
            </div>
          </Col>
        </Row>
      </div>

    );
  }
}


export default Form.create()(InspectionRouteNew);