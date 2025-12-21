
export class ParticleSystem {
    particles: Float32Array;
    count: number;
    width: number;
    height: number;

    constructor(count: number, width: number, height: number) {
        this.count = count;
        this.width = width;
        this.height = height;
        // x, y, vx, vy, life, speedOffset
        this.particles = new Float32Array(count * 6);
        this.init();
    }

    init() {
        for (let i = 0; i < this.count; i++) {
            this.resetParticle(i, true);
        }
    }

    resetParticle(i: number, randomStart = false) {
        const idx = i * 6;
        const angle = Math.random() * Math.PI * 2;
        // Start from center or random position
        const dist = randomStart ? Math.random() * Math.min(this.width, this.height) * 0.5 : 0;
        
        this.particles[idx] = this.width / 2 + Math.cos(angle) * dist;
        this.particles[idx + 1] = this.height / 2 + Math.sin(angle) * dist;
        
        // Base velocity outward
        const speed = Math.random() * 2 + 0.5;
        this.particles[idx + 2] = Math.cos(angle) * speed;
        this.particles[idx + 3] = Math.sin(angle) * speed;
        
        this.particles[idx + 4] = Math.random(); // Life (0-1)
        this.particles[idx + 5] = Math.random(); // Speed modifier
    }

    update(gflops: number, ctx: CanvasRenderingContext2D) {
        // Clear with trails
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, this.width, this.height);

        // Intensity based on GFLOPS (0 to ~1000 range expected, map to 0-1 factor)
        const intensity = Math.min(gflops / 500, 2); 
        const speedMultiplier = 1 + intensity * 5;
        
        // Color mapping based on intensity: Blue -> Cyan -> White -> Orange -> Red
        let r = 0, g = 0, b = 0;
        if (intensity < 0.2) { r=50; g=100; b=255; } // Blue
        else if (intensity < 0.5) { r=0; g=255; b=255; } // Cyan
        else if (intensity < 0.8) { r=255; g=255; b=255; } // White
        else if (intensity < 1.2) { r=255; g=165; b=0; } // Orange
        else { r=255; g=50; b=50; } // Red

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        
        for (let i = 0; i < this.count; i++) {
            const idx = i * 6;
            
            // Move
            this.particles[idx] += this.particles[idx + 2] * speedMultiplier * this.particles[idx + 5];
            this.particles[idx + 1] += this.particles[idx + 3] * speedMultiplier * this.particles[idx + 5];
            
            // Render
            const size = Math.max(1, intensity * 3 * this.particles[idx + 5]);
            ctx.fillRect(this.particles[idx], this.particles[idx + 1], size, size);

            // Reset if out of bounds
            if (
                this.particles[idx] < 0 || 
                this.particles[idx] > this.width || 
                this.particles[idx + 1] < 0 || 
                this.particles[idx + 1] > this.height
            ) {
                this.resetParticle(i);
            }
        }
        
        // Draw Center Core
        const coreSize = 10 + intensity * 40;
        const gradient = ctx.createRadialGradient(
            this.width/2, this.height/2, coreSize * 0.1, 
            this.width/2, this.height/2, coreSize
        );
        gradient.addColorStop(0, 'white');
        gradient.addColorStop(0.4, `rgba(${r},${g},${b},0.8)`);
        gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.width/2, this.height/2, coreSize, 0, Math.PI * 2);
        ctx.fill();
    }
}
