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
}
@end

@implementation ViewController

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

@end
