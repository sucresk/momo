class FSM 
{
	private _states:Array<State>;

	private _curState:State;

	public constructor() 
	{
		this._states = [];
	}

	public init(name:string):void
	{
		this.switchTo(name);
	}
	public addState(name:string):State
	{
		var s:State = this.getState(name);
		if(s == null)
		{
			s = new State(name);
			this._states.push(s);
		}
		return s;
	}

	public removeState(name:string):State
	{
		var i:number;
		var tempStates:Array<State>;
		for(i = this._states.length - 1; i >= 0; --i)
		{
			if(this._states[i].name == name)
			{
				tempStates = this._states.splice(i,1);
				return tempStates[0];
			}
		}
		return null;
	}

	public getState(name:string):State
	{
		var i:number;
		for(i = this._states.length - 1; i >= 0; --i)
		{
			if(this._states[i].name == name)
			{
				return this._states[i];
			}
		}
		return;
	}

	public get currentState():string
	{
		if(this._curState == null)
		{
			return null;
		}
		return this._curState.name;
	}
	public switchTo(name:string):void
	{
		// console.log("fsm ",name);
		
		if(this._curState != null)
		{
			if(this._curState.name == name)
			{
				return;
			}

			this._curState.end();
		}
		this._curState = this.getState(name);
		if(this._curState)
		{
			this._curState.start();
		}
	}

	public pushFront(state:string, fun:Function):void
	{
		var s:State = this.getState(state);
		if(s)
		{
			s.pushFront(fun);
		}
	}

	public pushBack(state:string, fun:Function):void
	{
		var s:State = this.getState(state);
		if(s)
		{
			s.pushBack(fun);
		}
	}
}