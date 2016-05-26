import { Component} from '@angular/core';

@Component({
	selector: 'current-events-widget',
	template: `
	<style>
	.panel-heading{
		margin-top: 0px;
		background-color: #97CE68;
		height: 4em;
		text-align: center;
		color: white;
		font-size: 1.2em;
		display: flex;
        align-items: center;
	}
	.row{
		padding: 10px;
	}
	.panel-footer{
		background-color: #FFFFFF;
		text-align: right;
		border-top: none;
	}
	</style>
    <div class="panel widgetContainer">

	    <div class="panel-heading">


	      <div class="col-md-12">
			What's New
	      </div>
	      <img src="icons/plusIcon.png">
	    </div>
	    <div class="panel-body">
			<div class="row">
				<div class="col-md-2">
					<img src="images/winter_child.png">
				</div>
				<div class="col-md-9 pull-right">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
				labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
				nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
				esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
				in culpa qui officia deserunt mollit anim id est laborum.</div>
			</div>
	    </div>
	    <div class="panel-footer">
            <img src="icons/backIcon.png">
            <img src="icons/frontIcon.png">
	    </div>
	</div>
    `
})
export class CurrentEventWidget {
	constructor() {

	}
}