class Game extends egret.DisplayObjectContainer
{
	public constructor() 
	{
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAdded, this);
	}

	private onAdded(e:egret.Event):void
    {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAdded, this);
        this.init();
    }

	private init():void
    {
        console.log("this is a new game!");
        this.initDB();
        var sceneManager:SceneManager = new SceneManager(this);
        
        sceneManager.registerScene("gameStart", new GameScene());
        sceneManager.registerScene("gameInfo", new GameInfo());
        sceneManager.registerScene("gameLevel", new GameLevel());
        sceneManager.setCurSceneByName("gameInfo");
        sceneManager.startTick();
    }

    private initDB():void
    {
        DBManager.addData("MomoUI_json","texture_json","texture_png")
        DBManager.addData("bubbles_json","texture2_json","texture2_png")
        DBManager.addData("questAnim_json","texture3_json","texture3_png")
    }
}