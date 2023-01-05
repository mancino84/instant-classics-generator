const cfg = {
	base: "D7ghIuf0V-o",
	mix1: "GBgV-b37CZc", //"N-p_ZG5ptg8",
	mix2: "GBgV-b37CZc"
}

const mainList = [ 
	{ title: "Francesco I - Il Calcio che amiamo", id: "GBgV-b37CZc" },
	{ title: "Francesco I - Giovane pensionato triste", id: "N-p_ZG5ptg8" },
	{ title: "Il Matta - Buon anno nuovo!", id: "wAWxm368aqg" },
	{ title: "Gianni Baget Bozzo - Impressioni in Angela", id: "z8JlHbmCb5g" }       
];

const auxList = [
	{ title: "01", id: "D7ghIuf0V-o" },
	{ title: "02", id: "vjWwR5FGj1k" },
	{ title: "03", id: "CyXJQogaRIs" },
	{ title: "04", id: "Jv0IrFLT2AQ" },
	{ title: "05", id: "3JkJps1L0Js" },
	{ title: "06", id: "TmyYfZCPZUE" }
]

let player1, player2, playerBase;

function onYouTubeIframeAPIReady() {

	playerBase = new YT.Player( 'base', {
		height: '180',
		width: '320',
		
		videoId: cfg.base,
		playerVars: {
			controls: "0",
			disablekb: "1",
			modestbranding: "1",
			rel: "0",
			showinfo: "0"
		},
		events: {
			'onReady': ( event ) => {
				initPlayer( event, "#base" );
				const initialVolume = 60;
				document.querySelector( "#baseVolume" ).value = initialVolume;
				event.target.setVolume( initialVolume );
			},
			'onStateChange': ( event ) => playerStateChange( event )
		}
	});					

	player1 = new YT.Player( 'mix1', {
		height: '360',
		width: '640',
		videoId: cfg.mix1,
		playerVars: {
			controls: "0",
			disablekb: "1",
			modestbranding: "1",
			rel: "0",
			showinfo: "0"
		},
		events: {
			'onReady': ( event ) => initPlayer( event, "#mix1" ),
			'onStateChange': ( event ) => playerStateChange( event )
		}
	});
	
	player2 = new YT.Player( 'mix2', {
		height: '360',
		width: '640',
		videoId: cfg.mix2,
		playerVars: {
			controls: "0",
			disablekb: "1",
			modestbranding: "1",
			rel: "0",
			showinfo: "0"
		},
		events: {
			'onReady': ( event ) => initPlayer( event, "#mix2" ),
			'onStateChange': ( event ) => playerStateChange( event )
		}
	});
	
	const xFade = document.querySelector( "#xFade" );
	xFade.value = 0;
	xFade.oninput = ( e ) => xFadeFun( e );
	
	
	
}

function xFadeFun( e ) {
	console.log( e );
	const xFade = e.target;
	const currentVal = xFade.value;
	const currentValNormalized = ( 100 - currentVal ) / 100;
	
	document.querySelector( "#mix1" ).style.opacity = currentValNormalized;
	document.querySelector( "#mix2" ).style.opacity = 1 - currentValNormalized;
	
	//eeeeh, curva da crossfader ( + o - ... )
	var v = ( 100 - currentVal ) / 100;
	//𝑦=(𝑥−1)2 and 𝑦=𝑥2
	//𝑦=1−(𝑥−1)2 and 𝑦=1−𝑥2
	var v1 = 1 - Math.pow( v - 1, 2 );
	var v2 = 1 - Math.pow( v, 2 );
	
	player1.setVolume( v1 * 100 );
	player2.setVolume( v2 * 100 );
	
}		

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
	//event.target.playVideo();
}

function playerStateChange( event ) {
/*
	const player = event.target;			
	if( event.data == YT.PlayerState.BUFFERING ) return;
	if( event.data == YT.PlayerState.PLAYING ) {
		const totalPlayTime = player.getDuration();
		player.updateRange = setInterval( () => {
			let percentage = ( player.getCurrentTime() * 100 ) / totalPlayTime;
			console.log( "PRC:" + percentage );
			player.rangeElement.value = percentage;
		}, 1000 );
	}
	else {
		clearInterval( player.updateRange );
	}
*/
}

//
function initPlayer( event, prefix ) {
	const player = event.target;
	player.stopped = true;
	console.log( player );
	
	document.querySelector( prefix + "Rw" ).onclick = () => {
		const doPause = player.stopped || player.getPlayerState() == YT.PlayerState.PAUSED;
		player.seekTo( player.getCurrentTime() - 5 );
		if( doPause ) {
			player.pauseVideo();
			player.stopped = false;
		}
	};
	
	document.querySelector( prefix + "Pause" ).onclick = () => {
		player.pauseVideo();
	};
	
	document.querySelector( prefix + "Play" ).onclick = () => {
		xFadeFun( { target: document.querySelector( "#xFade" ) } );
		
		
		
		if( player.stopped ) {
			player.seekTo( 0 );
			player.playVideo();
			player.stopped = false;
			
			
			player.updateRange = setInterval( () => {
				let percentage = ( player.getCurrentTime() * 100 ) / player.getDuration();
				console.log( "PRC:" + percentage );
				player.rangeElement.value = percentage;
			}, 1000 );
			
		}
		else {
			player.playVideo();
		}
	};
	
	document.querySelector( prefix + "Ff" ).onclick = () => {
		const doPause = player.stopped || player.getPlayerState() == YT.PlayerState.PAUSED;
		player.seekTo( player.getCurrentTime() + 5 );
		if( doPause ) {
			player.pauseVideo();
			player.stopped = false;
		}
	};
	document.querySelector( prefix + "Stop" ).onclick = () => {
		clearInterval( player.updateRange );
		player.stopped = true;
		player.seekTo( 0 );
		player.stopVideo();
		player.rangeElement.value = 0;
	};
	
	document.querySelector( prefix + "Load" ).onclick = () => {
		clearInterval( player.updateRange );
		player.stopped = true;
		player.stopVideo();
		//player.clearVideo();
		player.cueVideoById( { videoId: document.querySelector( prefix + "Id" ).value, startSeconds: 0 } );
		player.rangeElement.value = 0;	
		player.seekTo( 0, true );
		player.stopVideo();
	};
						
	player.rangeElement = document.querySelector( prefix + "Range" );
	player.rangeElement.value = 0;
	
	document.querySelector( prefix + "Id" ).value = player.playerInfo.videoData.video_id;
				
	player.rangeElement.onchange = ( e ) => {
		const totalPlayTime = player.playerInfo.duration;
		const doPause = player.stopped || player.getPlayerState() == YT.PlayerState.PAUSED;
		player.seekTo( ( e.target.value * totalPlayTime ) / 100, true );
		if( doPause ) {
			player.pauseVideo();
			player.stopped = false;
		}
	}
	
	if( prefix != "#base" ) { //:-(
	
		document.querySelector( prefix + "Copy" ).onclick = () => {
			document.querySelector( prefix + "Id" ).value = ( prefix == "#mix1" ? document.querySelector( "#mix2Id" ).value : document.querySelector( "#mix1Id" ).value );
		}
	
		const dropDownListHook = document.querySelector( prefix + "DropDown" );
		mainList.forEach( ( e ) => { 
			const el = document.createElement( "LI" );
			const elInner = document.createElement( "A" );
			elInner.className = "dropdown-item";
			elInner.href = "#";
			elInner.onclick = ( event ) => {
				document.querySelector( prefix + "Id" ).value = e.id;
			};
			console.log( "ZZZ:" + e.id );
			elInner.innerHTML = e.title;
			el.appendChild( elInner );
			dropDownListHook.appendChild( el );
			//<li><a class="dropdown-item" href="#">Francesco I - Il Calcio che amiamo</a></li>
		} );
	}
	else {
	
		document.querySelector( prefix + "Volume" ).oninput = ( event ) => {
			player.setVolume( event.target.value );				
		}
	
		const dropDownListHook = document.querySelector( prefix + "DropDown" );
		auxList.forEach( ( e ) => { 
			const el = document.createElement( "LI" );
			const elInner = document.createElement( "A" );
			elInner.className = "dropdown-item";
			elInner.href = "#";
			elInner.onclick = ( event ) => {
				document.querySelector( prefix + "Id" ).value = e.id;
			};
			console.log( "ZZZ:" + e.id );
			elInner.innerHTML = e.title;
			el.appendChild( elInner );
			dropDownListHook.appendChild( el );
			//<li><a class="dropdown-item" href="#">Francesco I - Il Calcio che amiamo</a></li>
		} );
	
	}
}