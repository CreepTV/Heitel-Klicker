// Verbesserungen: Modularisierung, bessere Kommentare, Fehlerbehandlung
let clickValue = 0; // Aktueller Heitel-Wert
let autoClickers = 0; // Anzahl der Auto Klicker
let autoClickerPrice = 10; // Initial price for auto-clickers
let ciscoRouters = 0; // Anzahl der Cisco Router
let ciscoRouterPrice = 50; // Initial price for Cisco Routers

function updateHeitelValueBar() {
    const heitelValueElement = document.getElementById('heitelValue');
    if (heitelValueElement) {
        heitelValueElement.innerText = Math.round(clickValue);
    }
}

function saveGame() {
    try {
        localStorage.setItem('clickValue', Math.round(clickValue));
        localStorage.setItem('autoClickers', autoClickers);
        localStorage.setItem('autoClickerPrice', autoClickerPrice);
        localStorage.setItem('ciscoRouters', ciscoRouters);
        localStorage.setItem('ciscoRouterPrice', ciscoRouterPrice);
    } catch (error) {
        console.error('Fehler beim Speichern des Spiels:', error);
    }
}

function loadGame() {
    try {
        const savedClickValue = localStorage.getItem('clickValue');
        const savedAutoClickers = localStorage.getItem('autoClickers');
        const savedAutoClickerPrice = localStorage.getItem('autoClickerPrice');
        const savedCiscoRouters = localStorage.getItem('ciscoRouters');
        const savedCiscoRouterPrice = localStorage.getItem('ciscoRouterPrice');

        clickValue = savedClickValue !== null ? Math.round(parseFloat(savedClickValue)) : 0;
        autoClickers = savedAutoClickers !== null ? parseInt(savedAutoClickers, 10) : 0;
        autoClickerPrice = savedAutoClickerPrice !== null ? parseInt(savedAutoClickerPrice, 10) : 10;
        ciscoRouters = savedCiscoRouters !== null ? parseInt(savedCiscoRouters, 10) : 0;
        ciscoRouterPrice = savedCiscoRouterPrice !== null ? parseInt(savedCiscoRouterPrice, 10) : 50;

        updateHeitelValueBar();
        updateItemCount('item1Count', autoClickers);
        updateAutoClickerPriceDisplay();
        updateCiscoRouterPriceDisplay();
        updateShopTooltip(1, 1, autoClickers);
        updateShopTooltip(2, 0.5, ciscoRouters);
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

    const maxSymbols = 10; // Maximum number of symbols displayed
    for (let i = 0; i < Math.min(autoClickers, maxSymbols); i++) {
        const angle = (360 / maxSymbols) * i;
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

    // Replace symbols cyclically for autoClickers > maxSymbols
    if (autoClickers > maxSymbols) {
        const extraSymbols = autoClickers - maxSymbols;
        for (let i = 0; i < extraSymbols; i++) {
            const index = i % maxSymbols; // Replace symbols cyclically
            const symbol = container.children[index];
            if (symbol) {
                symbol.src = '../assets/HeitelCursorNormal_Clicker.png';
            }
        }
    }
}

function updateAutoClickerPriceDisplay() {
    const priceElement = document.getElementById('kosten');
    if (priceElement) {
        priceElement.innerText = `${autoClickerPrice} Heitels`;
    }
}

function updateCiscoRouterPriceDisplay() {
    const priceElement = document.getElementById('kosten2');
    if (priceElement) {
        priceElement.innerText = `${ciscoRouterPrice} Heitels`;
    }
}

function updateShopTooltip(itemId, incomePerItem, purchasedCount) {
    if (itemId === 1) {
        const incomePerItemElement = document.getElementById('item1IncomePerItem');
        const totalIncomeElement = document.getElementById('item1TotalIncome');
        const purchasedElement = document.getElementById('item1Purchased');
        if (incomePerItemElement) incomePerItemElement.innerText = incomePerItem;
        if (totalIncomeElement) totalIncomeElement.innerText = incomePerItem * purchasedCount;
        if (purchasedElement) purchasedElement.innerText = purchasedCount;
    }
    if (itemId === 2) {
        const incomePerItemElement = document.getElementById('item2IncomePerItem');
        const totalIncomeElement = document.getElementById('item2TotalIncome');
        const purchasedElement = document.getElementById('item2Purchased');
        if (incomePerItemElement) incomePerItemElement.innerText = `${incomePerItem}%`;
        if (totalIncomeElement) totalIncomeElement.innerText = `${(incomePerItem * purchasedCount).toFixed(2)}%`;
        if (purchasedElement) purchasedElement.innerText = purchasedCount;
    }
}

function buyItem(itemId) {
    if (itemId === 1 && clickValue >= autoClickerPrice) {
        clickValue = Math.round(clickValue - autoClickerPrice);
        autoClickers += 1;
        autoClickerPrice = Math.ceil(autoClickerPrice * 1.20);
        updateHeitelValueBar();
        updateAutoClickerSymbols();
        updateItemCount('item1Count', autoClickers);
        updateAutoClickerPriceDisplay();
        updateShopTooltip(1, 1, autoClickers);
        saveGame();
        showNotification('success', 'Auto Klicker erfolgreich gekauft!');
    } else if (itemId === 1) {
        showNotification('warning', 'Nicht genug Heitels!');
    }
    if (itemId === 2 && clickValue >= ciscoRouterPrice) {
        clickValue = Math.round(clickValue - ciscoRouterPrice);
        ciscoRouters += 1;
        ciscoRouterPrice = Math.ceil(ciscoRouterPrice * 1.20);
        updateHeitelValueBar();
        updateItemCount('item2Count', ciscoRouters);
        updateCiscoRouterPriceDisplay();
        updateShopTooltip(2, 0.5, ciscoRouters);
        saveGame();
        showNotification('success', 'Cisco Router erfolgreich gekauft!');
    } else if (itemId === 2) {
        showNotification('warning', 'Nicht genug Heitels!');
    }
}

function generateHeitels() {
    const ciscoRouterBonus = Math.round(clickValue * (ciscoRouters * 0.005));
    clickValue = Math.round(clickValue + autoClickers + ciscoRouterBonus);
    updateHeitelValueBar();
    saveGame();
}

function createFloatingText(value, x, y) {
    const container = document.getElementById('floatingTextContainer');
    if (!container) return;

    const text = document.createElement('div');
    text.className = 'floating-text';
    text.innerText = `+${Math.round(value)}`;
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
    location.reload(); // Reload the page
}

function toggleSettingsPopup() {
    const popup = document.getElementById('settingsPopup');
    if (popup) {
        const isHidden = popup.style.display === 'none' || !popup.style.display;
        popup.style.display = isHidden ? 'block' : 'none';
    }
}

function toggleLoginPopup() {
    const loginPopup = document.getElementById('loginPopup');
    const registerPopup = document.getElementById('registerPopup');
    if (loginPopup) {
        const isHidden = loginPopup.style.display === 'none' || !loginPopup.style.display;
        loginPopup.style.display = isHidden ? 'block' : 'none';
        loginPopup.setAttribute('aria-hidden', !isHidden); // Dynamisch aria-hidden setzen
        if (isHidden && registerPopup) {
            registerPopup.style.display = 'none';
            registerPopup.setAttribute('aria-hidden', 'true');
        }
    }
}

function toggleRegisterPopup() {
    const registerPopup = document.getElementById('registerPopup');
    const loginPopup = document.getElementById('loginPopup');
    if (registerPopup) {
        const isHidden = registerPopup.style.display === 'none' || !registerPopup.style.display;
        registerPopup.style.display = isHidden ? 'block' : 'none';
        registerPopup.setAttribute('aria-hidden', !isHidden); // Dynamisch aria-hidden setzen
        if (isHidden && loginPopup) {
            loginPopup.style.display = 'none';
            loginPopup.setAttribute('aria-hidden', 'true');
        }
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

    // Maximal 3 Notifications gleichzeitig anzeigen
    while (notificationContainer.children.length >= 3) {
        notificationContainer.removeChild(notificationContainer.firstChild);
    }

    const notification = document.createElement('li');
    notification.className = `notification-item ${type} notification-pop`;
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

    // Pop-Animation: Klasse nach kurzer Zeit wieder entfernen
    setTimeout(() => {
        notification.classList.remove('notification-pop');
    }, 400);

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

function closePopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.style.display = 'none';
    }
}

function toggleProfilePopup() {
    const profilePopup = document.getElementById('profilePopup');
    if (profilePopup) {
        const isHidden = profilePopup.style.display === 'none' || !profilePopup.style.display;
        profilePopup.style.display = isHidden ? 'block' : 'none';
    }
}

function showProfile() {
    const profileManagementPopup = document.getElementById('profileManagementPopup');
    if (profileManagementPopup) {
        profileManagementPopup.style.display = 'block';
    }
}

let cropper;

function updateProfilePicturePreview(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const cropContainer = document.getElementById('cropContainer');
            if (cropContainer) {
                cropContainer.innerHTML = `<img id="cropImage" src="${e.target.result}" alt="Profilbild Vorschau">`;
                const cropImage = document.getElementById('cropImage');
                cropper = new Cropper(cropImage, {
                    aspectRatio: 1,
                    viewMode: 1,
                });
                showPopup('cropModal');
            }
        };
        reader.readAsDataURL(file);
    }
}

function applyCrop() {
    if (cropper) {
        const canvas = cropper.getCroppedCanvas({
            width: 120,
            height: 120,
        });
        const croppedImage = canvas.toDataURL('image/png');
        const preview = document.getElementById('profilePicturePreview');
        if (preview) {
            preview.src = croppedImage;
        }
        cropper.destroy();
        cropper = null;
        closePopup('cropModal');
    }
}

function triggerProfilePictureInput() {
    const input = document.getElementById('profilePictureInput');
    if (input) {
        input.click();
    }
}

function removeProfilePicture() {
    const preview = document.getElementById('profilePicturePreview');
    if (preview) {
        preview.src = 'assets/profile-placeholder.png'; // Reset to placeholder
    }
}


function saveAccountSettings() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    console.log('Kontoeinstellungen gespeichert:', { email, password });
    showNotification('success', 'Deine Kontoeinstellungen wurden gespeichert!');
    closePopup('profileManagementPopup');
}

document.addEventListener('DOMContentLoaded', () => {
    loadGame();
    updateAutoClickerSymbols();
    updateAutoClickerPriceDisplay();
    updateShopTooltip(1, 1, autoClickers); // Initialize tooltip on page load
    updateCiscoRouterPriceDisplay();
    updateShopTooltip(2, 0.5, ciscoRouters); // Initialize tooltip for Cisco Router

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