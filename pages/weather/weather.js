const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}

const colorMap = {
  'sunny': '#c4efff',
  'cloudy': '#daeff7',
  'overcast': '#c4ced2',
  'lightrain': '#b6d6e2',
  'heavyrain': '#c3ccd0',
  'snow': '#99e3ff'
}

let QQMapWX = require('../../libs/qqmap-wx-jssdk.js'); // 引入腾讯位置服务SDK核心类

Page({
  data: {
    temperature: '',
    desc: '',
    weatherBg: 'sunny-bg',
    hourlyForcast: [],
    today: {},
    locationTip: '点击获取当前位置',
    currentCity: '新加坡'
  },
  onLoad() {
    // 实例化API核心类
    this.qqmapsdk = new QQMapWX({
        key: 'WM6BZ-MQCCJ-CUPFL-FTY4D-62VMK-TSB5H'
    })    
    this.getWeather()
  },
  onPullDownRefresh() {
    this.getWeather(() => {
      wx.stopPullDownRefresh()
    })
  },
  getCurrentLocation() {

    wx.getLocation({
      success: rs => {

        this.qqmapsdk.reverseGeocoder({
          //位置坐标，默认获取当前位置，非必须参数
          location: {
            longitude: rs.longitude,
            latitude: rs.latitude
          },
          success: rs => {
            this.setData({
              currentCity: rs.result.address_component.city
            })
            this.getWeather()
          }
        })

      }
    })

  },
  getWeather(callback) {
    
    this.data.currentCity && wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: this.data.currentCity
      },
      success: rs => {

        let result = rs.data.result
        this.setData({
          temperature: result.now.temp + '°',
          desc: weatherMap[result.now.weather],
          weatherBg: result.now.weather + '-bg'
        })
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: colorMap[result.now.weather],
        })

        this.setHourlyWeather(result)
        this.setTodayBar(result)
      },
      complete: () => {
        callback && callback()
      }
    })

  },
  setHourlyWeather(result) {
    // 未来24h天气
    let hourlyForcast = []
    let current = new Date()
    result.forecast && result.forecast.forEach(o => {
      hourlyForcast.push({
        temp: o.temp + '°C',
        iconPath: 'img/' + o.weather + '-icon.png',
        hour: (current.getHours() + o.id * 3) % 24 + ':00'
      })
    })

    hourlyForcast[0] && (hourlyForcast[0].hour = '现在')
    this.setData({
      hourlyForcast: hourlyForcast
    })

  },
  setTodayBar(result) {
    let current = new Date()
    this.setData({
      today: {
        text: `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()} 今天`,
        tempRange: result.today.minTemp + '°C~' + result.today.maxTemp + '°C'
      }
    })
  },
  listDaylyForecast() {
    wx.navigateTo({
      url: '/pages/list/list?city=' + this.data.currentCity
    })
  }
})