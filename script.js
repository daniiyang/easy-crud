const htmlUserList = document.getElementById("userList");
const form = document.querySelector('form')
const inputs = form.querySelectorAll('input[type="text"]')

let selectedRow = null;
let fullUsersInfo = null;
let selectedUserID_GLOBAL = null;
let userProps = ["name", "username", "email", "street",
    "suite", "zipcode", "lat", "lng", "phone", "website",
    "companyName", "companyCatchPhrase", "bs", "city"
];


fetchFullUserInfo ()


function onFormSubmit() {
    let formData = readFormData();

    if (selectedRow == null)
        insertNewRecord(formData, fullUsersInfo.length + 1);
    else
        updateRecord(formData);
}


function addExistedCells (data) {
    let table = htmlUserList.getElementsByTagName('tbody')[0];
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
    // тут тоже лучше лучше на каждую итерацию не проходится по дому и не искать каждый раз по айди элемент по всему приложению
   /*  inputs.forEach(input => {
        formData[input.id] = input.value
    }) */
    for (let prop in userProps) {
        formData[userProps[prop]] = document.getElementById(userProps[prop]).value;
    }
    return formData;
}


function insertNewRecord(data, newID) {
    console.log(newID)
// Здесь можно использовать уже существующую функцию addExistingCells
    let table = htmlUserList.getElementsByTagName('tbody')[0];
    let newRow = table.insertRow(table.length);

    let cell1 = newRow.insertCell(0);
    cell1.innerHTML = newID;

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

    postNewUser(data, newID)
}

/* Лучше назвать clear fields или clear inputs  и создание нового пользователя тоже надо поля чистить*/
function updateContent() {
    // clean input
    for (let prop in userProps) {
        document.getElementById(userProps[prop]).value = "";
    }

    /*// delete all old rows
    for (let id in fullUsersInfo) {
        htmlUserList.deleteRow(id);
    }

    // add updated rows
    fetchFullUserInfo()*/
}

function getPlainUserData(userData) {
const {address, company, ...plainData} = userData;
const {geo, ...remainingAdress} = address; 
/* Здесь мы раскладываем наш объект, чтобы не было вложенностей */
const plainDataWithAddressAndCompany = {
    ...plainData,
    ...remainingAdress,
    ...geo,
    companyName : company.name,
    companyCatchPhrase: company.catchPhrase,
    bs: company.bs
}
// Теперь у нас есть объект, в котором ключ - это значение input id, а значение - это соответствующее свойство пользователя, осталось только подставить под наши инпуты
  return userProps.reduce((acc,prop) => {
    acc[prop] = plainDataWithAddressAndCompany[prop]
    return acc
  }, {})
  
}

function onEdit(td) {
    selectedRow = td.parentElement.parentElement;
    // Здесь лучше не привязываться к конкретному расположению элемента и иметь какой-либо идентификатор по которому мы сможем найти ячейку, к примеру, класс или id, но не суть
    let selectedUserID = htmlUserList.value = selectedRow.cells[0].innerHTML;
    // Зачастую в реальных проектах айди это уникальное значение не связанное с порядковым номером элемента, лучше находить пользователя по конкретному айди, а не через индекс
    const selectedUser = fullUsersInfo.find(user => user.id == selectedUserID);
    // Очень много лишних итераций по DOM, повторений в коде, лучше один раз наши инпуты найти в форме и работать с ними, а не находить каждый элемент по айди при редактировании
    // Можно сделать, как-то так, к примеру, но для этого нам необходимо объект, у которого ключами будут выступать уникальные айди нашего инпута, а значения - это свойства выбранного пользователя соответствующее инпуту
    const plainUserData = getPlainUserData(selectedUser)
    inputs.forEach(input => input.value = plainUserData[input.id])
    
    // document.getElementById("name").value = selectedRow.cells[1].innerHTML;
    // document.getElementById("username").value = selectedRow.cells[2].innerHTML;
    // document.getElementById("email").value = selectedRow.cells[3].innerHTML;
    // document.getElementById("street").value = fullUsersInfo[selectedUserID - 1].address.street;
    // document.getElementById("suite").value = fullUsersInfo[selectedUserID - 1].address.suite;
    // document.getElementById("city").value = fullUsersInfo[selectedUserID - 1].address.city;
    // document.getElementById("zipcode").value = fullUsersInfo[selectedUserID - 1].address.zipcode;
    // document.getElementById("lat").value = fullUsersInfo[selectedUserID - 1].address.geo.lat;
    // document.getElementById("lng").value = fullUsersInfo[selectedUserID - 1].address.geo.lng;
    // document.getElementById("phone").value = fullUsersInfo[selectedUserID - 1].phone;
    // document.getElementById("website").value = fullUsersInfo[selectedUserID - 1].website;
    // document.getElementById("companyName").value = fullUsersInfo[selectedUserID - 1].company.name;
    // document.getElementById("companyCatchPhrase").value = fullUsersInfo[selectedUserID - 1].company.catchPhrase;
    // document.getElementById("bs").value = fullUsersInfo[selectedUserID - 1].company.bs;

    selectedUserID_GLOBAL = selectedUserID;

}


function updateRecord(formData) {
    selectedRow.cells[0].innerHTML = selectedUserID_GLOBAL;
    selectedRow.cells[1].innerHTML = formData.name;
    selectedRow.cells[2].innerHTML = formData.username;
    selectedRow.cells[3].innerHTML = formData.email;

    patchEditedUser(selectedUserID_GLOBAL);
    updateContent();
}


function onDelete(td) {
    selectedRow = td.parentElement.parentElement;
    let selectedUserID = htmlUserList.value = selectedRow.cells[0].innerHTML;

    deleteUser(selectedUserID);

    htmlUserList.deleteRow(selectedUserID);
}


function onMoreInfo(td) {
    selectedRow = td.parentElement.parentElement;
    let selectedUserID = htmlUserList.value = selectedRow.cells[0].innerHTML;

    // -1 cause array starts from 1 instead 0
    // Тут тоже по айди находить
    let selectedUserFullInfo = fullUsersInfo[selectedUserID - 1];

    document.getElementById("usersMoreInfo").innerHTML = `id: ${selectedUserFullInfo.id}
                                                               <br>Name: ${selectedUserFullInfo.name}
                                                               <br>Username ${selectedUserFullInfo.username}
                                                               <br>Email: ${selectedUserFullInfo.email}
                                                               <br>Street: ${selectedUserFullInfo.address.street}
                                                               <br>Suite: ${selectedUserFullInfo.address.suite}
                                                               <br>City: ${selectedUserFullInfo.address.city}
                                                               <br>Zipcode: ${selectedUserFullInfo.address.zipcode}
                                                               <br>Lat: ${selectedUserFullInfo.address.geo.lat}
                                                               <br>Lng: ${selectedUserFullInfo.address.geo.lng}
                                                               <br>Phone: ${selectedUserFullInfo.phone}
                                                               <br>Website: ${selectedUserFullInfo.website}
                                                               <br>Company name: ${selectedUserFullInfo.company.name}
                                                               <br>Company catch phrase: ${selectedUserFullInfo.company.catchPhrase}
                                                               <br>Bs: ${selectedUserFullInfo.company.bs}`;
}


function fetchFullUserInfo () {
    fetch('https://jsonplaceholder.typicode.com/users')
        .then((response) => response.json())
        .then((json) => {
            fullUsersInfo = json;

            for (let id in fullUsersInfo) {
                addExistedCells(fullUsersInfo[id])
            }
        });
}


function postNewUser (data, newID) {
    fetch(`https://jsonplaceholder.typicode.com/users`, {
        method: 'POST',
        body: JSON.stringify({
            id: newID,
            name: data.name,
            username: data.username,
            email: data.email,
            address: {
                street: data.street,
                suite: data.suite,
                city: data.city,
                zipcode: data.zipcode,
                geo: {
                    lat: data.lat,
                    lng: data.lng,
                }
            },
            phone: data.phone,
            website: data.website,
            company: {
                name: data.companyName,
                catchPhrase: data.companyCatchPhrase,
                bs: data.bs,
            }
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) => response.json())
        .then((json) => console.log(json))
}


function patchEditedUser (selectedUserID) {
    fetch(`https://jsonplaceholder.typicode.com/users/${selectedUserID}`, {
        method: 'PATCH',
        body: JSON.stringify({
            name: fullUsersInfo[selectedUserID - 1].name,
            username: fullUsersInfo[selectedUserID - 1].username,
            email: fullUsersInfo[selectedUserID - 1].email,
            address: {
                street: fullUsersInfo[selectedUserID - 1].address.street,
                suite: fullUsersInfo[selectedUserID - 1].address.suite,
                city: fullUsersInfo[selectedUserID - 1].address.city,
                zipcode: fullUsersInfo[selectedUserID - 1].address.zipcode,
                geo: {
                    lat: fullUsersInfo[selectedUserID - 1].address.geo.lat,
                    lng: fullUsersInfo[selectedUserID - 1].address.geo.lng,
                }
            },
            phone: fullUsersInfo[selectedUserID - 1].phone,
            website: fullUsersInfo[selectedUserID - 1].website,
            company: {
                name: fullUsersInfo[selectedUserID - 1].company.name,
                catchPhrase: fullUsersInfo[selectedUserID - 1].company.catchPhrase,
                bs: fullUsersInfo[selectedUserID - 1].company.bs,
            }
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) => response.json())
        .then((json) => console.log(json))

}


function deleteUser (selectedUserID) {
    fetch(`https://jsonplaceholder.typicode.com/users/${selectedUserID}`, {
        method: 'DELETE',
    })
        .then((json) => console.log(json));
}
