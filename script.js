let currentAudio = null;
let currentTimeout = null;

function guardarAlarma() {
    const horaInput = document.getElementById('hora').value;
    const memeSelect = document.getElementById('meme').value;
    const mensaje = document.getElementById('mensaje');

    if (!horaInput) {
        mensaje.textContent = 'Por favor, elige una hora.';
        return;
    }

    // Очищаем предыдущий таймер и звук
    if (currentTimeout) {
        clearTimeout(currentTimeout);
        currentTimeout = null;
    }
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }

    // Парсим выбранное время
    const [hours, minutes] = horaInput.split(':').map(Number);

    // Текущая дата и время
    const now = new Date();
    const alarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);

    // Если время уже прошло, добавляем 1 день
    if (alarmTime < now) {
        alarmTime.setDate(alarmTime.getDate() + 1);
    }

    // Рассчитываем разницу в миллисекундах
    const timeDiff = alarmTime - now;

    // Устанавливаем таймер и сохраняем его id
    currentTimeout = setTimeout(() => {
        // ВАЖНО: используем глобальную переменную, а не объявляем новую
        currentAudio = new Audio(memeSelect);
        currentAudio.loop = true;
        currentAudio.play();

        // Лучше innerHTML, чтобы кнопка вставлялась корректно
        mensaje.innerHTML = '¡Alarma activada!';

        // Создаём кнопку для остановки
        const stopButton = document.createElement('button');
        stopButton.textContent = 'Detener sonido';
        stopButton.style.backgroundColor = 'purple';
        stopButton.style.color = 'white';
        stopButton.style.fontSize = '20px';
        stopButton.style.padding = '10px 20px';
        stopButton.style.border = 'none';
        stopButton.style.borderRadius = '5px';
        stopButton.style.marginLeft = '10px';

        stopButton.onclick = () => {
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                currentAudio = null;
            }
            stopButton.remove();
            mensaje.textContent = 'Alarma detenida.';
        };

        mensaje.appendChild(stopButton);
    }, timeDiff);

    // Сообщение об установке
    mensaje.textContent = `Alarma establecida para las ${horaInput}.`;
}

let previewAudio = null;

function previewMeme() {
    const memeSelect = document.getElementById('meme').value;

    // Останавливаем предыдущий предпрослушанный звук
    if (previewAudio) {
        previewAudio.pause();
        previewAudio.currentTime = 0;
    }

    // Запускаем новый
    previewAudio = new Audio(memeSelect);
    previewAudio.play();
}

function stopPreview() {
    if (previewAudio) {
        previewAudio.pause();
        previewAudio.currentTime = 0;
        previewAudio = null;
    }
}

let wakeLock = null;

async function activarWakeLock() {
    try {
        wakeLock = await navigator.wakeLock.request("screen");
        console.log("Wake Lock activado");
    } catch (err) {
        console.error("Wake Lock error:", err);
    }
}

function desactivarWakeLock() {
    if (wakeLock) {
        wakeLock.release();
        wakeLock = null;
        console.log("Wake Lock desactivado");
    }
}

