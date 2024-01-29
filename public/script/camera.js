const show = (e) => {
    if(e.target.files.length > 0){
        var src = URL.createObjectURL(e.target.files[0]);
        var preview = $("#image");
        preview.src = src;
    }
}

$(document).ready(() => {
    $("#camera").on("change", show(event))
})