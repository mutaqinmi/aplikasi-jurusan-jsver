$(() => {
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
});