class uiCreateRoom extends BaseView{
	public back:eui.Image;
	public plus:eui.Image;
	public sub:eui.Image;
	public playerNum:eui.Label;
	public create:eui.Image;
	public roomName:eui.TextInput;
	private num = 1;

	public constructor() {
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE,this.addToStage,this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.removeFromStage,this);
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}


	protected childrenCreated():void
	{
		super.childrenCreated();
		this.init();
	}
	
	private addToStage()
	{
		this.num = 1;
		this.playerNum.text = this.num.toString();
		this.roomName.text = "";
		this.sub.visible =false;
		this.plus.visible = true;
		this.plus.touchEnabled = true;
		this.sub.touchEnabled = false;
		this.addMsResponseListen();
	}

	private removeFromStage()
	{
		this.removeMsResponseListen();
	}

	private init()
	{
		this.back.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBackClick,this);
		this.plus.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onPlusClick,this);
		this.sub.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onSubClick,this);
		this.create.addEventListener(egret.TouchEvent.TOUCH_TAP,this.createRoom,this);
	}

    private addMsResponseListen(){
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_CREATEROOM_RSP, this.createRoomResponse,this);
    }

	private removeMsResponseListen()
	{
		mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_CREATEROOM_RSP,this.createRoomResponse,this);
	}

	private onBackClick()
	{
		ContextManager.Instance.dialogBack();
	}

	private  onPlusClick()
	{
		// if(this.num >= 3)
		// {
		// 	this.plus.touchEnabled = false;
		// 	this.plus.visible =false;
		// 	this.num = 3;
		// }else{
		// 	this.num ++;
		// 	this.sub.touchEnabled = true;
		// }
		this.num ++;
		if(this.num >= 3)
		{
			this.plus.touchEnabled = false;
			this.plus.visible = false;
			this.num = 3;
		}
		this.sub.visible = true;	
		this.sub.touchEnabled = true;	
		this.playerNum.text = this.num.toString();
	}

	private onSubClick()
	{
		// if(this.num <= 1)
		// {
		// 	this.sub.touchEnabled = false;
		// 	this.sub.visible =false;
		// 	this.num = 1;
		// }else{
		// 	this.num --;
		// 	this.plus.touchEnabled = true;
		// }
		this.num --;
		if(this.num <= 1)
		{
			this.sub.touchEnabled = false;
			this.sub.visible = false;
			this.num = 1;
		}
		this.plus.visible = true;
		this.plus.touchEnabled = true;
		this.playerNum.text = this.num.toString();
	}

	private createRoom()
	{
		GameData.maxPlayerNum = this.num;
		let roomName = this.roomName.text;

		let create:MsCreateRoomInfo = new MsCreateRoomInfo(roomName,this.num,0,0,1,"");
		mvs.MsEngine.getInstance.createRoom(create,JSON.stringify({"id":GameData.gameUser.id,"nickName":GameData.gameUser.name,"avatar":GameData.gameUser.avatar}));
	}

	private createRoomResponse(ev:egret.Event)
	{
		let rsp = ev.data;
  		GameData.roomID = rsp.roomID;
		ContextManager.Instance.showUI(UIType.roomView,[true,rsp]);
	}
}