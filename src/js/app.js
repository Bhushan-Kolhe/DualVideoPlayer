const openFileButton = document.getElementById("OpenFileButton");
const primaryVideo = document.getElementById("PrimaryVideo");
const secondaryVideo = document.getElementById("SecondaryVideo");

openFileButton.addEventListener("click", async () =>{
    console.log("asd")
    primaryVideo.setAttribute('src',"d:/test.mp4")
    primaryVideo.play()

    secondaryVideo.setAttribute('src',"d:/test.mp4")
    secondaryVideo.play()
})