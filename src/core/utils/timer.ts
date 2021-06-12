const Timer = function (callback, delay, ...args) {
	var timerId,
		start,
		remaining = delay;

	this.pause = function () {
		window.clearTimeout(timerId);
		remaining -= Date.now() - start;
	};

	this.resume = function () {
		start = Date.now();
		window.clearTimeout(timerId);
		timerId = window.setTimeout(callback, remaining, ...args);
	};

	this.resume();
};

export default Timer;
