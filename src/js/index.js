const FirstVideoPlayer = document.getElementById("FirstVideoPlayer");
const FirstHeader = document.getElementById("FirstHeader");
const FirstVideo = document.getElementById("FirstVideo");
const FirstVideoLoadButton = document.getElementById("FirstVideoLoadButton");
const FirstPlayButton = document.getElementById("FirstPlayButton");
const FirstControls = document.getElementById("FirstControls");
const SecondVideoPlayer = document.getElementById("SecondVideoPlayer");
const SecondHeader = document.getElementById("SecondHeader");
const SecondVideo = document.getElementById("SecondVideo");
const SecondVideoLoadButton = document.getElementById("SecondVideoLoadButton");
const SecondPlayButton = document.getElementById("SecondPlayButton");
const SecondControls = document.getElementById("SecondControls");
const SecondResizeHandle = document.getElementById("SecondResizeHandle");

const FirstPlayButtonIcon = document.querySelector("#FirstPlayButton > img")
const SecondPlayButtonIcon = document.querySelector("#SecondPlayButton > img")

const FirstVideoControlsPlayButton = document.querySelector("#FirstControls .PlayButton");
const FirstVideoControlsVolumeButton = document.querySelector("#FirstControls .VolumeButton");
const FirstVideoControlsFullscreenButton = document.querySelector("#FirstControls .FullscreenButton");

const FirstVideoControlsPlayButtonIcon = document.querySelector("#FirstControls .PlayButton > img");
const FirstVideoControlsVolumeButtonIcon = document.querySelector("#FirstControls .VolumeButton > img");

const SecondVideoControlsPlayButton = document.querySelector("#SecondControls .PlayButton");
const SecondVideoControlsVolumeButton = document.querySelector("#SecondControls .VolumeButton");
const SecondVideoControlsFullscreenButton = document.querySelector("#SecondControls .FullscreenButton");

const SecondVideoControlsPlayButtonIcon = document.querySelector("#SecondControls .PlayButton > img");
const SecondVideoControlsVolumeButtonIcon = document.querySelector("#SecondControls .VolumeButton > img");

const FirstVideoProgressInput = document.querySelector("#FirstControls .Progress > input")
const SecondVideoProgressInput = document.querySelector("#SecondControls .Progress > input")

const FirstVideoVolumeInput = document.querySelector("#FirstControls .VolumeControl .VolumeFillContainer > input")
const SecondVideoVolumeInput = document.querySelector("#SecondControls .VolumeControl .VolumeFillContainer > input")

const FirstVideoControlsStopButton = document.querySelector("#FirstControls .StopButton");
const SecondVideoControlsStopButton = document.querySelector("#SecondControls .StopButton");

const MinimizeButton = document.getElementById("MinimizeButton");
const MaximizeButton = document.getElementById("MaximizeButton");
const CloseButton = document.getElementById("CloseButton");


// Titlebar Buttons
let IsMaximized = false;

const OnClickMinimizeButton = async() =>
{
    await window.electronAPI.MinimizeWindow();

}

const OnClickMaximizeButton = async() =>
{
    IsMaximized = await window.electronAPI.ToggleMaximizeWindow();

}

const OnClickCloseButton = async() =>
{
    await window.electronAPI.CloseWindow();

}

MinimizeButton.addEventListener('click', OnClickMinimizeButton);
MaximizeButton.addEventListener('click', OnClickMaximizeButton);
CloseButton.addEventListener('click', OnClickCloseButton);


// Configuration Variables
const MinWidth = 200; 
const MinHeight = 200;
const FadePlayerControlsDelay = 2000;

const PlayIcon = "../../Resources/Icons/play-solid-full.svg";
const PauseIcon = "../../Resources/Icons/pause-solid-full.svg";

const VolumeIcon = "../../Resources/Icons/volume-high-solid-full.svg";
const MuteIcon = "../../Resources/Icons/volume-xmark-solid-full.svg";

// Helper Functions

const PxToNum = (value) => Number(value.replace('px','') || 0);

const GetRect = (element) =>
{
    return{
        left: PxToNum(element.style.left),
        top: PxToNum(element.style.top),
        width: element.offsetWidth,
        height: element.offsetHeight,
    }
}

const ClampToRect = (parentRect, currentRect) => 
{
    currentRect.width = Math.min(Math.max(MinWidth, currentRect.width), parentRect.width);
    currentRect.height = Math.min(Math.max(MinHeight, currentRect.height), parentRect.height);

    const rightBound = parentRect.width - currentRect.width;
    const bottomBound = parentRect.height - currentRect.height;

    currentRect.left = Math.min(Math.max(0, currentRect.left), rightBound);
    currentRect.top = Math.min(Math.max(0, currentRect.top), bottomBound);

    return currentRect;
}

// Drag Event

const OnDrag = (dragEvent) => 
{
    dragEvent.preventDefault();
    SecondHeader.setPointerCapture(dragEvent.pointerId);

    const startPosition = { x:dragEvent.clientX, y:dragEvent.clientY };
    const startRect = SecondVideoPlayer.getBoundingClientRect();
    const parentRect = GetRect(FirstVideoPlayer);

    const OnMouseMove = (moveEvent) =>
    {
        const dx = moveEvent.clientX - startPosition.x;
        const dy = moveEvent.clientY - startPosition.y;

        const newLeft = startRect.left + dx;
        const newTop = startRect.top + dy;

        const clampedRect = ClampToRect(parentRect, {
            left: newLeft,
            top: newTop,
            width: startRect.width,
            height: startRect.height,
        });

        SecondVideoPlayer.style.left = Math.floor(clampedRect.left) + 'px';
        SecondVideoPlayer.style.top  = Math.floor(clampedRect.top) + 'px';
    }

    const OnMouseUp = (moveEvent) =>
    {
        SecondHeader.releasePointerCapture(dragEvent.pointerId);
        window.removeEventListener('pointermove', OnMouseMove);
        window.removeEventListener('pointerup', OnMouseUp);
    }

    window.addEventListener('pointermove', OnMouseMove);
    window.addEventListener('pointerup', OnMouseUp);
}

SecondHeader.addEventListener('pointerdown', OnDrag);

// Resize Event

const OnResize = (resizeEvent) =>
{
    resizeEvent.preventDefault();
    SecondResizeHandle.setPointerCapture(resizeEvent.pointerId);

    const startPosition = { x:resizeEvent.clientX, y:resizeEvent.clientY };
    const startRect = SecondVideoPlayer.getBoundingClientRect();
    const parentRect = GetRect(FirstVideoPlayer);

    function OnMouseMove(moveEvent) {

        const dx = moveEvent.clientX - startPosition.x;
        const dy = moveEvent.clientY - startPosition.y;

        const newWidth = startRect.width + dx;
        const newHeight = startRect.height + dy;

     
        const clampedRect = ClampToRect(parentRect, {
            left: startRect.left,
            top: startRect.top,
            width: newWidth,
            height: newHeight,
        });

        SecondVideoPlayer.style.width  = Math.floor(clampedRect.width) + 'px';
        SecondVideoPlayer.style.height = Math.floor(clampedRect.height) + 'px';
        SecondVideoPlayer.style.left = Math.floor(clampedRect.left) + 'px';
        SecondVideoPlayer.style.top  = Math.floor(clampedRect.top) + 'px';
    }

    function OnMouseUp(moveEvent) {
        SecondResizeHandle.releasePointerCapture(resizeEvent.pointerId);
        window.removeEventListener('pointermove', OnMouseMove);
        window.removeEventListener('pointerup', OnMouseUp);
    }

    window.addEventListener('pointermove', OnMouseMove);
    window.addEventListener('pointerup', OnMouseUp);
}

SecondResizeHandle.addEventListener('pointerdown', OnResize);

// Fade Controls On Inactivity

let InactivityTimer;

const FadeControls = () =>
{
    FirstHeader.classList.add("SoftHide");
    FirstControls.classList.add("SoftHide");

    SecondHeader.classList.add("SoftHide");
    SecondControls.classList.add("SoftHide");
    SecondResizeHandle.classList.add("SoftHide");
}

const ResetTimer = () =>
{
    if(FirstHeader.classList.contains("SoftHide"))
    {
        FirstHeader.classList.remove("SoftHide");
        FirstControls.classList.remove("SoftHide");

        SecondHeader.classList.remove("SoftHide");
        SecondControls.classList.remove("SoftHide");
        SecondResizeHandle.classList.remove("SoftHide");
    }

    clearTimeout(InactivityTimer);
    InactivityTimer = setTimeout(FadeControls, FadePlayerControlsDelay);
}

window.addEventListener("mousemove", ResetTimer);
window.addEventListener("mousedown", ResetTimer); 

// First Video Player

let IsFirstVideoLoaded = false;
let IsFirstVideoPlaying = false;
let IsFirstVideoMuted = false;
let IsFirstVideoFullscreen = false;

let FirstVideoPreviousVolume = 100;

const OnClickFirstVideoLoadButton = async () =>
{
    const file = await window.electronAPI.OpenFile();

    if(file)
    {
        FirstVideoLoadButton.classList.add("Hide");
        FirstPlayButton.classList.remove("Hide");

        FirstVideo.setAttribute('src', file);
        IsFirstVideoLoaded = true;
    }
};

const OnClickFirstPlayButton = () =>
{
    TogglePlayFirstVideo();
}

const OnClickFirstVideoControlsPlayButton = () => 
{
    TogglePlayFirstVideo();
}

const OnClickFirstVideoControlsStopButton = () =>
{
    IsFirstVideoPlaying = false;
    IsFirstVideoLoaded = false;

    FirstVideo.setAttribute('src','');
    FirstVideoLoadButton.classList.remove("Hide");
    FirstPlayButton.classList.add("Hide");

    FirstPlayButtonIcon.setAttribute('src', PlayIcon);
    FirstVideoControlsPlayButtonIcon.setAttribute('src', PlayIcon);
    FirstVideoControlsVolumeButtonIcon.setAttribute('src', VolumeIcon)
    FirstVideoProgressInput.max = 0;
    FirstVideoProgressInput.value = 0;
    FirstVideoVolumeInput.value = 100;
}

const OnClickFirstVideoControlsVolumeButton = () => 
{
    ToggleMuteFirstVideo();
}

const OnClickFirstVideoControlsFullscreenButton = () => 
{
    ToggleFullscreenFirstVideo();
}

const OnFirstVideoMetaDataUpdate = () => 
{
    FirstVideoProgressInput.max = FirstVideo.duration;
}

const OnFirstVideoTimeUpdate = () =>
{
    FirstVideoProgressInput.value = FirstVideo.currentTime;
}

const OnFirstVideoProgressInput = () =>
{
    FirstVideo.currentTime = FirstVideoProgressInput.value;
}

const OnFirstVideoVolumeInput = () =>
{
    UnmuteFirstVideo();
    FirstVideo.volume = FirstVideoVolumeInput.value/100;
}

const TogglePlayFirstVideo = () => 
{
    if(!IsFirstVideoLoaded) return;

    if(IsFirstVideoPlaying)
    {
        PauseFirstVideo();
    }
    else
    {
        PlayFirstVideo();
    }
}

const ToggleMuteFirstVideo = () =>
{
    if(!IsFirstVideoLoaded) return;

    if(IsFirstVideoMuted)
    {
        FirstVideoVolumeInput.value = FirstVideoPreviousVolume;
        UnmuteFirstVideo();
    }
    else
    {
        FirstVideoPreviousVolume = FirstVideoVolumeInput.value;
        MuteFirstVideo();
    }
}

const ToggleFullscreenFirstVideo = () =>
{
    if(!IsFirstVideoLoaded) return;

    if(IsFirstVideoFullscreen)
    {
        RestoreFirstVideo();
    }
    else
    {
        FullscreenFirstVideo();
    }
}

const PlayFirstVideo = () =>
{
    FirstVideo.play();
    IsFirstVideoPlaying = true;
    FirstPlayButton.classList.add("SoftHide");

    FirstPlayButtonIcon.setAttribute('src', PauseIcon);
    FirstVideoControlsPlayButtonIcon.setAttribute('src', PauseIcon);
}

const PauseFirstVideo = () =>
{
    FirstVideo.pause();
    IsFirstVideoPlaying = false;
    FirstPlayButton.classList.remove("SoftHide");

    FirstPlayButtonIcon.setAttribute('src', PlayIcon);
    FirstVideoControlsPlayButtonIcon.setAttribute('src', PlayIcon);
}

const MuteFirstVideo = () => 
{
    FirstVideo.muted = true;
    IsFirstVideoMuted = true;

    FirstVideoVolumeInput.value = 0;
    FirstVideoControlsVolumeButtonIcon.setAttribute('src', MuteIcon)
}

const UnmuteFirstVideo = () =>
{
    FirstVideo.muted = false;
    IsFirstVideoMuted = false;

    FirstVideoControlsVolumeButtonIcon.setAttribute('src', VolumeIcon)
}

const FullscreenFirstVideo = () =>
{
    FirstVideoPlayer.requestFullscreen();
    IsFirstVideoFullscreen = true;
}

const RestoreFirstVideo = () =>
{
    document.exitFullscreen();
    IsFirstVideoFullscreen = false;
}


FirstVideoLoadButton.addEventListener('click', OnClickFirstVideoLoadButton);
FirstPlayButton.addEventListener('click', OnClickFirstPlayButton);
FirstVideo.addEventListener('click', PauseFirstVideo);

FirstVideoControlsPlayButton.addEventListener('click', OnClickFirstVideoControlsPlayButton);
FirstVideoControlsStopButton.addEventListener('click', OnClickFirstVideoControlsStopButton);
FirstVideoControlsVolumeButton.addEventListener('click', OnClickFirstVideoControlsVolumeButton);
FirstVideoControlsFullscreenButton.addEventListener('click', OnClickFirstVideoControlsFullscreenButton);

FirstVideo.addEventListener("loadedmetadata", OnFirstVideoMetaDataUpdate);
FirstVideo.addEventListener("timeupdate", OnFirstVideoTimeUpdate);
FirstVideoProgressInput.addEventListener("input", OnFirstVideoProgressInput);
FirstVideoVolumeInput.addEventListener("input", OnFirstVideoVolumeInput);

// Second Video Player

let IsSecondVideoLoaded = false;
let IsSecondVideoPlaying = false;
let IsSecondVideoMuted = false;
let IsSecondVideoFullscreen = false;

let SecondVideoPreviousVolume = 100;

const OnClickSecondVideoLoadButton = async () =>
{
    const file = await window.electronAPI.OpenFile();

    if(file)
    {
        SecondVideoLoadButton.classList.add("Hide");
        SecondPlayButton.classList.remove("Hide");

        SecondVideo.setAttribute('src', file)
        IsSecondVideoLoaded = true;
    }

    
};

const OnClickSecondPlayButton = () =>
{
    TogglePlaySecondVideo();
}

const OnClickSecondVideoControlsPlayButton = () => 
{
    TogglePlaySecondVideo();
}

const OnClickSecondVideoControlsStopButton = () =>
{
    IsSecondVideoPlaying = false;
    IsSecondVideoLoaded - false;
    SecondVideo.setAttribute('src','');
    SecondVideoLoadButton.classList.remove("Hide");
    SecondPlayButton.classList.add("Hide");

    SecondPlayButtonIcon.setAttribute('src', PlayIcon);
    SecondVideoControlsPlayButtonIcon.setAttribute('src', PlayIcon);
    SecondVideoControlsVolumeButtonIcon.setAttribute('src', VolumeIcon)
    SecondVideoProgressInput.max = 0;
    SecondVideoProgressInput.value = 0;
    SecondVideoVolumeInput.value = 100;
}

const OnClickSecondVideoControlsVolumeButton = () => 
{
    ToggleMuteSecondVideo();
}

const OnClickSecondVideoControlsFullscreenButton = () => 
{
    ToggleFullscreenSecondVideo();
}

const OnSecondVideoMetaDataUpdate = () => 
{
    SecondVideoProgressInput.max = SecondVideo.duration;
}

const OnSecondVideoTimeUpdate = () =>
{
    SecondVideoProgressInput.value = SecondVideo.currentTime;
}

const OnSecondVideoProgressInput = () =>
{
    SecondVideo.currentTime = SecondVideoProgressInput.value;
}

const OnSecondVideoVolumeInput = () =>
{
    UnmuteSecondVideo();
    SecondVideo.volume = SecondVideoVolumeInput.value/100;
}

const TogglePlaySecondVideo = () => 
{
    if(!IsSecondVideoLoaded) return;

    if(IsSecondVideoPlaying)
    {
        PauseSecondVideo();
    }
    else
    {
        PlaySecondVideo();
    }
}

const ToggleMuteSecondVideo = () =>
{
    if(!IsSecondVideoLoaded) return;

    if(IsSecondVideoMuted)
    {
        SecondVideoVolumeInput.value = SecondVideoPreviousVolume;
        UnmuteSecondVideo();
    }
    else
    {
        SecondVideoPreviousVolume = SecondVideoVolumeInput.value;
        MuteSecondVideo();
    }
}

const ToggleFullscreenSecondVideo = () =>
{
    if(!IsSecondVideoLoaded) return;

    if(IsSecondVideoFullscreen)
    {
        RestoreSecondVideo();
    }
    else
    {
        FullscreenSecondVideo();
    }
}

const PlaySecondVideo = () =>
{
    SecondVideo.play();
    IsSecondVideoPlaying = true;
    SecondPlayButton.classList.add("SoftHide");

    SecondPlayButtonIcon.setAttribute('src', PauseIcon);
    SecondVideoControlsPlayButtonIcon.setAttribute('src', PauseIcon);
}

const PauseSecondVideo = () =>
{
    SecondVideo.pause();
    IsSecondVideoPlaying = false;
    SecondPlayButton.classList.remove("SoftHide");

    SecondPlayButtonIcon.setAttribute('src', PlayIcon);
    SecondVideoControlsPlayButtonIcon.setAttribute('src', PlayIcon);
}

const MuteSecondVideo = () => 
{
    SecondVideo.muted = true;
    IsSecondVideoMuted = true;

    SecondVideoVolumeInput.value = 0;
    SecondVideoControlsVolumeButtonIcon.setAttribute('src', MuteIcon)
}

const UnmuteSecondVideo = () =>
{
    SecondVideo.muted = false;
    IsSecondVideoMuted = false;

    SecondVideoControlsVolumeButtonIcon.setAttribute('src', VolumeIcon)
}

const FullscreenSecondVideo = () =>
{
    SecondVideoPlayer.requestFullscreen();
    IsSecondVideoFullscreen = true;
}

const RestoreSecondVideo = () =>
{
    document.exitFullscreen();
    IsSecondVideoFullscreen = false;
}

SecondVideoLoadButton.addEventListener('click', OnClickSecondVideoLoadButton);
SecondPlayButton.addEventListener('click', OnClickSecondPlayButton);
SecondVideo.addEventListener('click', PauseSecondVideo);

SecondVideoControlsPlayButton.addEventListener('click', OnClickSecondVideoControlsPlayButton);
SecondVideoControlsStopButton.addEventListener('click', OnClickSecondVideoControlsStopButton);
SecondVideoControlsVolumeButton.addEventListener('click', OnClickSecondVideoControlsVolumeButton);
SecondVideoControlsFullscreenButton.addEventListener('click', OnClickSecondVideoControlsFullscreenButton);

SecondVideo.addEventListener("loadedmetadata", OnSecondVideoMetaDataUpdate);
SecondVideo.addEventListener("timeupdate", OnSecondVideoTimeUpdate);
SecondVideoProgressInput.addEventListener("input", OnSecondVideoProgressInput);
SecondVideoVolumeInput.addEventListener("input", OnSecondVideoVolumeInput);


// Keybinds

const OnKeyDown = (keyEvent) =>
{
    switch(keyEvent.key)
    {
        case " ":
            {
                if(keyEvent.shiftKey)
                {
                    TogglePlayFirstVideo();
                    TogglePlaySecondVideo();
                }
                else if(keyEvent.ctrlKey)
                {
                    TogglePlaySecondVideo();
                }
                else
                {
                    TogglePlayFirstVideo();
                }
            }
            break;
        case "m":
            {
                if(keyEvent.altKey && keyEvent.ctrlKey)
                {
                    ToggleMuteFirstVideo();
                    ToggleMuteSecondVideo();
                }
                else if(keyEvent.altKey)
                {
                    ToggleMuteSecondVideo();
                }
                else
                {
                    ToggleMuteFirstVideo();
                }
            }
            break;
        case "f":
            {
                if(keyEvent.ctrlKey)
                {
                    ToggleFullscreenSecondVideo();
                }
                else
                {
                    ToggleFullscreenFirstVideo();
                }
            }
            break;
        case "ArrowRight":
            {
                if(keyEvent.shiftKey && keyEvent.ctrlKey)
                {
                    BothVideoSuperSeekForward();
                }else if(keyEvent.ctrlKey && keyEvent.altKey)
                {
                    SecondVideoSuperSeekForward();
                }else if(keyEvent.altKey)
                {
                    SecondVideoSeekForward();
                }else if(keyEvent.ctrlKey)
                {
                    FirstVideoSuperSeekForward();
                }else if(keyEvent.shiftKey)
                {
                    BothVideoSeekForward();
                }else
                {
                    FirstVideoSeekForward();
                }
            }
            break;
        case "ArrowDown":
            {
                if(keyEvent.altKey)
                {
                    SecondVideoVolumeDown();
                }else if(keyEvent.shiftKey)
                {   
                    BothVideoVolumeDown();
                }else
                {
                    FirstVideoVolumeDown();
                }
            }
            break;
        case "ArrowLeft":
            {
                if(keyEvent.shiftKey && keyEvent.ctrlKey)
                {
                    BothVideoSuperSeekReverse();
                }else if(keyEvent.ctrlKey && keyEvent.altKey)
                {
                    SecondVideoSuperSeekReverse();
                }else if(keyEvent.altKey)
                {
                    SecondVideoSeekReverse();
                }else if( keyEvent.ctrlKey)
                {
                    FirstVideoSuperSeekReverse();
                }else if(keyEvent.shiftKey)
                {
                    BothVideoSeekReverse();
                }else
                {
                    FirstVideoSeekReverse();
                }
            }
            break;
        case "ArrowUp":
            {
                if(keyEvent.altKey)
                {
                    SecondVideoVolumeUp();
                }else if(keyEvent.shiftKey)
                {   
                    BothVideoVolumeUp();
                }else
                {
                    FirstVideoVolumeUp();
                }
            }
            break;
        
    }
}

window.addEventListener("keyup", OnKeyDown);

// Seek Forward

const BothVideoSeekForward = () =>
{
    FirstVideoSeekForward();
    SecondVideoSeekForward();
}

const BothVideoSuperSeekForward = () =>
{
    FirstVideoSuperSeekForward();
    SecondVideoSuperSeekForward();
}

const FirstVideoSeekForward = () =>
{
    FirstVideo.currentTime = Math.min(FirstVideo.currentTime + 15, FirstVideo.duration);
}

const FirstVideoSuperSeekForward = () =>
{
    FirstVideo.currentTime = Math.min(FirstVideo.currentTime + 60, FirstVideo.duration);
}

const SecondVideoSeekForward = () =>
{
    SecondVideo.currentTime = Math.min(SecondVideo.currentTime + 15, SecondVideo.duration);
}

const SecondVideoSuperSeekForward = () =>
{
    SecondVideo.currentTime = Math.min(SecondVideo.currentTime + 60, SecondVideo.duration);
}

// Seek Reverse

const BothVideoSeekReverse = () =>
{
    FirstVideoSeekReverse();
    SecondVideoSeekReverse();
}

const BothVideoSuperSeekReverse = () =>
{
    FirstVideoSuperSeekReverse();
    SecondVideoSuperSeekReverse();
}

const FirstVideoSeekReverse = () =>
{
    FirstVideo.currentTime = Math.max(FirstVideo.currentTime - 15, 0);
}

const FirstVideoSuperSeekReverse = () =>
{
    FirstVideo.currentTime = Math.max(FirstVideo.currentTime - 60, 0);
}

const SecondVideoSeekReverse = () =>
{
    SecondVideo.currentTime = Math.max(SecondVideo.currentTime - 15, 0);
}

const SecondVideoSuperSeekReverse = () =>
{
    SecondVideo.currentTime = Math.max(SecondVideo.currentTime - 60, 0);
}

// Volume Up

const BothVideoVolumeUp = () =>
{
    FirstVideoVolumeUp();
    SecondVideoVolumeUp();
}

const FirstVideoVolumeUp = () =>
{
    FirstVideo.volume = Math.min(1, FirstVideo.volume + 0.1);
    FirstVideoVolumeInput.value = FirstVideo.volume * 100;
}

const SecondVideoVolumeUp = () =>
{
    SecondVideo.volume = Math.min(1, SecondVideo.volume + 0.1);
    SecondVideoVolumeInput.value = SecondVideo.volume * 100;
}

// Volume down

const BothVideoVolumeDown = () =>
{
    FirstVideoVolumeDown();
    SecondVideoVolumeDown();
}

const FirstVideoVolumeDown = () =>
{
    FirstVideo.volume = Math.max(0, FirstVideo.volume - 0.1);
    FirstVideoVolumeInput.value = FirstVideo.volume * 100;
}

const SecondVideoVolumeDown = () =>
{
    SecondVideo.volume = Math.max(0, SecondVideo.volume - 0.1);
    SecondVideoVolumeInput.value = SecondVideo.volume * 100;
}

// Auto Updater
const UpdatePanel = document.getElementById("UpdatePanel");
const UpdateMessage = document.querySelector("#UpdateBody p");
const CancelUpdateButton = document.getElementById("CancelUpdateButton");
const UpdateButton = document.getElementById("UpdateButton");


const UpdateAvailableCallback = (event, updateEvent) =>
{
    UpdatePanel.classList.remove("Hide");
    UpdateMessage.textContent = "Version " + updateEvent.version + " is now available to download."
}

const UpdateNotAvailableCallback = (event, updateEvent) =>
{
    console.log("No updates available");
}

const UpdateDownloadedCallback = (event, updateEvent) =>
{
    console.log("update downloaded");
}

const UpdateErrorCallback = (event, updateEvent) =>
{
    console.log(updateEvent);
}

const DownloadProgressCallback = (event, updateEvent)=>
{
    UpdateMessage.textContent = "Downloading update..." + Math.floor(updateEvent.percent) + "% / 100% " + Math.floor(updateEvent.bytesPerSecond/1024) + " kbps ";
}

window.autoUpdater.UpdateAvailable(UpdateAvailableCallback);
window.autoUpdater.UpdateNotAvailable(UpdateNotAvailableCallback);
window.autoUpdater.UpdateDownloaded(UpdateDownloadedCallback);
window.autoUpdater.DownloadProgress(DownloadProgressCallback);
window.autoUpdater.Error(UpdateErrorCallback);

const OnClickUpdateButton = () =>
{
    window.autoUpdater.InstallUpdate();
    UpdateButton.classList.add("Hide");
    CancelUpdateButton.classList.add("Hide");
    UpdateMessage.textContent = "Downloading update...";

}

const OnClickCancleUpdateButton = () =>
{
    UpdatePanel.classList.add("Hide");
}

UpdateButton.addEventListener('click', OnClickUpdateButton);
CancelUpdateButton.addEventListener('click', OnClickCancleUpdateButton);