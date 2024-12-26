const gui = new dat.GUI();
const c = document.getElementById("c");
const ctx = c.getContext("2d");

const configs = {
  branchReduceFactor: 0.8,
  angle: 30,
  maxDepth: 10,
  branchWidthFactor: 0.55,
  rootLength: 100,
};

gui.add(configs, "angle", 0, 180);
gui.add(configs, "branchReduceFactor", 0, 1);
gui.add(configs, "maxDepth", 1, 15);
gui.add(configs, "branchWidthFactor", 0.1, 0.8);
gui.add(configs, "rootLength", 100, 200);

c.width = innerWidth;
c.height = innerHeight;

function getLineCord(x, y, length, angle = 0) {
  const toRadian = (angle * Math.PI) / 180;
  let x1 = length * Math.cos(toRadian) + x;
  let y1 = length * Math.sin(toRadian) + y;
  return [x, y, x1, y1];
}
function drawLine(a, b, c, d, color = "white", width = 1) {
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(a, b);
  ctx.lineTo(c, d);
  ctx.stroke();
}

function branch(x, y, length, angle, depth = 1) {
  if (depth > configs.maxDepth) return;
  let [x0, y0, x1, y1] = getLineCord(x, y, length, angle - configs.angle);
  let [rx0, ry0, rx1, ry1] = getLineCord(
    x,
    y,
    length,
    angle + configs.angle
  );
  drawLine(
    x0,
    y0,
    x1,
    y1,
    `hsl(${depth * 15}, 100%, 50%)`,
    (configs.maxDepth - depth) * configs.branchWidthFactor
  );
  drawLine(
    rx0,
    ry0,
    rx1,
    ry1,
    `hsl(${depth * 15}, 100%, 50%)`,
    (configs.maxDepth - depth) * configs.branchWidthFactor
  );

  branch(
    x1,
    y1,
    length * configs.branchReduceFactor,
    angle - configs.angle,
    depth + 1
  );
  branch(
    rx1,
    ry1,
    length * configs.branchReduceFactor,
    angle + configs.angle,
    depth + 1
  );
}

function animate() {
  requestAnimationFrame(animate);
  ctx.fillStyle = "black";
  ctx.clearRect(0, 0, c.width, c.height);
  let [x, y, x1, y1] = getLineCord(
    c.width / 2,
    c.height,
    configs.rootLength,
    -90
  );
  drawLine(
    x,
    y,
    x1,
    y1,
    "hsl(15, 100%, 50% )",
    configs.branchWidthFactor * configs.maxDepth
  );
  branch(x1, y1, configs.rootLength * configs.branchReduceFactor, -90);
}
animate();

window.addEventListener("resize", () => {
  c.width = innerWidth;
  c.height = innerHeight;
});
