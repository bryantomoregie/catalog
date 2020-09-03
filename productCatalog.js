
function createTableHeader(tableId) { //this 
    var tableHeaderRow = document.createElement('TR'); //creates a table row
    
    var th1 = document.createElement('TH'); //creates a table header, which is different from a regular cell (made by td)
    var th2 = document.createElement('TH');
    var th3 = document.createElement('TH');
    var th4 = document.createElement('TH');

    th1.appendChild(document.createTextNode('ProductId')); //adds this text into the header
    th2.appendChild(document.createTextNode('Type'));
    th3.appendChild(document.createTextNode('Price'));
    th4.appendChild(document.createTextNode('Examine'));

    tableHeaderRow.appendChild(th1); // add these headers into the table row created
    tableHeaderRow.appendChild(th2);
    tableHeaderRow.appendChild(th3);
    tableHeaderRow.appendChild(th4);

    document.getElementById(tableId).appendChild(tableHeaderRow);
}


function updateTable(tableId, productArray) { //takes in the id of the table and the product array
    var tableBody = document.getElementById(tableId) //I guess this is the id for the list of all products table?

    while (tableBody.hasChildNodes()) { //returns boolean value indicating if node has child nodes
        tableBody.removeChild(tableBody.firstChild); //clears the table. 
    }

    createTableHeader(tableId);

    for(let i = 0; i < productArray.length; i++){ //for each product, make this row and add to the table 
        var tr = document.createElement('TR'); //for each product in the array we are 
        var td1 = document.createElement('TD')  // creating a data cell for a table
        var td2 = document.createElement('TD')
        var td3 = document.createElement('TD')
        var td4 = document.createElement('button') //creating a button 

        td4.addEventListener('click', () => {
            processSearch(productArray[i].id)
     
        });

        td1.appendChild(document.createTextNode(productArray[i].id)); //adds the id to the empty data cell
        td2.appendChild(document.createTextNode(productArray[i].type)); //adds the type to the empty data cell
        td3.appendChild(document.createTextNode(productArray[i].price)); //adds the price to the empty data cell
        td4.appendChild(document.createTextNode('Examine')); //adds the examine to the empty data cell

        tr.appendChild(td1); //adding the cells into the row we created
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);

        tableBody.appendChild(tr); //add to the table, which we acquired earlier. 
    }
}

api.searchAllProducts().then((value) => {
    updateTable('allTable', value)
});

function updateExaminedText(product){
    var outputString = 'Product Id: ' + product.id;
    outputString += "<br> Price: " + product.price;
    outputString += "<br> Type: " + product.type;
    document.getElementById("productText").innerHTML = outputString;
}

function getIntersection(arrA, arrB, searchedId) {
    var samePrice = arrA;
    var sameType = arrB;
    var similarArray = [];
    samePrice.forEach((obj1) => {
        sameType.forEach((obj2) => {
            if(obj1.id == obj2.id && obj1.id != searchedId){
                similarArray.push(obj1)
            }
        });
    });

    return similarArray;
}
/* takes in two arrays. Searches through both arrays. If obj1 and obj2 id are the same, 
meaning this object is in both the same type array and in the price arrange array.
And object is not the object passed in. Push into a new array and we will display that. 
*/

function processSearch(searchId){
    api.searchProductById(searchId).then((val) => { //first return a promise that as its value has the product with the id we passed in as an argument
        return Promise.all([api.searchProductsByPrice(val.price, 50), api.searchProductsByType(val.type), val]); //returns all the promises with the relevant arguments
    }).then((val) => {
        var similarArray = getIntersection(val[0], val[1], val[2].id); //here we get all the resolved promise objects and we can pass them in as arguemnts to getIntersection
        updateExaminedText(val[2]); //displays the product we're examining 
        updateTable('similarTable', similarArray); //populates list for similar objectsw with similar array 
    }).catch((val) => { //if theres an error somewhere we will be alerted of it.
        alert(val);
    });
}

document.getElementById("inputButton").addEventListener('click',function(){
    processSearch(document.getElementById('input').value);
});


function searchSimilarProducts(type, allProducts) {
    var possibleTypes = ['Electronics','Book','Clothing','Food'];
    let arr = []
    if(!possibleTypes.includes(type)){
        alert("Invalid Type: " + type)
    } else {
        allProducts.forEach( product => {
            if(product.type === type){
                arr.push(product)
            }
        })
    }
    
   

    return arr
}


function findAllTypes(string){
    api.searchAllProducts().then((val) => {
        updateTable("similarTable" , searchSimilarProducts(string, val))
    })
}

function similarPriceProducts(string){
    let int = parseInt(string)
    api.searchProductsByPrice(int, 50).then((value) => {
        updateTable('similarTable', value)
    })

}

document.getElementById("inputTypeButton").addEventListener('click', () => {
    findAllTypes(document.getElementById('typeInput').value)
})

document.getElementById("inputPriceButton").addEventListener('click', () => {
    similarPriceProducts(document.getElementById("priceInput").value)
})

/*   

onCLick event on search price button that triggers a function that will return an array or
products with the array that is $50 less or $50 more 

Get the button from the HTMl //
add onclick event that triggers searchProductsByPrice //
pass in the input value and 50 as arguments //
A promise is returend whos value is the array of the products //
pass that array in to the updateTable function 


*/


