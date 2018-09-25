class uiRoom extends BaseView {
	private players = [];
	private roomid = 0;
	private roomInfo = null;
	private ownerid = 0;
	public gamestart:eui.Button;
	public gamestartGray:eui.Button;
	public leave:eui.Button;
	public roomUserGroup:eui.Group;

	public constructor() {
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE,this.addToStage,this);
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
	
	public onEnter(context:any):void
	{
		let createRoom:boolean = context[0];
		if(createRoom)
		{
			let rsp = context[1];
			this.roomid = rsp.roomID;
			this.ownerid = rsp.owner;
			GameData.isRoomOwner = true;
			this.refreshStartBtn();
			this.createRoomInit(rsp);
		}else{
			let roomUserInfoList = context[1];
			let roominfo = context[2];
			this.joinRoomInit(roomUserInfoList,roominfo);
			this.refreshStartBtn();
		}
	}

	public onExit():void
	{

	}

	public onResume():void
	{

	}

	public onPause():void
	{

	}

	private init()
	{
		this.gamestart.addEventListener(egret.TouchEvent.TOUCH_TAP,this.gamestartClick,this);
		this.leave.addEventListener(egret.TouchEvent.TOUCH_TAP,this.leaveRoom,this);
	}

	 private addMsResponseListen(){
		 //加入房间
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_JOINROOM_RSP, this.joinRoomResponse,this);
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_JOINROOM_NTFY, this.joinRoomNotify,this);

        //离开房间
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_LEAVEROOM_RSP, this.leaveRoomResponse,this);
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_LEAVEROOM_NTFY, this.leaveRoomNotify,this);

        //踢人
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_KICKPLAYER_RSP, this.kickPlayerResponse,this);
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_KICKPLAYER_NTFY, this.kickPlayerNotify,this);

		mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_JOINOVER_RSP, this.joinOverResponse,this);
		mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_JOINOVER_NTFY, this.joinOverNotify,this);

		//发送消息
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_SENDEVENT_NTFY, this.sendEventNotify,this);

		mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_ERROR_RSP, this.onErrorRsp,this);
    }

	private removeMsResponseListen()
	{
			 //加入房间
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_JOINROOM_RSP, this.joinRoomResponse,this);
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_JOINROOM_NTFY, this.joinRoomNotify,this);

        //离开房间
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_LEAVEROOM_RSP, this.leaveRoomResponse,this);
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_LEAVEROOM_NTFY, this.leaveRoomNotify,this);

        //踢人
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_KICKPLAYER_RSP, this.kickPlayerResponse,this);
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_KICKPLAYER_NTFY, this.kickPlayerNotify,this);

		mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_JOINOVER_RSP, this.joinOverResponse,this);
		mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_JOINOVER_NTFY, this.joinOverNotify,this);

		//发送消息
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_SENDEVENT_NTFY, this.sendEventNotify,this);

		mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_ERROR_RSP, this.onErrorRsp,this);
	}

	private addToStage()
	{
		while(this.roomUserGroup.numChildren > 0)
		{
			this.roomUserGroup.removeChildAt(0);
		}
		this.players = [];
		for(let i=0;i<GameData.maxPlayerNum;i++)
		{
			var temp:RoomUserInfo = new RoomUserInfo();
			this.players.push(temp);
			this.roomUserGroup.addChild(temp);
		}

		this.addMsResponseListen();		
	}

	private removeFromStage()
	{
		this.removeFromStage();
	}

	private joinRoomInit(roomUserInfoList, roomInfo)
	{
		 roomUserInfoList.sort(function(a, b) {
            if (roomInfo.ownerId === b.userId) {
                return 1;
            }
            return 0;
        });

		roomUserInfoList.push({
			userId: GameData.gameUser.id,
						userProfile: ""
		})
		
        this.ownerid = roomInfo.ownerId;
        for (var j = 0; j < roomUserInfoList.length; j++) {
            this.players[j].setData(roomUserInfoList[j].userId, this.ownerid);
        }
        this.refreshStartBtn();
	}

	private createRoomInit(rsp)
	{
		this.roomid = rsp.roomID;
		this.ownerid = rsp.owner;
		this.players[0].setData(this.ownerid,this.ownerid);
		GameData.isRoomOwner = true;
		this.refreshStartBtn();
	}

	private refreshStartBtn()
	{
		if(GameData.isRoomOwner)
		{
			this.gamestart.visible = true;
			this.gamestartGray.visible = false;
		}else 
		{
			this.gamestartGray.visible = true;
			this.gamestart.visible = false;
		}
	}

	private leaveRoom()
	{
		mvs.MsEngine.getInstance.leaveRoom("");
	}

	private gamestartClick()
	{
		if(!GameData.isRoomOwner)
		{
			//不是房主等待房间开始
		}
		var userIds = [];
		var playerCnt = 0;
		for (var j = 0; j < this.players.length; j++) {
            if (this.players[j].userid != 0) {
                playerCnt++;
                userIds.push(this.players[j].userid);
            }
        }

		if (playerCnt === GameData.maxPlayerNum) {
            var result = mvs.MsEngine.getInstance.joinOver("");
            if (result !== 0) {
                console.log("关闭房间失败，错误码：", result);
            }

            GameData.playerUserIds = userIds;

			let value = JSON.stringify({
				action:"gamestart",
			})
			mvs.MsEngine.getInstance.sendEvent(value);
        } else {
			let tip = new uiTip("房间人数不足");
			this.addChild(tip);
        }
	}

	private leaveRoomResponse(ev:egret.Event)
	{
		if(!this.parent)
			return;
		GameData.isRoomOwner = false;
		// ContextManager.Instance.uiBack();
		ContextManager.Instance.backSpecifiedUI(UIType.lobbyBoard);
	}

	private leaveRoomNotify(ev:egret.Event)
	{
		if(!this.parent)
			return;
		let leaveRoomInfo = ev.data;
		for (var j = 0; j < this.players.length; j++) {
            if (this.players[j].userid === leaveRoomInfo.userId) {
                this.players[j].init();
                break;
            }
        }
        this.ownerid = leaveRoomInfo.owner;
        if (this.ownerid === GameData.gameUser.id) {
            GameData.isRoomOwner = true;
        }
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].userid !== 0) {
                this.players[i].setData(this.players[i].userid, this.ownerid);
            }
        }
        this.refreshStartBtn();
	}

	private kickPlayerResponse(ev:egret.Event)
	{
		if(!this.parent)
			return;
		let rsp = ev.data;
		for (var j = 0; j < this.players.length; j++) {
            if (this.players[j].userid === rsp.userID) {
                this.players[j].init();
                break;
            }
        }
        if (GameData.gameUser.id === rsp.userID) {
            GameData.isRoomOwner = false;
			//ContextManager.Instance.uiBack();
			ContextManager.Instance.backSpecifiedUI(UIType.lobbyBoard);
        }
	}

	private kickPlayerNotify(ev:egret.Event)
	{
		if(!this.parent)
			return;
		let rsp = ev.data;
		for (var j = 0; j < this.players.length; j++) {
            if (this.players[j].userid === rsp.userId) {
                this.players[j].init();
                break;
            }
        }
        if (GameData.gameUser.id === rsp.userId) {
            GameData.isRoomOwner = false;
			// ContextManager.Instance.uiBack();
			ContextManager.Instance.backSpecifiedUI(UIType.lobbyBoard);
        }
	}

	private joinRoomResponse(ev:egret.Event)
	{
		if(!this.parent)
			return;
		let rsp = ev.data;
		GameData.isRoomOwner = false;
		//ContextManager.Instance.uiBack();
	}

	private joinRoomNotify(ev:egret.Event)
	{
		if(!this.parent)
			return;
		let roomUserInfo = ev.data;
		 for (var j = 0; j < this.players.length; j++) {
            if (this.players[j].userid === 0) {
                this.players[j].setData(roomUserInfo.userId, this.ownerid);
                break;
            }
        }
	}

	private joinOverResponse(ev:egret.Event)
	{
		if(!this.parent)
			return;
		ContextManager.Instance.showUI(UIType.gameBoard);
	}

	private joinOverNotify(ev:egret.Event)
	{
		if(!this.parent)
			return;
	}

	private sendEventNotify(event:egret.Event)
	{
		if(!this.parent)
			return;
		let sdnotify = event.data;
		if(sdnotify && sdnotify.cpProto){
			if(sdnotify.cpProto.indexOf("gamestart") >= 0)
			{
				var userIds = [];
				for (var j = 0; j < this.players.length; j++) {
					if (this.players[j].userid != 0) {
						userIds.push(this.players[j].userid);
					}
				}
				GameData.playerUserIds = userIds;
				ContextManager.Instance.showUI(UIType.gameBoard);
			}
		}
	}

	
	private onErrorRsp(ev:egret.Event)
	{
		let data = ev.data;
		let errorCode = data.errCode;
		if(errorCode == 1001)
		{
			let tip = new uiTip("网络断开连接");
			this.addChild(tip);
			setTimeout(function() {
				mvs.MsEngine.getInstance.logOut();
				ContextManager.Instance.backSpecifiedUI(UIType.loginBoard);
			}, 5000);
		}
	}
}