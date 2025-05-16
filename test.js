function markCharactersWithTimers() {
    const addCheckmark = (element) => {
        if (!element.querySelector('.gargonem-char-timer-icon')) {
            const checkmark = document.createElement('div');
            checkmark.textContent = '✅';
            checkmark.classList.add('gargonem-char-timer-icon');
            checkmark.style.position = 'absolute';
            checkmark.style.top = '-15px';
            checkmark.style.left = '50%';
            checkmark.style.transform = 'translateX(-50%)';
            checkmark.style.fontSize = '16px';
            checkmark.style.zIndex = '10';

            element.style.overflow = 'visible';
            element.style.position = 'relative';
            element.appendChild(checkmark);
        }
    };

    const removeCheckmark = (element) => {
        const existing = element.querySelector('.gargonem-char-timer-icon');
        if (existing) {
            existing.remove();
        }
    };

    const updateCharacterMarks = () => {
        let savedCharIds = new Set();
        try {
            const rawTimerData = GM_getValue("timer");
            const timerData = JSON.parse(rawTimerData);
            if (timerData && Array.isArray(timerData.timers)) {
                savedCharIds = new Set(timerData.timers.map(t => t.savedByID));
            }
        } catch (e) {
            console.error("Error parsing timer data:", e);
        }

        document.querySelectorAll('.gargonem-change-character-char').forEach(charElement => {
            const charId = parseInt(charElement.getAttribute('data-charid'), 10);
            if (savedCharIds.has(charId)) {
                addCheckmark(charElement);
            } else {
                removeCheckmark(charElement);
            }
        });
    };

    const observeCharacterList = () => {
        const characterList = document.querySelector('.gargonem-change-character');
        if (!characterList) return;

        const observer = new MutationObserver(() => {
            updateCharacterMarks();
        });

        observer.observe(characterList, { childList: true, subtree: true });
    };

    const observeTimers = () => {
        const timerWrapper = document.querySelector('.gargonem-timer-wrapper');
        if (!timerWrapper) return;

        const observer = new MutationObserver(() => {
            updateCharacterMarks();
        });

        observer.observe(timerWrapper, { childList: true, subtree: true });
    };

    updateCharacterMarks();
    observeCharacterList();
    observeTimers();
}
