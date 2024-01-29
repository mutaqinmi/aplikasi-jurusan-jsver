const input = document.getElementById("camera");

function Show(event) {
    if(event.target.files.length > 0){
        var src = URL.createObjectURL(event.target.files[0]);
        var preview = document.getElementById("image");
        preview.src = src;
    }
}