//Aquí se utiliza el gstatic para traer firebase y los métodos de database.
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

/*En esta parte se inicializa la aplicación, luego desde dicha aplicación se
 trae la base de datos, y posteriormente se referencia el nodo padre "students".*/
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const studentsRef =ref(database, "students");

/*En el siguiente apartado se traen todos los elementos del modal que hace
el registro de los NUEVOS estudiantes.*/
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

/*En este otro apartado se trae el modal, así como también sus elementos,
los cuales sirven para la ACTUALIZACIÓN de los estudiantes ya creados.*/
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

//Esta función limpia los values de cada input que hay en el form del modal.
const clearModalForm =()=>{
  modalForm["nombre"].value="";
  modalForm["apellido"].value="";
  modalForm["celular"].value="";
  modalForm["email"].value="";
  modalForm["descripcion"].value="";
}

/*En esta parte se activa un escuchador de evento, el cual se dispara cuando
submit es llevado a cabo, */
modalForm.addEventListener("submit", async(e)=>{
    e.preventDefault();
    /*se capturan los valores de los inputs en variables, 
    usando los names del form.*/
    const nombre= modalForm["nombre"].value;
    const apellido= modalForm["apellido"].value;
    const celular = modalForm["celular"].value;
    const email = modalForm["email"].value;
    const descripcion =  modalForm["descripcion"].value;
    /*En la siguiente línea se usa el nodo padre referenciado para
    crearlo usando el push, dicho nodo no tiene nada adentro pero si
    tiene un identificador que se puede sacar usando .key y asignándolo
    a una variable.*/
    const oneStudentRef = await push(studentsRef, );
    const oneStudentKey = oneStudentRef.key;
    /*El siguiente es el objeto que contiene toda la información y que
    será seteado.*/
    const studentInfo = {
      id: oneStudentKey,
      nombre : nombre,
      apellido: apellido,
      celular: celular,
      email: email,
      descripcion: descripcion
    }
  /*Se usa la asincronía para setear el objeto studentInfo, en el nodo hijo
  con el nombre studentInfo.id, el cual corresponde al identificador.*/
  await set(ref(database, `students/${studentInfo.id}`), studentInfo);
  clearModalForm();
  registerModal();
})
//Esta función renderiza cada fila de la tabla.
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
  /*El siguiente segmento de código permite acceder a todos los botones con la 
  clase .is-danger, y le asigna a cada uno un evento de escucha, el cual al 
  activarse remueve al estudiante especificado. */
  const buttonsRemove = document.querySelectorAll(".is-danger");
    buttonsRemove.forEach((button)=>{
      button.addEventListener("click", ()=>{
        let dataRemoveID =  button.getAttribute('data-id')
        remove(ref(database, `students/${dataRemoveID}`));
      })
    })
    /* En el siguiente apartado se obtienen todos los botones con la clase
    .is-warning, y a cada uno se lo pone un evento de escucha, el cual al
    activarse permite traer los datos del respectivo estudiante solicitado,
    y a su vez abre el modal con todos los datos al interior de cada input.*/
  const buttonsEdit = document.querySelectorAll(".is-warning");
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
          //Aquí se utiliza localSotrage para evitar errores debido al bucle.
          localStorage.setItem("dataID",JSON.stringify(dataEditable.id))
          registerModalUpdate();
        }
      }catch(error){
        console.log(error);
      }
    })
  })
  /*A continuación se aplica un evento de escucha en el submit del modal,
  de tal modo que al hacer click todos los datos dentro de los inputs (incluidos
  los datos modificados) son usados para actualizar el estudiante especificado*/
  modalFormUpdate.addEventListener("submit", async(e)=>{
    e.preventDefault();
    /*Se sustrae el identificador desde el localStorage para así evitar los 
    problemas generados por el loop si se fuese a usar una variable.*/
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
/*Esta parte del código es un método creado previamente por firebase para así
mantener actualizado el renderizado donde se muestra la información del database.*/
onValue(studentsRef, async(snapshot)=>{
  if(snapshot.exists()){
    tbody.innerHTML = "";
    /*El Object.entries convierte un objeto en un arreglo donde cada item
    será un subarreglo, el cual tendrá dos items que representaran 
    al key y al value.*/
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

