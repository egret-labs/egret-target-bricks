//
//  ViewController.m
//  PublicBrickEngineGame
//
//  Created by 肖湘 on 2017/4/17.
//  Copyright © 2017年 tencent. All rights reserved.
//

#import "ViewController.h"
#import "DemoGLView.h"
#include <MobileCoreServices/UTCoreTypes.h>


static ViewController* cmshow_view_controler = nil;
//void openImageSelector(struct bkImageSelector* imageSelector);

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
    // Dispose of any resources that can be recreated.
}


-(void)addGLView
{
    _glview = [[bkGLView alloc] initWithFrame:CGRectMake(0 , 0, self.view.bounds.size.width, self.view.bounds.size.height)];
    [_glview initialize];
    _glview.backgroundColor = [UIColor clearColor];
    
    [self.view addSubview:_glview];
    _glview.frame = CGRectMake(0 , 0, self.view.bounds.size.width, self.view.bounds.size.height);
    cmshow_view_controler = self;
//    bkDirectorSetSelectImageHandler(_glview.director, openImageSelector);
}


//- (void)selectPhoto:(struct bkImageSelector *)imageSelector {
//    //    //创建UIImagePickerController对象
//    UIImagePickerController * imagePicker = [ImagePicker bkCreateImagePicker:imageSelector delegages:(void*)self];
//    if (imagePicker)
//    {
//        [self presentViewController:imagePicker animated:YES completion:nil];
//    }
//}

//- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary<NSString *,id> *)info {
//    [ImagePicker bkImagePickerControllerCallBack:picker didFinishPickingMediaWithInfo:info];
//}
//
//- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker
//{
//    [ImagePicker bkImagePickerControllerDidCancelCallBack:picker];
//}

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

//void openImageSelector(struct bkImageSelector* imageSelector)
//{
//    if (cmshow_view_controler) {
//        [cmshow_view_controler selectPhoto:imageSelector];
//    }
//}

