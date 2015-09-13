/**
 * TiNSGIF
 *
 * Created by Kosso
 * Copyright (c) 2015 . MIT License.
 */

#import "TiNsgifModule.h"
#import "TiBase.h"
#import "TiHost.h"
#import "TiUtils.h"

#import "NSGIF.h"

@implementation TiNsgifModule

#pragma mark Internal

// this is generated for your module, please do not change it
-(id)moduleGUID
{
	return @"563873f2-04dc-4501-b0cf-6c05779ab1a4";
}

// this is generated for your module, please do not change it
-(NSString*)moduleId
{
	return @"ti.nsgif";
}

#pragma mark Lifecycle

-(void)startup
{
	// this method is called when the module is first loaded
	// you *must* call the superclass
	[super startup];

	NSLog(@"[INFO] %@ loaded",self);
}

-(void)shutdown:(id)sender
{
	// this method is called when the module is being unloaded
	// typically this is during shutdown. make sure you don't do too
	// much processing here or the app will be quit forceably
    NSLog(@"[INFO] %@ shutdown",self);
    
	// you *must* call the superclass
	[super shutdown:sender];
}

#pragma mark Cleanup


-(void)dealloc
{
	// release any resources that have been retained by the module
	[super dealloc];
}


#pragma mark Internal Memory Management

-(void)didReceiveMemoryWarning:(NSNotification*)notification
{
	// optionally release any resources that can be dynamically
	// reloaded once memory is available - such as caches
	[super didReceiveMemoryWarning:notification];
}

#pragma mark Listener Notifications

-(void)_listenerAdded:(NSString *)type count:(int)count
{
	if (count == 1 && [type isEqualToString:@"my_event"])
	{
		// the first (of potentially many) listener is being added
		// for event named 'my_event'
	}
}

-(void)_listenerRemoved:(NSString *)type count:(int)count
{
	if (count == 0 && [type isEqualToString:@"my_event"])
	{
		// the last listener called for event named 'my_event' has
		// been removed, we can optionally clean up any resources
		// since no body is listening at this point for that event
	}
}

#pragma Public APIs

- (void) optimalGIFfromURL:(id)args {
    
        NSString *inputUrlString = [args objectAtIndex:0];
        if(inputUrlString!=nil){
            NSString *escapedValue =
            [(NSString *)CFURLCreateStringByAddingPercentEscapes(nil,
                                                                 (CFStringRef)inputUrlString,
                                                                 NULL,
                                                                 NULL,
                                                                 kCFStringEncodingUTF8) autorelease];
            NSURL *inputURL = [NSURL fileURLWithPath: escapedValue];
            [NSGIF optimalGIFfromURL:inputURL loopCount:0 completion:^(NSURL *GifURL) {
                if ([self _hasListeners:@"complete"]) {
                    NSDictionary *event = [NSDictionary dictionaryWithObjectsAndKeys:
                                           GifURL,              @"url",
                                           self,                @"source",
                                           @"complete",         @"type",nil];
                    [self fireEvent:@"complete" withObject:event];
               }
            }];
        }
}

- (void) createGIFfromURL:(id)args {

    NSString *inputUrlString = [args objectAtIndex:0];
    int *frameCount = [TiUtils intValue:[args objectAtIndex:1] def:10];
    int *delayTime = [TiUtils intValue:[args objectAtIndex:2] def:.01];
    int *loopCount = [TiUtils intValue:[args objectAtIndex:3] def:0];

    if(inputUrlString!=nil){
        NSString *escapedValue =
        [(NSString *)CFURLCreateStringByAddingPercentEscapes(nil,
                                                             (CFStringRef)inputUrlString,
                                                             NULL,
                                                             NULL,
                                                             kCFStringEncodingUTF8) autorelease];
        
        NSURL *inputURL = [NSURL fileURLWithPath: escapedValue];
        [NSGIF createGIFfromURL:inputURL withFrameCount:frameCount delayTime:delayTime loopCount:loopCount completion:^(NSURL *GifURL) {
            if ([self _hasListeners:@"complete"]) {
                NSDictionary *event = [NSDictionary dictionaryWithObjectsAndKeys:
                                       GifURL,              @"url",
                                       self,                @"source",
                                       @"complete",         @"type",nil];
                [self fireEvent:@"complete" withObject:event];
            }
        }];
    }
}

@end
