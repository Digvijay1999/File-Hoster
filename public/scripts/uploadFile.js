let file = document.getElementById("file")
let form = document.getElementById("form")

file.onchange = async (e) => {
    let filename = e.target.files[0].name
    let size = e.target.files[0].size
    let type = e.target.files[0].type

    //console.log(filename, size, type);

    var xrh = new XMLHttpRequest()
    xrh.open("POST", "http://localhost:8000/file/upload")
    xrh.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xrh.send(`filename=${filename}&size=${size}&type=${type}`)
    xrh.onload = () => {
        let res = xrh.responseText
        console.log(res)
        uploadTos3(res, new FormData(form))
    }
}

function uploadTos3(url, formData) {
    var xrh = new XMLHttpRequest()
    xrh.open("PUT", url)
    xrh.setRequestHeader("Content-Type", "multipart/form-data")
    xrh.send(formData)
    xrh.onload = () => {
        console.log("file uploaded successfully");
    }
}
