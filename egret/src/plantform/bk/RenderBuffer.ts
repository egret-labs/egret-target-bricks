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

namespace egret {
    export class BKRenderBuffer implements sys.RenderBuffer {

        public constructor(width?: number, height?: number) {
            this.surface = {};
            this.context = {};
            //保证rootCanvas是第一个创建的canvas
        }

        /**
         * 渲染上下文
         */
        public context: any;
        /**
         * 呈现最终绘图结果的画布
         */
        public surface: any;

        /**
         * 渲染缓冲的宽度，以像素为单位。
         * @readOnly
         */
        public get width(): number {
            return 0;
        }

        /**
         * 渲染缓冲的高度，以像素为单位。
         * @readOnly
         */
        public get height(): number {
            return 0;
        }

        /**
         * 改变渲染缓冲的大小并清空缓冲区
         * @param width 改变后的宽
         * @param height 改变后的高
         * @param useMaxSize 若传入true，则将改变后的尺寸与已有尺寸对比，保留较大的尺寸。
         */
        public resize(width: number, height: number, useMaxSize?: boolean): void {

        }

        /**
         * 获取指定区域的像素
         */
        public getPixels(x: number, y: number, width: number = 1, height: number = 1): number[] {
            return [];
        }

        /**
         * 转换成base64字符串，如果图片（或者包含的图片）跨域，则返回null
         * @param type 转换的类型，如: "image/png","image/jpeg"
         */
        public toDataURL(type?: string, encoderOptions?: number): string {
            return "";
        }

        /**
         * 清空缓冲区数据
         */
        public clear(): void {
        }

        /**
         * 销毁绘制对象
         */
        public destroy(): void {
        }
    }

    sys.RenderBuffer = BKRenderBuffer as any;
}
