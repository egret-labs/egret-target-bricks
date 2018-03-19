

/**
 * 圆的Mask
 * @author Lee
 */
CCUIRoundMask = CCClass.Extends("CCUIRoundMask", 
{
    /**
     * 图片对象
     */
    _image : null,
    /**
     * 材质对象
     */
    _material : null,
    /**
     * 进度
     */
    _progress : null,


    /**
     * 构造函数
     * @param image 图片对象
     */
    Ctor : function(image)
    {
        //图片对象
        this._image = image;
        //材质对象
        this._material = new BK.Render.Material("GameRes://script/plugin/CCore/Engine/UI/Advance/RoundMask/UIRoundMask.vs", 
                                                "GameRes://script/plugin/CCore/Engine/UI/Advance/RoundMask/UIRoundMask.fs");;
        //进度
        this._progress = null;

        //挂接材质到图片上
        if (this._image &&
            this._material)
        {
            var imageNode = image.Node();
            if (imageNode)
            {
                imageNode.attachComponent(this._material);
            }
        }
    },

    /**
     * 析构函数
     */
    Dtor : function()
    {
        //从图片上移除材质
        if (this._image &&
            this._material)
        {
            var imageNode = image.Node();
            if (imageNode)
            {
                imageNode.detachComponent(this._material);
            }
        }

        //进度
        this._progress = null;
        //材质对象
        this._material = null;
        //图片对象
        this._image = null;
    },

    /**
     * 设置进度
     * @param progress 进度
     */
    SetProgress : function(progress)
    {
        progress = progress <= 0 ? 0.00000001 : progress;
        progress = progress > 1 ? 1 : progress;
        if (this._progress != progress)
        {
            this._progress = progress;

            if (this._material)
            {
                this._material.setUniform1f("Progress", progress);
            }
        }
    }
});

