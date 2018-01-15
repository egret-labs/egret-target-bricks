//
//  ImagePicker.h
//  brick
//
//  Created by marvinzhou on 2017/11/1.
//  Copyright © 2017年 louisluo. All rights reserved.
//

#ifndef ImagePicker_h
#define ImagePicker_h

#ifdef __cplusplus
extern "C"{
#endif

struct bkImageSelector;
struct bkDirector;

typedef void(*BK_IMAGE_SELECT_CALLBACK)(struct bkImageSelector* imageSelector);

void bkDirectorSetSelectImageHandler(struct bkDirector * director, BK_IMAGE_SELECT_CALLBACK imageSelectCallback);


#ifdef __cplusplus
};
#endif
        
#endif /* ImagePicker_h */
