// storing the key, token, boardID, and list present in board 
let key = "ec220ca0f912754f4b53bf6b99985066";
let token = "0845a930eeeaa45f23bd8ab16cbcbbd2583d0439c6ab7255e15a05876bbc2e7d";
let idBoard = "623ae5d00fd3292eee19390f";
let boardList = "623ae5d8089eed6056599d92";

let recievedCardData;
let input_Value;
let idObj = {};
let listID = [];
let idForList;
let cardID;

// query selectors
let form = document.querySelector("form");
let input = document.querySelector("input");
let ul = document.querySelector("#form-data");
let addListBtn = document.querySelector("#add");

// action event listeners
addListBtn.addEventListener("click", createLi);
addListBtn.addEventListener("click", () => {
    window.location.reload(true);
});
ul.addEventListener("click", cardPopUp);

// function to create a new list.
function createLi(event) {
    event.preventDefault();

    if (input.value === "") {
        alert("Please Enter Something...");
        return false;
    }

    // creating the ui
    let li = document.createElement("li");
    let span = document.createElement("span");
    span.innerText = input.value;
    let div = document.createElement("div");
    div.classList.add("jsList");
    let inputText = document.createElement("input");
    inputText.classList.add("inputValue");
    inputText.setAttribute("type", "text");
    inputText.placeholder = "+ Add a Card..";
    let addButton = document.createElement("button");
    addButton.classList.add("cardButton", "submit");
    addButton.innerText = "ADD";
    addButton.addEventListener("click", addCard);
    let removeBtn = document.createElement("button");
    removeBtn.classList.add("cardButton");
    removeBtn.innerText = "REMOVE";

    li.appendChild(span);
    li.appendChild(div);
    li.appendChild(inputText);
    li.appendChild(addButton);
    li.appendChild(removeBtn);
    ul.appendChild(li);

    // getting all the lists from the trello data base using the API
    fetch(`https://api.trello.com/1/lists?name=${input.value}&idBoard=${idBoard}&key=${key}&token=${token}`, {
            method: 'POST'
        })
        .then(response => {
            console.log(
                `Response: ${response.status} ${response.statusText}`
            );
            return response.text();
        })
        .then(text => console.log(text))
        .catch(err => console.error(err));

    form.reset();
}

// function to add a card in list
function addCard(event) {
    let btn = event.target;
    if (btn.innerText === "ADD") {
        // getting the element where we have to attach the data
        let text = btn.previousSibling.value;
        let textList = btn.previousSibling.previousSibling;
        let p = document.createElement("p");
        p.setAttribute("draggable", "true");
        p.classList.add("pop-up");
        if (text === "") {
            alert("Please enter something...");
            return false;
        }
        p.innerText = text;
        textList.appendChild(p);
        let nameOfObj = btn.parentElement.firstElementChild.textContent;

        // getting the list id from list id arrays
        for (let index = 0; index < listID.length; index++) {
            if (nameOfObj === listID[index].name) {
                idForList = listID[index].id;
            }
        }

        // posting the created card to the list in trello API
        fetch(`https://api.trello.com/1/cards?name=${text}&idList=${idForList}&key=${key}&token=${token}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                console.log(
                    `Response: ${response.status} ${response.statusText}`
                );
                return response.text();
            })
            .catch(err => console.error(err));
        btn.previousSibling.value = ""
    }
}

// making a popup 
function cardPopUp(event) {
    let btn = event.target;

    if (btn.className === "pop-up") {
        let li = document.createElement("li");
        let popUpHeader = document.createElement("div");
        popUpHeader.classList.add("popUpHeader");
        let cardTitle = document.createElement("h2");
        cardTitle.textContent = btn.textContent;
        cardTitle.classList.add("heading1");
        let removeDescription = document.createElement("button");
        removeDescription.textContent = "X";
        removeDescription.classList.add("close");
        let heading1 = document.createElement("h3");
        heading1.textContent = "Description";
        let inputBtn1 = document.createElement("input");
        inputBtn1.type = "text";
        inputBtn1.classList.add("descriptionList");
        inputBtn1.placeholder = "Add description here";
        let saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        saveBtn.classList.add("save1");
        let crossBtn = document.createElement("button");
        crossBtn.textContent = "Cancel";
        crossBtn.classList.add("cross-btn");
        let div3 = document.createElement("div");
        div3.classList.add("description-div");
        let heading2 = document.createElement("h3");
        heading2.textContent = "Activity";
        let div4 = document.createElement("div");
        div4.classList.add("comment-div");
        let inputBtn2 = document.createElement("input");
        inputBtn2.type = "text";
        inputBtn2.classList.add("commentList");
        inputBtn2.placeholder = "Add a comment";
        let saveBtn1 = document.createElement("button");
        saveBtn1.textContent = "Save";
        saveBtn1.classList.add("save2");
        let watch = document.createElement("button");
        watch.textContent = "Delete";
        watch.classList.add("watch-btn");
        let div5 = document.createElement("div");
        div5.classList.add("comment-saving");
        popUpHeader.append(cardTitle, removeDescription);
        div3.append(saveBtn, crossBtn);
        div5.append(saveBtn1, watch);
        li.append(popUpHeader, heading1, inputBtn1, div3, heading2, div4, inputBtn2, div5);
        description.append(li);
        cardName = cardTitle.textContent
        form.style.pointerEvents = "none";
        ul.style.pointerEvents = "none";
        removeDescription.addEventListener("click", removePopUp);
        saveBtn.addEventListener("click", addDescription);
        saveBtn1.addEventListener("click", addComment);
    }

    let cardValue = document.querySelector(".heading1")
    let cardValueText = cardValue.innerText

    for (let index = 0; index < listID.length; index++) {
        fetch(`https://api.trello.com/1/lists/${listID[index].id}/cards/?key=${key}&token=${token}`).then((cardData) => {
            return cardData.json()
        }).then((cardData) => {
            let cards = cardData;
            for (let card in cards) {
                if (cardValueText === cards[card].name) {
                    cardID = cards[card].id;
                    fetch(`https://api.trello.com/1/cards/${cardID}?key=${key}&token=${token}`, {
                            method: 'GET',
                            headers: {
                                'Accept': 'application/json'
                            }
                        })
                        .then(response => {
                            console.log(
                                `Response: ${response.status} ${response.statusText}`
                            );
                            return response.text();
                        })
                        .then(text => {
                            let textObj = JSON.parse(text);
                            let descText = textObj.desc;
                            if (descText !== "") {
                                let btn = event.target;

                                let descrip = document.querySelector(".save1")
                                let cancelbtn = document.querySelector(".cross-btn")
                                let div = document.querySelector(".description-div")
                                let descr = document.querySelector(".descriptionList")
                                descrip.style.display = "none";
                                descr.style.display = "none";
                                cancelbtn.style.display = 'none';
                                let data = document.createElement("p");
                                data.classList.add("data-description");
                                data.textContent = descText;
                                div.appendChild(data);
                            }
                        })
                        .catch(err => console.error(err));

                    fetch(`https://api.trello.com/1/cards/${cardID}/actions/?filter=commentCard&key=${key}&token=${token}`, {
                            method: 'GET',
                            headers: {
                                'Accept': 'application/json'
                            }
                        })
                        .then(response => {
                            console.log(
                                `Response: ${response.status} ${response.statusText}`
                            );
                            return response.text();
                        })
                        .then(text => {
                            let textObj = JSON.parse(text);
                            for (let commentText in textObj) {
                                let commentDiv = document.querySelector(".comment-div");
                                let commentToPut = document.createElement("p");
                                commentToPut.innerText = textObj[commentText].data.text;
                                commentToPut.classList.add("comments");
                                commentDiv.append(commentToPut);
                            }
                        })
                        .catch(err => console.error(err));

                    let watch = document.querySelector(".watch-btn")
                    watch.addEventListener("click", (event) => {
                        let btn = event.target;
                        let com = btn.parentElement.previousSibling.previousSibling.lastElementChild;
                        // fetch(`https://api.trello.com/1/cards/${cardID}/actions/?filter=commentCard&key=${key}&token=${token}`, {
                        //         method: 'GET',
                        //         headers: {
                        //             'Accept': 'application/json'
                        //         }
                        //     })
                        //     .then(response => {
                        //         console.log(
                        //             `Response: ${response.status} ${response.statusText}`
                        //         );
                        //         return response.text();
                        //     })
                        //     .then(text => {
                        //         let textObj = JSON.parse(text);
                        //         for (let commentText in textObj) {
                        //             if (com.innerText == textObj[commentText].data.text) {
                        //                 commentId = textObj[commentText].id;
                        //                 fetch(`https://api.trello.com/1/cards/${cardID}/actions?${commentId}/comments&key=${key}&token=${token}`, {
                        //                         method: 'DELETE'
                        //                     })
                        //                     .then(response => {
                        //                         console.log(
                        //                             `Response: ${response.status} ${response.statusText}`
                        //                         );
                        //                         return response.text();
                        //                     })
                        //                     .then(text => console.log(text))
                        //                     .catch(err => console.error(err));
                        //             }
                        //         }
                        //     })
                        //     .catch(err => console.error(err));
                        com.remove();
                    });
                }
            }
        });
    }
}

function removePopUp(event) {
    form.style.pointerEvents = "all";
    ul.style.pointerEvents = "all";
    let btn = event.target;
    btn.parentElement.parentElement.remove();
}

function addDescription(event) {
    let btn = event.target;
    let secondChildElement = btn.nextSibling;
    let data = document.createElement("p");
    data.classList.add("data-description");
    if (btn.parentElement.previousSibling.value == "") {
        alert("Please enter a description..");
        return false;
    }
    data.textContent = btn.parentElement.previousSibling.value;
    console.log(data);
    btn.parentElement.previousSibling.style.display = "none";
    btn.parentElement.append(data);
    let cardValue = document.querySelector(".heading1")
    let cardValueText = cardValue.innerText

    btn.remove();
    secondChildElement.remove();

    let descData = data.textContent;
    console.log(descData);
    for (let index = 0; index < listID.length; index++) {
        fetch(`https://api.trello.com/1/lists/${listID[index].id}/cards/?key=${key}&token=${token}`).then((cardData) => {
            return cardData.json()
        }).then((cardData) => {
            let cards = cardData;
            for (let card in cards) {
                if (cardValueText === cards[card].name) {
                    cardID = cards[card].id;
                    fetch(`https://api.trello.com/1/cards/${cardID}?key=${key}&token=${token}&desc=${descData}`, {
                            method: 'PUT',
                            headers: {
                                'Accept': 'application/json'
                            }
                        })
                        .then(response => {
                            console.log(
                                `Response: ${response.status} ${response.statusText}`
                            );
                            return response.text();
                        })
                        .then(text => console.log(text))
                        .catch(err => console.error(err));
                }
            }
        });
    }
}

function addComment(event) {
    let btn = event.target;
    if (btn.className === "save2") {
        let commentData = document.createElement("p");
        commentData.classList.add("comments");
        let commentArea = document.querySelector(".comment-div")
        let cardValue = document.querySelector(".heading1")
        let cardValueText = cardValue.innerText

        commentData.textContent = btn.parentElement.previousSibling.value;
        if (commentData.textContent === "") {
            alert("Please Enter a comment...");
            return false;
        }
        commentArea.appendChild(commentData);
        btn.parentElement.previousSibling.value = "";

        for (let index = 0; index < listID.length; index++) {
            fetch(`https://api.trello.com/1/lists/${listID[index].id}/cards/?key=${key}&token=${token}`).then((cardData) => {
                return cardData.json()
            }).then((cardData) => {
                let cards = cardData;
                for (let card in cards) {
                    if (cardValueText === cards[card].name) {
                        cardID = cards[card].id;
                        fetch(`https://api.trello.com/1/cards/${cardID}/actions/comments?text=${commentData.textContent}&key=${key}&token=${token}`, {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json'
                                }
                            })
                            .then(response => {
                                console.log(
                                    `Response: ${response.status} ${response.statusText}`
                                );
                                return response.text();
                            })
                            .then(text => console.log(text))
                            .catch(err => console.error(err));
                    }
                }
            });
        }
    }
}

function removeList(event) {
    let btn = event.target;

    if (btn.innerText === "REMOVE") {
        btn.parentElement.remove();
        let nameOfObj = event.target.parentElement.firstElementChild.textContent;
        for (let index = 0; index < listID.length; index++) {
            if (nameOfObj === listID[index].name) {
                idForList = listID[index].id;
            }
        }

        fetch(`https://api.trello.com/1/lists/${idForList}/closed?value=true&key=${key}&token=${token}`, {
                method: 'PUT'
            })
            .then(response => {
                console.log(
                    `Response: ${response.status} ${response.statusText}`
                );
                return response.text();
            })
            .then(text => console.log(text))
            .catch(err => console.error(err));
    }
}

function renderui(response) {
    response.forEach(element => {
        let ids = element.id;
        let names = element.name;
        let listIDo = {
            id: ids,
            name: names
        };
        listID.push(listIDo);

        let li = document.createElement("li");
        let span = document.createElement("span");
        span.innerText = element.name;
        let div = document.createElement("div");
        div.classList.add("jsList");
        let inputText = document.createElement("input");
        inputText.classList.add("inputValue");
        inputText.setAttribute("type", "text");
        inputText.placeholder = "+ Add a Card..";
        let addButton = document.createElement("button");
        addButton.classList.add("cardButton", "submit");
        addButton.innerText = "ADD";
        let removeBtn = document.createElement("button");
        removeBtn.classList.add("cardButton");
        removeBtn.innerText = "REMOVE";

        li.appendChild(span);
        li.appendChild(div);
        li.appendChild(inputText);
        li.appendChild(addButton);
        li.appendChild(removeBtn);
        ul.appendChild(li);

        fetch(`https://api.trello.com/1/lists/${element.id}/cards?key=${key}&token=${token}`).then((cardData) => {
            return cardData.json()
        }).then((cardData) => {
            cardData.forEach(card => {
                if (element.id === card.idList) {
                    const cardTitle = document.createElement("p");
                    cardTitle.classList.add("pop-up");
                    cardTitle.setAttribute("draggable", "true");
                    cardTitle.innerText = card.name;
                    div.appendChild(cardTitle);
                }
            })

            // const draggables = document.querySelectorAll('.draggable')
            // const containers = document.querySelectorAll('.container')

            // draggables.forEach(draggable => {
            //     draggable.addEventListener('dragstart', () => {
            //         draggable.classList.add('dragging')
            //     })

            //     draggable.addEventListener('dragend', () => {
            //         draggable.classList.remove('dragging')
            //     })
            // })

            // containers.forEach(container => {
            //     container.addEventListener('dragover', e => {
            //         e.preventDefault()
            //         const afterElement = getDragAfterElement(container, e.clientY)
            //         const draggable = document.querySelector('.dragging')
            //         if (afterElement == null) {
            //             container.appendChild(draggable)
            //         } else {
            //             container.insertBefore(draggable, afterElement)
            //         }
            //     })
            // })
        });
        addButton.addEventListener("click", addCard);
        removeBtn.addEventListener("click", removeList);
    })

}

function start() {

    fetch(`https://api.trello.com/1/board/${idBoard}/lists?&key=${key}&token=${token}`).then((listData) => {
        return listData.json()
    }).then((listData) => {
        renderui(listData)
    });
}

start();