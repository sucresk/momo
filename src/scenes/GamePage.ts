class GameScene extends Scene
{
    
	private _bg:egret.Bitmap;
	private _roleManager:RoleManager;

    private _fsm:FSM = new FSM();
    
    private  STATE_NORMAL:string = "STATE_NORMAL";
    private  STATE_QUEST:string = "STATE_QUEST";
    private  STATE_QUEST_DO:string = "STATE_QUEST_DO";
    private  STATE_QUEST_DONE:string = "STATE_QUEST_DONE";
    private  STATE_QUEST_MISS:string = "STATE_QUEST_MISS";
    private  STATE_QUEST_OUTTIME:string = "STATE_QUEST_OUTTIME";
    private  STATE_OVER:string = "STATE_OVER";
    
    private _mainRole:Role;

    private _timeConfig:any = {};
    private _questConfig:any = {};
    private _curTime:number;
    private _targetTime:number;
    private _curQuestNum:number = 0;
    private _curQuestName:string;
    private _txtHelp:egret.TextField;
    
    private _questPartMap:any;
    private _questIndexMap:any;

    private _questArm:dragonBones.Armature;
    private _questSlot:dragonBones.Slot;
    private _countDownSlot:dragonBones.Slot;
    private _pause:boolean;
    
    private _curScore:number = 0;
    private _totalScore:number = 3;
    private _scoreBar:egret.DisplayObject;
    private _scoreMask:egret.Shape;
    private _scoreMaskW:number = 10;

	public constructor() 
	{
		super();
        this._timeConfig.normalTime_min = 3000;
        this._timeConfig.normalTime_max = 3000;
        
        this._timeConfig.questTime = 100;

        this._timeConfig.questDoTime = 3000;
        this._timeConfig.questResultTime = 2000;

        this._questConfig.questNum = 3;
        this._txtHelp = new egret.TextField();
        this._questPartMap = {"L_ear":Quest.QUEST_LEFT_EAR,
                              "R_ear":Quest.QUEST_RIGHT_EAR,
                              "L_eye":Quest.QUEST_LEFT_EYE,
                              "R_eye":Quest.QUEST_RIGHT_EYE,
                              "Shit":Quest.QUEST_HAIR,
                              "Mouth":Quest.QUEST_MOUTH,
                              "Nose":Quest.QUEST_NOSE
                            };
        this._questIndexMap = {"L_ear":6,
                              "R_ear":2,
                              "L_eye":5,
                              "R_eye":1,
                              "Shit":0,
                              "Mouth":4,
                              "Nose":3
                            };
        this._totalScore = this._questConfig.questNum;

        
	}

    private addTip(tip:string):void
    {
        this._txtHelp.text = tip;
    }
	public init():void
	{
		super.init();

		this._roleManager = new RoleManager();

        //init bg
		// this._bg = AssetManager.createBitmapByName("bg_jpg", false);
        // this.addChild(this._bg);
        var bgArm:dragonBones.Armature = DBManager.buildArmature("MomoUI");
        var bgDisplay:egret.DisplayObject = bgArm.display;
        bgArm.display.x = this.stage.stageWidth / 2;
        bgArm.display.y = this.stage.stageHeight;
        this.addChild(bgDisplay);
        var scoreBarSlot:dragonBones.Slot = bgArm.getSlot("progressBar");
        this._scoreBar = scoreBarSlot.display;
        this._scoreMask = new egret.Shape();
        this._scoreMask.graphics.beginFill(0xffff00);
        this._scoreMask.graphics.drawRect(0,0, this._scoreBar.width, this._scoreBar.height);
        this.addChild(this._scoreMask);
        this._scoreMaskW = this._scoreBar.width;
        this._scoreMask.x = -this._scoreMaskW;
        this._scoreBar.mask = this._scoreMask;

        //init role
        this._mainRole = this._roleManager.getRole("man1");
		this._mainRole.x = this.stage.stageWidth / 2;
		this._mainRole.y = this.stage.stageHeight;
		this.addChild(this._mainRole);

        //init bubble 
        var bubbleArm1:dragonBones.Armature = DBManager.buildArmature("Bubble1");
        var bubbleDisplay1:egret.DisplayObject = bubbleArm1.display;
        dragonBones.WorldClock.clock.add(bubbleArm1);
        bubbleArm1.animation.gotoAndPlay("float");

        bubbleDisplay1.x = this.stage.stageWidth / 8;
        bubbleDisplay1.y = this.stage.stageHeight - 100;

        var bubbleArm2:dragonBones.Armature = DBManager.buildArmature("Bubble2");
        this._countDownSlot = bubbleArm2.getSlot("medium");
        var bubbleDisplay2:egret.DisplayObject = bubbleArm2.display;
        dragonBones.WorldClock.clock.add(bubbleArm2);
        DBManager.copyAnimation(bubbleArm2, bubbleArm1);
        bubbleArm2.animation.gotoAndPlay("float");

        bubbleDisplay2.x = this.stage.stageWidth / 2;
        bubbleDisplay2.y = this.stage.stageHeight - 100;

        var bubbleArm3:dragonBones.Armature = DBManager.buildArmature("Bubble3");
        var bubbleDisplay3:egret.DisplayObject = bubbleArm3.display;
        dragonBones.WorldClock.clock.add(bubbleArm3);
        DBManager.copyAnimation(bubbleArm3, bubbleArm1);
        bubbleArm3.animation.gotoAndPlay("float");
        bubbleDisplay3.touchEnabled = true;
        bubbleDisplay3.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onPause, this)

        bubbleDisplay3.x = this.stage.stageWidth / 8 * 7;
        bubbleDisplay3.y = this.stage.stageHeight - 100;

        this.addChild(bubbleDisplay1);
        this.addChild(bubbleDisplay2);
        this.addChild(bubbleDisplay3);

		//init quest
        this._questArm = DBManager.buildArmature("QuestAnim");
        this._questSlot = this._questArm.getSlot("quest");
        this._questSlot.displayController = "no_anim";
        this._questSlot.displayIndex = -1;

        dragonBones.WorldClock.clock.add(this._questArm);
        this._questArm.display.x = this.stage.stageWidth / 2;
        this._questArm.display.y = 220;

        this.addChild(this._questArm.display);

        this.initEvent();
        this.initState();
        
        this.addChild(this._txtHelp);

	}
    
    private initEvent():void
    {
        
    }
    private onPause(e:egret.TouchEvent):void
    {
        console.log("aaaa")
        this._pause = !this._pause;
    }
    private onTouchHot(e:RoleEvent):void
    {
        var touchHotName:string = e.data;
        if(touchHotName == this._curQuestName)
        {
            //this.playHitAnim();
            //this.addScore();
            this._fsm.switchTo(this.STATE_QUEST_DONE);
        }
        else
        {
            this.failHit();
            this._fsm.switchTo(this.STATE_QUEST_MISS);
        }
        
    }
    private onAnimComplete(e:dragonBones.AnimationEvent):void
    {
        console.log(e.animationName, "complete");
    }
    private initState():void
    {
        //状态
        //notmal -> quest -> quest_do  -> quest_missing -> quest_count -> normal
        //                             -> quest_done
        //                             -> quest_error
        this._fsm.addState(this.STATE_NORMAL);
        this._fsm.addState(this.STATE_QUEST);
        this._fsm.addState(this.STATE_QUEST_DO);
        this._fsm.addState(this.STATE_QUEST_DONE);
        this._fsm.addState(this.STATE_QUEST_MISS);
        this._fsm.addState(this.STATE_QUEST_OUTTIME);
        this._fsm.addState(this.STATE_OVER);
        
        this._fsm.pushFront(this.STATE_NORMAL,()=>{
            this._mainRole.play(Role.ANIM_IDLE);
            this._curTime = 0;
            this._targetTime = this._timeConfig.normalTime_min + Math.floor(Math.random() * (this._timeConfig.normalTime_max - this._timeConfig.normalTime_max));
            console.log(this._fsm.currentState);
            this.addTip("normal state");
            this._countDownSlot.displayIndex = 2;
        })
        this._fsm.pushBack(this.STATE_NORMAL,()=>{
            this._countDownSlot.displayIndex = -1;
        })

        this._fsm.pushFront(this.STATE_QUEST,()=>{
            this._curTime = 0;
            this._targetTime = this._timeConfig.questTime;
            this._curQuestNum++;
            console.log(this._fsm.currentState);
            this.createQuest();
            this.playQuestAnim();
            this.addTip("quest state : " + this._curQuestName);

            // var questName:string = this._questPartMap[this._curQuestName];
            // var questAnim:Quest = new Quest(questName);
            // questAnim.y = 100;
            // this.addChild(questAnim);
            // console.log(questAnim)
        })

        this._fsm.pushFront(this.STATE_QUEST_DO,()=>{
            this._curTime = 0;
            this._targetTime = this._timeConfig.questDoTime;
            console.log(this._fsm.currentState);
            this.addRoleTouchEvent();
            this.addTip("do quest")
        })
        this._fsm.pushBack(this.STATE_QUEST_DO,()=>{
            this.removeRoleTouchEvent();

        })

        this._fsm.pushFront(this.STATE_QUEST_DONE,()=>{
            this._curTime = 0;
            this._targetTime = this._timeConfig.questResultTime;
            console.log(this._fsm.currentState);
            this.playHitAnim();
            this.addScore();

            this.addTip("quest done")
        })

        this._fsm.pushFront(this.STATE_QUEST_MISS,()=>{
            this._curTime = 0;
            this._targetTime = this._timeConfig.questResultTime;
            console.log(this._fsm.currentState);
            this.playMissAnim();
            this.failHit();
            this.addTip("quest miss")
        })

        this._fsm.pushFront(this.STATE_QUEST_OUTTIME,()=>{
            this._curTime = 0;
            this._targetTime = this._timeConfig.questResultTime;
            console.log(this._fsm.currentState);
            this.playOutAnim();
            this.failHit();
            this.addTip("quest time out")
        })

        this._fsm.pushFront(this.STATE_OVER,()=>{
            this._curTime = 0;
            console.log(this._fsm.currentState);
            this.levelOver();
            this.addTip("quest level over")
        })
        
        this._fsm.init(this.STATE_NORMAL);
    }

    private levelOver():void
    {
        var scoreBoard:ScoreBoard = new ScoreBoard();
        scoreBoard.x = this.stage.stageWidth / 2;
        scoreBoard.y = this.stage.stageHeight / 2;
        scoreBoard.touchEnabled = true;
        scoreBoard.addEventListener(egret.TouchEvent.TOUCH_END, (e:egret.Event)=>{
            this.next("gameInfo");
        },this);
        this.addChild(scoreBoard);
    }
	public tick(advancedTime:number):void
    {
        if(this._pause)
        {
            return;
        }
        dragonBones.WorldClock.clock.advanceTime(advancedTime/1000);

        this._curTime += advancedTime;
        if(this._curTime > this._targetTime)
        {
            this.stateChange();
        }

        if(this._fsm.currentState == this.STATE_NORMAL)
        {
            this.updateCountDown();
        }
    }

    private updateCountDown():void
    {
        if(this._curTime > 2000)
        {
            this._countDownSlot.displayIndex = 0;
        }
        else if(this._curTime > 1000)
        {
            this._countDownSlot.displayIndex = 1;
        }
    }
    private stateChange():void
    {
        switch(this._fsm.currentState)
        {
            case this.STATE_NORMAL:
                if(this._curQuestNum > this._questConfig.questNum)
                {
                    this._fsm.switchTo(this.STATE_OVER);
                }
                else
                {
                    this._fsm.switchTo(this.STATE_QUEST);
                }
                break;
            case this.STATE_QUEST:
                this._fsm.switchTo(this.STATE_QUEST_DO);
                break;
            case this.STATE_QUEST_DO:
                this._fsm.switchTo(this.STATE_QUEST_OUTTIME);
                break;
            case this.STATE_QUEST_DONE:
            case this.STATE_QUEST_MISS:
            case this.STATE_QUEST_OUTTIME:
                this._fsm.switchTo(this.STATE_NORMAL);
                break;
        }
    }

    private createQuest():void
    {
        this._curQuestName = this._mainRole.randomPart();
    }

    private playQuestAnim():void
    {
        this._questSlot.displayIndex = this._questIndexMap[this._curQuestName];;
        var level:number = Math.floor(Math.random() * 11);
        this._questArm.animation.play("quest" + level,1);
    }

    private addRoleTouchEvent():void
    {
        this._mainRole.addEventListener(RoleEvent.TOUCH_HOT, this.onTouchHot,this);
        this._mainRole.addEventListener(dragonBones.AnimationEvent.COMPLETE, this.onAnimComplete,this);
    }

    private removeRoleTouchEvent():void
    {
        this._mainRole.removeEventListener(RoleEvent.TOUCH_HOT, this.onTouchHot,this);
        this._mainRole.removeEventListener(dragonBones.AnimationEvent.COMPLETE, this.onAnimComplete,this);
    }

    private playHitAnim():void
    {
        this._mainRole.play(Role.ANIM_MAP[this._curQuestName]);
    }

    private addScore():void
    {
        this._curScore++;
        this._scoreMask.x = -(1 - this._curScore / this._totalScore) * this._scoreMaskW;
        console.log(this._curScore, this._curScore/ this._totalScore, this._scoreMask.x);
    }

    private playMissAnim():void
    {

    }

    private playOutAnim():void
    {

    }
    private failHit():void
    {
        this._mainRole.play(Role.ANIM_ERROR);
    }
}