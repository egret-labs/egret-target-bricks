//
//  BKNavigationController.m
//  PublicBrickEngineGame
//
//  Created by MichaelxQiu on 2018/2/7.
//  Copyright © 2018年 tencent. All rights reserved.
//

#import "BKNavigationController.h"

@interface BKNavigationController ()

@end

@implementation BKNavigationController

- (UIInterfaceOrientationMask)supportedInterfaceOrientations
{
    return [[self.viewControllers lastObject] supportedInterfaceOrientations];
}

- (BOOL)shouldAutorotate
{
    return [[self.viewControllers lastObject] shouldAutorotate];
}

@end
