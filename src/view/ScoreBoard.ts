class ScoreBoard extends egret.Sprite
{
	private _bg:egret.Bitmap;

	public constructor() 
	{
		super();
		this._bg = AssetManager.createBitmapByName("ui3_png");
		this.addChild(this._bg);
	}
}