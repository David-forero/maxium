const btnDepartamentos = document.getElementById('btn-departamentos'),
	  btnCerrarMenu = document.getElementById('btn-menu-cerrar'),
	  grid = document.getElementById('grid'),
	  contenedorEnlacesNav = document.querySelector('#menu .contenedor-enlaces-nav'),
	  contenedorSubCategorias = document.querySelector('#grid .contenedor-subcategorias'),
	  esDispositivoMovil = () => window.innerWidth <= 800;

btnDepartamentos.addEventListener('mouseover', () => {
	if(!esDispositivoMovil()){
		grid.classList.add('activo');
	}
});

grid.addEventListener('mouseleave', () => {
	if(!esDispositivoMovil()){
		grid.classList.remove('activo');
	}
});

document.querySelectorAll('#menu .categorias a').forEach((elemento) => {
	elemento.addEventListener('mouseenter', (e) => {
		if(!esDispositivoMovil()){
			document.querySelectorAll('#menu .subcategoria').forEach((categoria) => {
				categoria.classList.remove('activo');
				if(categoria.dataset.categoria == e.target.dataset.categoria){
					categoria.classList.add('activo');
				}
			});
		};
	});
});

// EventListeners para dispositivo movil.
document.querySelector('#btn-menu-barras').addEventListener('click', (e) => {
	e.preventDefault();
	if(contenedorEnlacesNav.classList.contains('activo')){
		contenedorEnlacesNav.classList.remove('activo');
		document.querySelector('body').style.overflow = 'visible';
	} else {
		contenedorEnlacesNav.classList.add('activo');
		document.querySelector('body').style.overflow = 'hidden';
	}
});

// Click en boton de todos los departamentos (Para version movil).
btnDepartamentos.addEventListener('click', (e) => {
	e.preventDefault();
	grid.classList.add('activo');
	btnCerrarMenu.classList.add('activo');
});

// Boton de regresar en el menu de categorias
document.querySelector('#grid .categorias .btn-regresar').addEventListener('click', (e) => {
	e.preventDefault();
	grid.classList.remove('activo');
	btnCerrarMenu.classList.remove('activo');
});

document.querySelectorAll('#menu .categorias a').forEach((elemento) => {
	elemento.addEventListener('click', (e) => {
		if(esDispositivoMovil()){
			contenedorSubCategorias.classList.add('activo');
			document.querySelectorAll('#menu .subcategoria').forEach((categoria) => {
				categoria.classList.remove('activo');
				if(categoria.dataset.categoria == e.target.dataset.categoria){
					categoria.classList.add('activo');
				}
			});
		}
	});
});

// Boton de regresar en el menu de categorias
document.querySelectorAll('#grid .contenedor-subcategorias .btn-regresar').forEach((boton) => {
	boton.addEventListener('click', (e) => {
		e.preventDefault();
		contenedorSubCategorias.classList.remove('activo');
	});
});

btnCerrarMenu.addEventListener('click', (e)=> {
	e.preventDefault();
	document.querySelectorAll('#menu .activo').forEach((elemento) => {
		elemento.classList.remove('activo');
	});
	document.querySelector('body').style.overflow = 'visible';
});

//scroll
window.sr = ScrollReveal();
sr.reveal('.anim');


//validation
var expresion = /\w+@+[a-z]+\.+[a-z]/;

$('#inputNombre').on('blur', function() {
	if ($('#inputNombre').val() === "") {
		$('#inputNombre').addClass('errorInput');
	}else{
		$('#inputNombre').removeClass('errorInput');
	}
})

$('#inputApellido').on('blur', function() {
	if ($('#inputApellido').val() === "") {
		$('#inputApellido').addClass('errorInput');
	}else{
		$('#inputApellido').removeClass('errorInput');
	}
})

$('#inputCi').on('blur', function() {
	if ($('#inputCi').val() === "") {
		$('#inputCi').addClass('errorInput');
	}else{
		$('#inputCi').removeClass('errorInput');
		if ($('#inputCi') === !Number) {
			$('#inputCi').addClass('errorInput');
		}
	}
})

$('#inputTelefono').on('blur', function() {
	if ($('#inputTelefono').val() === "") {
		$('#inputTelefono').addClass('errorInput');
	}else{
		$('#inputTelefono').removeClass('errorInput');
		if ($('#inputTelefono') === !Number) {
			$('#inputTelefono').addClass('errorInput');
		}
	}
})

$('#inputCorreo').on('blur', function() {
	if ($('#inputCorreo').val() === "") {
		$('#inputCorreo').addClass('errorInput');
	}else{
		$('#inputCorreo').removeClass('errorInput');
		if(!expresion.test($('#inputCorreo').val())){
			$('#inputCorreo').addClass('errorInput');
		}else{
			$('#inputCorreo').removeClass('errorInput');
		}
	}
})

$('#inputClave').on('blur', function() {
	if ($('#inputClave').val() === "") {
		$('#inputClave').addClass('errorInput');
	}else{
		$('#inputClave').removeClass('errorInput');
	}
})

$('#inputClave2').on('blur', function() {
	if ($('#inputClave2').val() === "") {
		$('#inputClave2').addClass('errorInput');
	}else{
		$('#inputClave2').removeClass('errorInput');
	}
})

$('#inputAddress').on('blur', function() {
	if ($('#inputAddress').val() === "") {
		$('#inputAddress').addClass('errorInput');
	}else{
		$('#inputAddress').removeClass('errorInput');
	}
})

$('#inputCity').on('blur', function() {
	if ($('#inputCity').val() === "") {
		$('#inputCity').addClass('errorInput');
	}else{
		$('#inputCity').removeClass('errorInput');
	}
})

$('#inputZip').on('blur', function() {
	if ($('#inputZip').val() === "") {
		$('#inputZip').addClass('errorInput');
	}else{
		$('#inputZip').removeClass('errorInput');
		if ($('#inputZip') === !Number) {
			$('#inputZip').addClass('errorInput');
		}
	}
})