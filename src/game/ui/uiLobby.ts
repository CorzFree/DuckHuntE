class uiLobby extends BaseView {
	public randomMatch:eui.Group;
	public createRoom:eui.Group;
	public joinRoom:eui.Group;
	public username:eui.Label;
	public exit:eui.Image;

	public constructor() {
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE,this.addToStage,this);
		this.addEventListener(egret.Event.LEAVE_STAGE,this.leaveStage,this);
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
		this.username.text = GameData.gameUser.id.toString();
	}

	private leaveStage()
	{
	
	}

	private exitRoom()
	{
		mvs.MsEngine.getInstance.logOut();
		ContextManager.Instance.uiBack();
	}

	private init()
	{
		this.createRoom.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onCreateRoomClick,this);
		this.randomMatch.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onRandomMatch,this);
		this.joinRoom.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onJoinRoomMatch,this);
		this.exit.addEventListener(egret.TouchEvent.TOUCH_TAP,this.exitRoom,this);
	}

	private onCreateRoomClick()
	{
		ContextManager.Instance.showDialog(UIType.createRoom);
	}

	private onRandomMatch()
	{
		ContextManager.Instance.showUI(UIType.matchBoard);
	}

	private onJoinRoomMatch()
	{
		ContextManager.Instance.showUI(UIType.roomList);
	}
}