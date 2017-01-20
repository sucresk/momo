class RoleEvent extends egret.Event
{
    public static TOUCH_HOT:string = "TOUCH_HOT";
    
	public constructor(type:string, data:any = null, bubbles:boolean = true, cancelable:boolean = false) 
	{
        super(type,bubbles,cancelable,data);
    }
}