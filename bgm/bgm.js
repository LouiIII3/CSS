var myBgm = $('#bgm')[0];
var bgmSource = [
    {title: '제목 1',
     src: '복사한 링크 주소 1'} 
   ,{title: '제목 2',
     src: '복사한 링크 주소 2'}
];
var saveIndex = window.localStorage.getItem('current-bgm-index');
var currentIndex = saveIndex?Number(saveIndex):Math.floor(Math.random()*bgmSource.length);
var currentVolume = Number(window.localStorage.getItem('current-bgm-volume'))||0.1;
var bgmStart = false;
var bgmPlaying = false;


function saveBgmStatus() {
    if(Date.now() - Number(window.localStorage.getItem('visit-time')) < 1000*60*60 || window.localStorage.getItem('visit-time') == null) {
        window.localStorage.setItem('current-bgm-index', currentIndex);
        window.localStorage.setItem('current-bgm-time', myBgm.currentTime);			
    } else {
        window.localStorage.setItem('current-bgm-index', Math.floor(Math.random()*bgmSource.length));
        window.localStorage.setItem('current-bgm-time', '0');				
    }
    window.localStorage.setItem('visit-time', Date.now());
    window.localStorage.setItem('current-bgm-volume', currentVolume);
}

function getCurrentBgm() {
    $('#current-bgm').html(bgmSource[currentIndex].title);
    if(window.localStorage.getItem('current-bgm') == 'stop') {
        myBgm.pause();
        $('#bgm-status').html('켜기');
        $('.bgm-box').addClass('paused');
        bgmStart = false;
        bgmPlaying = false;
    } else {
        if(!bgmPlaying){
            myBgm.src = bgmSource[currentIndex].src;
            myBgm.muted = true;				
            var promise = myBgm.play();
            if (promise !== undefined) {
                promise.then(function(){
                    bgmStart = true;
                    bgmPlaying = true;
                    var saveBgmTime = (Number(window.localStorage.getItem('current-bgm-time'))||0.0)-0.3;
                    myBgm.currentTime = (saveBgmTime>0)?saveBgmTime:0.0;
                }).catch(function(error){
                    console.log(error);
                    bgmStart = false;
                    bgmPlaying = false;
                });
            }
        }

        $('.bgm-box').removeClass('paused');
        $('#bgm-status').html('끄기');
    }
}

function nextBgm() {
    bgmPlaying = false;
    currentIndex = (currentIndex + 1)%bgmSource.length;
    window.localStorage.setItem('current-bgm-index', null);
    window.localStorage.setItem('current-bgm-time', null);
    getCurrentBgm();
    $('.bgm-btn').blur();
}

function toggleBgm() {
    if(window.localStorage.getItem('current-bgm') == 'stop') {
        window.localStorage.setItem('current-bgm', 'play');
    } else {
        saveBgmStatus();
        window.localStorage.setItem('current-bgm', 'stop');
    }
    getCurrentBgm();
    $('.bgm-btn').blur();
}

function browserCheck(){
    if(navigator.userAgent.toLowerCase().indexOf('chrome') > 0) {
        return true;
    } else {
        return false;
    }
}

if(!browserCheck()) {
    $('#bgm-switch').css('display', 'none');
}

function bgmVolume(type) {
    if(type == '+') {
        if(currentVolume > 1.0) {
            currentVolume = 1.0;
        } else {
            currentVolume += 0.1;
        }
    } else {
        if(currentVolume < 0.0) {
            currentVolume = 0.0;
        } else {
            currentVolume -= 0.1;
        }
    }
    if(browserCheck()) {
        myBgm.volume = currentVolume;
    } else {
        if(type == '+') {
            myBgm.muted = false;
            myBgm.play();
        } else {
            myBgm.muted = true;
            myBgm.pause();
        }
    }
    $('.bgm-btn').blur();
}


function bgmStartHandler(e) {
    if(!bgmStart) {
        bgmStart = true;
        getCurrentBgm();
    } else {
        if(bgmPlaying) {
            saveBgmStatus();
        }
    }
}

$(window).on('click', bgmStartHandler);
$(window).on('touchstart', bgmStartHandler);
$(window).on('touchend', bgmStartHandler);

$(window).on("beforeunload",function(e){saveBgmStatus();});	
$('#bgm').on('ended',function(e){nextBgm();});

$('#bgm').on('playing', function(e){
  myBgm.volume = currentVolume;
  myBgm.muted = false;
});