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

/**
 * @class ProjectileMotionGame
 * @implements LabGame
 * @description A physics lab game simulating projectile motion. Users can set initial
 * velocity and launch angle, then observe the trajectory on a canvas and
 * calculate key metrics like range, max height, and time of flight.
 */
class ProjectileMotionGame implements LabGame {
    public id: string = "projectile-motion";
    public name: string = "Projectile Motion Simulator";
    public description: string = "Simulate projectile motion by adjusting launch speed and angle.";

    private initialVelocity: number = 50; // m/s
    private launchAngle: number = 45; // degrees
    private gravity: number = 9.81; // m/s^2

    private containerElement: HTMLElement | null = null;
    private velocityInput: HTMLInputElement | null = null;
    private angleInput: HTMLInputElement | null = null;
    private simulateButton: HTMLButtonElement | null = null;
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private rangeDisplay: HTMLElement | null = null;
    private maxHeightDisplay: HTMLElement | null = null;
    private timeOfFlightDisplay: HTMLElement | null = null;

    private animationFrameId: number | null = null; // To store requestAnimationFrame ID for cleanup

    /**
     * @constructor
     * @description Initializes the ProjectileMotionGame instance.
     */
    constructor() {
        // Constructor is kept light. DOM interaction in 'initialize'.
    }

    /**
     * @method initialize
     * @param containerId The ID of the HTML element to inject the game UI into.
     * @description Sets up the game's UI, including input fields, canvas, and displays.
     * Attaches event listeners for user interaction.
     */
    initialize(containerId: string): void {
        this.containerElement = document.getElementById(containerId);
        if (!this.containerElement) {
            console.error(`Error: Container element with ID '${containerId}' not found for ProjectileMotionGame.`);
            return;
        }

        this.containerElement.innerHTML = `
            <div class="lab-game-container p-4 md:p-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl shadow-xl border border-border w-full max-w-2xl mx-auto my-8">
                <h3 class="text-3xl font-extrabold text-center text-foreground mb-6">
                    ${this.name}
                </h3>
                
                <p class="text-md text-muted-foreground text-center mb-6">
                    Enter initial velocity and launch angle to simulate a projectile's path.
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div class="p-4 bg-card rounded-xl shadow-inner border border-border">
                        <label for="velocityInput" class="block text-lg font-semibold text-foreground mb-2">
                            Initial Velocity (m/s):
                        </label>
                        <input type="number" id="velocityInput" min="1" max="200" step="1" value="${this.initialVelocity}"
                               class="w-full p-2 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200">
                    </div>
                    <div class="p-4 bg-card rounded-xl shadow-inner border border-border">
                        <label for="angleInput" class="block text-lg font-semibold text-foreground mb-2">
                            Launch Angle (degrees):
                        </label>
                        <input type="number" id="angleInput" min="0" max="90" step="1" value="${this.launchAngle}"
                               class="w-full p-2 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200">
                    </div>
                </div>

                <div class="text-center mb-6">
                    <button id="simulateButton"
                            class="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-full shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/50 transition transform hover:scale-105 active:scale-95 duration-200">
                        Simulate Trajectory
                    </button>
                </div>

                <div class="mb-6 p-4 bg-muted rounded-xl shadow-inner border border-border">
                    <h4 class="text-lg font-semibold text-foreground mb-2">Simulation Results:</h4>
                    <p class="text-foreground">Max Height: <span id="maxHeightDisplay" class="font-bold text-primary">0.00</span> m</p>
                    <p class="text-foreground">Range: <span id="rangeDisplay" class="font-bold text-primary">0.00</span> m</p>
                    <p class="text-foreground">Time of Flight: <span id="timeOfFlightDisplay" class="font-bold text-primary">0.00</span> s</p>
                </div>

                <div class="relative w-full overflow-hidden rounded-xl shadow-md border border-border bg-card">
                    <canvas id="projectileCanvas" class="w-full h-96 block bg-background rounded-xl"></canvas>
                    <div class="absolute bottom-2 left-2 text-muted-foreground text-sm">X-axis: Distance (m)</div>
                    <div class="absolute top-2 left-2 text-muted-foreground text-sm rotate-90 origin-top-left -translate-x-full">Y-axis: Height (m)</div>
                </div>
            </div>
        `;

        // Get references to DOM elements
        this.velocityInput = this.containerElement.querySelector("#velocityInput") as HTMLInputElement;
        this.angleInput = this.containerElement.querySelector("#angleInput") as HTMLInputElement;
        this.simulateButton = this.containerElement.querySelector("#simulateButton") as HTMLButtonElement;
        this.canvas = this.containerElement.querySelector("#projectileCanvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");
        this.rangeDisplay = this.containerElement.querySelector("#rangeDisplay");
        this.maxHeightDisplay = this.containerElement.querySelector("#maxHeightDisplay");
        this.timeOfFlightDisplay = this.containerElement.querySelector("#timeOfFlightDisplay");

        // Set canvas resolution for crisp drawing
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;

        // Add event listeners
        if (this.simulateButton) {
            this.simulateButton.addEventListener("click", this.handleSimulateClick);
        }
        if (this.velocityInput) {
            this.velocityInput.addEventListener("input", this.handleInputChange);
        }
        if (this.angleInput) {
            this.angleInput.addEventListener("input", this.handleInputChange);
        }

        // Initial render to draw axes
        this.render();
    }

    /**
     * @method handleInputChange
     * @description Handles input changes for velocity and angle, updating the internal state.
     */
    private handleInputChange = (): void => {
        if (this.velocityInput) {
            this.initialVelocity = parseFloat(this.velocityInput.value) || 0;
        }
        if (this.angleInput) {
            this.launchAngle = parseFloat(this.angleInput.value) || 0;
        }
        // No immediate re-render on input change, only on simulate click
    }

    /**
     * @method handleSimulateClick
     * @description Event handler for the simulate button. Triggers the simulation.
     */
    private handleSimulateClick = (): void => {
        this.render(); // Re-render/draw trajectory
    }

    /**
     * @method calculateTrajectoryPoints
     * @description Calculates an array of {x, y} coordinates for the projectile's trajectory.
     * @returns An array of objects, each with x and y coordinates.
     */
    private calculateTrajectoryPoints(): { x: number; y: number }[] {
        const points: { x: number; y: number }[] = [];
        const angleRad = (this.launchAngle * Math.PI) / 180; // Convert angle to radians
        const Vx = this.initialVelocity * Math.cos(angleRad); // Initial horizontal velocity
        const Vy = this.initialVelocity * Math.sin(angleRad); // Initial vertical velocity

        // Calculate time of flight
        const timeOfFlight = (2 * Vy) / this.gravity;
        if (this.timeOfFlightDisplay) {
            this.timeOfFlightDisplay.textContent = timeOfFlight.toFixed(2);
        }

        // Calculate maximum height
        const maxHeight = (Vy * Vy) / (2 * this.gravity);
        if (this.maxHeightDisplay) {
            this.maxHeightDisplay.textContent = maxHeight.toFixed(2);
        }

        // Calculate horizontal range
        const range = Vx * timeOfFlight;
        if (this.rangeDisplay) {
            this.rangeDisplay.textContent = range.toFixed(2);
        }

        // Generate points for drawing the trajectory
        const numSteps = 100; // Number of points to draw the curve
        const timeStep = timeOfFlight / numSteps;

        for (let i = 0; i <= numSteps; i++) {
            const t = i * timeStep;
            const x = Vx * t;
            const y = Vy * t - 0.5 * this.gravity * t * t; // Equation for vertical position
            points.push({ x, y });
        }
        return points;
    }

    /**
     * @method drawCanvas
     * @param trajectoryPoints An array of points representing the projectile's path.
     * @description Clears the canvas and draws the trajectory, axes, and scale.
     */
    private drawCanvas(trajectoryPoints: { x: number; y: number }[]): void {
        if (!this.ctx || !this.canvas) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear previous drawing

        const padding = 40; // Padding for axes labels and values
        const canvasWidth = this.canvas.width - padding * 2;
        const canvasHeight = this.canvas.height - padding * 2;

        // Find max x and y values for scaling
        let maxX = Math.max(...trajectoryPoints.map(p => p.x));
        let maxY = Math.max(...trajectoryPoints.map(p => p.y));

        // Ensure minimum scale to avoid division by zero or tiny graphs
        maxX = Math.max(maxX, 10);
        maxY = Math.max(maxY, 10);

        const scaleX = canvasWidth / maxX;
        const scaleY = canvasHeight / maxY;

        // Draw X and Y axes
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'hsl(var(--muted-foreground))';
        this.ctx.lineWidth = 2;

        // X-axis
        this.ctx.moveTo(padding, this.canvas.height - padding);
        this.ctx.lineTo(this.canvas.width - padding, this.canvas.height - padding);

        // Y-axis
        this.ctx.moveTo(padding, this.canvas.height - padding);
        this.ctx.lineTo(padding, padding);
        this.ctx.stroke();

        this.ctx.font = '12px Inter';
        this.ctx.fillStyle = 'hsl(var(--foreground))';

        // Draw X-axis labels
        const numXLabels = 5;
        for (let i = 0; i <= numXLabels; i++) {
            const xVal = (maxX / numXLabels) * i;
            const screenX = padding + xVal * scaleX;
            this.ctx.fillText(xVal.toFixed(0), screenX - 10, this.canvas.height - padding + 20);
            this.ctx.beginPath();
            this.ctx.moveTo(screenX, this.canvas.height - padding - 5);
            this.ctx.lineTo(screenX, this.canvas.height - padding + 5);
            this.ctx.stroke();
        }

        // Draw Y-axis labels
        const numYLabels = 5;
        for (let i = 0; i <= numYLabels; i++) {
            const yVal = (maxY / numYLabels) * i;
            const screenY = this.canvas.height - padding - yVal * scaleY;
            this.ctx.fillText(yVal.toFixed(0), padding - 30, screenY + 5);
            this.ctx.beginPath();
            this.ctx.moveTo(padding - 5, screenY);
            this.ctx.lineTo(padding + 5, screenY);
            this.ctx.stroke();
        }

        // Draw trajectory
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'hsl(var(--primary))';
        this.ctx.lineWidth = 3;
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';

        if (trajectoryPoints.length > 0) {
            // Map physics coordinates to canvas coordinates (origin at bottom-left)
            const startX = padding + trajectoryPoints[0].x * scaleX;
            const startY = this.canvas.height - padding - trajectoryPoints[0].y * scaleY;
            this.ctx.moveTo(startX, startY);

            for (let i = 1; i < trajectoryPoints.length; i++) {
                const p = trajectoryPoints[i];
                const screenX = padding + p.x * scaleX;
                // Invert Y-axis for canvas drawing (canvas Y increases downwards)
                const screenY = this.canvas.height - padding - p.y * scaleY;
                this.ctx.lineTo(screenX, screenY);
            }
        }
        this.ctx.stroke();
    }

    /**
     * @method update
     * @param deltaTime Not actively used for continuous animation in this version,
     * but could be used for an animated projectile dot.
     */
    update(deltaTime: number): void {
        // This game updates on button click rather than continuously,
        // but this method is kept for interface compliance.
    }

    /**
     * @method render
     * @description Calculates the trajectory and draws it on the canvas,
     * also updates the displayed metrics.
     */
    render(): void {
        if (!this.canvas || !this.ctx) {
            console.warn("Canvas or context not available for rendering.");
            return;
        }

        const points = this.calculateTrajectoryPoints();
        this.drawCanvas(points);
    }

    /**
     * @method dispose
     * @description Cleans up event listeners and clears the canvas and container.
     */
    dispose(): void {
        if (this.simulateButton) {
            this.simulateButton.removeEventListener("click", this.handleSimulateClick);
        }
        if (this.velocityInput) {
            this.velocityInput.removeEventListener("input", this.handleInputChange);
        }
        if (this.angleInput) {
            this.angleInput.removeEventListener("input", this.handleInputChange);
        }
        if (this.containerElement) {
            this.containerElement.innerHTML = "";
        }
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }

    /**
     * @method setLaunchParameters
     * @param velocity Sets the initial velocity.
     * @param angle Sets the launch angle.
     */
    public setLaunchParameters(velocity: number, angle: number): void {
        this.initialVelocity = velocity;
        this.launchAngle = angle;
        if (this.velocityInput) {
            this.velocityInput.value = this.initialVelocity.toString();
        }
        if (this.angleInput) {
            this.angleInput.value = this.launchAngle.toString();
        }
        this.render(); // Re-render after setting parameters
    }
}

/**
 * @class CellStructureGame
 * @implements LabGame
 * @description A biology lab game where users can explore different parts of a cell
 * and learn about their functions by clicking on them.
 */
class CellStructureGame implements LabGame {
    public id: string = "cell-structure";
    public name: string = "Cell Structure Viewer";
    public description: string = "Explore the parts of a cell and learn their functions.";

    private containerElement: HTMLElement | null = null;
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private infoDisplayElement: HTMLElement | null = null;
    private organelleDescriptionElement: HTMLElement | null = null;
    private selectedOrganelle: any | null = null;
    private hoveredOrganelle: any | null = null;

    // Define organelles and their properties
    private organelles: any[] = [
        {
            name: "Nucleus",
            description: "The control center of the cell, containing genetic material.",
            shape: "circle", x: 0, y: 0, radius: 40,
            color: "hsl(var(--secondary))", hoverColor: "hsl(var(--secondary) / 0.8)",
        },
        {
            name: "Mitochondria",
            description: "The powerhouse of the cell, generating energy (ATP).",
            shape: "ellipse", x: 80, y: -50, radiusX: 30, radiusY: 15, rotation: Math.PI / 6,
            color: "hsl(var(--accent))", hoverColor: "hsl(var(--accent) / 0.8)",
        },
        {
            name: "Endoplasmic Reticulum",
            description: "Network of membranes involved in protein and lipid synthesis.",
            shape: "rectangle", x: -70, y: 30, width: 80, height: 40,
            color: "hsl(var(--muted))", hoverColor: "hsl(var(--muted) / 0.8)",
        },
        {
            name: "Ribosomes",
            description: "Synthesize proteins. Found free or on ER.",
            shape: "circle", x: 10, y: 60, radius: 8,
            color: "hsl(var(--destructive))", hoverColor: "hsl(var(--destructive) / 0.8)",
        },
        {
            name: "Golgi Apparatus",
            description: "Modifies, sorts, and packages proteins and lipids.",
            shape: "rectangle", x: 50, y: 70, width: 60, height: 30,
            color: "hsl(var(--ring))", hoverColor: "hsl(var(--ring) / 0.8)",
        },
        {
            name: "Cytoplasm",
            description: "Jelly-like substance filling the cell, where organelles are suspended.",
            shape: "boundary",
            color: "hsl(var(--background))", hoverColor: "hsl(var(--background))",
        }
    ];

    constructor() {}

    initialize(containerId: string): void {
        this.containerElement = document.getElementById(containerId);
        if (!this.containerElement) {
            console.error(`Error: Container element with ID '${containerId}' not found for CellStructureGame.`);
            return;
        }

        this.containerElement.innerHTML = `
            <div class="lab-game-container p-4 md:p-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl shadow-xl border border-border w-full max-w-2xl mx-auto my-8">
                <h3 class="text-3xl font-extrabold text-center text-foreground mb-6">
                    ${this.name}
                </h3>
                
                <p class="text-md text-muted-foreground text-center mb-6">
                    Click on parts of the cell to learn about them!
                </p>

                <div class="relative w-full overflow-hidden rounded-xl shadow-md border border-border bg-card mb-6">
                    <canvas id="cellCanvas" class="w-full h-96 block bg-background rounded-xl"></canvas>
                </div>

                <div id="organelleInfo" class="p-4 bg-card rounded-xl shadow-inner border border-border">
                    <h4 class="text-lg font-semibold text-foreground mb-2">Selected Organelle: <span id="organelleName" class="font-bold text-primary">None</span></h4>
                    <p id="organelleDescription" class="text-muted-foreground">Click an organelle on the diagram to see its description here.</p>
                </div>
            </div>
        `;

        this.canvas = this.containerElement.querySelector("#cellCanvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");
        this.infoDisplayElement = this.containerElement.querySelector("#organelleName");
        this.organelleDescriptionElement = this.containerElement.querySelector("#organelleDescription");

        this.resizeCanvas();
        window.addEventListener('resize', this.resizeCanvas.bind(this));

        if (this.canvas) {
            this.canvas.addEventListener("click", this.handleCanvasClick);
            this.canvas.addEventListener("mousemove", this.handleMouseMove);
            this.canvas.addEventListener("mouseleave", this.handleMouseLeave);
        }
        
        this.render();
    }

    private resizeCanvas = (): void => {
        if (this.canvas) {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
            this.render();
        }
    }

    private handleCanvasClick = (event: MouseEvent): void => {
        if (!this.canvas || !this.ctx) return;

        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        const mouseX = (event.clientX - rect.left) * scaleX;
        const mouseY = (event.clientY - rect.top) * scaleY;

        const cellX = mouseX - this.canvas.width / 2;
        const cellY = -(mouseY - this.canvas.height / 2);

        let clickedOrganelle: any | null = null;
        for (let i = this.organelles.length - 1; i >= 0; i--) {
            const organelle = this.organelles[i];
            if (organelle.shape === "boundary") continue;

            if (this.isPointInOrganelle(cellX, cellY, organelle)) {
                clickedOrganelle = organelle;
                break;
            }
        }

        if (clickedOrganelle) {
            this.selectedOrganelle = clickedOrganelle;
            this.updateInfoDisplay();
            this.render();
        } else {
            this.selectedOrganelle = null;
            this.updateInfoDisplay();
            this.render();
        }
    }

    private handleMouseMove = (event: MouseEvent): void => {
        if (!this.canvas || !this.ctx) return;

        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        const mouseX = (event.clientX - rect.left) * scaleX;
        const mouseY = (event.clientY - rect.top) * scaleY;

        const cellX = mouseX - this.canvas.width / 2;
        const cellY = -(mouseY - this.canvas.height / 2);

        let hoveredOrganelle: any | null = null;
        for (let i = this.organelles.length - 1; i >= 0; i--) {
            const organelle = this.organelles[i];
            if (this.isPointInOrganelle(cellX, cellY, organelle) && organelle.shape !== "boundary") {
                hoveredOrganelle = organelle;
                break;
            }
        }

        if (hoveredOrganelle !== this.hoveredOrganelle) {
            this.hoveredOrganelle = hoveredOrganelle;
            this.render();
        }
    }

    private handleMouseLeave = (): void => {
        if (this.hoveredOrganelle !== null) {
            this.hoveredOrganelle = null;
            this.render();
        }
    }

    private isPointInOrganelle(px: number, py: number, organelle: any): boolean {
        switch (organelle.shape) {
            case "circle":
                const dist = Math.sqrt(Math.pow(px - organelle.x, 2) + Math.pow(py - organelle.y, 2));
                return dist <= organelle.radius;
            case "ellipse":
                const cx = organelle.x;
                const cy = organelle.y;
                const rx = organelle.radiusX;
                const ry = organelle.radiusY;
                const angle = organelle.rotation || 0;

                const tempX = px - cx;
                const tempY = py - cy;

                const cosAngle = Math.cos(-angle);
                const sinAngle = Math.sin(-angle);
                const rotatedX = tempX * cosAngle - tempY * sinAngle;
                const rotatedY = tempX * sinAngle + tempY * cosAngle;

                const rxSq = rx * rx;
                const rySq = ry * ry;

                if (rxSq === 0 || rySq === 0) return false;

                return (rotatedX * rotatedX) / rxSq + (rotatedY * rotatedY) / rySq <= 1;

            case "rectangle":
                const rectX1 = organelle.x - organelle.width / 2;
                const rectY1 = organelle.y - organelle.height / 2;
                const rectX2 = organelle.x + organelle.width / 2;
                const rectY2 = organelle.y + organelle.height / 2;
                return px >= rectX1 && px <= rectX2 && py >= rectY1 && py <= rectY2;
            case "boundary":
                const boundaryRadius = 150;
                const boundaryDist = Math.sqrt(Math.pow(px, 2) + Math.pow(py, 2));
                return boundaryDist <= boundaryRadius;
            default:
                return false;
        }
    }

    private updateInfoDisplay(): void {
        if (this.infoDisplayElement && this.organelleDescriptionElement) {
            if (this.selectedOrganelle) {
                this.infoDisplayElement.textContent = this.selectedOrganelle.name;
                this.organelleDescriptionElement.textContent = this.selectedOrganelle.description;
            } else {
                this.infoDisplayElement.textContent = "None";
                this.organelleDescriptionElement.textContent = "Click an organelle on the diagram to see its description here.";
            }
        }
    }

    private drawOrganelle(ctx: CanvasRenderingContext2D, organelle: any, offsetX: number, offsetY: number, isSelected: boolean, isHovered: boolean): void {
        ctx.save();
        ctx.beginPath();

        const drawX = offsetX + organelle.x;
        const drawY = offsetY - organelle.y;

        let fillColor = organelle.color;
        if (isSelected && organelle.shape !== "boundary") {
            fillColor = "hsl(var(--primary) / 0.8)";
        } else if (isHovered && organelle.shape !== "boundary") {
            fillColor = organelle.hoverColor || organelle.color;
        }

        ctx.fillStyle = fillColor;
        ctx.strokeStyle = "hsl(var(--border))";
        ctx.lineWidth = 2;

        switch (organelle.shape) {
            case "circle":
                ctx.arc(drawX, drawY, organelle.radius, 0, Math.PI * 2);
                break;
            case "ellipse":
                ctx.ellipse(drawX, drawY, organelle.radiusX, organelle.radiusY, organelle.rotation || 0, 0, Math.PI * 2);
                break;
            case "rectangle":
                ctx.rect(drawX - organelle.width / 2, drawY - organelle.height / 2, organelle.width, organelle.height);
                break;
            case "boundary":
                ctx.arc(offsetX, offsetY, 150, 0, Math.PI * 2);
                ctx.lineWidth = 3;
                ctx.strokeStyle = "hsl(var(--primary))";
                ctx.fillStyle = organelle.color;
                ctx.fill();
                ctx.stroke();
                ctx.restore();
                return;
            default:
                break;
        }

        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    update(deltaTime: number): void {
        // Static viewer, no continuous updates needed
    }

    render(): void {
        if (!this.canvas || !this.ctx) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const offsetX = this.canvas.width / 2;
        const offsetY = this.canvas.height / 2;

        const cytoplasm = this.organelles.find(o => o.name === "Cytoplasm");
        if (cytoplasm) {
            this.drawOrganelle(this.ctx, cytoplasm, offsetX, offsetY, false, false);
        }

        this.organelles.forEach(organelle => {
            if (organelle.shape !== "boundary") {
                const isSelected = this.selectedOrganelle === organelle;
                const isHovered = this.hoveredOrganelle === organelle;
                this.drawOrganelle(this.ctx, organelle, offsetX, offsetY, isSelected, isHovered);
            }
        });
    }

    dispose(): void {
        if (this.canvas) {
            this.canvas.removeEventListener("click", this.handleCanvasClick);
            this.canvas.removeEventListener("mousemove", this.handleMouseMove);
            this.canvas.removeEventListener("mouseleave", this.handleMouseLeave);
        }
        window.removeEventListener('resize', this.resizeCanvas);
        if (this.containerElement) {
            this.containerElement.innerHTML = "";
        }
    }
}

// Export the interface and game classes for easy import
export type { LabGame };
export { PHSimulationGame, ProjectileMotionGame, CellStructureGame };