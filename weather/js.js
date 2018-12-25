const cities = [353412, 352954, 353981];
const apikey = 'gHuEn9ghiy20CHSHAJ4ccgWcdU0XWkGS';

Vue.component('weather-day', {
  props: ['day', 'mode'],
  computed: {
    weekday() {
      let d = new Date(this.day.Date);
      let days = ["Chủ nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
      return days[d.getDay()];
    },

    wicon() {
      let wicon = '';
      if(this.mode == 'day') {
        let icon = this.day.Day.Icon;
        if([1,2].includes(icon)) wicon = 'svg/1.svg';
        if([3,4,5,6].includes(icon)) wicon = 'svg/2.svg';
        if([7,8,11].includes(icon)) wicon = 'svg/3.svg';
        if([12,13,14,18].includes(icon)) wicon = 'svg/4.svg';
        if([15,16,17].includes(icon)) wicon = 'svg/5.svg';
      } else {
        let icon = this.day.Night.Icon;
        if([33, 34].includes(icon)) wicon = 'svg/10.svg';
        if([35, 36, 37, 38].includes(icon)) wicon = 'svg/11.svg';
        if([7,8,11].includes(icon)) wicon = 'svg/3.svg';
        if([12,13,14,18].includes(icon)) wicon = 'svg/4.svg';
      }
      return wicon;
    },

    wtemp() {
      let wtemp = 0;
      if(this.mode == 'day') {
        wtemp = app.FtoC(this.day.Temperature.Maximum.Value);
      } else {
        wtemp = app.FtoC(this.day.Temperature.Minimum.Value);
      }
      return wtemp;
    }
  },
  template: `
    <div class="wday">
      <div class="weekday">{{ weekday }}</div>
      <div class="wicon">
        <img :src="wicon" />
      </div>
      <div class="wtemp">{{ wtemp }} &#176;C</div>
    </div>
  `,
})

var app = new Vue({
  el: '#app',
  data: {
    city_key: cities[0],
    days: [],
    cities: [
      {value: 353412, name: "Hà Nội"},
      {value: 352954, name: "Đà Nẵng"},
      {value: 353981, name: "TP Hồ Chí Minh"},
    ],
    load: true,
  },
  computed: {
    city_name() {
      let city_names = ['Hà Nội', 'Đà Nẵng', 'TP Hồ Chí Minh'];
      return city_names[cities.indexOf(this.city_key)];
    },

    city_image() {
      let imgs = ['images/hanoi.jpg','images/danang.jpg','images/tphcm.jpg'];
      return imgs[cities.indexOf(this.city_key)];
    },

    url_icon_day() {
      if(this.days[0]) {
        let icon = this.days[0].Day.Icon;
        if([1,2].includes(icon)) return 'svg/1.svg';
        if([3,4,5,6].includes(icon)) return 'svg/2.svg';
        if([7,8,11].includes(icon)) return 'svg/3.svg';
        if([12,13,14,18].includes(icon)) return 'svg/4.svg';
        if([15,16,17].includes(icon)) return 'svg/5.svg';
      }
      return false;
    },

    url_icon_night() {
      if(this.days[0]) {
        let icon = this.days[0].Night.Icon;
        if([33, 34].includes(icon)) return 'svg/10.svg';
        if([35, 36, 37, 38].includes(icon)) return 'svg/11.svg';
        if([7,8,11].includes(icon)) return 'svg/3.svg';
        if([12,13,14,18].includes(icon)) return 'svg/4.svg';
      }
      return false;
    },

    description() {
      if(this.days[0]) {
        return {day: this.days[0].Day.IconPhrase, night: this.days[0].Night.IconPhrase};
      }
    },

    temp() {
      if(this.days[0]) {
        let temp = {min: 0, max: 0};
        if (this.days[0].Temperature.Minimum)
          temp.min = this.FtoC(this.days[0].Temperature.Minimum.Value);
        if (this.days[0].Temperature.Maximum)
          temp.max = this.FtoC(this.days[0].Temperature.Maximum.Value);
        return temp;
      }
    }
  },
  watch: {
    city_key() {
      this.load = true;
      this.fetch_data();
    }
  },
  mounted() {
    this.fetch_data();
  },
  methods: {
    fetch_data() {
      let url = 'https://dataservice.accuweather.com/forecasts/v1/daily/5day/' + this.city_key;
      let param = '?language=vi&apikey=' + apikey;
      fetch(url + param)
        .then(res => {
          return res.json();
        })
        .then(res => {
          this.days = res.DailyForecasts;
        })
        .catch(res => {
          alert('Tải dữ liệu không thành công');
        })
    },

    FtoC(f) {
      return Math.round((f - 32) * 5 / 9);
    },
  },
})

