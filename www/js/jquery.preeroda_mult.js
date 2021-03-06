﻿(function( $ ){	
	var methods = {
		init : function( options ) {
 			return this.each(function(){
				
				var $this = $(this);
				var data = $this.data('preeroda_mult');
			
				if ( !data ) {
					var settings = {
						//plotsVideos			:	null //array of videoData
					}
					if ( options ) { 
						$.extend( settings, options );
					}					
					data = {
						settings 		: settings
					};
					$this.data('preeroda_mult', data);

					var FRAMES_NUMBER				= 589;
					var NUM_IMAGES_TO_LOAD_AT_START	= 20;
					var IMAGES_URL					= "i_data/mult/s";
					var loadedImagesArray 			= new Array();
					
					var loadedImages = 0;
					
					var multContainer 	= $this.find(".mult-container");
					
					var loader			= $this.find(".loader-wrapper");
					var imageLoaded		= false;
					var needToLoadMoreImages = 0;
					
					var multScroll 		= $this.find(".mult-scroll");
					var multSlider 		= multScroll.find(".mult-slider");
					var sliderStartPos	= 0;
					var sliderEndPos	= multScroll.outerWidth() - multSlider.outerWidth();
					var	currentFrame	= 0;
					var animationStopped= false;
					
					var interval;
					var DELAY			= 120;
					var mainTimerStopped= false;
					
					function showFrame (index) {						
						if (loadedImagesArray[index] && loadedImagesArray[index].loaded) {
							animationStopped= false;
							loader.css({display : "none"});
							
							currentFrame = index;
							if (loadedImagesArray[index].img) {
								multContainer.html(loadedImagesArray[index].img);																
							}
							setSliderPosition(index);
							
							if (mainTimerStopped) {
								setTimeout (function () {
									showFrame(currentFrame + 1)
								}, DELAY);								
							}
						} else {
							animationStopped = true;
							loader.css({display : "block"});
							console.log('image not loaded yet');
						}
					}
					
					function loadMoreImages() {
						if(imageLoaded && needToLoadMoreImages > 0) {
							if (animationStopped && currentFrame < FRAMES_NUMBER) {
								showFrame(currentFrame + 1);
							}
							
							needToLoadMoreImages--;
							loadImage(loadedImages + 1, function () {
								loadMoreImages();
							});							
						}
					}
					
					function setSliderPosition (index) {
						multSlider.css({left : Math.ceil(index / FRAMES_NUMBER * (sliderEndPos - sliderStartPos))});
					}
					
					function loadImage(index, completeCallBack) {						
						var img = new Image();
						loadedImagesArray[index] = {
							loaded  : false,
							img		: $(img)
						};
						imageLoaded = false;
						$(img).load(function () {
							loadedImagesArray[index].loaded = true;
							imageLoaded = true;
							loadedImages++;
							completeCallBack();
						}).error(function () {
							loadedImagesArray[index].loaded = true;
							loadedImagesArray[index].img = null;
							imageLoaded = true;
							loadedImages++;
							completeCallBack();
						}).attr('src', IMAGES_URL + index + ".jpg");						
					}
					
					
					
					//init
					function loadFirstImages () {
						if (loadedImages == NUM_IMAGES_TO_LOAD_AT_START) {							
							loader.css({display : "none"});
							
							var frameToShow = 0;
							interval = setInterval(function () {
								if (++frameToShow <= FRAMES_NUMBER) {							
									showFrame(frameToShow);
							
									//загружать еще кадры только в случае прокрутки вперед
									needToLoadMoreImages++;
									loadMoreImages();									
								} else {
									mainTimerStopped = true;
									clearInterval(interval);
								}
							}, DELAY);
						} else {
							loadImage(loadedImages + 1, function(){
								loadFirstImages();
							});
						}
					}
					loadFirstImages();				
				}
			});
		}
	};
 
	$.fn.preeroda_mult = function( method ) {
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.preeroda_mult' );
		}    
	};
 })( jQuery );
 
 $(document).ready(function() {
	$(".mult-wrapper").preeroda_mult();
 });