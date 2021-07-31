let btn = document.getElementById("submitbtn");
let get_data = [];
btn.addEventListener("click", async (e) => {
  e.preventDefault();
  let length = get_data.length + 1;
  let inputvalue = document.getElementById("inputtext").value;
  if (inputvalue == "") {
    alert("Task cannot be empty");
  } else {
    const data = {
      taskname: inputvalue,
      date: Date.now(),
    };
    document.getElementById(
      "alltasks"
    ).innerHTML += `<div class="card" id=${length}card>
        <p class="text">${length}.</p>
        <p id=${length}para ondblclick="doubleclick(this.id)" class="enteredtext">${inputvalue}</p>
        <button id=${length} class="delbtn" onclick="deleteitem(this.id)"><i style="font-size:20px" class="fa">&#xf014;</i></button>
    </div>`;
    const res = await fetch("/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let data_res = await res.json();
    //console.log('I have received response', data_res)
    document.getElementById("inputtext").value = "";
    getInfo();
  }
});

async function getInfo() {
  const response = await fetch("/info");
  get_data = await response.json();
  get_data.sort(function (a, b) {
    return new Date(a.date) - new Date(b.date);
  });
}

async function writehtml() {
  await getInfo();
  console.log(get_data);
  // get_data.forEach((element) => {
  //   document.getElementById("alltasks").innerHTML += `<div class="card" id=${element.index}card>
  //       <p class="text">Task:</p>
  //       <p id=${element.index}para ondblclick="doubleclick(this.id)" class="enteredtext">${element.taskname}</p>
  //       <button id=${element.index} class="delbtn" onclick="deleteitem(this.id)">Delete</button>
  //   </div>`;
  // });
  for (var i = 0; i < get_data.length; i++) {
    let element = get_data[i].taskname;
    let style = get_data[i].style;
    let index = i + 1;
    document.getElementById(
      "alltasks"
    ).innerHTML += `<div class="card" id=${index}card>
         <p class="text">${index}.</p>
         <p id=${index}para ondblclick="doubleclick(this.id)" class="enteredtext" style="text-decoration: ${style};" >${element}</p>
         <button id=${index} class="delbtn" onclick="deleteitem(this.id)"><i style="font-size:20px" class="fa">&#xf014;</i></button>
     </div>`;
  }
}

async function deleteitem(index) {
  let del_element = {
    element: get_data[index - 1].taskname,
  };
  document.getElementById(`${index}card`).remove();
  await fetch("/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(del_element),
  }).catch(console.error);
  document.getElementById("alltasks").innerHTML = "";
  writehtml();
}

//document.getElementsByClassName('.enteredtext').addEventListener('dblclick', doubleclick())
async function doubleclick(index) {
  let idvar = document.getElementById(index).innerText;
  let element_data = {
    element: idvar,
  };

  let response = await fetch("/cross", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(element_data),
  }).catch(console.error);
  document.getElementById(index).style.textDecoration = "line-through";
  // console.log('this should be crossed')
  // style="text-decoration: line-through;"
}
