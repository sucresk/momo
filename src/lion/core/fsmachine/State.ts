class State
 {
	private _name:string;
	private _beginFun:Array<Function>;
	private _endFun:Array<Function>;

	public constructor(name:string) 
	{
		this._name = name;
		this._beginFun = [];
		this._endFun = [];
	}
	public get name():string
	{
		return this._name;
	}
	public pushFront(fun:Function):void
	{
		if(fun && this._beginFun.indexOf(fun) == -1)
		{
			this._beginFun.push(fun);
		}
	}
	public pushBack(fun:Function):void
	{
		if(fun && this._endFun.indexOf(fun) == -1)
		{
			this._endFun.push(fun);
		}
	}

	public start():void
	{
		var i:number;
		var len:number = this._beginFun.length;
		for(i = 0; i < len; ++i)
		{
			this._beginFun[i].call(this);
		}
	}

	public end():void
	{
		var i:number;
		var len:number = this._endFun.length;
		for(i = 0; i < len; ++i)
		{
			this._endFun[i].call(this);
		}
	}
}