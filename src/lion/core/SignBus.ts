class SignBus extends egret.Sprite
{
	public static appStage:egret.Stage;
	private static  _instance: SignBus;
	public static get instance():SignBus
	{
		if(SignBus._instance == null)
		{
			SignBus._instance = new SignBus();
		}
		return SignBus._instance;
	}
	public constructor() 
	{
		super()
	}
}