class GameInfo extends Scene
{
	public constructor() 
	{
		super();
	}

	public init():void
	{
		var bg:egret.Bitmap = AssetManager.createBitmapByName("ui0_jpg");
		bg.x = this.stage.stageWidth / 2;
		bg.y = this.stage.stageHeight / 2;
		this.addChild(bg);

		this.touchEnabled = true;
		this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouch, this);
	}

	private onTouch(e:egret.TouchEvent):void
	{
		this.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouch, this);
		this.next("gameLevel");
	}
}