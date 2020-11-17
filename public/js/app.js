 var db = firebase.firestore();

const tareaform = document.querySelector("#formulario-tareas");
const tareacontenedor = document.querySelector("#tareas-contenedor");
//variable para ver si agrega o edita
let editstatus = false;
let id;


//guardar tarea
const guardatarea = (titulo, descripcion) => {
    db.collection('tareas').doc().set({
        titulo,
        descripcion
    });
    alertify.success('Tarea guardada con exito!');
}
//traer tarea
const getTareas = () => db.collection('tareas').get();
//traer tareas y refrescar en cada accion
const ongettareas = (callback) => db.collection('tareas').onSnapshot(callback);

//eliminar una tarea
const deletetarea = id => db.collection('tareas').doc(id).delete();

//obtener un tarea
const gettarea = (id) => db.collection('tareas').doc(id).get();

//edita una tarea
const modificartarea = (id, modificatarea) => db.collection('tareas').doc(id).update(modificatarea);


window.addEventListener('DOMContentLoaded', async (e) => {
    //cuando llega una nueva tarea
    ongettareas((querySnapshot) => {
        tareacontenedor.innerHTML = '';
        querySnapshot.forEach(doc => {
            //conjunto de datos raros
            const task = doc.data();
            task.id = doc.id;
            tareacontenedor.innerHTML += `
            <div class="card card-body mt-2">
                <h5>${task.titulo}</h5>
                <p>${task.descripcion}</p>
                <div>
                    <button class="btn btn-danger btn-delete" data-id="${task.id}">Borrar</button>
                    <button class="btn btn-primary btn-edit" data-id="${task.id}" >Eliminar</button>
                </div>
            </div>
            `;

            //para eliminar
            const btnsDelete = document.querySelectorAll(".btn-delete");
            btnsDelete.forEach(btn => {
                btn.addEventListener("click", async (e) => {
                    await deletetarea(e.target.dataset.id);
                    alertify.error('Borrado con exito !');
                })
            });
            //para editar
            const btnsEdit = document.querySelectorAll(".btn-edit");
            btnsEdit.forEach(btn => {
                btn.addEventListener("click", async (e) => {
                    const tarea = await gettarea(e.target.dataset.id);
                    const task = tarea.data();
                    tareaform["titulo-tarea"].value = task.titulo;
                    tareaform["descripcion-tarea"].value = task.descripcion;
                    editstatus = true;
                    //llamamos al boton de btn-task form 
                    tareaform["btn-tarea"].innerText = 'update';
                    id = tarea.id;
                    //console.log(id);
                })
            })
        })
    })
});




tareaform.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const titulo = tareaform["titulo-tarea"].value;
    const descripcion = tareaform["descripcion-tarea"].value;
    //si el estado es falso guarda sino edita
    if (!editstatus) {
            await guardatarea(titulo, descripcion); 
       
    } else {
        //si es editalo
        await modificartarea(id, {
            titulo: titulo,
            descripcion: descripcion
        })
        editstatus = false;
        tareaform["btn-tarea"].innerHTML = "Guardar tarea";
        alertify.success('Modificado con exito !');
    }
    tareaform.reset();
}); 
