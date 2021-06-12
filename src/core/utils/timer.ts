class Timer {
	private timerId: number;
	private start: number;
	private remaining: number;
	private args: any;
	constructor(private callback: () => any, private delay: number, ...args) {
		this.remaining = delay;
		this.args = args;
		this.resume();
	}

	pause = () => {
		window.clearTimeout(this.timerId);
		this.remaining -= Date.now() - this.start;
	};

	resume = () => {
		this.start = Date.now();
		window.clearTimeout(this.timerId);
		console.log(this.remaining);
		this.timerId = window.setTimeout(this.callback, this.remaining, ...this.args);
	};

	reset = (pause: boolean = false) => {
		window.clearTimeout(this.timerId);
		this.remaining = this.delay;
		if (!pause) {
			this.resume();
		}
	};
}

export default Timer;
