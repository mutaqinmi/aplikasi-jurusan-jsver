const show = (e) => {
    if(e.target.files.length > 0){
        var src = URL.createObjectURL(e.target.files[0]);
        var preview = document.getElementById("image");
        preview.src = src;
    }
}