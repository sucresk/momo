class BaseControl 
{
	private _bus:SignBus;
	protected _running:boolean;

	private _commandNotification:Notification;
	private _commandData:any;

	public constructor() 
	{
		this._bus = SignBus.instance;
		this._commandNotification = new Notification(Notification.COMMAND);
		this._commandData = {};
	}

	public on(notification:string, handler:Function, priority:number = 0):void
	{
		this._bus.addEventListener(notification, handler, this, false, priority);
	}

	public off(notification:string, handler:Function):void
	{
		this._bus.removeEventListener(notification, handler,this);
	}

	public send(notification:string, data:any = null):void
	{
		this._bus.dispatchEvent(new Notification(notification, data));
	}

	public sendCommand(notification:string, data:any = null):void
	{
		this._commandData.command = notification;
		this._commandData.data = data;
		this._commandNotification.data = this._commandData;
		this._bus.dispatchEvent(this._commandNotification);
	}

	public start():void
	{
		if(!this._running)
		{
			this.initListener();
			this._running = true;
		}
	}

	public stop():void
	{
		this._running = false;
		this.removeListener();
	}

	protected initListener():void
	{
		
	}

	protected removeListener():void
	{

	}
}