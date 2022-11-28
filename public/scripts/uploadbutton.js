/*
 * Created on Sun Nov 27 2022
 *
 * Copyright (c) 2022 Connor Doman
 */

window.addEventListener("load", () => {
    let productImage = document.querySelector("#productImage");
    let productImageLabel = document.querySelector("#productImageLabel");
    let uploadButton = document.querySelector("#uploadButton");
    let submitButton = document.querySelector("#submitupload");

    uploadButton.addEventListener("click", (e) => {
        let clickEvent = document.createEvent("MouseEvents");
        clickEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        productImage.dispatchEvent(clickEvent);
    });

    productImage.addEventListener("input", (e) => {
        let file = e.target.files[0];
        if (file) {
            uploadButton.value = file.name;
            submitButton.disabled = false;
        } else {
            uploadButton.value = "PNG/JPEG";
            submitButton.disabled = true;
        }
    });
});
