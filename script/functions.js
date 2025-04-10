// Verbesserungen: Modularisierung, bessere Kommentare, Fehlerbehandlung
let clickValue = 0; // Aktueller Heitel-Wert
let autoClickers = 0; // Anzahl der Auto Klicker

function updateHeitelValueBar() {
    const heitelValueBar = document.getElementById('heitelValueBar');
    if (heitelValueBar) {
        heitelValueBar.innerText = `🍪 ${clickValue}`;
    }
}

function saveGame() {
    try {
        localStorage.setItem('clickValue', clickValue);
        localStorage.setItem('autoClickers', autoClickers);
    } catch (error) {
        console.error('Fehler beim Speichern des Spiels:', error);
    }
}

function loadGame() {
    try {
        const savedClickValue = localStorage.getItem('clickValue');
        const savedAutoClickers = localStorage.getItem('autoClickers');

        clickValue = savedClickValue !== null ? parseInt(savedClickValue, 10) : 0;
        autoClickers = savedAutoClickers !== null ? parseInt(savedAutoClickers, 10) : 0;

        updateHeitelValueBar();
        updateItemCount('item1Count', autoClickers);
    } catch (error) {
        console.error('Fehler beim Laden des Spiels:', error);
    }
}

function updateItemCount(elementId, count) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerText = count;
    }
}

function updateAutoClickerSymbols() {
    const container = document.getElementById('autoClickerSymbols');
    if (!container) return;

    container.innerHTML = '';

    for (let i = 0; i < autoClickers; i++) {
        const angle = (360 / autoClickers) * i;
        const symbol = document.createElement('img');
        symbol.src = '../assets/HeitelCursorNormal_Clicker.ico';
        symbol.className = 'auto-clicker-symbol';

        const radius = 90; // Angepasster Radius für das vergrößerte Click-Objekt
        const x = radius * Math.cos((angle * Math.PI) / 180);
        const y = radius * Math.sin((angle * Math.PI) / 180);

        symbol.style.left = `${90 + x}px`; // Zentriert relativ zur neuen Größe
        symbol.style.top = `${90 + y}px`; // Zentriert relativ zur neuen Größe
        symbol.style.transform = `rotate(${angle + 270}deg)`;

        container.appendChild(symbol);
    }
}

function buyItem(itemId) {
    if (itemId === 1 && clickValue >= 10) {
        clickValue -= 10;
        autoClickers += 1;
        updateHeitelValueBar();
        updateAutoClickerSymbols();
        updateItemCount('item1Count', autoClickers);
    } else if (itemId === 1) {
        alert('Nicht genug Heitels!');
    }
}

function generateHeitels() {
    clickValue += autoClickers;
    updateHeitelValueBar();
    saveGame();
}

function createFloatingText(value, x, y) {
    const container = document.getElementById('floatingTextContainer');
    if (!container) return;

    const text = document.createElement('div');
    text.className = 'floating-text';
    text.innerText = `+${value}`;
    text.style.left = `${x}px`;
    text.style.top = `${y}px`;

    container.appendChild(text);

    setTimeout(() => {
        container.removeChild(text);
    }, 1000);
}

function resetGame() {
    localStorage.clear();
    clickValue = 0;
    autoClickers = 0;
    updateHeitelValueBar();
    updateItemCount('item1Count', autoClickers);
}

function toggleSettingsPopup() {
    const popup = document.getElementById('settingsPopup');
    if (popup) {
        const isHidden = popup.style.display === 'none' || !popup.style.display;
        popup.style.display = isHidden ? 'block' : 'none';
    }
}

function switchTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-button');

    tabs.forEach(tab => tab.classList.remove('active'));
    buttons.forEach(button => button.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    document.querySelector(`.tab-button[onclick="switchTab('${tabId}')"]`).classList.add('active');
}

function closeNotification(notificationElement) {
    if (notificationElement) {
        notificationElement.remove();
    }
}

function setupNotificationAutoClose(notificationElement) {
    const progressBar = notificationElement.querySelector('.notification-progress-bar');
    if (progressBar) {
        progressBar.addEventListener('animationend', () => {
            closeNotification(notificationElement);
        });
    }
}

function showNotification(type, message) {
    const notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) return;

    const notification = document.createElement('li');
    notification.className = `notification-item ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                    <!-- SVG paths based on type -->
                    ${type === 'success' ? '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>' : ''}
                    ${type === 'info' ? '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>' : ''}
                    ${type === 'warning' ? '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>' : ''}
                    ${type === 'error' ? '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>' : ''}
                </svg>
            </div>
            <div class="notification-text">${message}</div>
        </div>
        <div class="notification-icon notification-close" onclick="closeNotification(this.closest('.notification-item'))">
            <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"></path>
            </svg>
        </div>
        <div class="notification-progress-bar"></div>
    `;

    notificationContainer.appendChild(notification);
    setupNotificationAutoClose(notification);
}

// Example usage for showing notifications
function showWarning(message) {
    showNotification('warning', message);
}

function showError(message) {
    showNotification('error', message);
}

function showInfo(message) {
    showNotification('info', message);
}

document.addEventListener('DOMContentLoaded', () => {
    loadGame();
    updateAutoClickerSymbols();

    const clickObject = document.getElementById('clickObject');
    if (clickObject) {
        clickObject.addEventListener('click', (event) => {
            clickValue += 1;
            updateHeitelValueBar();
            createFloatingText(1, event.clientX, event.clientY);
            saveGame();
        });
    }

    setInterval(generateHeitels, 1000);
});