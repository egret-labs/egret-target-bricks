//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

namespace egret.web {

    let sharedCanvas: HTMLCanvasElement;

    /**
     * @private
     * Canvas2D渲染缓冲
     */
    export class CanvasRenderBuffer implements sys.RenderBuffer {

        public constructor(width?: number, height?: number, root?: boolean) {
            this.surface = { width: width, height: height }//createCanvas(width, height);
            this.context = new BK.Canvas(width, height)//{}//this.surface.getContext("2d");
            // this.last_matrix = new egret.Matrix();
            if (this.context) {
                this.context.$offsetX = 0;
                this.context.$offsetY = 0;
            }
        }

        /**
         * 渲染上下文
         */
        public context: any;//CanvasRenderingContext2D;
        /**
         * 呈现最终绘图结果的画布
         */
        public surface: any;//HTMLCanvasElement;


        /**
         * 渲染缓冲的宽度，以像素为单位。
         * @readOnly
         */
        public get width(): number {
            return this.surface.width;
        }

        /**
         * 渲染缓冲的高度，以像素为单位。
         * @readOnly
         */
        public get height(): number {
            return this.surface.height;
        }

        /**
         * 改变渲染缓冲的大小并清空缓冲区
         * @param width 改变后的宽
         * @param height 改变后的高
         * @param useMaxSize 若传入true，则将改变后的尺寸与已有尺寸对比，保留较大的尺寸。
         */
        public resize(width: number, height: number, useMaxSize?: boolean): void {
            let surface = this.surface;
            if (useMaxSize) {
                let change = false;
                if (surface.width < width) {
                    surface.width = width;
                    change = true;
                }
                if (surface.height < height) {
                    surface.height = height;
                    change = true;
                }
                //尺寸没有变化时,将绘制属性重置
                if (!change) {
                    this.context.globalCompositeOperation = "source-over";
                    this.context_setTransform(1, 0, 0, 1, 0, 0);
                    this.context.globalAlpha = 1;
                }
            }
            else {
                if (surface.width != width) {
                    surface.width = width;
                }
                if (surface.height != height) {
                    surface.height = height;
                }

                // if (surface.width != width || surface.height != height) {
                //     this.context.dispose();
                //     this.surface = { width: width, height: height }
                //     this.context = new BK.Canvas(width, height)
                //     if (this.context) {
                //         this.context.$offsetX = 0;
                //         this.context.$offsetY = 0;
                //     }
                //     Matrix.release(this.inversMatrix);
                // }
            }
            this.clear();
        }
        private inversMatrix: egret.Matrix;


        /**
         * BK新增
         * 操作context进行矩阵变化
         */
        public context_setTransform(a: number, b: number, c: number, d: number, tx: number, ty: number) {
            // //查看有没有逆矩阵
            // //先乘以逆矩阵
            // let inversMatrix = this.inversMatrix;
            // let targetMatrix = Matrix.create().setTo(a, b, c, d, tx, ty);
            // let resultMatrix = Matrix.create().setTo(1, 0, 0, 1, 0, 0);
            // if (inversMatrix) {
            //     resultMatrix.concat(inversMatrix);
            // }

            // inversMatrix = Matrix.create().setTo(a, b, c, d, tx, ty);
            // inversMatrix.invert();
            // this.inversMatrix = inversMatrix;
            // resultMatrix.concat(targetMatrix);
            // this.context.transforms(resultMatrix.a, resultMatrix.b, resultMatrix.c, resultMatrix.d, resultMatrix.tx, resultMatrix.ty);
            // Matrix.release(targetMatrix);
            // Matrix.release(resultMatrix);

            this.context.transforms(a, b, c, d, tx, ty);
        }

        /**
         * 获取指定区域的像素
         * BK brick不支持像素颜色信息提取，
         * 这里做一个简单处理，只要坐标在canvas内，就返回true；
         */
        public getPixels(x: number, y: number, width: number = 1, height: number = 1): any {
            return undefined;
            // return <number[]><any>this.context.getImageData(x, y, width, height).data;
        }

        /**
         * 转换成base64字符串，如果图片（或者包含的图片）跨域，则返回null
         * @param type 转换的类型，如: "image/png","image/jpeg"
         */
        public toDataURL(type?: string, encoderOptions?: number): string {
            return this.surface.toDataURL(type, encoderOptions);
        }

        /**
         * 清空缓冲区数据
         */
        public clear(): void {
            this.context_setTransform(1, 0, 0, 1, 0, 0);
            this.context.clearRect(0, 0, this.surface.width, this.surface.height);
        }

        /**
         * 销毁绘制对象
         */
        public destroy(): void {
            this.surface.width = this.surface.height = 0;
        }
    }
}
