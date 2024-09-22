document.addEventListener('DOMContentLoaded', (event) => {
    const nombreGastoInput = document.getElementById('nombreGasto');
    const valorGastoInput = document.getElementById('valorGasto');
    const descripcionGastoInput = document.getElementById('descripcionGasto');
    const botonFormulario = document.getElementById('botonFormulario');
    const mostrarTablaButton = document.getElementById('mostrarTabla');

    nombreGastoInput.addEventListener('input', () => validarTexto(nombreGastoInput));
    valorGastoInput.addEventListener('input', () => validarNumero(valorGastoInput));
    descripcionGastoInput.addEventListener('input', () => validarTexto(descripcionGastoInput));

    botonFormulario.addEventListener('click', clickBoton);
    mostrarTablaButton.addEventListener('click', mostrarTablaGastos);
});

let listaGastos = [];
let totalGastos = 0;

function clickBoton() {
    const nombreGasto = document.getElementById('nombreGasto').value.trim();
    const valorGasto = parseFloat(document.getElementById('valorGasto').value);
    const descripcionGasto = document.getElementById('descripcionGasto').value.trim();

    if (!nombreGasto || isNaN(valorGasto) || !descripcionGasto) {
        alert('Por favor ingrese un dato válido.');
        return;
    }

    if (/\d/.test(nombreGasto) || /\d/.test(descripcionGasto)) {
        alert('Solo se permiten letras en los campos de nombre y detalle.');
        return;
    }

    if (nombreGasto.split(' ').length > 3 || descripcionGasto.split(' ').length > 3) {
        alert('Solo se permiten tres palabras máximo en los campos de nombre y detalle.');
        return;
    }

    if (listaGastos.length >= 7) {
        alert('Solo se permiten 7 registros de gastos.');
        return;
    }

    if (valorGasto > 150) {
        alert('¡Alerta! El gasto supera los 150 dólares.');
    }

    const gastoExistente = listaGastos.find(
        (g) => g.nombre === nombreGasto && g.descripcion === descripcionGasto
    );
    if (gastoExistente) {
        alert('Gasto ya registrado.');
        return;
    }

    const nuevoGasto = {
        nombre: nombreGasto,
        valor: valorGasto,
        descripcion: descripcionGasto,
        id: Date.now(),
    };

    listaGastos.push(nuevoGasto);
    totalGastos += valorGasto;
    actualizarTotal();

    // Limpiar las casillas
    document.getElementById('nombreGasto').value = '';
    document.getElementById('valorGasto').value = '';
    document.getElementById('descripcionGasto').value = '';

    // Mostrar alerta
    alert('Gasto agregado');
}

function validarTexto(input) {
    input.value = input.value.replace(/[^a-zA-Z\s]/g, '');
}

function validarNumero(input) {
    input.value = input.value.replace(/[^0-9.]/g, '');
    if (input.value.includes('.')) {
        const [integer, decimal] = input.value.split('.');
        if (decimal && decimal.length > 2) {
            input.value = `${integer}.${decimal.slice(0, 2)}`;
        }
    }
}

function actualizarTotal() {
    document.getElementById('totalGastosTabla').innerText =
        totalGastos.toFixed(2);
}

function mostrarTablaGastos() {
    document.querySelector('.title-container').style.display = 'none';
    document.getElementById('tablaGastosContainer').style.display = 'block';
    document.querySelector('.form-group').style.display = 'none';
    document.getElementById('mostrarTabla').style.display = 'none';

    actualizarTotal();

    const cuerpoTabla = document.getElementById('cuerpoTabla');
    cuerpoTabla.innerHTML = '';

    if (listaGastos.length === 0) {
        const fila = cuerpoTabla.insertRow();
        const celda = fila.insertCell();
        celda.colSpan = 3;
        celda.textContent = 'No hay gastos para mostrar.';
    } else {
        listaGastos.forEach((gasto) => {
            const fila = cuerpoTabla.insertRow();
            const celdaNombre = fila.insertCell();
            const celdaDescripcion = fila.insertCell();
            const celdaValor = fila.insertCell();

            celdaNombre.textContent = gasto.nombre;
            celdaDescripcion.textContent = gasto.descripcion;
            celdaValor.textContent = gasto.valor.toFixed(2);
        });
    }
}

function editarGastos() {
    const nombreGasto = prompt('¿Qué gasto desea editar?');
    const gasto = listaGastos.find((g) => g.nombre === nombreGasto);

    if (gasto) {
        const nuevoNombre = prompt(
            'Introduzca el nuevo nombre del gasto:',
            gasto.nombre
        );
        const nuevoDetalle = prompt(
            'Introduzca el nuevo detalle del gasto:',
            gasto.descripcion
        );
        const nuevoValor = parseFloat(
            prompt('Introduzca el nuevo valor del gasto:', gasto.valor)
        );

        if (!nuevoNombre || !nuevoDetalle || isNaN(nuevoValor)) {
            alert('Por favor ingrese un dato válido.');
            return;
        }

        if (/\d/.test(nuevoNombre) || /\d/.test(nuevoDetalle)) {
            alert(
                'Solo se permiten letras en los campos de nombre y detalle.'
            );
            return;
        }

        if (
            nuevoNombre.split(' ').length > 3 ||
            nuevoDetalle.split(' ').length > 3
        ) {
            alert(
                'Solo se permiten tres palabras máximo en los campos de nombre y detalle.'
            );
            return;
        }

        gasto.nombre = nuevoNombre;
        gasto.descripcion = nuevoDetalle;
        totalGastos -= gasto.valor;
        gasto.valor = nuevoValor;
        totalGastos += nuevoValor;

        actualizarTotal();
        mostrarTablaGastos();
    } else {
        alert('Gasto no encontrado.');
    }
}

function eliminarGastos() {
    const nombreGasto = prompt('Introduzca el nombre del gasto que desea eliminar:');

    if (!nombreGasto) {
        alert('Debe introducir un nombre válido.');
        return;
    }

    const index = listaGastos.findIndex((g) => g.nombre.trim().toLowerCase() === nombreGasto.trim().toLowerCase());

    if (index !== -1) {
        totalGastos -= listaGastos[index].valor;
        listaGastos.splice(index, 1);
        actualizarTotal();
        mostrarTablaGastos();
        alert('Gasto eliminado');
    } else {
        alert('Gasto no encontrado.');
    }
}

function volver() {
    document.querySelector('.title-container').style.display = 'block';
    document.querySelector('.form-group').style.display = 'flex';
    document.getElementById('mostrarTabla').style.display = 'inline-block';
    document.getElementById('tablaGastosContainer').style.display = 'none';
}

function salir() {
    window.location.href = 'https://www.google.com';
}
