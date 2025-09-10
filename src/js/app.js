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

const MinWidth = 200; 
const MinHeight = 200;

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
    const rightBound = parentRect.width - currentRect.width;
    const bottomBound = parentRect.height - currentRect.height;

    currentRect.left = Math.min(Math.max(0, currentRect.left), rightBound);
    currentRect.top = Math.min(Math.max(0, currentRect.top), bottomBound);

    return currentRect;
}

const OnDrag = (dragEvent) => 
{
    dragEvent.preventDefault();
    SecondHeader.setPointerCapture(dragEvent.pointerId);

    const startPosition = { x:dragEvent.clientX, y:dragEvent.clientY };
    const startRect = SecondVideoPlayer.getBoundingClientRect();
    const parentRect = GetRect(FirstVideoPlayer);

    console.log(startRect);

    const OnMouseMove = (moveEvent) =>
    {
        const dx = moveEvent.clientX - startPosition.x;
        const dy = moveEvent.clientY - startPosition.y;

        let newLeft = startRect.left + dx;
        let newTop = startRect.top + dy;

        const clampedRect = ClampToRect(parentRect, {
            left: newLeft,
            top: newTop,
            width: startRect.width,
            height: startRect.height,
        });

        SecondVideoPlayer.style.left = Math.round(clampedRect.left) + 'px';
        SecondVideoPlayer.style.top  = Math.round(clampedRect.top) + 'px';
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