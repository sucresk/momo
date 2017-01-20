class Scene extends egret.DisplayObjectContainer implements IScene
{
    public constructor()
    { 
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAdded, this);
        
    }
    
    private onAdded(e:egret.Event):void
    {
        //this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAdded, this);
        this.init();
    }
    
    public init():void
    {
        console.log("this is a scene");
    }
    public show(parent:egret.DisplayObjectContainer):void
    {
        parent.addChild(this);
    }
    
    public next(scene:string):void
    {
        this.dispatchEvent(new SceneEvent(SceneEvent.NEXT,scene));
        this.parent.removeChild(this);
    }
    
    public tick(advancedTime:number):void
    {
        
    }
}