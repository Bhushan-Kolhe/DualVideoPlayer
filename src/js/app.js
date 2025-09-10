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