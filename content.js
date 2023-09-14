

const initialVideoQueue = [
    {
    url: 'yr_Rpk9HR1g',
    duration: 7
},
{
    url: 'SBeYzoQPbu8',
    duration: 5
},
{
    url: 'q6EoRBvdVPQ',
    duration: 10
},  
{
    url: 'wsZ7013yHiw',
    duration: 6
},
{
    url: 'Pbkn21NNduc',
    duration: 8
},
{
    url: 'NZOFukA2V0A',
    duration: 7
},
{
    url: 'UYahPVL3FL0',
    duration: 6
},
{
    url: 'HTQIVIxp7E',
    duration: 11
},
{
    url: 'Fc1P-AEaEp',
    duration: 6
},
{
    url: 'xq1tN9jZI80',
    duration: 13
},
{
    url: '2oy5F4m_g6c',
    duration: 7
},
{
    url: 'aDS_MRBVVII',
    duration: 10
},
{
    url: 'b_pIxlmrrp8',
    duration: 9
},
{
    url: 'OzJdfitKEpQ',
    duration: 13
},
{
    url: 'JfVSuTtGprI',
    duration: 10
},
{
    url: 'I43EVfwcGRU',
    duration: 25
},
{
    url: 'WOA0LTv93_s',
    duration: 6
},
{
    url: 'sBEK10m-ldQ',
    duration: 6
},
{
    url: 'qvpDO8xbXno',
    duration: 6
},
{
    url: 'EzA8DcAiijc',
    duration: 13
},
{
    url: '3qPHoWVWjH4',
    duration: 15
},
{
    url: '7xqfC80SRGU',
    duration: 23
},
{
    url: 'C998K2nN5lE',
    duration: 15
},
{
    url: 'B-pFvhuGeuQ',
    duration: 8
},
{
    url: 'RD2Gm2-pSpQ',
    duration: 9
},
{
    url: 'rKkzRvJqF9o',
    duration: 9
},
{
    url: 'cJtpeJ_DbxE',
    duration: 13
},
{
    url: 'ziki8C2V1ns',
    duration: 5
},
{
    url: '01pLMqaQKzI',
    duration: 14
},
{
    url: 'L1msHfUxMGQ',
    duration: 7
},
{
    url: 'IOGLV06CcUE',
    duration: 8
}
];



function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

shuffleArray(initialVideoQueue);
let videoQueue = [...initialVideoQueue];
let videoPlayCount = {};
let isPlayingVideo = false;
let isGPTTyping = false;

function playNextVideo() {
    if (isGPTTyping && !isPlayingVideo) {
        if (videoQueue.length === 0) {
            shuffleArray(initialVideoQueue);
            videoQueue = [...initialVideoQueue];
        }

        isPlayingVideo = true;
        const videoInfo = videoQueue.shift();

        videoPlayCount[videoInfo.url] = (videoPlayCount[videoInfo.url] || 0) + 1;

        const existingVideoContainer = document.querySelector('#videoContainer');
        if (existingVideoContainer) {
            existingVideoContainer.remove();
        }
        

        const videoContainer = document.createElement('div');
        videoContainer.style.position = 'fixed';
        videoContainer.style.zIndex = '1000';
        
        if (window.innerWidth < 768) {  
            videoContainer.style.top = '10px';
            videoContainer.style.right = '10px';
        } else {
            videoContainer.style.top = '50%';           // Position it at 50% from the top
            videoContainer.style.left = '0px';          // Place it on the left side of the screen
            videoContainer.style.transform = 'translateY(-50%)'; // Shift it up by half of its height
        }
        
        const iframe = document.createElement('iframe');
        iframe.width = '608';
        iframe.height = '342';
        iframe.src = `https://www.youtube.com/embed/${videoInfo.url}?preload=metadata`;
        iframe.allow = 'accelerometer; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        
        videoContainer.appendChild(iframe);
        document.body.appendChild(videoContainer);
        
        window.addEventListener('resize', () => {
            if (window.innerWidth < 768) {
                videoContainer.style.top = '10px';
                videoContainer.style.right = '';
                videoContainer.style.top = '';
                videoContainer.style.left = '';
                videoContainer.style.transform = '';
            } else {
                videoContainer.style.top = '50%';
                videoContainer.style.left = '0px';
                videoContainer.style.transform = 'translateY(-50%)';
                videoContainer.style.bottom = '';
                videoContainer.style.right = '';
            }
        });
        

        iframe.addEventListener('load', () => {
            setTimeout(() => {
                videoContainer.remove();
                isPlayingVideo = false;
                if (isGPTTyping) {
                    playNextVideo();
                }
            }, videoInfo.duration * 1000);
        });
    }
}

function createVideoContainer() {
        playNextVideo();
}

function destroyVideo() {
    const videoContainers = document.querySelectorAll('#videoContainer');
    videoContainers.forEach(container => {
        container.remove();
    });
}

function checkGPTStatus() {
    const gptElementDark = document.querySelector('.result-streaming.markdown.prose.w-full.break-words.dark\\:prose-invert.dark');
    const gptElementLight = document.querySelector('.result-streaming.markdown.prose.w-full.break-words.dark\\:prose-invert.light');

    if ((gptElementDark || gptElementLight) && !isGPTTyping) {
        isGPTTyping = true;
        createVideoContainer();
    } else if (!gptElementDark && !gptElementLight && isGPTTyping) {
        isGPTTyping = false;
        destroyVideo();
    }
}

setInterval(checkGPTStatus, 500);
