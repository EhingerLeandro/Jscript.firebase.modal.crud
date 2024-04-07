import {initializeApp} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {getDatabase, ref, push, set, get, onValue, remove, child, update} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js"

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCcYozsZgYl0gzNQUgEl2UJB7vDLZFTwfA",
    authDomain: "crud-vanilla-js-firebase.firebaseapp.com",
    databaseURL: "https://crud-vanilla-js-firebase-default-rtdb.firebaseio.com",
    projectId: "crud-vanilla-js-firebase",
    storageBucket: "crud-vanilla-js-firebase.appspot.com",
    messagingSenderId: "11128907007",
    appId: "1:11128907007:web:c93aa1e146abff15f218ca"
  };

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const studentsRef =ref(database, "students");

const modal = document.querySelector("#modal");
const openModal = document.getElementById('openModal');
const closeModal = document.getElementById("closeModal");
const modalForm = document.getElementById("modalForm");
const tbody = document.getElementById("tbody");
const registerModal =()=>{
  modal.classList.toggle("is-active");
}
openModal.addEventListener("click",()=>{
  registerModal()
  clearModalForm();
});
closeModal.addEventListener("click",(e)=>{
  e.preventDefault();
  registerModal();
});

const modalUpdate = document.querySelector("#modalUpdate");
const modalFormUpdate = document.querySelector("#modalFormUpdate");
const closeModalUpdate = document.querySelector("#closeModalUpdate");
const registerModalUpdate =()=>{
  modalUpdate.classList.toggle("is-active");
}
closeModalUpdate.addEventListener("click", (e)=>{
  e.preventDefault();
  registerModalUpdate();
})

const clearModalForm =()=>{
  modalForm["nombre"].value="";
  modalForm["apellido"].value="";
  modalForm["celular"].value="";
  modalForm["email"].value="";
  modalForm["descripcion"].value="";
}

modalForm.addEventListener("submit", async(e)=>{
    e.preventDefault();
    const nombre= modalForm["nombre"].value;
    const apellido= modalForm["apellido"].value;
    const celular = modalForm["celular"].value;
    const email = modalForm["email"].value;
    const descripcion =  modalForm["descripcion"].value;
    const oneStudentRef = await push(studentsRef, );
    const oneStudentKey = oneStudentRef.key;
    const studentInfo = {
      id: oneStudentKey,
      nombre : nombre,
      apellido: apellido,
      celular: celular,
      email: email,
      descripcion: descripcion
    }
  await set(ref(database, `students/${studentInfo.id}`), studentInfo);
  clearModalForm();
  registerModal();
})

function renderRows (studentsData){
  studentsData.forEach((student)=>{
    tbody.innerHTML += `<tr>
      <td>
      <button class="button is-warning is-small btn-option" data-id="${student[0]}">
        <i class="fa-solid fa-pen"></i>
      </button>
      <button class="button is-danger is-small btn-option" data-id="${student[0]}">
        <i class="fa-solid fa-trash"></i>
      </button>
      </td>
      <td>${student[1].nombre}</td>
      <td>${student[1].apellido}</td>
      <td>${student[1].celular}</td>
      <td>${student[1].email}</td>
    </tr>`
  })

  const buttonsRemove = document.querySelectorAll(".is-danger");
    buttonsRemove.forEach((button)=>{
      button.addEventListener("click", ()=>{
        let dataRemoveID =  button.getAttribute('data-id')
        remove(ref(database, `students/${dataRemoveID}`));
      })
    })

  const buttonsEdit = document.querySelectorAll(".is-warning");
  let dataID;
  buttonsEdit.forEach((button)=>{
    button.addEventListener("click", async(e)=>{
      let dataEditID = button.getAttribute('data-id');
      try{
        let editItem = await get(ref(database, `students/${dataEditID}`));
        let dataEditable = editItem.val();
        console.log(dataEditable);
        if(editItem.exists()){
          modalFormUpdate["nombreUpdate"].value = dataEditable.nombre;
          modalFormUpdate["apellidoUpdate"].value = dataEditable.apellido;
          modalFormUpdate["celularUpdate"].value = dataEditable.celular;
          modalFormUpdate["emailUpdate"].value = dataEditable.email;
          modalFormUpdate["descripcionUpdate"].value = dataEditable.descripcion;
          localStorage.setItem("dataID",JSON.stringify(dataEditable.id))
          registerModalUpdate();
        }
      }catch(error){
        console.log(error);
      }
    })
  })
  
modalFormUpdate.addEventListener("submit", async(e)=>{
    e.preventDefault();
    let dataID =JSON.parse(localStorage.getItem("dataID"));
    const nombre= modalFormUpdate["nombreUpdate"].value;
    const apellido= modalFormUpdate["apellidoUpdate"].value;
    const celular = modalFormUpdate["celularUpdate"].value;
    const email = modalFormUpdate["emailUpdate"].value;
    const descripcion =  modalFormUpdate["descripcionUpdate"].value;
    const studentUpdate = {
     nombre:nombre,
     apellido: apellido,
     celular: celular,
     email: email,
     descripcion: descripcion
    }
    let info= await update(ref(database, `students/${dataID}`), studentUpdate);
    modalUpdate.classList.remove("is-active");
  })
}

onValue(studentsRef, async(snapshot)=>{
  if(snapshot.exists()){
    tbody.innerHTML = "";
    let studentsData = await Object.entries(snapshot.val());
    renderRows(studentsData);
  }else{
    tbody.innerHTML = `<tbody id="tbody">
    <tr>
      <td class="btn-flex">
        <button class="button is-warning is-small btn-option ">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="button is-danger is-small btn-option ">
          <i class="fa-solid fa-trash"></i>
        </button>
      </th>
      <td>........</td>
      <td>........</td>
      <td>........</td>
      <td>........</td>
      <td>........</td>
    </tr>
  </tbody>`;
  }
})

