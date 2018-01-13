//矩阵类

/**
 * 生成一个普通的矩阵
 */
var mat = new BK.Matrix();

/**
 * 生成一个大小变换矩阵
 * x 变换
 * y 变换
 * z 变换
 */
var scaleMat =new BK.Matrix.Scale(2,2,2);

/**
 * 生成一个位置变换矩阵
 * x 变换
 * y 变换
 * z 变换
 */
var tansMat = new BK.Matrix.Translate(10,10,0);


/**
 * 生成一个旋转矩阵 逆时针方向
 * x 绕x轴旋转
 * y 绕y轴旋转
 * z 绕z轴旋转
 */
var rotaMat = new BK.Matrix.Rotate(1,2,3);


/**
 * 矩阵运算
 */
//矩阵相乘
var mat = BK.Matrix.multiply(tansMat,scaleMat);
