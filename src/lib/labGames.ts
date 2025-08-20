/**
 * @interface LabGame
 * @description Defines the common interface for all lab simulation games.
 * Each game should implement these methods to ensure consistency.
 */
interface LabGame {
    /** Unique identifier for the game. */
    id: string;
    /** Display name of the game. */
    name: string;
    /** Short description of what the game teaches or simulates. */
    description: string;

    /**
     * @method initialize
     * @param containerId The ID of the HTML element where the game's UI should be rendered.
     * @description Sets up the game's initial state and renders its UI into the specified container.
     */
    initialize(containerId: string): void;

    /**
     * @method update
     * @param deltaTime The time elapsed since the last update, useful for animations or continuous simulations.
     * @description Updates the game's logic based on time or user interaction.
     * For static simulations, this might be empty or triggered by specific events.
     */
    update(deltaTime: number): void;

    /**
     * @method render
     * @description Renders or re-renders the current state of the game's UI.
     * Called after updates or when the game state changes.
     */
    render(): void;

    /**
     * @method dispose
     * @description Cleans up any resources, event listeners, or DOM elements created by the game
     * to prevent memory leaks when the game is no longer needed.
     */
    dispose(): void;

    // Optional methods for games that might have scores or specific controls
    getScore?(): number;
    setGameParameter?(paramName: string, value: any): void;
    getGameParameter?(paramName: string): any;
}

/**
 * @class PHSimulationGame
 * @implements LabGame
 * @description A chemistry lab game simulating the pH scale. Users can adjust a slider
 * to change the solution's pH and observe its acidity/basicity and a
 * corresponding color indicator.
 */
class PHSimulationGame implements LabGame {
    public id: string = "ph-simulation";
    public name: string = "pH Scale Simulator";
    public description: string = "Explore the pH scale by adjusting acidity/basicity and observing changes.";

    private currentPH: number = 7.0; // Initial pH value (neutral)
    private containerElement: HTMLElement | null = null;
    private phDisplayElement: HTMLElement | null = null;
    private acidBaseSlider: HTMLInputElement | null = null;
    private solutionStateElement: HTMLElement | null = null;
    private phIndicatorElement: HTMLElement | null = null;

    /**
     * @constructor
     * @description Initializes the PHSimulationGame instance.
     */
    constructor() {
        // No heavy initialization here. DOM manipulation should happen in 'initialize'.
    }

    /**
     * @method initialize
     * @param containerId The ID of the HTML element to inject the game UI into.
     * @description Renders the game's UI (slider, display, indicator) into the provided container.
     * Sets up event listeners for user interaction.
     */
    initialize(containerId: string): void {
        this.containerElement = document.getElementById(containerId);
        if (!this.containerElement) {
            console.error(`Error: Container element with ID '${containerId}' not found for PHSimulationGame.`);
            return;
        }

        // Construct the game's HTML UI
        this.containerElement.innerHTML = `
            <div class="lab-game-container p-4 md:p-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl shadow-xl border border-border w-full max-w-xl mx-auto my-8">
                <h3 class="text-3xl font-extrabold text-center text-foreground mb-6">
                    ${this.name}
                </h3>
                
                <p class="text-md text-muted-foreground text-center mb-6">
                    Adjust the slider to change the solution's pH and observe the color!
                </p>

                <div class="mb-8 p-4 bg-card rounded-xl shadow-inner border border-border">
                    <label for="acidBaseSlider" class="block text-lg font-semibold text-foreground mb-3">
                        Solution Acidity/Basicity:
                    </label>
                    <input type="range" id="acidBaseSlider" min="0" max="14" step="0.1" value="${this.currentPH}"
                           class="w-full h-3 bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition duration-300">
                </div>

                <div class="text-center mb-8">
                    <p class="text-2xl font-bold text-foreground">
                        Current pH: <span id="phDisplay" class="font-extrabold text-primary transition-colors duration-300">
                            ${this.currentPH.toFixed(1)}
                        </span>
                    </p>
                    <p id="solutionState" class="text-xl font-medium mt-2 text-foreground transition-colors duration-300">
                        Neutral
                    </p>
                </div>

                <div class="p-2 bg-muted rounded-xl shadow-inner border border-border">
                    <p class="text-md font-semibold text-foreground mb-2">pH Indicator:</p>
                    <div id="phIndicator" class="h-10 rounded-lg border border-border shadow-sm" style="background-color: hsl(var(--muted));"></div>
                </div>
            </div>
        `;

        // Get references to the newly created DOM elements
        this.phDisplayElement = this.containerElement.querySelector("#phDisplay");
        this.acidBaseSlider = this.containerElement.querySelector("#acidBaseSlider") as HTMLInputElement;
        this.solutionStateElement = this.containerElement.querySelector("#solutionState");
        this.phIndicatorElement = this.containerElement.querySelector("#phIndicator");

        // Add event listener to the slider for real-time updates
        if (this.acidBaseSlider) {
            this.acidBaseSlider.addEventListener("input", this.handleSliderInput);
        }

        // Perform initial render to set up the display based on initial pH
        this.render();
    }

    /**
     * @method handleSliderInput
     * @description Event handler for the pH slider. Updates the current pH value
     * and triggers a re-render of the game state.
     */
    private handleSliderInput = (event: Event): void => {
        this.currentPH = parseFloat((event.target as HTMLInputElement).value);
        this.render(); // Re-render the UI when the slider value changes
    }

    /**
     * @method update
     * @param deltaTime Not used in this static simulation, but kept for interface compliance.
     * @description This particular game doesn't require continuous updates, so this method is a no-op.
     * It would be used for animations, physics simulations, etc.
     */
    update(deltaTime: number): void {
        // This game is a static simulation, so no continuous update logic is needed here.
        // It's part of the interface for future, more dynamic games.
    }

    /**
     * @method render
     * @description Updates the text and color of the UI elements based on the current pH value.
     * This method is called whenever the pH changes or initially.
     */
    render(): void {
        if (this.phDisplayElement) {
            this.phDisplayElement.textContent = this.currentPH.toFixed(1);
        }

        // Update solution state (Acidic, Neutral, Basic)
        if (this.solutionStateElement) {
            this.solutionStateElement.classList.remove("text-red-600", "text-green-600", "text-blue-600");
            if (this.currentPH < 6.5) { // Slightly wider range for visual distinction
                this.solutionStateElement.textContent = "Acidic";
                this.solutionStateElement.classList.add("text-red-600");
            } else if (this.currentPH > 7.5) {
                this.solutionStateElement.textContent = "Basic";
                this.solutionStateElement.classList.add("text-green-600");
            } else {
                this.solutionStateElement.textContent = "Neutral";
                this.solutionStateElement.classList.add("text-blue-600");
            }
        }

        // Update the pH indicator color based on the pH value
        if (this.phIndicatorElement) {
            let r: number, g: number, b: number;

            if (this.currentPH <= 2) { // Strong Acid (Red)
                r = 255; g = 0; b = 0;
            } else if (this.currentPH <= 4) { // Acid (Orange-Red)
                r = 255; g = Math.floor(128 * ((this.currentPH - 2) / 2)); b = 0;
            } else if (this.currentPH <= 6) { // Weak Acid (Yellow-Orange)
                r = 255; g = Math.floor(128 + 127 * ((this.currentPH - 4) / 2)); b = 0;
            } else if (this.currentPH <= 7) { // Very Weak Acid / Near Neutral (Yellow-Green)
                r = Math.floor(255 - 255 * ((this.currentPH - 6) / 1)); // Fades red
                g = 255;
                b = 0;
            } else if (this.currentPH <= 8) { // Neutral / Very Weak Base (Green)
                r = 0;
                g = 255;
                b = 0;
            } else if (this.currentPH <= 10) { // Weak Base (Green-Blue)
                r = 0;
                g = Math.floor(255 - 128 * ((this.currentPH - 8) / 2));
                b = Math.floor(128 * ((this.currentPH - 8) / 2));
            } else if (this.currentPH <= 12) { // Base (Blue)
                r = 0; g = 0; b = Math.floor(128 + 127 * ((this.currentPH - 10) / 2));
            } else { // Strong Base (Deep Blue/Violet)
                r = Math.floor(64 * ((this.currentPH - 12) / 2));
                g = 0;
                b = 255;
            }
            this.phIndicatorElement.style.backgroundColor = `rgb(${r},${g},${b})`;
        }
    }

    /**
     * @method dispose
     * @description Cleans up the event listener for the slider and clears the container's content.
     * Important for preventing memory leaks when the game is removed from the DOM.
     */
    dispose(): void {
        if (this.acidBaseSlider) {
            this.acidBaseSlider.removeEventListener("input", this.handleSliderInput);
        }
        if (this.containerElement) {
            this.containerElement.innerHTML = ""; // Clear the injected HTML
        }
    }

    /**
     * @method setPHValue
     * @param value Sets the pH value programmatically, useful for external controls or testing.
     */
    public setPHValue(value: number): void {
        this.currentPH = Math.max(0, Math.min(14, value)); // Clamp value between 0 and 14
        if (this.acidBaseSlider) {
            this.acidBaseSlider.value = this.currentPH.toString();
        }
        this.render();
    }

    /**
     * @method getCurrentPH
     * @returns The current pH value of the simulated solution.
     */
    public getCurrentPH(): number {
        return this.currentPH;
    }
}

// Export the interface and the game class for easy import into your application.
export type { LabGame };
export { PHSimulationGame };