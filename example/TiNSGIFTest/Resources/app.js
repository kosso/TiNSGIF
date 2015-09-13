// TiNSGIFTest

// Author	: Kosso
// Date 	: Sept 12 2015 


var applicationDataDirectoryPath = Ti.Filesystem.applicationDataDirectory;
var movieFile, writer;
var TiNSGIF = require('ti.nsgif');

var win = Ti.UI.createWindow({
	backgroundColor:'white'
});
var webview = Ti.UI.createWebView({
	top:30,
	left:10,
	right:10,
	borderWidth:2,
	borderColor:'#ccc',
	bottom:70
});

win.add(webview);


var btn_camera = Ti.UI.createButton({
	title:'camera',
	borderColor:'#ccc',
	tintColor:'#222',
	bottom:10,
	height:50,
	left:10,
	width:'30%'
});

var btn_album = Ti.UI.createButton({
	title:'pick',
	borderColor:'#ccc',
	tintColor:'#222',
	bottom:10,
	height:50,
	//right:10,
	width:'30%'
});

var btn_test = Ti.UI.createButton({
	title:'test',
	borderColor:'#ccc',
	tintColor:'#222',
	bottom:10,
	height:50,
	right:10,
	width:'30%'
});


win.add(btn_album);
win.add(btn_camera);
win.add(btn_test);

btn_camera.addEventListener('click', openCamera);
btn_test.addEventListener('click', convertTest);
btn_album.addEventListener('click', openAlbum);



win.open();



function gifComplete(e){
	console.log('GIF complete :');
	console.log(e);

	TiNSGIF.removeEventListener('complete',gifComplete);

	movieFile = null;
	writer = null;
	
	var gif_path = e.url.split('file://').join('');
	var gif = Titanium.Filesystem.getFile(gif_path);

	console.log('GIF File.name: '+gif.name+' - File.size : '+bytesToSize(gif.size));

	var new_path = applicationDataDirectoryPath + Math.round(new Date().getTime() / 1000)+'.gif';
	// move it from the tmp directory
	gif.move(new_path);
	var new_url = 'file://'+new_path;
	//console.log('final url : '+new_url);
	webview.url = new_url;
	gif = null;


}

function openCamera(){

	webview.html = '...';

	Titanium.Media.showCamera({
		success:function(event){

			console.log(event);
			var video_path = applicationDataDirectoryPath + 'gif.mov';
			movieFile = Ti.Filesystem.getFile(video_path);

			if(movieFile.exists()){
				movieFile.deleteFile();
			}

			writer = movieFile.write(event.media); 	
			Ti.API.info ("Video File: " + video_path); 

			writer = null;
			movieFile = null;

			TiNSGIF.addEventListener('complete',gifComplete);
			//TiNSGIF.optimalGIFfromURL(video_path);
			TiNSGIF.createGIFfromURL(video_path, 50, 0.01, 0);  // 5 seconds.

			Titanium.Media.hideCamera();

		},
		cancel:function(){
		},
		error:function(error){
		},
		allowEditing:true,
		mediaTypes: Titanium.Media.MEDIA_TYPE_VIDEO,
		videoMaximumDuration:5000, // 5 seconds
		videoQuality:Ti.Media.QUALITY_MEDIUM
	});
}


function openAlbum(){

	webview.html = '...';

	Titanium.Media.openPhotoGallery({
		success:function(event){

			//console.log(event);
			var video_path = applicationDataDirectoryPath + 'gif.mov';
			//Ti.API.info('new chosen file : '+video_path);
			movieFile = Ti.Filesystem.getFile(video_path);

			if(movieFile.exists()){
				movieFile.deleteFile();
			}

			writer = movieFile.write(event.media); 	
			Ti.API.info ("Video File: " + video_path); 

			writer = null;
			movieFile = null;

			TiNSGIF.addEventListener('complete',gifComplete);
			TiNSGIF.createGIFfromURL(video_path, 50, 0.01, 0); // 5 seconds.

		},
		cancel:function(){
		},
		error:function(error){
		},
		allowEditing:true,
		videoMaximumDuration:5000, // 5 seconds
		mediaTypes: Titanium.Media.MEDIA_TYPE_VIDEO
	});	
}


function bytesToSize(bytes) {
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes == 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

TiNSGIF.addEventListener('complete',gifComplete);

function convertTest(){

	webview.html = '...';

	var testVideosPath = Ti.Filesystem.resourcesDirectory + 'video/';
	var movies = ['toasthouse.m4v', 'video.mp4', 'IMG_0495.MOV'];
	
	var movie = movies[getRandomInt(0,2)]
	console.log('movie: '+movie);

	var inputMovieURL = testVideosPath + movie;

	console.log('inputMovieURL: '+inputMovieURL);

	// Creates optimal infinite looping GIF from video.
	// @ TiNSGIF.optimalGIFfromURL(inputMovieURL);
	// Create animated GIF from video with params
	// @ TiNSGIF.createGIFfromURL(inputMovieURL, frameCount [def:10], delayTime [def:0.01], loopCount [def:0]);

	TiNSGIF.addEventListener('complete',gifComplete);
	TiNSGIF.createGIFfromURL(inputMovieURL, 50, 0.01, 0);

}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}