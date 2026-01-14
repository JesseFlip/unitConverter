
class UnitConverter {
    constructor() {
        this.inputEl = document.getElementById('user-input');
        this.cardsContainer = document.getElementById('cards-container');
        this.themeToggle = document.getElementById('theme-toggle');

        // State for selected units in each category
        this.state = {
            length: { unitA: 'meters', unitB: 'feet' },
            volume: { unitA: 'liters', unitB: 'gallons' },
            mass: { unitA: 'kilograms', unitB: 'pounds' },
            temperature: { unitA: 'celsius', unitB: 'fahrenheit' },
            speed: { unitA: 'kmh', unitB: 'mph' },
            area: { unitA: 'sq_meters', unitB: 'sq_feet' },
            time: { unitA: 'minutes', unitB: 'seconds' },
            digital: { unitA: 'megabytes', unitB: 'gigabytes' }
        };

        this.definitions = {
            length: {
                title: 'Length',
                units: {
                    meters: { label: 'Meters', factor: 1 },
                    feet: { label: 'Feet', factor: 0.3048 },
                    kilometers: { label: 'Kilometers', factor: 1000 },
                    miles: { label: 'Miles', factor: 1609.34 },
                    centimeters: { label: 'Centimeters', factor: 0.01 },
                    inches: { label: 'Inches', factor: 0.0254 }
                }
            },
            volume: {
                title: 'Volume',
                units: {
                    liters: { label: 'Liters', factor: 1 },
                    gallons: { label: 'Gallons', factor: 3.78541 }, // US Gallon
                    milliliters: { label: 'Milliliters', factor: 0.001 },
                    fluid_ounces: { label: 'Fluid Ounces', factor: 0.0295735 }
                }
            },
            mass: {
                title: 'Mass',
                units: {
                    kilograms: { label: 'Kilograms', factor: 1 },
                    pounds: { label: 'Pounds', factor: 0.453592 },
                    grams: { label: 'Grams', factor: 0.001 },
                    ounces: { label: 'Ounces', factor: 0.0283495 }
                }
            },
            temperature: {
                title: 'Temperature',
                units: {
                    celsius: { label: 'Celsius' },
                    fahrenheit: { label: 'Fahrenheit' },
                    kelvin: { label: 'Kelvin' }
                },
                isSpecial: true // Requires formulas, not factors
            },
            speed: {
                title: 'Speed',
                units: {
                    kmh: { label: 'km/h', factor: 1 },
                    mph: { label: 'mph', factor: 1.60934 },
                    ms: { label: 'm/s', factor: 3.6 },
                    fts: { label: 'ft/s', factor: 1.09728 } // 1.09728 km/h
                }
            },
            area: {
                title: 'Area',
                units: {
                    sq_meters: { label: 'Sq. Meters', factor: 1 },
                    sq_feet: { label: 'Sq. Feet', factor: 0.092903 },
                    hectares: { label: 'Hectares', factor: 10000 },
                    acres: { label: 'Acres', factor: 4046.86 }
                }
            },
            time: {
                title: 'Time',
                units: {
                    seconds: { label: 'Seconds', factor: 1 },
                    minutes: { label: 'Minutes', factor: 60 },
                    hours: { label: 'Hours', factor: 3600 },
                    days: { label: 'Days', factor: 86400 }
                }
            },
            digital: {
                title: 'Digital Storage',
                units: {
                    bytes: { label: 'Bytes', factor: 1 },
                    kilobytes: { label: 'KB', factor: 1024 },
                    megabytes: { label: 'MB', factor: 1048576 },
                    gigabytes: { label: 'GB', factor: 1073741824 },
                    terabytes: { label: 'TB', factor: 1099511627776 }
                }
            }
        };

        this.init();
    }

    init() {
        this.renderCards();
        this.loadTheme();
        this.addEventListeners();
        // Trigger initial calculation
        this.updateConversions();
    }

    addEventListeners() {
        this.inputEl.addEventListener('input', () => this.updateConversions());

        this.themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            this.themeToggle.textContent = isDark ? '☀️' : '🌙';
        });

        // Event delegation for dynamically created elements
        this.cardsContainer.addEventListener('change', (e) => {
            if (e.target.tagName === 'SELECT') {
                const category = e.target.dataset.category;
                const type = e.target.dataset.type; // 'unitA' or 'unitB'
                this.state[category][type] = e.target.value;
                this.updateConversions();
            }
        });

        this.cardsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('swap-btn')) {
                const category = e.target.dataset.category;
                // Swap state
                const temp = this.state[category].unitA;
                this.state[category].unitA = this.state[category].unitB;
                this.state[category].unitB = temp;
                // Update Selects
                const card = document.getElementById(`card-${category}`);
                card.querySelector(`select[data-type="unitA"]`).value = this.state[category].unitA;
                card.querySelector(`select[data-type="unitB"]`).value = this.state[category].unitB;

                this.updateConversions();
            }

            if (e.target.classList.contains('copy-btn')) {
                const text = e.target.previousElementSibling.textContent;
                navigator.clipboard.writeText(text).then(() => {
                    const originalText = e.target.textContent;
                    e.target.textContent = '✅';
                    setTimeout(() => e.target.textContent = originalText, 1000);
                });
            }
        });
    }

    loadTheme() {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            this.themeToggle.textContent = '☀️';
        }
    }

    renderCards() {
        this.cardsContainer.innerHTML = '';

        for (const [key, category] of Object.entries(this.definitions)) {
            const card = document.createElement('div');
            card.className = 'card';
            card.id = `card-${key}`;

            const options = Object.entries(category.units).map(([unitKey, unitData]) => {
                return `<option value="${unitKey}">${unitData.label}</option>`;
            }).join('');

            card.innerHTML = `
                <div class="card-header">
                    <h3 class="card-title">${category.title}</h3>
                    <div class="unit-controls">
                        <select data-category="${key}" data-type="unitA">
                            ${options}
                        </select>
                        <button class="swap-btn" data-category="${key}" aria-label="Swap units">⇄</button>
                        <select data-category="${key}" data-type="unitB">
                            ${options}
                        </select>
                    </div>
                </div>
                <div class="card-content" id="content-${key}">
                    <div class="conversion-row">
                        <span class="conversion-text" id="result-${key}-A"></span>
                        <button class="copy-btn" aria-label="Copy result">📋</button>
                    </div>
                    <div class="conversion-row">
                        <span class="conversion-text" id="result-${key}-B"></span>
                        <button class="copy-btn" aria-label="Copy result">📋</button>
                    </div>
                </div>
            `;

            // Set initial values
            card.querySelector(`select[data-type="unitA"]`).value = this.state[key].unitA;
            card.querySelector(`select[data-type="unitB"]`).value = this.state[key].unitB;

            this.cardsContainer.appendChild(card);
        }
    }

    updateConversions() {
        let val = parseFloat(this.inputEl.value);
        if (isNaN(val)) val = 0;

        for (const [key, category] of Object.entries(this.definitions)) {
            const unitA = this.state[key].unitA;
            const unitB = this.state[key].unitB;

            // Calculate A -> B
            const resA = this.convert(val, unitA, unitB, key);
            // Calculate B -> A
            const resB = this.convert(val, unitB, unitA, key);

            const labelA = category.units[unitA].label;
            const labelB = category.units[unitB].label;

            document.getElementById(`result-${key}-A`).textContent =
                `${val} ${labelA} = ${this.format(resA)} ${labelB}`;

            document.getElementById(`result-${key}-B`).textContent =
                `${val} ${labelB} = ${this.format(resB)} ${labelA}`;
        }
    }

    convert(value, fromUnit, toUnit, categoryKey) {
        if (categoryKey === 'temperature') {
            return this.convertTemp(value, fromUnit, toUnit);
        }

        const fromFactor = this.definitions[categoryKey].units[fromUnit].factor;
        const toFactor = this.definitions[categoryKey].units[toUnit].factor;

        // Convert to base unit then to target unit
        // Base unit value = value * fromFactor
        // Target unit value = Base unit value / toFactor
        return (value * fromFactor) / toFactor;
    }

    convertTemp(value, from, to) {
        if (from === to) return value;

        // Convert to Celsius first
        let celsius;
        if (from === 'celsius') celsius = value;
        else if (from === 'fahrenheit') celsius = (value - 32) * 5/9;
        else if (from === 'kelvin') celsius = value - 273.15;

        // Convert Celsius to Target
        if (to === 'celsius') return celsius;
        if (to === 'fahrenheit') return (celsius * 9/5) + 32;
        if (to === 'kelvin') return celsius + 273.15;
    }

    format(num) {
        // Adjust precision based on magnitude
        if (Math.abs(num) < 0.001 && num !== 0) return num.toExponential(4);
        // Avoid .000 for integers
        if (Number.isInteger(num)) return num;
        return parseFloat(num.toFixed(4));
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    new UnitConverter();
});
