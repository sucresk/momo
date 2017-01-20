class DBManager 
{
	private static _factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();

	public static addData(json:string, textureConfig:string, texture:string)
	{

		var skeletonData = RES.getRes(json);
        var textureData = RES.getRes(textureConfig);
        var textureImg = RES.getRes(texture);
        
        DBManager._factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        DBManager._factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(textureImg, textureData));
	}

	public static buildArmature(armatureName:string):dragonBones.Armature
	{
		return DBManager._factory.buildArmature(armatureName);
	}

	public static copyAnimation(target:dragonBones.Armature, source:dragonBones.Armature):void
	{
		DBManager._factory.copyAnimationsToArmature(target,source.name);
	}
	public constructor() 
	{
	}
}