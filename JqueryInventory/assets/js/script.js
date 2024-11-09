$(document).ready(function () {
  const localDb = localStorage;

  //Holder Array
  let categoryArr = JSON.parse(localStorage.getItem("Category")) || [];
  let productArr = JSON.parse(localStorage.getItem("Product")) || [];
  let inventoryArr = JSON.parse(localStorage.getItem("Inventory")) || [];

  //Re-render
  RenderTable("CATEGORY");
  RenderTable("PRODUCT");
  RenderTable("PRODUCTCOMBO");
  RenderTable("INVENTORY");

  // setInterval(()=>{
  //     $("#temp").append(`<div class="alert alert-success alert-dismissible">
  //         <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  //         <strong>Success!</strong> This alert box could indicate a successful or positive action.
  //       </div>`);
  // },5000);

  //Region for submit forms

  $("#categoryForm").submit(function (event) {
    event.preventDefault();
    let categoryName = $("input[name=categoryName]");
    if (categoryName.val() != "") {
      const categoryObject = {
        Name: categoryName.val().toUpperCase(),
      };
      categoryArr.push(categoryObject);
      localDb.setItem("Category", JSON.stringify(categoryArr));
      categoryName.val(null);
      RenderTable("CATEGORY");
      GenerateNotification("Category Created", "bg-success", "text-dark");
    } else {
      GenerateNotification(
        "Category name is requried",
        "bg-danger",
        "text-dark"
      );
    }
  });

  $("#productForm").submit(function (event) {
    event.preventDefault();
    let productName = $("input[name=productName]");
    let productPrice = $("input[name=productPrice]");
    let productCategory = $("#categoryDropDown option:selected");
    if (productName.val() != "" || productPrice.val() != "") {
      const productObject = {
        Name: productName.val().toUpperCase(),
        Price: productPrice.val(),
        ProductCategory: productCategory.val(),
      };
      productArr.push(productObject);
      localDb.setItem("Product", JSON.stringify(productArr));
      productName.val(null);
      productPrice.val(null);
      RenderTable("PRODUCT");
      GenerateNotification("Product Created.", "bg-success", "text-dark");
    } else {
      GenerateNotification(
        "Product feilds are empty.",
        "bg-danger",
        "text-dark"
      );
    }
  });

  $("#inventoryForm").submit(function (event) {
    event.preventDefault();
    let productName = $("#productDropDown option:selected");
    let productQuantity = $("input[name=productQuantity]");
    const productPriceDynamic = $("#productPrice").val();
    if (productName.val() == "" || productQuantity.val() == "") {
      GenerateNotification(
        "Inventory feilds are empty.",
        "bg-warning",
        "text-dark"
      );
    } else if (productPriceDynamic == "") {
      GenerateNotification(
        "Product price is not valid.",
        "bg-warning",
        "text-dark"
      );
    } else {
      const findInventoryProduct = inventoryArr.filter(
        (inventory) => inventory.ProductName == productName.val()
      );

      const CreatedOn = new Date(Date.now()).toLocaleDateString();
      const UpdatedOn = new Date(Date.now()).toLocaleDateString();

      //variable function
      let updateTotalPrice = () => {
        return inventoryModel.ProductPrice * inventoryModel.ProductQuantity;
      };

      let inventoryModel = {
        ProductName: "",
        ProductPrice: 0.0,
        ProductQuantity: 0,
        ProductTotal: 0,
        CreatedOn: null,
        UpdatedOn: null,
      };

      if (findInventoryProduct.length == 0) {
        //Internal fields from data-form
        inventoryModel.ProductName = productName.val();
        inventoryModel.ProductQuantity = parseInt(productQuantity.val());
        inventoryModel.CreatedOn = CreatedOn;
        //Getting product price
        const productPrice = productArr.filter(
          (product) => product.Name == productName.val()
        );
        inventoryModel.ProductPrice = parseFloat(productPrice[0].Price);
        inventoryModel.ProductTotal = updateTotalPrice();
        //To localDB
        inventoryArr.push(inventoryModel);
        localDb.setItem("Inventory", JSON.stringify(inventoryArr));
        //Fields to empty
        productQuantity.val(null);
        $("#productPrice").val(null);
        //Render table
        RenderTable("INVENTORY");
      } else {
        findInventoryProduct.forEach((element, index) => {
          inventoryArr[index].ProductQuantity += parseInt(
            productQuantity.val()
          );
          inventoryArr[index].UpdatedOn = UpdatedOn;
          inventoryArr[index].ProductTotal =
            inventoryArr[index].ProductPrice *
            inventoryArr[index].ProductQuantity;
          localDb.setItem("Inventory", JSON.stringify(inventoryArr));
          console.log(inventoryArr);
          productQuantity.val(null);
          $("#productPrice").val(null);
          //Render table
          RenderTable("INVENTORY");
        });
      }
    }
  });

  //End region

  $("#productDropDown").on("change", function () {
    const comboValue = $("#productDropDown option:selected").val();
    $("#productPrice").val(null);
    if (comboValue != "") {
      const productPrice = productArr.filter(
        (product) => product.Name == comboValue
      );
      $("#productPrice").val(productPrice[0].Price);
    }
  });

  function RenderTable(type) {
    switch (type) {
      case (type = "CATEGORY"):
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

        //For Category select list population from localDB
        $("#categoryDropDown").html(null);
        categoryArr.forEach((element, index) => {
          $("#categoryDropDown").append(
            `<option value="${element.Name}">${element.Name}</option>`
          );
        });
        break;
      case (type = "PRODUCT"):
        let productCounter = 1;
        $("#renderProductTable").html(null);
        if (!Array.isArray(productArr) || !productArr.length) {
          $("#renderProductTable").html(
            `<tr><td colspan="6" class="text-center">No product found.</td></tr>`
          );
        } else {
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
      case (type = "PRODUCTCOMBO"):
        //For Category select list population from localDB
        $("#productDropDown").html(null);
        $("#productDropDown").html('<option value=""></option>');
        productArr.forEach((element, index) => {
          $("#productDropDown").append(
            `<option value="${element.Name}">${element.Name}</option>`
          );
        });
        break;
      case (type = "INVENTORY"):
        let inventoryCounter = 1;
        $("#renderInventoryTable").html(null);
        if (!Array.isArray(inventoryArr) || !inventoryArr.length) {
          $("#renderInventoryTable").html(
            `<tr><td colspan="6" class="text-center">No inventory found.</td></tr>`
          );
        } else {
          inventoryArr.forEach((element, index) => {
            $("#renderInventoryTable").append(`
                        <tr>
                            <td>${inventoryCounter}</td>
                            <td>${element.ProductName}</td>
                            <td>${element.ProductPrice}</td>
                            <td>${element.ProductQuantity}</td>
                            <td>${element.ProductTotal}</td>
                            <td><strong><span class="text-white p-1 rounded-1  bg-dark">${(element.CreatedOn) || "NAN"}</span></strong></td>
                            <td><strong><span class="text-white p-1 rounded-1  bg-warning">${(element.UpdatedOn) || "NAN"}</span></strong></td>
                            <td><button data-category-index="${index}" class="btn btn-sm btn-danger" disabled>X</button></td>
                        </tr>`);
            inventoryCounter++;
          });
        }
        break;
      default:
        console.log("No case found");
        break;
    }
  }

  function GenerateNotification(
    message,
    bgColor,
    textColor,
    autoHide = true,
    delayTime = 5000
  ) {
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
    $("#toast-container").append(toastHTML);
    const toastElement = $(toastIdElement);
    // Initialize and show the toast using Bootstrap's Toast API
    const bootstrapToast = new bootstrap.Toast(toastElement, {
      autohide: autoHide,
      delay: delayTime,
    });
    bootstrapToast.show();
    // Remove the toast from DOM after hidden
    // toastElement.addEventListener("hidden.bs.toast",function (){
    //     $(this).remove();
    // });
  }
});
