import {Component, Inject, Injectable, Input, Output} from '@angular/core';
import {HTTP_PROVIDERS, Http, Response} from '@angular/http';
import {WeatherModel} from "../../models/WeatherModel";


@Component({
	selector: 'weather-widget',
	viewProviders: [HTTP_PROVIDERS],
	template: `
		<div class="weather-container">
			<div class="col-md-6 iconColumn">
				<i id="weatherIcon" class="wi weatherIcon"></i>
			</div>
			<div class="col-md-6 temperatureColumn">
				<label style="font-size: 4em">{{temperature}}</label>
				<label  style="font-size: 1.4em">{{city}}</label>
			</div>
            <!--<button class="loginmodal-submit" (click)="getWeather()">Get Weather</button>-->
        </div>
    `
})

export class WeatherWidget {
	weatherModel:WeatherModel;
	data = {};

	icon;
	city;
	temperature;

	url = "http://api.openweathermap.org/data/2.5/weather?q=McKinney&units=imperial&APPID=60353c525f9cbc73e954b150387b7169";

	constructor(public http:Http) {

		this.getWeather();
	}

	getWeather():void {

		this.http.get(this.url)
			.subscribe((res: Response) => {
				this.data = res.json();
				this.city = this.data.name;
				this.temperature = Math.round(this.data.main.temp) + "°";
				console.log("WEATHER>> "+ this.data.weather[0].main);

				switch(this.data.weather[0].main){
					case "Clear":
						this.icon = "wi-day-sunny";
						break;
					case "Rain":
						this.icon = "wi-rain";
						break;
					case "Clouds":
						this.icon = "wi-cloudy";
						break;
					case "Haze":
						this.icon = "wi-fog";
						break;
					default:
						this.icon = "wi-na";
				}
				document.getElementById('weatherIcon').classList.add(this.icon);
			});
	}
}