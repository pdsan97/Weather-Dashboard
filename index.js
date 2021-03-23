var APIKEY = '21af69caa6ad3d0ac8d6958f2afd7836'
APIKEY = 'b190a0605344cc4f3af08d0dd473dd25'

var SearchesHistory = []
var SearchHistoryDoc = document.getElementById('SearchesHistory')
const AddToSearchHistory = (value) => {
	if (localStorage.getItem('SearchHistoryStorage')) {
		SearchesHistory = JSON.parse(localStorage.getItem('SearchHistoryStorage'))
		SearchesHistory.push(value)
		localStorage.setItem(
			'SearchHistoryStorage',
			JSON.stringify(SearchesHistory),
		)
	} else {
		SearchesHistory.push(value)
		localStorage.setItem(
			'SearchHistoryStorage',
			JSON.stringify(SearchesHistory),
		)
	}
}
const Search = () => {
	var SearchValue = document.getElementById('cityInput').value
	fetch(
		`https://api.openweathermap.org/data/2.5/weather?q=${SearchValue}&appid=${APIKEY}`,
	)
		.then((response) => response.json())
		.then((r) => {
			if (r.cod == 200) {
				fetch(
					`https://api.openweathermap.org/data/2.5/onecall?lat=${r.coord.lat}&lon=${r.coord.lon}&exclude={part}&appid=${APIKEY}`,
				)
					.then((response) => response.json())
					.then((data) => {
						AddToSearchHistory(SearchValue)
						ShowSearchHistory()
						ShowCityWeatherData(data)
						ShowForecast(data)
					})
			}
		})
}
const ShowCityWeatherData = (data) => {
	var currentWeather = data.current
	var currentDate = new Date(currentWeather.dt * 1000)
	var city = document.getElementById('weather-city')
	var temp = document.getElementById('weather-temperature')
	var humidity = document.getElementById('weather-humidity')
	var wind_speed = document.getElementById('weather-windSpeed')
	var uviButtonVariant

	city.innerHTML = `<h1 class="card-title" id='weather-city'>${
		document.getElementById('cityInput').value
	} (${currentDate.getDate()}/${
		currentDate.getMonth() + 1
	}/${currentDate.getFullYear()})
	<img  src='${
		'http://openweathermap.org/img/w/' + currentWeather.weather[0].icon + '.png'
	}'>
	</h1>`

	temp.innerHTML = `Temperature : ${currentWeather.temp} &deg;F`
	humidity.innerHTML = `Humidity : ${currentWeather.humidity} &percnt;`
	wind_speed.innerHTML = `Wind Speed : ${currentWeather.wind_speed} MPH`

	if (currentWeather.uvi === 0) {
		uviButtonVariant = `btn-light`
	} else if (currentWeather.uvi < 5) {
		uviButtonVariant = `btn-success`
	} else if (currentWeather.uvi < 7) {
		uviButtonVariant = `btn-warning`
	} else {
		uviButtonVariant = `btn btn-danger`
	}

	document.getElementById(
		'weather-uvIndex',
	).innerHTML = `<p class="card-text"  id='weather-uvIndex' >UV Index :
	<button class="btn ${uviButtonVariant}">${currentWeather.uvi}</button>
	</p>`
}
const ShowForecast = (data) => {
	var Cards = ''
	data.daily.map((v, i) => {
		if (i < 5) {
			var currentDate = new Date(v.dt * 1000)
			Cards += `<div class="col">
			<div class="card forecast-card">
				<div class="card-body">
					<h5 class="card-title forecast-card-title">
						${currentDate.getDate()}/${
				currentDate.getMonth() + 1
			}/${currentDate.getFullYear()}
					</h5>
					<img src='${'http://openweathermap.org/img/w/' + v.weather[0].icon + '.png'}'>
					<p class="card-text forecast-card-text" >Temp : ${v.temp.day}&deg;F</p>
					<p class="card-text forecast-card-text" >Humidity : ${v.humidity}&percnt;</p>
				</div>
			</div>
			</div>`
		}
	})
	document.getElementById(
		'weather-forecast',
	).innerHTML = `<div id="weather-forecast" class="row">${Cards}</div>`
}

function ShowSearchHistory() {
	SearchHistoryDoc.innerHTML = ''
	if (localStorage.getItem('SearchHistoryStorage')) {
		SearchesHistory = JSON.parse(localStorage.getItem('SearchHistoryStorage'))
		SearchesHistory.map((v, i) => {
			SearchHistoryDoc.innerHTML += `<button type="button" class="btn btn-light">${v}</button>`
		})
	} else {
		SearchHistoryDoc.innerHTML = `<button type="button" class="btn btn-light">Search Something to show in history</button>`
	}
}
ShowSearchHistory()
