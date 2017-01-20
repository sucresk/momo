class Role extends egret.Sprite
{
    public static LEFT_EAR:string = "L_ear";
    public static RIGHT_EAR:string = "R_ear";
    public static LEFT_EYE:string = "L_eye";
    public static RIGHT_EYE:string = "R_eye";
    public static MOUTH:string = "Mouth";
    public static NOSE:string = "Nose";
    public static HAIR:string = "Shit";

    public static ANIM_EAR:string = "Basic_ear";
    public static ANIM_EYE:string = "Basic_eye";
    public static ANIM_EYE_1:string = "Blink";
    public static ANIM_NOSE:string = "Basic_sniff";
    public static ANIM_MOUTH:string = "Basic_mouth";
    public static ANIM_HAIR:string = "Shit jump";
    public static ANIM_IDLE:string = "scratch";
    public static ANIM_ERROR:string = "Basic_error";

    public static ANIM_MAP:any = {
        "L_ear" : Role.ANIM_EAR,
        "R_ear" : Role.ANIM_EAR,
        "L_eye" : Role.ANIM_EYE,
        "R_eye" : Role.ANIM_EYE_1,
        "Mouth" : Role.ANIM_MOUTH,
        "Nose" : Role.ANIM_NOSE,
        "Shit" : Role.ANIM_HAIR
    }
    public hotPoints:Array<string> = [Role.LEFT_EAR, 
                                      Role.RIGHT_EAR, 
                                      Role.LEFT_EYE, 
                                      Role.RIGHT_EYE,
                                      Role.MOUTH,
                                      Role.NOSE,
                                      Role.HAIR]
    public armature:dragonBones.Armature;
    public name:string;
    private _scale:number;

    
    public constructor(name:string = "man1", scale:number = 1)
    {
        super();
        this.name = name;
        this._scale = scale;
        console.log("name armature",name);
        var skeletonData = RES.getRes("skeleton_" + name + "_json");
        var textureData = RES.getRes("texture_"+name + "_json");
        var texture = RES.getRes("texture_" + name + "_png");
        
        var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
        
        this.armature = factory.buildArmature(name);
        var armatureDisplay = this.armature.display;
        armatureDisplay.scaleX = this._scale;
        armatureDisplay.scaleY = this._scale;
        dragonBones.WorldClock.clock.add(this.armature);
        this.addChild(armatureDisplay);

        this.initEvent();
    }
    
    private initEvent():void
    {
        var s:dragonBones.Slot;
        var b:egret.Bitmap;
        var i:number;
        var len:number;
        var hotName:string;

        for(i = 0,len = this.hotPoints.length; i < len; i++)
        {
            hotName = this.hotPoints[i];
            s = this.armature.getSlot(hotName);
            if(s)
            {
                b = s.display;
                b.name = hotName;
                if(b)
                {
                    b.touchEnabled = true;
                    b.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchHotPoint,this);
                }
            }
        }
        this.armature.addEventListener(dragonBones.AnimationEvent.COMPLETE, this.onAnimComplete,this);
    }

    private onAnimComplete(e:dragonBones.AnimationEvent):void
    {
        this.dispatchEvent(e);
    }
    private onTouchHotPoint(e:egret.TouchEvent):void
    {
        var hotName = e.target.name;
        var evt:RoleEvent = new RoleEvent(RoleEvent.TOUCH_HOT, hotName);
        //this.play(Role.ANIM_MAP[hotName])
        this.dispatchEvent(evt);
    }
    public play(name:string):void
    {
         this.armature.animation.gotoAndPlay(name,0,-1,1);
    }
    public gotoAndStop(name:string, pos:number):void
    {
         this.armature.animation.gotoAndStop(name,pos);
    }
    
    public get totleTime():number
    {
        return this.armature.animation.lastAnimationState.totalTime;
    }
    public remove():void
    {
        dragonBones.WorldClock.clock.remove(this.armature);
    }
    public randomPart():string
    {
        let r:number = Math.floor(Math.random() * this.hotPoints.length);
        return this.hotPoints[r];
    }
}