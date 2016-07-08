import { Component, Input } from '@angular/core';
import {CacheUpdateEventManager} from './../../../../../events/cacheupdateeventmanager';
import {CommonUtils} from './../../../../../util/commonutils';
import {DataUtil} from './../../../../../../dataservice/dataserviceutil.component';


@Component({
  selector: 'activity',
  templateUrl: './app/common/components/ui/loansubapp/viewrenderer/lap/ActivityPanel.html',
  styleUrls: ['./app/common/components/ui/loansubapp/viewrenderer/lap/ActivityPanel.css'],
})
export class ActivityPanel {
    actiitycontextTO = null;
  @Input() set activityType(activityType: any) {

    this._activityType = activityType;

    let imgFile = 'activitynone.png';
    if(activityType.activityContext)
    {
        CacheUpdateEventManager.subscribeForReadRootEvent(CommonUtils.getToClass(activityType.activityContext),
                                                                activityType.activityContext.id,data => this.activityToUpdated(data));
        let index: number = (activityType.activityContext.id as number) % 4;

        switch(index) {
          case 0:
            imgFile = 'activitynone.png';
            break;
          case 1:
            imgFile = 'activitynew.png';
            break;
          case 2:
            imgFile = 'activityerror.png';
            break;
          case 3:
            imgFile = 'activitycomplete.png';
            break;
        }
    }
    else
    {
        imgFile = 'activitynone.png';
    }
    this.imgSrc = './app/common/components/ui/loansubapp/viewrenderer/images/'+imgFile;
  }
  _activityType: any;
  imgSrc: string;

  constructor() {  }

  onClick(e: MouseEvent) {
    console.debug(""+e);
  }
  activityToUpdated(data)
  {
      console.debug('Activity TO '+data+ ' has been updated my id is '+this._activityType.activityContext.id);
      this.actiitycontextTO = DataUtil.getEditableEntity(data);
  }

}
