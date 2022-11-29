let file = document.getElementById("file")
let form = document.getElementById("form")

form.onclick = () => {
    file.click()
}

file.onchange = async (e) => {

    let filename = e.target.files[0].name
    let size = e.target.files[0].size
    let type = e.target.files[0].type

    document.getElementById("content").style.display = "block"
    document.getElementById("filenamespan").textContent = filename

    var xrh = new XMLHttpRequest()
    xrh.open("POST", "http://localhost:8000/file/upload")
    xrh.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xrh.send(`filename=${filename}&size=${size}&type=${type}`)
    xrh.onload = () => {
        let res = xrh.responseText
        console.log(res)
        uploadTos3(res, new FormData(form), updatePercentage, filename)
    }
}

function updatePercentage(percentage, filename) {
    if (percentage == 100) {
        document.getElementById("content").style.display = "none"
        document.getElementById("uploadingprocess").textContent = percentage

        let node = document.createElement('span').textContent = `${filename}   DONE`
        document.getElementById('append').innerHTML = node
    }
    document.getElementById("progressbar").style.width = `${percentage}%`
}

function uploadTos3(url, file, updatePercentage, filename) {
    return new Promise(function (resolve, reject) {

        const xhr = new XMLHttpRequest();
        xhr.open("PUT", url)
        xhr.setRequestHeader("Content-Type", "multipart/form-data")
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr)
                }
                else {
                    reject(xhr)
                }
            }
        };

        if (updatePercentage) {
            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    var percentComplete = Math.ceil((e.loaded / e.total) * 100);
                    updatePercentage(percentComplete, filename);
                }
            };
        }

        xhr.open("PUT", url);
        xhr.send(file);
    });
}
