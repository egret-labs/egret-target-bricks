//
//  ViewController.m
//  PublicBrickEngineGame
//
//  Created by 肖湘 on 2017/4/17.
//  Copyright © 2017年 tencent. All rights reserved.
//

#import "ViewController.h"
#import "DemoGLView.h"

@interface ViewController ()<UIImagePickerControllerDelegate, UINavigationControllerDelegate>
{
    DemoGLView * _glview;
    UIInterfaceOrientation _deviceOritation;
}
@end

@implementation ViewController

- (instancetype)init {
    if (self = [super init]) {
        _deviceOritation = UIInterfaceOrientationPortrait;
    }
    return self;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    [self addGLView];
    [self loadInitJSScript];
    
    NSString *demoPath = [[NSBundle mainBundle] pathForResource:@"Res/main" ofType:@"js"];
    if(demoPath){
        [_glview execJavaScriptFile:demoPath];
    }
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}


-(void)addGLView
{
    _glview = [[DemoGLView alloc] initWithFrame:CGRectMake(0 , 0, self.view.bounds.size.width, self.view.bounds.size.height)];
    _glview.backgroundColor = [UIColor clearColor];
    [self.view addSubview:_glview];
    _glview.gameOritation = _deviceOritation;
}

-(void)loadInitJSScript
{
    NSString *tickerPath = [[NSBundle mainBundle] pathForResource:@"preload/ticker" ofType:@"js"];
    if(tickerPath){
        [_glview execJavaScriptFile:tickerPath];
    }
    NSString *corePath = [[NSBundle mainBundle] pathForResource:@"preload/brick" ofType:@"js"];
    if(corePath){
        [_glview execJavaScriptFile:corePath];
    }
    NSString *gamePath = [[NSBundle mainBundle] pathForResource:@"preload/game" ofType:@"js"];
    if(gamePath){
        [_glview execJavaScriptFile:gamePath];
    }
}

-(void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    [self.navigationController setNavigationBarHidden:YES];
}

// MARK: - ScreenOrientationControl
- (BOOL)shouldAutorotate
{
    return YES;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations
{
    if (_deviceOritation == UIInterfaceOrientationLandscapeLeft) {
        return UIInterfaceOrientationMaskLandscapeLeft;
    } else if (_deviceOritation == UIInterfaceOrientationLandscapeRight) {
        return UIInterfaceOrientationMaskLandscapeRight;
    } else {
        return UIInterfaceOrientationMaskPortrait;
    }
}

-(void)viewWillTransitionToSize:(CGSize)size withTransitionCoordinator:(id<UIViewControllerTransitionCoordinator>)coordinator
{
    [super viewWillTransitionToSize:size withTransitionCoordinator:coordinator];
    [CATransaction begin];
    [CATransaction setDisableActions:YES];
    [coordinator animateAlongsideTransition:^(id<UIViewControllerTransitionCoordinatorContext> _Nonnull context) {
        
    } completion:^(id<UIViewControllerTransitionCoordinatorContext> _Nonnull context) {
        [CATransaction commit];
    }];
}

- (void)refreshScreenOrientation:(NSNumber *)orientation
{
    _deviceOritation = UIInterfaceOrientationPortrait;
    if (2 == [orientation intValue]) { // 设置方向
        _deviceOritation = UIInterfaceOrientationLandscapeLeft;
    } else if (3 == [orientation intValue]) {
        _deviceOritation = UIInterfaceOrientationLandscapeRight;
    }
    _glview.gameOritation = _deviceOritation;
    
    CGFloat deviceWidth = [UIScreen mainScreen].fixedCoordinateSpace.bounds.size.width;
    CGFloat deviceHeight = [UIScreen mainScreen].fixedCoordinateSpace.bounds.size.height;
    
    if (_deviceOritation == UIInterfaceOrientationPortrait) {
        _glview.frame = CGRectMake(0, 0, deviceWidth, deviceHeight);
    } else {
        _glview.frame = CGRectMake(0, 0, deviceHeight, deviceWidth);
    }
    
    [[UIDevice currentDevice] setValue:[NSNumber numberWithInteger:_deviceOritation] forKey:@"orientation"];
    [UIViewController attemptRotationToDeviceOrientation];
}

- (void)noticeEngineChangeScreenWithMode:(int)screenMode
{
    if (_glview) {
        [_glview changeScreenWithMode:screenMode];
    }
}

@end
