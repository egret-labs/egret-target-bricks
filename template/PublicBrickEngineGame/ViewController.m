//
//  ViewController.m
//  PublicBrickEngineGame
//
//  Created by 肖湘 on 2017/4/17.
//  Copyright © 2017年 tencent. All rights reserved.
//

#import "ViewController.h"
#import "DemoGLView.h"

/////////横竖屏//////////
typedef NS_ENUM(NSInteger, CmGameOrientation) {
    CmGameOrientationPortrait           = 1,
    CmGameOrientationLandscapeLeft,
    CmGameOrientationLandscapeRight,
};
@interface SpriteGameConfigModel : NSObject

@property (nonatomic,copy) NSString *enterUrl;
@property (nonatomic,assign) CmGameOrientation viewMode;    // 横竖屏模式：1.竖屏 2.横屏（home键在左边）3.横屏（home键在右边）
- (instancetype)initWithDicionary:(NSDictionary *)dic;
- (BOOL)isCmWebGame;
@end
@implementation SpriteGameConfigModel
- (instancetype)initWithDicionary:(NSDictionary *)dic
{
    if (self = [super init]) {
        if([dic objectForKey:@"enterUrl"]){
            _enterUrl = [[dic objectForKey:@"enterUrl"] copy];
        }
        if ([dic objectForKey:@"viewMode"]) {
            _viewMode = (CmGameOrientation) [[dic objectForKey:@"viewMode"] intValue];
        }
    }
    return self;
}
- (BOOL)isCmWebGame
{
    if (_enterUrl.length > 0) {
        return YES;
    } else {
        return NO;
    }
}
@end

@interface ViewController ()<UIImagePickerControllerDelegate, UINavigationControllerDelegate>
{
    DemoGLView * _glview;
    SpriteGameConfigModel * gameConfig;
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
    
    gameConfig = [self parseGameConfigJson:[[NSBundle mainBundle] pathForResource:@"Res/gameConfig" ofType:@"json"]];
    if (gameConfig) {
        [self refreshScreenOrientation:@(gameConfig.viewMode)];
    }
    
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


-(SpriteGameConfigModel *)parseGameConfigJson:(NSString *) configPath
{
    SpriteGameConfigModel *configModel = nil;
    BOOL isDir = NO;
    BOOL isExist = [[NSFileManager defaultManager] fileExistsAtPath:configPath isDirectory:&isDir];
    if (isExist)
    {
        NSData *configData = [NSData dataWithContentsOfFile:configPath];
        if (configData && configData.length > 0) {
            NSError * err;
            NSDictionary *configDic = [NSJSONSerialization JSONObjectWithData:configData options:NSJSONReadingMutableContainers error:&err];
            if (configDic && configDic.count > 0)
            {
                configModel = [[SpriteGameConfigModel alloc] initWithDicionary:configDic];
            }else{
                NSLog(@"gameConfig.json parse failed. error:%@",err.description);
            }
        }
    }
    if (!configModel) {
        NSLog(@"gameConfig.json parse failed.");
    }
    return configModel;
}

@end
