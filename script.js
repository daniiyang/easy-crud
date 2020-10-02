let selectedRow = null
let fullUsersInfo = null


function onFormSubmit() {
    fetchFullUserInfo()

   /* // output all existed users
    for (let id in fullUsersInfo) {
        addExistedCells(fullUsersInfo[id])
    }*/

    let formData = readFormData();

    if (selectedRow == null)
        insertNewRecord(formData);
    else
        updateRecord(formData);

    // clean input after insert new record
    resetForm();
}


function fetchFullUserInfo () {
    fetch('https://jsonplaceholder.typicode.com/users')
        .then((response) => response.json())
        .then((json) => fullUsersInfo = json);
}


function addExistedCells (data) {
        let table = document.getElementById("employeeList").getElementsByTagName('tbody')[0];
        let newRow = table.insertRow(table.length);

        let cell1 = newRow.insertCell(0);
        cell1.innerHTML = data.id;

        let cell2 = newRow.insertCell(1);
        cell2.innerHTML = data.name;

        let cell3 = newRow.insertCell(2);
        cell3.innerHTML = data.username;

        let cell4 = newRow.insertCell(3);
        cell4.innerHTML = data.email;

        cell4 = newRow.insertCell(4);
        cell4.innerHTML = `<a onClick="onEdit(this)">Edit</a>
                       <a onClick="onDelete(this)">Delete</a>
                       <a onClick="onMoreInfo(this)">More Info</a>`;
}


function readFormData() {
    let formData = {};

    formData["id"] = document.getElementById("id").value;
    formData["name"] = document.getElementById("name").value;
    formData["username"] = document.getElementById("username").value;
    formData["email"] = document.getElementById("email").value;
    formData["street"] = document.getElementById("street").value;
    formData["suite"] = document.getElementById("suite").value;
    formData["zipcode"] = document.getElementById("zipcode").value;
    formData["lat"] = document.getElementById("lat").value;
    formData["lng"] = document.getElementById("lng").value;
    formData["phone"] = document.getElementById("phone").value;
    formData["website"] = document.getElementById("website").value;
    formData["companyName"] = document.getElementById("companyName").value;
    formData["companyCatchPhrase"] = document.getElementById("companyCatchPhrase").value;
    formData["bs"] = document.getElementById("bs").value;

    return formData;
}


function insertNewRecord(data) {
    let table = document.getElementById("employeeList").getElementsByTagName('tbody')[0];
    let newRow = table.insertRow(table.length);

    let cell1 = newRow.insertCell(0);
    cell1.innerHTML = data.id;

    let cell2 = newRow.insertCell(1);
    cell2.innerHTML = data.name;

    let cell3 = newRow.insertCell(2);
    cell3.innerHTML = data.username;

    let cell4 = newRow.insertCell(3);
    cell4.innerHTML = data.email;

    cell4 = newRow.insertCell(4);
    cell4.innerHTML = `<a onClick="onEdit(this)">Edit</a>
                       <a onClick="onDelete(this)">Delete</a>
                       <a onClick="onMoreInfo(this)">More Info</a>`;
}

// clean input after insert new record
function resetForm() {
    document.getElementById("id").value = "";
    document.getElementById("name").value = "";
    document.getElementById("username").value = "";
    document.getElementById("email").value = "";
    selectedRow = null;
}


function onEdit(td) {
    selectedRow = td.parentElement.parentElement;
    document.getElementById("id").value = selectedRow.cells[0].innerHTML;
    document.getElementById("name").value = selectedRow.cells[1].innerHTML;
    document.getElementById("username").value = selectedRow.cells[2].innerHTML;
    document.getElementById("email").value = selectedRow.cells[3].innerHTML;
}


function updateRecord(formData) {
    selectedRow.cells[0].innerHTML = formData.id;
    selectedRow.cells[1].innerHTML = formData.name;
    selectedRow.cells[2].innerHTML = formData.username;
    selectedRow.cells[3].innerHTML = formData.email;
}


function onDelete(td) {
    let row = td.parentElement.parentElement;
    document.getElementById("employeeList").deleteRow(row.rowIndex);

    resetForm();
}


function onMoreInfo(td) {
    //TODO: should be in text block after user list

    selectedRow = td.parentElement.parentElement;
    let selectedUserID = document.getElementById("id").value = selectedRow.cells[0].innerHTML;
    console.log(selectedUserID);

    // -1 cause array starts from 1 instead 0
    let selectedUserFullInfo = fullUsersInfo[selectedUserID - 1];
    alert(JSON.stringify(selectedUserFullInfo));
}