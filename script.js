// Esperar a que cargue el DOM
document.addEventListener('DOMContentLoaded', function() {
    const spinBtn = document.getElementById('spinButton');
    const messageDiv = document.getElementById('message');
    const errorDiv = document.getElementById('errorMessage');
    const wheelContainer = document.getElementById('wheelContainer');

    // Leer el token de la URL usando URLSearchParams:contentReference[oaicite:4]{index=4}
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
        // Si no hay token, mostrar error y no mostrar la ruleta
        errorDiv.textContent = 'Error: Token no proporcionado en la URL.';
        return;
    }

    // URL del Apps Script Web App (desplegar tu script y poner su URL aquí)
    const apiUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

    // Validar el token con el Apps Script usando fetch:contentReference[oaicite:5]{index=5}:contentReference[oaicite:6]{index=6} 
    fetch(`${apiUrl}?token=${encodeURIComponent(token)}`)
        .then(response => response.text())
        .then(text => {
            if (text === 'OK') {
                // Token válido: mostrar la ruleta y habilitar el botón
                wheelContainer.style.display = 'inline-block';
                spinBtn.disabled = false;
            } else if (text === 'USED') {
                errorDiv.textContent = 'Error: Este token ya ha sido utilizado.';
            } else {
                errorDiv.textContent = 'Error: Token inválido.';
            }
        })
        .catch(err => {
            console.error(err);
            errorDiv.textContent = 'Error al validar el token.';
        });

    // Configurar la ruleta con Winwheel.js:contentReference[oaicite:7]{index=7}:contentReference[oaicite:8]{index=8}
    let theWheel = new Winwheel({
        'canvasId': 'wheelCanvas',
        'numSegments': 9,
        'outerRadius': 200,      // Radio exterior (puede ajustarse)
        'innerRadius': 50,       // Radio del centro vacío
        'textFontSize': 18,
        'textOrientation': 'horizontal',
        'textAlignment': 'center',
        'segments': [
            {'fillStyle': '#FF6666', 'text': 'Tarjeta Amazon'},
            {'fillStyle': '#FFA500', 'text': 'Taza'},
            {'fillStyle': '#FFD700', 'text': 'Descuento 15%'},
            {'fillStyle': '#90EE90', 'text': 'Pluma'},
            {'fillStyle': '#87CEFA', 'text': 'Playera'},
            {'fillStyle': '#DA70D6', 'text': 'Llaverito'},
            {'fillStyle': '#FF69B4', 'text': 'Gorra'},
            {'fillStyle': '#40E0D0', 'text': 'Sticker Pack'},
            {'fillStyle': '#CCCCCC', 'text': 'Gracias por participar'}
        ],
        'animation': {
            'type': 'spinToStop',
            'duration': 5,
            'spins': 8,
            'callbackFinished': displayPrize  // Llamada cuando termine de girar:contentReference[oaicite:9]{index=9}
        }
    });

    // Función que se ejecuta cuando la ruleta termina de girar
    function displayPrize() {
        // Obtener el segmento ganador usando getIndicatedSegment:contentReference[oaicite:10]{index=10}
        let winningSegment = theWheel.getIndicatedSegment();
        let prize = winningSegment.text;
        // Mostrar mensaje con el premio ganado
        messageDiv.innerHTML = 
            `¡Muchas Felicidades! Has ganado <strong>${prize}</strong>.<br>¡Gracias por participar en nuestra Security Ruleta!`;
        // Marcar el token como usado en la hoja mediante otra petición
        fetch(`${apiUrl}?token=${encodeURIComponent(token)}&prize=${encodeURIComponent(prize)}`)
            .then(res => res.text())
            .then(res => console.log('Token marcado: ' + res))
            .catch(err => console.error('Error al marcar token:', err));
        // Deshabilitar nuevamente el botón
        spinBtn.disabled = true;
    }

    // Evento click del botón Girar
    spinBtn.addEventListener('click', function() {
        messageDiv.textContent = ''; // limpiar mensaje previo
        spinBtn.disabled = true;     // deshabilitar para evitar dobles clics
        theWheel.startAnimation();    // iniciar animación
    });
});
