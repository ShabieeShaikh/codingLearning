$(document).ready(function () {

    const localDb = localStorage;

    //Holder Array
    let categoryArr = JSON.parse(localStorage.getItem("Category")) || [];
    let productArr = JSON.parse(localStorage.getItem("Product")) || [];

    //Re-render
    RenderTable("CATEGORY");
    RenderTable("PRODUCT");

    // setInterval(()=>{
    //     $("#temp").append(`<div class="alert alert-success alert-dismissible">
    //         <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    //         <strong>Success!</strong> This alert box could indicate a successful or positive action.
    //       </div>`);
    // },5000);

    $("#categoryForm").submit(function (event) {
        event.preventDefault();
        let categoryName = $("input[name=categoryName]");
        if (categoryName.val() != "") {
            let categoryObject = {
                Name: categoryName.val()
            }
            categoryArr.push(categoryObject);
            localDb.setItem("Category", JSON.stringify(categoryArr));
            categoryName.val(null);
            RenderTable("CATEGORY");
            GenerateNotification("Category Created", "bg-success", "text-dark");
        } else {
            GenerateNotification("Category name is requried", "bg-danger", "text-dark");
        }
    });

    $("#productForm").submit(function (event) {
        event.preventDefault();
        let productName = $("input[name=productName]");
        let productPrice = $("input[name=productPrice]");
        let productCategory = $("#categoryDropDown option:selected");
        if (productName.val() != "" || productPrice.val() != "") {
            let productObject = {
                Name: productName.val(),
                Price: productPrice.val(),
                ProductCategory: productCategory.val()
            }
            productArr.push(productObject);
            localDb.setItem("Product", JSON.stringify(productArr));
            productName.val(null);
            productPrice.val(null);
            RenderTable("PRODUCT");
            GenerateNotification("Product Created.", "bg-success", "text-dark");
        } else {
            GenerateNotification("Product feilds are empty.", "bg-danger", "text-dark");
        }
    });

    function RenderTable(type) {
        switch (type) {
            case type = "CATEGORY":
                let categoryCounter = 1;
                $("#renderCategoryTable").html(null);
                categoryArr.forEach((element, index) => {
                    $("#renderCategoryTable").append(`
                <tr>
                    <td>${categoryCounter}</td>
                    <td>${element.Name}</td>
                    <td><button data-category-index="${index}" class="btn btn-sm btn-danger" disabled>X</button></td>
                </tr>`);
                categoryCounter++;
                });

                $("#categoryDropDown").html(null)
                categoryArr.forEach((element, index) => {
                    $("#categoryDropDown").append(`<option value=${element.Name}>${element.Name}</option>`);
                });
                break;
            case type = "PRODUCT":
                let productCounter = 1;
                $("#renderProductTable").html(null);
                console.log(productArr);
                if (!Array.isArray(productArr)|| !productArr.length) {
                    $("#renderProductTable").html(`<tr><td colspan="6" class="text-center">No product found.</td></tr>`);
                }else{
                    productArr.forEach((element, index) => {
                        $("#renderProductTable").append(`
                    <tr>
                        <td>${productCounter}</td>
                        <td>${element.Name}</td>
                        <td>${element.Price}</td>
                        <td>${element.ProductCategory}</td>
                        <td><button data-category-index="${index}" class="btn btn-sm btn-danger" disabled>X</button></td>
                    </tr>`);
                    productCounter++;
                    });
                }
                break;

            default:
                console.log("No case found");
                break;
        }
    }

    function GenerateNotification(message, bgColor, textColor, autoHide = true, delayTime = 5000) {
        let datetime = Date.now();
        const toastId = "toast-" + datetime;
        const toastIdElement = "#" + toastId;
        //Convert Date to human
        const dateToHuman = new Date(datetime).toDateString("hh-mm-ss");
        const toastHTML = `<div class="toast ${textColor} ${bgColor}" id="${toastId}" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
        <strong class="me-auto">Notification</strong>
        <small class="text-muted">${dateToHuman}</small>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body bg-white">
        ${message}
    </div>
</div>`;
        // Append the toast to the container
        $('#toast-container').append(toastHTML);
        const toastElement = $(toastIdElement);
        // Initialize and show the toast using Bootstrap's Toast API
        const bootstrapToast = new bootstrap.Toast(toastElement, {
            autohide: autoHide,
            delay: delayTime
        });
        bootstrapToast.show();
        // Remove the toast from DOM after hidden
        // toastElement.addEventListener("hidden.bs.toast",function (){
        //     $(this).remove();
        // });
    }


});