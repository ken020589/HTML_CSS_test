const canvas = document.getElementById("canvas1");
var c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var mouse = {
    x: null,
    y: null,
    mRadius: (canvas.height / 100) * (canvas.width / 100),
}

var click = Boolean(false);
//var positionX = [];
//var positionY = [];
var maxRadius = 40;
var particlesArray = [];
var colorArray = [
    '#FD6833',
    '#E3432D',
    '#FA3E52',
    '#E32D9A',
    '#F233FD',
    '#FAB74D',
    '#FDDB42',
    '#33FD7D',
    '#2DE3A3',
    '#3FFAEF',
    '#2DBEE3',
];

window.addEventListener('mousemove',
    function (event) {
        mouse.x = event.x;
        mouse.y = event.y;
    }
);

window.addEventListener('mousedown',
    function (event) {
        mouse.x = event.x;
        mouse.y = event.y;
        click = !click;
        //positionX = positionX.push(particles.x);
        //positionY = positionY.push(particles.y);
    }
);

window.addEventListener('mouseup',
    function (event) {
        mouse.x = event.x;
        mouse.y = event.y;
        click = !click;
    }
);

window.addEventListener('resize',
    function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        init();
    }
);

window.addEventListener('mouseout',
    function () {
        mouse.x = undefined;
        mouse.y = undefined;
    }
);

class particles {
    constructor(x, y, directionX, directionY, radius) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.radius = radius;
        this.minRadius = radius;
        this.color = colorArray[Math.floor(Math.random() * colorArray.length)];

        this.th = 0;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }

    update() {
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.directionY = -this.directionY;
        }

        this.x += this.directionX;
        this.y += this.directionY;

        var positionX = [];
        var positionY = [];
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.mRadius + this.radius) {
            positionX = positionX[this.x];
            positionY = positionY[this.y];
        }

        if (click) {
            //this.th += 2;
            if (distance < mouse.mRadius + this.radius) {
                if (mouse.x < this.x && this.x < canvas.width - this.radius * 5) {
                    this.x += distance / 25;
                }
                if (mouse.x > this.x && this.x > this.radius * 5) {
                    this.x -= distance / 25;
                }
                if (mouse.y < this.y && this.y < canvas.width - this.radius * 5) {
                    this.y += distance / 25;
                }
                if (mouse.y > this.y && this.y > this.radius * 5) {
                    this.y -= distance / 25;
                }
            }
        } else {

            /*if (distance < mouse.mRadius + this.radius) {
                this.x = positionX;
                this.y = positionY;
            }*/

            /*if (positionDistance < mouse.mRadius + this.radius) {
                if (mouse.x < positionX && positionX < canvas.width - this.radius * 5) {
                    this.x -= distance / 30;
                }
                if (mouse.x > positionX && positionX > this.radius * 5) {
                    this.x += distance / 30;
                }
                if (mouse.y < positionY && positionY < canvas.width - this.radius * 5) {
                    this.y -= distance / 30;
                }
                if (mouse.y > positionY && positionY > this.radius * 5) {
                    this.y += distance / 30;
                }
            }*/
        }

        if (mouse.x - this.x < 50 && mouse.x - this.x > -50 && mouse.y - this.y < 50 && mouse.y - this.y > -50) {
            if (this.radius < maxRadius) {
                this.radius += 1;
            }
            //this.dx = Math.cos(th);
            //this.dy = Math.sin(th);
        }
        else if (this.radius > this.minRadius) {
            this.radius -= 1;
        }

        this.draw();
    }
}

function init() {
    particlesArray = [];
    let numberOfParticle = (canvas.height * canvas.width) / 9000;
    for (var i = 0; i < numberOfParticle * 2; i++) {
        var radius = (Math.random() * 6) + 1;
        var x = Math.random() * (innerWidth - radius * 2) + radius;
        var y = Math.random() * (innerHeight - radius * 2) + radius;
        var directionX = (Math.random() - 0.5) * 5;
        var directionY = (Math.random() - 0.5) * 5;

        particlesArray.push(new particles(x, y, directionX, directionY, radius));
    }
    //console.log(particlesArray);
}

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = 0; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width / 18) * (canvas.height / 18)) {
                opacityValue = 1 - (distance / 20000);
                c.strokeStyle = colorArray[Math.floor(Math.random() * colorArray.length)];
                c.lineWidth = 0.7;
                c.beginPath();
                c.moveTo(particlesArray[a].x, particlesArray[a].y);
                c.lineTo(particlesArray[b].x, particlesArray[b].y);
                c.stroke();
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);

    for (var i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }

    connect();
}

init();
animate();