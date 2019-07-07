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

Page({
  data: {
    temperature: '',
    desc: '',
    weatherBg: 'sunny-bg',
    hourlyForcast: []
  },
  onLoad() {
    this.getWeather()
  },
  onPullDownRefresh() {
    this.getWeather(() => {
      wx.stopPullDownRefresh()
    })
  },
  getWeather(callback) {
    
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: '深圳'
      },
      success: rs => {

        let result = rs.data.result
        this.setData({
          temperature: result.now.temp,
          desc: weatherMap[result.now.weather],
          weatherBg: result.now.weather + '-bg'
        })
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: colorMap[result.now.weather],
        })

        // 未来24h天气
        result.forecast

      },
      complete: () => {
        callback && callback()
      }
    })

  }
})