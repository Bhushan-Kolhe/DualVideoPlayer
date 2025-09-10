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

// Configuration Variables
const MinWidth = 200; 
const MinHeight = 200;
const FadePlayerControlsDelay = 2000;

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

let IsFirstVideoPlaying = false;
let IsSecondVideoPlaying = false;

const OnClickFirstVideoLoadButton = () =>
{
    FirstVideoLoadButton.classList.add("Hide");
    FirstPlayButton.classList.remove("SoftHide");

    FirstVideo.setAttribute('src',"../../Resources/Video/test.mp4")
};

const OnClickFirstPlayButton = () =>
{
    if(IsFirstVideoPlaying)
    {
        PauseFirstVideo();
    }
    else
    {
        PlayFirstVideo();
    }
}

const PlayFirstVideo = () =>
{
    FirstVideo.play();
    IsFirstVideoPlaying = true;
    FirstPlayButton.classList.add("SoftHide");
}

const PauseFirstVideo = () =>
{
    FirstVideo.pause();
    IsFirstVideoPlaying = false;
    FirstPlayButton.classList.remove("SoftHide");
}

FirstVideoLoadButton.addEventListener('click', OnClickFirstVideoLoadButton);
FirstPlayButton.addEventListener('click', OnClickFirstPlayButton);
FirstVideo.addEventListener('click', PauseFirstVideo);

// Second Video Player

const OnClickSecondVideoLoadButton = () =>
{
    SecondVideoLoadButton.classList.add("Hide");
    SecondPlayButton.classList.remove("SoftHide");

    SecondVideo.setAttribute('src',"../../Resources/Video/test.mp4")
};

const OnClickSecondPlayButton = () =>
{
    if(IsSecondVideoPlaying)
    {
        PauseSecondVideo();
    }
    else
    {
        PlaySecondVideo();
    }
}

const PlaySecondVideo = () =>
{
    SecondVideo.play();
    IsSecondVideoPlaying = true;
    SecondPlayButton.classList.add("SoftHide");
}

const PauseSecondVideo = () =>
{
    SecondVideo.pause();
    IsSecondVideoPlaying = false;
    SecondPlayButton.classList.remove("SoftHide");
}

SecondVideoLoadButton.addEventListener('click', OnClickSecondVideoLoadButton);
SecondPlayButton.addEventListener('click', OnClickSecondPlayButton);
SecondVideo.addEventListener('click', PauseSecondVideo);