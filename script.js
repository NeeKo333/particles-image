window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  class Controller {
    constructor(width, height, context) {
      this.width = width;
      this.height = height;
      this.context = context;
      this.image = document.getElementById("image");

      this.centerX = this.width / 2;
      this.centerY = this.height / 2;
      this.x = this.centerX - this.image.width / 2;
      this.y = this.centerY - this.image.height / 2;

      this.particles = [];
      this.gap = 3;

      this.mouse = {
        radius: 3000,
        x: 0,
        y: 0,
      };

      canvas.addEventListener("mousemove", (event) => {
        this.mouse.x = event.x;
        this.mouse.y = event.y;
      });
    }

    init() {
      this.context.drawImage(this.image, this.x, this.y);
      const pixels = this.context.getImageData(0, 0, this.width, this.height).data;

      for (let y = 0; y < this.height; y += this.gap) {
        for (let x = 0; x < this.width; x += this.gap) {
          const index = (y * this.width + x) * 4;

          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels[index + 2];
          const color = "rgb(" + red + "," + green + "," + blue + ")";

          const alpha = pixels[index + 3];

          if (alpha > 0) {
            this.particles.push(new Particle(this, x, y, color));
          }
        }
      }
      this.context.clearRect(0, 0, this.width, this.height);
    }

    update() {
      this.context.clearRect(0, 0, this.width, this.height);
      this.particles.forEach((p) => {
        p.updatePosition();
        p.draw(this.context);
      });
    }
  }

  class Particle {
    constructor(controller, x, y, color) {
      this.controller = controller;

      this.originX = x;
      this.originY = y;
      this.x = Math.random() * controller.width;
      this.y = Math.random() * controller.height;

      this.size = 2.5;
      this.color = color;

      this.cathetusX = 0;
      this.cathetusY = 0;

      this.force = 0;
      this.angle = 0;
      this.distance = 0;
      this.ease = 0.03;
    }

    updatePosition() {
      this.x += (this.originX - this.x) * this.ease;
      this.y += (this.originY - this.y) * this.ease;

      this.cathetusX = this.controller.mouse.x - this.x;
      this.cathetusY = this.controller.mouse.y - this.y;

      this.distance = Math.pow(this.cathetusX, 2) + Math.pow(this.cathetusY, 2);
      this.force = -this.controller.mouse.radius / this.distance;

      if (this.distance < this.controller.mouse.radius) {
        this.angle = Math.atan2(this.cathetusY, this.cathetusX);
        this.x += this.force * Math.cos(this.angle);
        this.y += this.force * Math.sin(this.angle);
      }
    }

    draw(context) {
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, this.size, this.size);
    }
  }

  const controller = new Controller(canvas.width, canvas.height, ctx);
  controller.init();

  function animate() {
    controller.update();
    requestAnimationFrame(animate);
  }
  animate();
});
