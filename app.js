//variables

const formulario = document.querySelectorAll("form input"); // acceso a todos los input campos
let i;

const tablaa = document.querySelector(".table tbody");// aqui para limpiar html antes de inyectar datos
const BotonAgregar = document.querySelector(".btn");// referencia boton agregar en html
const BtnEliminar= document.querySelector(".table tbody")// referencia boton eliminar en html
const BtnEditar= document.querySelector(".table tbody")//referencia boton editar en html




const email = document.querySelector("#Email") // acceso al campo email para tomar su valor value
const Passwor = document.querySelector("#Password") // acceso al campo passowrd para tomar su valor value

//expresiones regulares
const regxEmail =
  /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
  const regexp_password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,15}/;

  // generar id alearorio para el objeto data
  const generateId = () => Math.random().toString(36).substr(2, 18);

  const makeRandomId= (length) => {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
   }
   return result;
}
  
  //array data donde se almacenara toda la informacion leer,agregar,editar,eliminar
  data=[];
   
// funcion escuchar eventos
Listerners();

function Listerners() {

  formulario.forEach((inpu) => {// recorro todos los inputs y le agrego un listener llamando a la funcion validarCampos
    inpu.addEventListener("blur", ValidarCampos);// captura el evento blur en email y password y pasa como parametro el target evento
  });
  BotonAgregar.addEventListener("click",AgregarDatos)// capturo evento click en boton agregar y llamo funcion agregardatos
  BtnEliminar.addEventListener("click",EliminarDatos)//capturo evento click 

  BtnEditar.addEventListener("click",EditarDatos)//capturo evento click 
  document.addEventListener("DOMContentLoaded",IniciarApp)//capturo evento cuando carga la pagina 
  
}

function IniciarApp(){
  data=JSON.parse(localStorage.getItem("Data")) || [];
  InyectarHtml(data)
}

function ValidarCampos(e) {// reutilizo la funcion validarGeneral y le paso los parametros que pide...

ValidarGeneral(e,"form-control1",regxEmail,"Esta correcto el Email","No es correcto el Email debe ser por Ejemplo:fulano@gmail.com",1); //Email
ValidarGeneral(e,"form-control2",regexp_password,"la contraseña es correcta","la contraseña debe ser ejemplo:147896VacA$",2)//clave

}

function LimpiarMsj(inputs,n){
// para limpiar los mensajes debajo de los campos el impust puede ser email,password, y botonagregar
// n  es el numero para identificar la clase de la etiqueta <p></p> donde se eliminara msj
  inputs.classList.remove("correcto");
  const Pmsj=document.querySelector(`.msj${n}`);
  Pmsj.classList.remove("pmsjBien");
  Pmsj.textContent=""
}


function msjError(msj,n){
// espera como parametro el msj  a mostrar, y n para identificar la clase de la etiqueta <p></p> donde se mostrara msj error
    const Pmsj=document.querySelector(`.msj${n}`);
    Pmsj.classList.remove("pmsjBien");
    Pmsj.classList.add("pmsjError");
    Pmsj.textContent=msj

    setTimeout(function() {
      Pmsj.remove();
  
    },3000)
    
  
}
function msjCorrecto(msj,n){
  // espera como parametro el msj  a mostrar, y n para identificar la clase de la etiqueta <p></p> donde se mostrara msj correcto
    const Pmsj=document.querySelector(`.msj${n}`);
    Pmsj.classList.remove("pmsjError")
    Pmsj.classList.add("pmsjBien");
    Pmsj.textContent=msj
    
setTimeout(function() {
  Pmsj.remove();


},3000)



}

function ValidarGeneral(ev,clase,reXg,messageBien,messageError,n){
// ev es el evento target que recibe de validar ValidarCampos
// clase es la clase del imput sea email, password
// reXg xpresion regular
// messageBien mensaje a mostrar cuano los datos se ingresan correctamente
// messageError mensaje a mostrar cuano los datos se ingresan mal
// n es el numero que identifica cada etiqueta <p class="msj1"></p> y su clase

    if (ev.target.classList.contains(clase)) {
        if (reXg.test(ev.target.value)) {
            ev.target.classList.remove("error");
            ev.target.classList.add("correcto");
          msjCorrecto(messageBien,n)
        } else {
            ev.target.classList.remove("correcto");
            ev.target.classList.add("error");
          msjError(messageError,n)
        }
      }

}

function SincronizarData(){

  localStorage.setItem("Data",JSON.stringify(data))
}


function AgregarDatos(e){
    e.preventDefault()

const ExisteEmailenData=data.some(data=>data.email===email.value)// busca en el array data si existe el 
//email y retorna true o false
const ExistePassowrdenData=data.some(data=>data.Clave===Passwor.value)


if(regxEmail.test(email.value) && regexp_password.test(Passwor.value) && ExisteEmailenData==false &&ExistePassowrdenData==false){

  tablaa.innerHTML="" // limpiar html

    const Info={//llenar objeto con la informacion de los input
        id:generateId(),// id aleatorio
        email:email.value,// valor actual del campo email
        Clave:Passwor.value // valor actual del campo password
        }
        data=[...data,Info]; // uso del spread para copiar data y agregar la informacion del objeto info
        console.log("🚀 ~ file: app.js ~ line 111 ~ AgregarDatos ~ data", data)
      
       
setTimeout(function() {// luego de un segundo agregar msj
  msjCorrecto("Has agregado tu informacion",3)
},1000)
//setTimeout(function() {// eliminar el msj
  //LimpiarMsj(BotonAgregar,3)
//},4000)
  
InyectarHtml(data)  // inyectar data en hmtl llamando a funcion
SincronizarData()
}else if(ExisteEmailenData){// si existe el email mostrar msj error
  msjError("El email ya existe",3)
}
else if(ExistePassowrdenData){
  msjError("La contraseña ya existe",3)

}
else{// si los campos estan vacios  o no cumple la expresion regular
    msjError("Debes rellenar correctamente los datos",3)

}
LimpiarMsj(email,1) //limpiar msj
email.value="";// limpiar campos
Passwor.value=""//limpiar campos

LimpiarMsj(Passwor,2) //limpiar msj

}

function EliminarDatos(e){// eliminar datos

  if(e.target.classList.contains("borrarItems")){// se recibe el target se evaluar si tiene esa clase borrarItems, si la tiene se ejecuta
    tablaa.innerHTML=""
    const IdElemento= e.target.getAttribute("data-id");// extraigo id del elemento
    console.log("🚀 ~ file: app.js ~ line 134 ~ EliminarDatos ~ IdElemento", IdElemento)
  
    data= data.filter(d=>d.id !== IdElemento) // devuelvo todos menos el id del elemento a eliminar

    InyectarHtml(data);// se vuelve a inyectar html
    msjCorrecto("Has Borrado un Email",3)
    //setTimeout(function() {// eliminar el msj
      //LimpiarMsj(BotonAgregar,3)
    //},3000)
    SincronizarData()
  }
  
}

function EditarDatos(e) {// edicion

  if(e.target.classList.contains("EditarItems") ){
    
    
    const IdElemento = e.target.getAttribute("data-id");// se recibe el id del email a editar
    console.log("🚀 ~ file: app.js ~ line 191 ~ EditarDatos ~ IdElemento", IdElemento)

  let pepra = data.findIndex(e => e.id == IdElemento)

  console.log(pepra)
  
    if (e.target.classList.contains("EditarItems") && email.value=="" & Passwor.value=="") {// se evalua q tenga la clase EditarItems y que los campos email y password esten vacios
      BotonAgregar.disabled = true; // se desactiva el boton agregar
  
      data.forEach((d) => {// recorro array data
        if (d.id === IdElemento) {// si algun id en el array data es igual al IdElemento que recibi
          // lleno los campos con los datos que quiero editar
          email.value=d.email
          Passwor.value=d.Clave
          //console.log("aqui estoy")
          msjError("Modifica el correo",1)// aggrego msj debajo de email
          msjError("Modifica la clave",2)//aggrego msj debajo de passowrd
          
        }
      }); 
    }
  // nota la primera vez al hacer click en editar entra en el primer if
   //luego del que el usuario edita los q tiene en el campo ya no entrara
   // en el primer if sino que buscara el siguiente
  
    const ExisteEmailenData = data.some((data) => data.email === email.value); // en el primer click en editar aqui dara valor true luego de q edita el campo sera false
    console.log(ExisteEmailenData)
  
    if(e.target.classList.contains("EditarItems") && regxEmail.test(email.value) && regexp_password.test(Passwor.value) && ExisteEmailenData===false){// se valua que el email y clave cumple la expresion regular y ExisteEmailenData sea false es decir ese email no esta creado en data
      
     const Nuevadata=data.map((d)=>{// mapeo data
        tablaa.innerHTML="" 
        if(d.id == IdElemento ){// evaluo si algun id en data es igual al IdElemento que recibi
        //si alguno es igual lo modifica
          d.email=email.value
          d.Clave=Passwor.value
  
          setTimeout(function() {
            msjCorrecto("Has Editado el email !",3)
          },1000)
          setTimeout(function() {  
           //LimpiarMsj(email,1)
          //LimpiarMsj(Passwor,2)
          //LimpiarMsj(BotonAgregar,3)
         email.value="";
         Passwor.value="" 
          BotonAgregar.disabled = false; 
          },3000)
          return d // retorna email y clave actualizado que se guarda en Nuevadata
        }
        else{
          return d // retorna objeto que no se modifica y se guarda en Nuevadata
        }
      }) 
      data=[...Nuevadata]
      console.log("🚀 ~ file: app.js ~ line 196 ~ EditarDatos ~ Nuevadata", Nuevadata)
      InyectarHtml(data)
      SincronizarData()
    }else{
      msjError("El correo ya existe",1)
  
    }

  }


  

}
 
function InyectarHtml(informacion){


informacion.forEach((d)=>{
  
    const {id,email,Clave}=d
const row = document.createElement("tr");
row.innerHTML=`

<td>${email}</td>
<td>${Clave}</td>
<td><a href="#" class="EditarItems" data-id="${id}">Editar</a></td>
<td><a href="#" class="borrarItems" data-id="${id}">Borrar</a></td>
`
tablaa.appendChild(row)

})

}

