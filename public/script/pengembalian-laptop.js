const date = new Date();
$(document).ready(() => {
    $(window).scroll(() => {
        const scroll = $(window).scrollTop();
        const form = $(".form").outerHeight();
        const coverImage = $(".cover-image");

        if (scroll <= form){
            const opacity = (scroll / form * 200) + '%';
            coverImage.css({
                "opacity": opacity,
            })
        }
    });

    const time = `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}`;
    $("#tanggal").val(time);
});