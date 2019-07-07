Page({
  data: {
    temperature: 12,
    desc: '晴天'
  },
  onLoad() {
    this.getWeather()
  },
  onPullDownRefresh() {
    this.getWeather()
  },
  getWeather() {
    
  }
})