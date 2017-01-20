class Quest extends egret.Sprite
{
	public static QUEST_NOSE:string = "nose";
	public static QUEST_HAIR:string = "hair";
	public static QUEST_LEFT_EYE:string = "lefrEye";
	public static QUEST_RIGHT_EYE:string = "rightEye";
	public static QUEST_LEFT_EAR:string = "leftEar";
	public static QUEST_RIGHT_EAR:string = "rightEar";
	public static QUEST_MOUTH:string = "mouth";

	private _questImage:egret.Bitmap;
	private _w:number;

	public constructor(name:string) 
	{
		super();
		this._questImage = AssetManager.createBitmapByName("quest_"+name+"_png");
		this._questImage.scaleX = this._questImage.scaleY = 0.5;
		this.addChild(this._questImage);
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAdded, this);
	}

	private onAdded(e:egret.Event):void
	{
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAdded, this);
		this._w = this.stage.stageWidth;
		this.show();
	}

	private show():void
	{
		this.effect1();
	}

	private effect1():void
	{
		egret.Tween.get(this._questImage).to({x:this._w/2},500).wait(500)
			.to({x:this._w},100).call(()=>{
				this.parent.removeChild(this);
			});
	}
}