import {Component,ViewChild,ElementRef, AfterViewInit} from '@angular/core';

@Component({
	selector: 'map-widget',
	template: `
	<style>
	.mapStyle{
		background-color: #8c8c8c;
		min-width:800px;
		min-height: 480px;
		width: auto;
	}
	.panel-heading{
		margin-top: 0px;
		background-color: #FFFFFF;
		height: 4em;
		text-align: center;
		color: gray;
		font-size: 1.2em;
		display: flex;
        align-items: center;
	}
	.panel-body{
		margin: 0px 0px;
		padding: 0px;
	}
	</style>
       <!--<div class="mapStyle">Place holder for Map Widget</div>-->
       <div class="panel-heading">


	      <div class="col-md-12">
			Real Estate
	      </div>
	      <img src="assets/icons/plusIconDrk.png" style="color: gray">
	    </div>
	    <div class="panel-body">
	        <div #map id="map" class="mapStyle"></div>
	    </div>

    `	
})

export class MapWidget implements AfterViewInit {
	map;
	myLatlng = new google.maps.LatLng(32.991235,-97.195014);
	@ViewChild('map') mapElement: ElementRef;
	constructor(elementRef:ElementRef) {
		//this.initialize();
	}


	ngAfterViewInit():void 
	{

		var mapProp = {

			center:this.myLatlng,
			zoom:14,
			mapTypeId:google.maps.MapTypeId.ROADMAP
		};

		this.map = new google.maps.Map(this.mapElement.nativeElement, mapProp);
		this.addMarker();
		//google.maps.event.trigger(map, 'resize');
	}

	addMarker() {
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(32.991235,-97.195014),
			map: this.map,
			animation: google.maps.Animation.DROP,
			label:"CoreLogic"
		});
	}
}