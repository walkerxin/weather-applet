const weekArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

Page({
  data: {
    daylyForecast: [],
    city: ''
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({ city: options.city })
    this.getWeather()
  },
  onPullDownRefresh: function () {
    this.getWeather(() => {
      wx.stopPullDownRefresh()
    })
  },
  getWeather(callback) {

    this.data.city && wx.request({
      url: 'https://test-miniprogram.com/api/weather/future',
      data: {
        city: this.data.city,
        time: new Date()
      },
      success: rs => {
        let result = rs.data.result
        let daylyForecast = []
        result && result.forEach(o => {
          let forecastDay = new Date(new Date().getTime() + o.id * 86400000)
          daylyForecast.push({
            weekText: weekArr[forecastDay.getDay()],
            dateText: `${forecastDay.getFullYear()}-${forecastDay.getMonth() + 1}-${forecastDay.getDate()}`,
            tempRange: o.minTemp + '°C~' + o.maxTemp + '°C',
            weather: o.weather,
          })
        })

        daylyForecast[0] && (daylyForecast[0].weekText = '今天')
        daylyForecast[1] && (daylyForecast[1].weekText = '明天')

        this.setData({
          daylyForecast: daylyForecast
        })
      },
      complete: () => {
        callback && callback()
      }
    })

  }
})