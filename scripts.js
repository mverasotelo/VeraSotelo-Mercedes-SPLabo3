let accion = 0;

class Vehiculo{

    constructor(id, fabricante, modelo, añoLanzamiento){
        this.id = id;
        this.fabricante = fabricante;
        this.modelo = modelo;
        this.añoLanzamiento = añoLanzamiento;
    } 
        
    toString() {
        return this.id + " - " + this.fabricante + " - " + this.modelo + ", "+this.añoLanzamiento;
    } 

    toJsonString(conId) {
        if(conId){
            return JSON.stringify(this);
        }else{
            return JSON.stringify(this,['fabricante', 'modelo', 'añoLanzamiento']);
        }    
    }
}
    
class Auto extends Vehiculo{
    constructor(id, fabricante, modelo, añoLanzamiento, cantidadPuertas){
        super( id, fabricante, modelo, añoLanzamiento,);
        this.cantidadPuertas = cantidadPuertas;
    }    
    
    toString() {
        return super.toString() + " - " + this.cantidadPuertas;
    }

    toJsonString(conId) {
        if(conId){
            return JSON.stringify(this);
        }else{
            return JSON.stringify(this,['fabricante', 'modelo', 'añoLanzamiento', 'cantidadPuertas']);
        }
    }
}
    
class Camioneta extends Vehiculo{
    constructor(id, fabricante, modelo, añoLanzamiento, transmision4x4){
        super( id, fabricante, modelo, añoLanzamiento,);
        this.transmision4x4 = transmision4x4;
    }   

    toString() {
        return super.toString() + " - " + this.transmision4x4;
    }

    toJsonString(conId) {
        if(conId){
            return JSON.stringify(this);
        }else{
            return JSON.stringify(this,['fabricante', 'modelo', 'añoLanzamiento', 'transmision4x4']);
        }
    }
}
    
//Elementos HTML
const spinner = document.getElementById("spinner");
const formContainer = document.getElementById("formContainer");
const form = document.getElementById("formVehiculos");
const selectForm = document.getElementById("selectTipo");
const tabla = document.getElementById("tabla");
const tbody = document.getElementById("tbody");
const botonAceptar = document.getElementById("aceptarButton");
const lista =  document.getElementById("formularioLista");

//Generar una lista en memoria de la jerarquía de clases
let arrayVehiculos = [];

spinner.style.display="block";
fetch("https://localhost:5001/vehiculos/vehiculos",{
    method: "GET",
    headers: {"Content-type": "application/json"},
    })
    .then(response => {
        if(response.status === 200){
            return response.json();
        }
        else{
            alert(`No se ha podido realizar la operación!`)
        }
    })
    .then(data => {
        arrayVehiculos = arrayObjetosToVehiculos(data);
        cargarDatosTabla(arrayVehiculos);
    })
    .catch(err => {
        alert(`No se ha podido realizar la operación. Error: ${err.message}`)
    })
    .finally(()=>{
        spinner.style.display="none";     
})
   
function arrayObjetosToVehiculos(listaJSON){
    return listaJSON.map((elemActual)=>{
        if(elemActual.hasOwnProperty('cantidadPuertas')){
            elemActual = new Auto(elemActual.id,elemActual.fabricante,elemActual.modelo,parseInt(elemActual.añoLanzamiento),parseInt(elemActual.cantidadPuertas));
        }else if(elemActual.hasOwnProperty('transmision4x4')){
            elemActual = new Camioneta(elemActual.id,elemActual.fabricante,elemActual.modelo,parseInt(elemActual.añoLanzamiento),elemActual.transmision4x4);
        }
        return elemActual;
    });
}

function cargarDatosTabla(arrayVehiculos){
    let tablaBody = document.getElementById("tablaBody");
    vaciarTabla();
    
    if(arrayVehiculos!=null){
        for(let element of arrayVehiculos){
            let registro = document.createElement('tr');
            registro.id=element.id;
            registro.className="registro";
    
            let id = document.createElement('th');
            let fabricante = document.createElement('th');
            let modelo = document.createElement('th');
            let añoLanzamiento = document.createElement('th');    
            let cantidadPuertas = document.createElement('th');
            let transmision4x4 = document.createElement('th');    

            let eliminar = document.createElement('th');
            let botonEliminar = document.createElement('button');
            botonEliminar.innerHTML="Eliminar";
            botonEliminar.id = element.id;
            botonEliminar.name ="eliminar";
            botonEliminar.addEventListener('click',e=>{
                accion=1;
                abrirFormulario(accion,e.target.id);
            });
            eliminar.appendChild(botonEliminar);
        
            let modificar = document.createElement('th');  
            let botonModificar = document.createElement('button');
            botonModificar.id = element.id;
            botonModificar.name ="modificar";
            botonModificar.innerHTML="Modificar";
            botonModificar.addEventListener('click',e=>{
                accion=2;
                abrirFormulario(accion, e.target.id);
            });            
            modificar.appendChild(botonModificar);

            id.innerHTML = element.id;
            fabricante.innerHTML = element.fabricante;
            modelo.innerHTML = element.modelo;
            añoLanzamiento.innerHTML = element.añoLanzamiento;
    
            if(element instanceof Auto){
                cantidadPuertas.innerHTML = element.cantidadPuertas;
                transmision4x4.innerHTML = "N/A";
            }else if(element instanceof Camioneta){
                transmision4x4.innerHTML = element.transmision4x4;
                cantidadPuertas.innerHTML = "N/A";
            }
    
            registro.appendChild(id);
            registro.appendChild(fabricante);
            registro.appendChild(modelo);
            registro.appendChild(añoLanzamiento);
            registro.appendChild(cantidadPuertas);
            registro.appendChild(transmision4x4);   
            registro.appendChild(modificar);   
            registro.appendChild(eliminar);   
            tablaBody.appendChild(registro);    
        }
    }
}

function getIndiceVehiculo(id){
    for(let i=0; i<arrayVehiculos.length; i++){
        if(id == arrayVehiculos[i].id){
            return i;
        }
    }
    return null;
}

function getVehiculoById(id){
    for(let i=0; i<arrayVehiculos.length; i++){
        if(id == arrayVehiculos[i].id){
            return arrayVehiculos[i];
        }
    }
    return null;
}

//Carga los datos de un vehiculo en el form
function cargarDatos(id){
    vehiculo=getVehiculoById(id);
    if(vehiculo!=null){
        form.selectTipo.disabled=true;
        form.inputId.value=vehiculo.id;
        form.inputFabricante.value=vehiculo.fabricante;
        form.inputModelo.value=vehiculo.modelo;
        form.inputAnio.value=vehiculo.añoLanzamiento;
        
        if(vehiculo instanceof Auto){
            form.selectTipo.selectedIndex=0;
            form.inputCantPuertas.value=vehiculo.cantidadPuertas;
        }else{
            form.selectTipo.selectedIndex=1;
            form.inputTransmision.value=vehiculo.transmision4x4;    
        }
    }
    ocultarInputs();
}

document.getElementById("agregarButton").addEventListener("click", ()=>{
    accion = 0;
    abrirFormulario(0,null);
} );
    
document.getElementById("cancelarButton").addEventListener("click", ()=>{
    volverALaLista();
});

selectForm.addEventListener("change", ocultarInputs);

aceptarButton.addEventListener("click", e=>enviarSolicitud(e));

function enviarSolicitud(e){
    e.preventDefault();
    if(accion==0){
        agregarRegistro();
    }
    else if(accion==1){
        let idRegistro = (form["inputId"].value);
        eliminarRegistro(idRegistro);
    }
    else if(accion==2){
        let idRegistro = (form["inputId"].value);
        modificarRegistro(idRegistro);
    }
}

//ABM
//Agrega un registro a la lista
function agregarRegistro(){
    if(validarCampos()){
        let url="";
        let vehiculo=null;
        let modelo = form["inputModelo"].value;
        let fabricante = form["inputFabricante"].value;
        let año = parseInt(form["inputAnio"].value);
        if(selectForm.selectedIndex==0){
            url='https://localhost:5001/vehiculos/insertarauto';
            let cantPuertas = parseInt((form["inputCantPuertas"].value));
            vehiculo = new Auto(0,fabricante,modelo,año,cantPuertas);        
        }else{
            url='https://localhost:5001/vehiculos/insertarcamioneta';
            let transmision = (form["inputTransmision"].value).toUpperCase();
            vehiculo = new Camioneta(0,fabricante,modelo,año,transmision);        
        }
        peticionAgregar(url, vehiculo)
    }
}
    
//Modifica un registro existente en la lista
function modificarRegistro(idRegistro){
    if(validarCampos()){
        let url="";
        vehiculo="";
        let modelo = form["inputModelo"].value;
        let fabricante = form["inputFabricante"].value;
        let año = parseInt(form["inputAnio"].value);
        if(selectForm.selectedIndex==0){
            url='https://localhost:5001/vehiculos/modificarauto';
            let cantPuertas = parseInt((form["inputCantPuertas"].value));
            vehiculo = new Auto(idRegistro,fabricante,modelo,año,cantPuertas);        
        }else{
            url='https://localhost:5001/vehiculos/modificarcamioneta';
            let transmision = (form["inputTransmision"].value).toUpperCase();
            vehiculo = new Camioneta(idRegistro,fabricante,modelo,año,transmision);        
        }
        peticionModificar(url, vehiculo)
    }
}

//Elimina un registro de la lista
function eliminarRegistro(idRegistro){
    for(let i=0; i<arrayVehiculos.length;i++){
        if(idRegistro==arrayVehiculos[i].id){
            let id= {id:idRegistro};
            peticionEliminar(id,i);   
        }
    }
}

//PETICIONES
function peticionAgregar(url, vehiculo){

    var xhr = new XMLHttpRequest();
    xhr.open("PUT",url);
    xhr.onloadstart=function() {
        spinner.style.display="block";
    }
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(vehiculo.toJsonString(false)); 

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4){
            if(xhr.status === 200){
                response=JSON.parse(this.responseText);
                vehiculo.id=response['id'];
                arrayVehiculos.push(vehiculo);    
                cargarDatosTabla(arrayVehiculos);
            }else{
                alert(`No se ha podido realizar la operación. Error: ${xhr.status}`)
            }
            volverALaLista();
            spinner.style.display="none";
        }
    }
}    
    
async function peticionModificar(url, vehiculo){
    spinner.style.display="block";
    await fetch(url, {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(vehiculo)
    })
    .then(response=>{
        if(response.status === 200){
            indice = getIndiceVehiculo(vehiculo.id);
            if(indice!=null){
                arrayVehiculos[indice] = vehiculo;
            }
            cargarDatosTabla(arrayVehiculos);
        }
        else{
            alert(`No se ha podido realizar la operación.`)
        }
        volverALaLista();
        spinner.style.display="none";     
    }) 
}    

async function peticionEliminar(id,index){
    spinner.style.display="block";
    await fetch('https://localhost:5001/vehiculos/eliminarvehiculo', {
        method: "DELETE",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(id)
    })
    .then(response => {
        if(response.status === 200){
            arrayVehiculos.splice(index, 1);
            cargarDatosTabla(arrayVehiculos);
        }
        else{
            alert(`No se ha podido realizar la operación.`)
        }
        volverALaLista();
        spinner.style.display="none"; 
    })
}    
    

//Resetea el formulario y oculta inputs segun se trate de un Cliente o un Empleado
function resetearFormulario(){
    ocultarMensajes();
    form.reset();
    form.inputId.disabled=true;
    form.selectTipo.disabled=false;
    form.selectTipo.selectedIndex=0;
    ocultarInputs();
}
    
//Oculta inputs segun el tipo de registro
function ocultarInputs(){
if(selectForm.selectedIndex==0){
    document.getElementById("labelCantPuertas").style.display="block";
    form.inputCantPuertas.style.display="block";
    document.getElementById("labelTransmision").style.display="none";
    form.inputTransmision.style.display="none";  
}else{
    document.getElementById("labelCantPuertas").style.display="none";
    form.inputCantPuertas.style.display="none";
    document.getElementById("labelTransmision").style.display="block";
    form.inputTransmision.style.display="block";  
    }
}
    
//Elimina todos los registros de la tabla
function vaciarTabla(){
while (tablaBody.firstChild) {
    tablaBody.removeChild(tablaBody.firstChild);
    }   
}

function volverALaLista(){
    resetearFormulario();
    lista.style.display="block"; 
    formContainer.style.display="none";
}

//Abre el Formulario ABM dependiendo de la peticion
function abrirFormulario(accion,id){
    if(accion==0){
        resetearFormulario();
        document.getElementById("encabezadoForm").innerHTML="Alta";
    }
    else if(accion==1){
        cargarDatos(id);
        document.getElementById("encabezadoForm").innerHTML="Eliminar";
    }else{
        cargarDatos(id);
        document.getElementById("encabezadoForm").innerHTML="Modificar";
    }
    lista.style.display="none";
    formContainer.style.display="block";
}

//VALIDACIONES CAMPOS
function validarCampos(){
    let validacion = false;
    if(validarAnio() && form["inputFabricante"].value!=null && form["inputModelo"].value!=null){
        if(selectForm.selectedIndex==0){
            if(validarCantidadPuertas()){
                validacion = true;
            }
        }else{
            if(validarTransmision4x4()){
                validacion = true;
            }
        }
    }
    return validacion;
}

function ocultarMensajes(){
    let mensajes = document.getElementsByName("errorValidacion");
    for(let m of mensajes){
        m.style.display="none";
    }
}

function validarAnio(){
    const mensaje = document.getElementById("validacionAnio");
    let retorno = false;
    let año = form["inputAnio"].value;
    if(año%1==0 && año>1920){
        retorno = true;
        mensaje.style.display = "none";
    }else{
        mensaje.innerHTML =  `${año} no es un año válido`;
        mensaje.style.display = "block";
    }
    return retorno;
}

function validarCantidadPuertas(){
    const mensaje = document.getElementById("validacionCantPuertas");
    let retorno = false;
    let cantPuertas = form["inputCantPuertas"].value;
    if(cantPuertas%1==0 && cantPuertas>=2){
        retorno = true;
        mensaje.style.display = "none";
    }else{
        mensaje.innerHTML =  `${cantPuertas} no es una cantidad de puertas válida`;
        mensaje.style.display = "block";
    }
    return retorno;
}

function validarTransmision4x4(){
    let retorno = false;
    const mensaje = document.getElementById("validacionTransmision");
    let transmision = form["inputTransmision"].value;
    if(transmision.toLowerCase()=='si' || transmision.toLowerCase()=='no') {
        retorno = true;
        mensaje.style.display = "none";
    }else{
        mensaje.innerHTML =  `${transmision} no es un valor válido`;
        mensaje.style.display = "block";
    }
    return retorno;
}