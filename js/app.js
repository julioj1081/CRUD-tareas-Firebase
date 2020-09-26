/*importacion de firebase firebase se encargara de crear la base de datos como si fuera nosql*/
var db = firebase.firestore();

const taskForm = document.querySelector("#task-form");
const taskContainer = document.querySelector("#task-container");
//variable se utilizara para modificar y saber si se modifica o se agrega
let editStatus = false;
let id;
const saveTask = (title, description) =>{
    db.collection('tasks').doc().set({
        title,
        description
    });
}
//traer tareas
const getTasks = () => db.collection('tasks').get();
//traer tarea para refrescar cada vez que haya una accion nueva
const onGetTasks = (callback) => db.collection('tasks').onSnapshot(callback);

//eliminar una tarea necesitamos un id unico
const deleteTask = id => db.collection('tasks').doc(id).delete();

//obtener tareas
const getTask = (id) => db.collection('tasks').doc(id).get();

//edita una tarea
const updateTask = (id, updatedTask) => db.collection('tasks').doc(id).update(updatedTask);

window.addEventListener('DOMContentLoaded', async (e) =>{
    //cuando llegue una nueva tarea
    onGetTasks((querySnapshot) =>{
        //para evitar que se repitan datos anteriores agregamos esto 
        taskContainer.innerHTML = '';
        // y luego llenas los datos
        querySnapshot.forEach(doc =>{

            //es un conjunto raro por eso solo llamamos a doc que contiene todos los datos
            const task = doc.data();
            //llamamos el id que nonos devuelve el doc.data
            task.id = doc.id;
            taskContainer.innerHTML += `
                <div class="card card-body mt-2">
                <h5>${task.title}</h5>
                <p>${task.description}</p>
                <div>
                    <button class="btn btn-danger btn-delete" data-id="${task.id}">Delete</button>
                    <button class="btn btn-primary btn-edit" data-id="${task.id}" >Edit</button>
                </div>
                </div>
            `;
            //boton eliminar
            const btnsDelete = document.querySelectorAll(".btn-delete");
            btnsDelete.forEach(btn  => {
                btn.addEventListener("click", async (e) => {
                    //podemos ver el id unico que nos ofrece firebase
                    //console.log(e.target.dataset.id);
                    await deleteTask(e.target.dataset.id);
                })
            });
            //boton eliminar
            const btnsEdit = document.querySelectorAll(".btn-edit");
            btnsEdit.forEach(btn => {
                btn.addEventListener("click", async (e) => {
                    //podemos ver el taget
                    //console.log(e.target.dataset.id);
                    const tarea = await getTask(e.target.dataset.id);
                    //console.log(tarea.data());
                    const task = tarea.data();
                    taskForm["task-title"].value = task.title; 
                    taskForm["task-description"].value = task.description;
                    editStatus = true;
                    //llamamos el boton de btn-task-form y lo cambiamos de guardar a update
                    taskForm["btn-task-form"].innerText = 'Update';
                    id = tarea.id;
                    //console.log(id);
                })
            })
        })
    })
    
    
})


taskForm.addEventListener('submit', async(e) =>{
    e.preventDefault();

    const title = taskForm["task-title"].value;
    const description = taskForm["task-description"].value;
    //si es falso guarda uno nuevo
    if(!editStatus){
    await saveTask(title, description);
    console.log(title, description);
    }else{
        //si el estado es lo contrario editalo
        await updateTask(id, {
            title: title,
            description : description
        })
        editStatus = false;
        taskForm["btn-task-form"].innerText = "Save new Task";
    }
     //elimina los valores anteriores
     taskForm.reset();
});


