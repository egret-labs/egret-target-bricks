//
//  ImageSelectPlatform.h
//  brick
//
//  Created by marvinzhou on 2017/11/1.
//  Copyright © 2017年 louisluo. All rights reserved.
//



#ifndef ImageSelectPlatform_h
#define ImageSelectPlatform_h

#import <UIKit/UIKit.h>
#include <MobileCoreServices/UTCoreTypes.h>

struct bkImageSelector;

@interface ImagePicker : UIViewController

+(UIImagePickerController * )bkCreateImagePicker:(struct bkImageSelector *) imageSelector delegages:(void*) delegate;

+(void) bkImagePickerControllerCallBack:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary<NSString *,id> *)info;

+(void) bkImagePickerControllerDidCancelCallBack:(UIImagePickerController *)pickers;
@end

void bkChooseImage(int status);

#endif /* ImageSelectPlatform_h */
