var bd = firebase.firestore();

const form = document.querySelector("#formulario-tareas");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const titulo = form["titulo-tarea"].value;
    const descripcion = form["descripcion-tarea"].value;
    console.log(titulo, descripcion);
    const resp = await bd.collection('tareas').doc().set({
        titulo,
        descripcion
    })
    console.log(resp);
})