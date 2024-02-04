//* ------------------------- Handling File and Submits -------------------------
const show = (e) => {
    if(e.target.files.length > 0){
        document.getElementById("form").scrollIntoView({ behavior: "smooth", block: "end" }); 

        var src = URL.createObjectURL(e.target.files[0]);
        var preview = document.getElementById("result-image");
        preview.src = src;
        preview.style.height = "15rem";
        
        const submitButton = document.getElementsByClassName("submit")[0];
        if(submitButton.hasChildNodes() === false){
            const button = document.createElement("button");
            button.innerHTML = "<i class='ph ph-check'></i>";
            button.setAttribute("type", "submit");
            button.setAttribute("class", "submit-button");
    
            submitButton.appendChild(button)
        }
    }
}

//* ------------------------- Handling and Getting Async Data -------------------------
const getDataNama = (e) => {
    $(() => {
        const value = e.target.value;
        $.ajax({
            method: "GET",
            url: "http://localhost:8000/api/data-peminjaman/data-nama/" + value,
            type: "json",
            success: (res) => {
                $("#nis").val(res.dataSiswa[0].nis);
                $("#nama").val(res.dataSiswa[0].nama);
            },
            error: () => {
                $("#nis").val("");
                $("#nama").val("");
            }
        })
    })
}