class Notification extends egret.Event
 {
	public static COMMAND:string = "NOTIFICATION:COMMAND";
	public constructor(type:string, data:any = null) 
	{
		super(type, false, false, data);
	}
}