import './main.scss'
import { io } from "socket.io-client";
 
const socket = io("https://whispering-chamber-09886.herokuapp.com");
// const socket = io("http://localhost:3000/");

let messagesTab = []
const messagesContainer = document.getElementById('messagesContainer')
let usersTab = []
const userContainer = document.getElementById('users')

socket.emit('getUsers')
socket.emit('getMessages')

function goFrontUser(user) {
  if (document.getElementById(user.id) === null) {
    const tag = document.createElement("p")
    tag.setAttribute("id", user.id);
    if (user.id === socket.id) {
      tag.setAttribute("class", "myUser");
    }
    var text = document.createTextNode(user.name);
    tag.appendChild(text);
    userContainer.appendChild(tag)
  }
}

function goFrontMessage(message) {
  if (message.value != '' && message.value.trim()!= '' ) {
    if (message.type === null) {
      if (document.getElementById(message.id) === null) {
        const contenerMessage = document.createElement("div")
        const mes = document.createElement("p")
        const label = document.createElement("span")
        mes.setAttribute("id", message.id)
        contenerMessage.setAttribute("class", 'contenerMessage')
        if (message.user.id === socket.id) {
          contenerMessage.setAttribute("class", 'contenerMessageMe')
          mes.setAttribute("class", 'myMessages')
          label.setAttribute("class", 'myLabelUsername')
        }
        const text = document.createTextNode(message.value)
        const username = document.createTextNode(message.user.name)
        label.appendChild(username)
        mes.appendChild(text)
        contenerMessage.appendChild(label)
        contenerMessage.appendChild(mes)
        messagesContainer.appendChild(contenerMessage)
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  }
}

const promiseUsers = new Promise((resolve) => {
  socket.on('users', (users) => {
    usersTab = users
    resolve()
  })
})
promiseUsers.then(() => {
  usersTab.forEach((user) => {
    goFrontUser(user)
  });
});

const promiseMessages = new Promise( (resolve) => {
  socket.on('messages', (messages) => {
    messagesTab = messages.filter((message) => {
      return !!message.value
    })
    resolve()
  })
})
promiseMessages.then(() => {
  messagesTab.forEach((message) => {
    goFrontMessage(message)
  });
});


socket.emit('user')
socket.on('userConnection', (user) => {
  if (document.getElementById(user.id) === null) {
    goFrontUser(user)
    usersTab.push(user)
  }
})

socket.on('userDisconnection', (userDisconnected) => {
  const index = usersTab.findIndex(user => user.id === userDisconnected.id)
  usersTab.splice(index, 1);
  const contenerUserDisconnected = document.getElementById(userDisconnected.id)
  if (contenerUserDisconnected) {
    contenerUserDisconnected.remove()
  }
})

const buttonSend = document.querySelector("#buttonSend");
buttonSend.addEventListener("click", 
  () => {
    const input = document.querySelector("#inputMessage")
    if (input.value != '') {
      socket.emit('message', input.value)
      input.value = ''
    }
  },
  false
);

socket.on('message', (message) => {
  if (message.value) {
    goFrontMessage(message)
  }
})

socket.on('updateUsername', (userChangeName) => {
  const userChange = usersTab.findIndex(user => user.id === userChangeName.id)
  usersTab[userChange].name = userChangeName.name
  document.getElementById(userChangeName.id).innerHTML = userChangeName.name
})


const buttonSet = document.querySelector("#buttonSet");
buttonSet.addEventListener("click", 
  () => {
    const input = document.querySelector("#inputUsername")
    if (input.value != '' && input.value.trim()!= '' ) {
      socket.emit('setUsername', input.value)
      input.value = ''
      document.querySelector('.firstPage').style.display = "none"
    }
  },
  false
);

const buttonChat = document.querySelector("#goChat");
buttonChat.addEventListener("click", 
  () => {
    document.querySelector('.homeContainer').style.display = "none"
  },
  false
);

const buttonOnline = document.querySelector("#online");
buttonOnline.addEventListener("click", 
  () => {
    document.querySelector('.main').style.display = "none"
    document.querySelector('#userContainer').style.display = "block"
  },
  false
);

const buttonBackMain = document.querySelector("#backMain");
buttonBackMain.addEventListener("click", 
  () => {
    document.querySelector('.main').style.display = "block"
    document.querySelector('#userContainer').style.display = "none"
  },
  false
);

const buttonBackWorld = document.querySelector("#backWorld");
buttonBackWorld.addEventListener("click", 
  () => {
    document.querySelector('.homeContainer').style.display = "block"
  },
  false
);


///////////////////////////////////////////////////////////////////////////

const clock = setInterval(function(){myTimer()}, 1000);
const heureTime1 = document.getElementById('heures1')
const secTime1 = document.getElementById('secondes1')
const minTime1 = document.getElementById('minutes1')

const heureTimeE = document.getElementById('heuresE')
const secTimeE = document.getElementById('secondesE')
const minTimeE = document.getElementById('minutesE')

const heureTimeAs = document.getElementById('heuresAs')
const secTimeAs = document.getElementById('secondesAs')
const minTimeAs = document.getElementById('minutesAs')

const heureTimeAm = document.getElementById('heuresAm')
const secTimeAm = document.getElementById('secondesAm')
const minTimeAm = document.getElementById('minutesAm')

const heureTimeAf = document.getElementById('heuresAf')
const secTimeAf = document.getElementById('secondesAf')
const minTimeAf = document.getElementById('minutesAf')

const sec = [secTimeE, secTimeAs, secTimeAm, secTimeAf, secTime1]
const min = [minTimeE, minTimeAs, minTimeAm, minTimeAf, minTime1]
const heure = [heureTimeE, heureTimeAf, heureTime1]

function myTimer() {
  var d = new Date();
  
  var s = d.getSeconds();
  var m = d.getMinutes();
  var h = d.getHours();
  
  let HAs = h + 7
  if (HAs > 23) {
    HAs = HAs - 24
  }
  heureTimeAs.innerHTML = HAs
  let HAm = h - 6
  if (HAm < 1) {
    HAm = HAm + 24
  }
  heureTimeAm.innerHTML = HAm

  heure.forEach((heure)=> {
    heure.innerHTML = h
  })

  sec.forEach((seconde)=> {
    seconde.innerHTML = s
  })

  min.forEach((minute)=> {
    minute.innerHTML = m
  })

}

////////////////////////////////////////////////////////

let bgEllipse = document.querySelectorAll('.bg-ellipse');

const rand = (multi) => {
  return parseInt(multi * Math.random() ,10);
}

let ww = window.innerWidth;
let wh = window.innerHeight;

// define biggest possible value as constraint
let constraint = Math.min(ww+1000, wh+500);

function move(){
  bgEllipse.forEach((div) => {

    let w = rand(constraint);
    let x = rand((ww - w));
    let y = rand((wh - w));

    div.style.width = w + 'px'; 
    div.style.height = w + 'px'; 
    div.style.top = y + 'px'; 
    div.style.left = x + 'px';
    
    div.style.transition = (rand(100) + 900) + 'ms';

  });
}

window.setInterval(move, 1000);


////////////////////////////////////////////////////

// function getRandomInt(max) {
//   return Math.floor(Math.random() * max);
// }

// let orbites = document.querySelectorAll('.orbite');

// function orbitesMove() {
//   orbites.forEach((orbite)=> {
//     const dir = getRandomInt(10)*10
//     console.log(dir)
//     orbite.style.top = '50%'; 
//     orbite.style.left = dir + '%';
//     orbite.style.transition = 800 + 'ms';
//   })
// }

// window.setInterval(orbitesMove, 1500)