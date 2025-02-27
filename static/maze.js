const { createApp } = Vue;

createApp({
    data() {
        return {
            maze: [
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
                [1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,0,1],
                [1,0,0,0,1,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1,0,0,1],
                [1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1,1,0,1],
                [1,0,1,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
                [1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1,1,1,1,0,1],
                [1,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,1],
                [1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1],
                [1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,1],
                [1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,0,1],
                [1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,1],
                [1,0,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,1,0,1],
                [1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,0,1],
                [1,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,1,0,1,0,1],
                [1,0,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,0,1,0,1],
                [1,0,1,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,1,0,1,0,0,0,1],
                [1,0,1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,0,1,1,1,0,1],
                [1,0,1,0,1,0,0,1,0,0,0,0,0,0,1,0,1,0,1,0,0,0,1,0,1],
                [1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,0,1,0,1],
                [1,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,1],
                [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
            ],
            tileSize: 16,
            player: { x: 1, y: 1 },
            trophy: { x: 23, y: 23 },
            steps: 0,
            time: 0,
            gameWon: false,
            ctx: null,
            timer: null,
            showHelp: false,
            bfsCode: `
def bfs(maze, start, goal):
    queue = [(start, [start])]
    visited = set()

    while queue:
        (vertex, path) = queue.pop(0)
        if vertex in visited:
            continue

        for next in get_neighbors(maze, vertex):
            if next in visited:
                continue
            if next == goal:
                return path + [next]
            queue.append((next, path + [next]))

        visited.add(vertex)
    return None
            `,
            shortestPath: [],
        }
    },
    computed: {
        formattedTime() {
            const minutes = Math.floor(this.time / 60);
            const seconds = this.time % 60;
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    },
    mounted() {
        console.log('bfsCode:', this.bfsCode);
        this.initGame();
        window.addEventListener('keydown', this.handleKeyPress);
    },
    methods: {
        initGame() {
            const canvas = this.$refs.mazeCanvas;
            this.ctx = canvas.getContext('2d');
            canvas.width = this.maze[0].length * this.tileSize;
            canvas.height = this.maze.length * this.tileSize;
            this.draw();
            this.startTimer();
        },
        draw() {
            this.ctx.clearRect(0, 0, this.$refs.mazeCanvas.width, this.$refs.mazeCanvas.height);
            this.drawMaze();
            this.drawPlayer();
            this.drawTrophy();
            if (this.shortestPath) {
                this.drawShortestPath();
            }
        },
        drawMaze() {
            for (let y = 0; y < this.maze.length; y++) {
                for (let x = 0; x < this.maze[y].length; x++) {
                    if (this.maze[y][x] === 1) {
                        this.ctx.fillStyle = '#2c3e50';
                        this.ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
                        this.ctx.strokeStyle = '#34495e';
                        this.ctx.strokeRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
                    }
                }
            }
        },
        drawPlayer() {
            this.ctx.fillStyle = '#3498db';
            this.ctx.beginPath();
            this.ctx.arc(this.player.x * this.tileSize + this.tileSize / 2, this.player.y * this.tileSize + this.tileSize / 2, this.tileSize / 2 - 2, 0, Math.PI * 2);
            this.ctx.fill();
        },
        drawTrophy() {
            this.ctx.fillStyle = '#f1c40f';
            this.ctx.beginPath();
            this.ctx.moveTo(this.trophy.x * this.tileSize + this.tileSize / 2, this.trophy.y * this.tileSize);
            this.ctx.lineTo(this.trophy.x * this.tileSize + this.tileSize, this.trophy.y * this.tileSize + this.tileSize);
            this.ctx.lineTo(this.trophy.x * this.tileSize, this.trophy.y * this.tileSize + this.tileSize);
            this.ctx.closePath();
            this.ctx.fill();
        },
        handleKeyPress(e) {
            if (this.gameWon) return;
            
            let dx = 0, dy = 0;
            switch (e.key) {
                case 'ArrowUp':
                case 'w': dy = -1; break;
                case 'ArrowDown':
                case 's': dy = 1; break;
                case 'ArrowLeft':
                case 'a': dx = -1; break;
                case 'ArrowRight':
                case 'd': dx = 1; break;
                default: return;
            }
            this.movePlayer(dx, dy);
        },
        movePlayer(dx, dy) {
            const newX = this.player.x + dx;
            const newY = this.player.y + dy;

            if (newX >= 0 && newX < this.maze[0].length && newY >= 0 && newY < this.maze.length && this.maze[newY][newX] !== 1) {
                this.player.x = newX;
                this.player.y = newY;
                this.steps++;
                this.draw();

                if (this.player.x === this.trophy.x && this.player.y === this.trophy.y) {
                    this.gameWon = true;
                    this.stopTimer();
                }
            }
        },
        resetGame() {
            this.player = { x: 1, y: 1 };
            this.steps = 0;
            this.time = 0;
            this.gameWon = false;
            this.stopTimer();
            this.startTimer();
            this.draw();
            this.shortestPath = [];
        },
        startTimer() {
            this.timer = setInterval(() => {
                this.time++;
            }, 1000);
        },
        stopTimer() {
            clearInterval(this.timer);
        },
        toggleHelp() {
            this.showHelp = !this.showHelp;
            console.log('showHelp:', this.showHelp);
        },
        runBFS() {
            // Implement BFS in JavaScript
            const queue = [[[this.player.x, this.player.y], [[this.player.x, this.player.y]]]];
            const visited = new Set();

            while (queue.length > 0) {
                const [[x, y], path] = queue.shift();
                if (x === this.trophy.x && y === this.trophy.y) {
                    this.shortestPath = path;
                    this.visualizeShortestPath();
                    return;
                }

                const key = `${x},${y}`;
                if (!visited.has(key)) {
                    visited.add(key);
                    for (const [dx, dy] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
                        const nextX = x + dx;
                        const nextY = y + dy;
                        if (nextX >= 0 && nextX < this.maze[0].length &&
                            nextY >= 0 && nextY < this.maze.length &&
                            this.maze[nextY][nextX] !== 1 &&
                            !visited.has(`${nextX},${nextY}`)) {
                            queue.push([[nextX, nextY], [...path, [nextX, nextY]]]);
                        }
                    }
                }
            }
        },
        visualizeShortestPath() {
            this.draw();
            this.ctx.strokeStyle = '#e74c3c';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(this.shortestPath[0][0] * this.tileSize + this.tileSize / 2,
                            this.shortestPath[0][1] * this.tileSize + this.tileSize / 2);
            for (let i = 1; i < this.shortestPath.length; i++) {
                this.ctx.lineTo(this.shortestPath[i][0] * this.tileSize + this.tileSize / 2,
                                this.shortestPath[i][1] * this.tileSize + this.tileSize / 2);
            }
            this.ctx.stroke();
        },
        drawShortestPath() {
            this.ctx.strokeStyle = 'rgba(46, 204, 113, 0.8)';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.shortestPath.forEach(([x, y], index) => {
                if (index === 0) {
                    this.ctx.moveTo(x * this.tileSize + this.tileSize / 2, y * this.tileSize + this.tileSize / 2);
                } else {
                    this.ctx.lineTo(x * this.tileSize + this.tileSize / 2, y * this.tileSize + this.tileSize / 2);
                }
            });
            this.ctx.stroke();
        },
    }
}).mount('#app');

app.config.compilerOptions.delimiters = ['[[', ']]'];
