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
    hourlyForcast: [],
    today: {}
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
  }
})