class SceneManager{
    
    private _parent:egret.DisplayObjectContainer;
    private _sceneObj:any;
    private _curScene:IScene;
    private _prevScene:IScene;
    
    private _curTime:number;
    private _lastTime:number;
    
    public constructor(parent:egret.DisplayObjectContainer)
    {
        this._parent = parent;
        this._sceneObj = {};
    }
    
    public startTick():void
    {
        this._curTime = egret.getTimer();
        egret.startTick(this.tick, this);
    }
    
    public stopTick():void
    {
        egret.stopTick(this.tick, this);
    }
    public tick(advancedTime:number):boolean
    {
        this._lastTime = this._curTime;
        this._curTime = advancedTime;
       
        if(this._curScene)
        {
            this._curScene.tick(this._curTime - this._lastTime);
        }
        return true;
    }
    public registerScene(name:string, scene:IScene):void
    {
        this._sceneObj[name] = scene;
    }
    
    public setCurSceneByName(name:string):void
    {
        var scene:IScene = this._sceneObj[name];
        if(scene)
        {
            this.setCurScene(scene);
        }
    }
    public setCurScene(scene:IScene):void
    {
        if(this._curScene)
        {
            this._curScene.removeEventListener(SceneEvent.NEXT, this.onNext, this);
            this._prevScene = this._curScene;
        }
        this._curScene = scene;
        this._curScene.show(this._parent);
        this._curScene.addEventListener(SceneEvent.NEXT, this.onNext, this);
        
    }
    private onNext(e:SceneEvent):void
    {
        var scene:IScene = this._sceneObj[e.data];
        if(scene)
        {
            this.setCurScene(scene);
        }
    }
}