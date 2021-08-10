var canvas = document.getElementById('pendulum')
var ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const start = Date.now()
const g = 9.8
const x0 = canvas.width / 2
const y0 = 50
const scale = 50

var pendulums = []

function get_t(zero = start) {
    return (Date.now() - zero) / 1000
}

class Pendulum {
    constructor(l, a, f = 0, color = 'black', width = 1) {
        this.t = Date.now()
        this.f = f
        this.l = l
        this.a = a
        this.w = Math.sqrt(g / l)
        this.color = color
        this.width = width
    }

    get_x(t) {
        return this.a * Math.sin(this.w * t + this.f)
    }

    get_y(x) {
        return Math.sqrt(this.l * this.l - x * x)
    }

    async render() {
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        let t = get_t(this.t)
        let x = this.get_x(t)
        let y = this.get_y(x)
        ctx.lineTo(x * scale + x0, y * scale + y0)
        ctx.stroke()
    }

    static drawAll() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        pendulums.forEach((p) => {
            ctx.strokeStyle = p.color
            ctx.lineWidth = p.width
            p.render()
        })
    }

    static clear() {
        pendulums = []
    }

    static create(length = 1, amplitude = 0, initial_state = 0, color = 'black', width = 1) {
        pendulums.push(new Pendulum(length, amplitude, initial_state, color, width))
    }

    static create_seria(
        length = 1, amplitude = 0,
        initial_state_func = (i) => 0.1 * i,
        color_func = () => 'black',
        width_func = (i) => i + 1) {
        for (let i = 0; i < 10; ++i)
            pendulums.push(new Pendulum(
                length, amplitude,
                initial_state_func(i), color_func(i), width_func(i)))
    }
}

const interval = setInterval(() => Pendulum.drawAll(), 0);

Pendulum.create_seria(10, 5, (i) => i * 0.2, (i) => {
    return ['red', 'orange', 'yelow', 'green', 'blue', 'purpure', 'black'][i % 7]
})
