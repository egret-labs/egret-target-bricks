//
//  bkGLView.h
//  brick
//
//  Created by wesleyxiao on 2017/2/13.
//  Copyright © 2017年 louisluo. All rights reserved.
//

#import <UIKit/UIKit.h>

#import <OpenGLES/ES2/gl.h>
#import <OpenGLES/ES2/glext.h>

struct bkDirector;

@interface bkGLView : UIView

@property (nonatomic, assign) BOOL initialized;

@property (nonatomic, assign) NSInteger frameInterval;

@property (nonatomic, assign) NSInteger framesPerSecond;

@property (nonatomic, assign) struct bkDirector * director;

@property (nonatomic, assign) EAGLContext * glContext;



-(void)initialize;

-(void)dispose;

-(void)createScript;

-(void)execJavaScriptString:(NSString *)scriptString;

-(void)execJavaScriptFile:(NSString *)scriptFile;

-(void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event;

#ifdef AUTO_TEST
-(void)simulateTouchBegin;
-(void)simulateTouchEnd;
#endif

@end
