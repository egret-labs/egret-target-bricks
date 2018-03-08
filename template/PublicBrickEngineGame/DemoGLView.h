//
//  DemoGLView.h
//  bricktest
//
//  Created by 肖湘 on 2017/4/26.
//  Copyright © 2017年 louisluo. All rights reserved.
//

#include "bkGLView.h"
@interface DemoGLView : bkGLView

@property (nonatomic, assign) UIInterfaceOrientation gameOritation;
- (void)changeScreenWithMode:(int)screenMode;

@end
