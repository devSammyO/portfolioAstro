document.addEventListener('DOMContentLoaded', function () {
	var carousel = document.querySelector('[data-writeups-carousel]');
	if (!carousel) return;

	var track = carousel.querySelector('[data-writeups-track]');
	var scrollbar = document.querySelector('[data-writeups-scrollbar]');
	var thumb = document.querySelector('[data-writeups-thumb]');
	if (!track) return;

	var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	function clamp(v, lo, hi) {
		return Math.max(lo, Math.min(hi, v));
	}

	function maxScroll() {
		return Math.max(0, track.scrollWidth - track.clientWidth);
	}

	function cardStep() {
		var card = track.querySelector('.writeup-card');
		if (!card) return 300;
		var gap = parseFloat(getComputedStyle(track).columnGap) || 20;
		return card.getBoundingClientRect().width + gap;
	}

	function nearestCard(pos) {
		var step = cardStep();
		if (step <= 0) return pos;
		return clamp(Math.round(pos / step) * step, 0, maxScroll());
	}

	function updateChrome() {
		var max = maxScroll();
		carousel.classList.toggle('is-scrollable', max > 4);
		carousel.classList.toggle('is-start', current <= 2);
		carousel.classList.toggle('is-end', current >= max - 2);

		if (thumb && scrollbar) {
			var trackWidth = scrollbar.clientWidth;
			var visibleRatio = Math.min(1, track.clientWidth / track.scrollWidth);
			var thumbWidth = Math.max(trackWidth * visibleRatio, 32);
			var progress = max > 0 ? current / max : 0;
			thumb.style.width = thumbWidth + 'px';
			thumb.style.left = progress * (trackWidth - thumbWidth) + 'px';
		}
	}

	// --- Reduced motion: plain, instant scrolling, no physics ---
	if (reducedMotion) {
		track.classList.add('is-animating'); // permanently suspend CSS snap-fighting
		track.addEventListener(
			'wheel',
			function (e) {
				if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
				var max = maxScroll();
				if (max <= 0) return;
				var atStart = track.scrollLeft <= 0;
				var atEnd = track.scrollLeft >= max;
				if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
				e.preventDefault();
				track.scrollLeft += e.deltaY;
			},
			{ passive: false }
		);
		track.addEventListener('keydown', function (e) {
			if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
			track.scrollBy({ left: e.key === 'ArrowRight' ? cardStep() : -cardStep() });
		});
		if (scrollbar) {
			scrollbar.addEventListener('pointerdown', function (e) {
				var rect = scrollbar.getBoundingClientRect();
				var ratio = clamp((e.clientX - rect.left) / rect.width, 0, 1);
				track.scrollLeft = ratio * maxScroll();
			});
		}
		var syncFn = function () {
			current = track.scrollLeft;
			updateChrome();
		};
		var current = track.scrollLeft;
		track.addEventListener('scroll', syncFn, { passive: true });
		window.addEventListener('resize', syncFn);
		updateChrome();
		return;
	}

	// --- Physics-based inertia + magnetic card snap ---
	var current = track.scrollLeft;
	var velocity = 0;
	var settleTarget = null;
	var isPointerActive = false;
	var rafId = null;

	function ensureLoop() {
		if (rafId === null) {
			track.classList.add('is-animating');
			rafId = requestAnimationFrame(loop);
		}
	}

	function loop() {
		var max = maxScroll();

		if (settleTarget !== null) {
			current += (settleTarget - current) * 0.18;
			if (Math.abs(settleTarget - current) < 0.4) {
				current = settleTarget;
				settleTarget = null;
			}
		} else if (Math.abs(velocity) > 0.05) {
			current += velocity;
			velocity *= 0.91;
			if (current <= 0) {
				current = 0;
				velocity = 0;
			} else if (current >= max) {
				current = max;
				velocity = 0;
			}
		} else if (!isPointerActive && velocity !== 0) {
			velocity = 0;
			settleTarget = nearestCard(current);
		}

		track.scrollLeft = current;
		updateChrome();

		if (settleTarget !== null || Math.abs(velocity) > 0.05 || isPointerActive) {
			rafId = requestAnimationFrame(loop);
		} else {
			rafId = null;
			track.classList.remove('is-animating');
		}
	}

	// Vertical wheel -> horizontal impulse, letting the page scroll through at the edges
	track.addEventListener(
		'wheel',
		function (e) {
			if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
			var max = maxScroll();
			if (max <= 0) return;
			var atStart = current <= 0;
			var atEnd = current >= max;
			if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
			e.preventDefault();

			var delta = e.deltaY;
			if (e.deltaMode === 1) delta *= 18; // DOM_DELTA_LINE
			else if (e.deltaMode === 2) delta *= track.clientWidth; // DOM_DELTA_PAGE

			settleTarget = null;
			velocity = clamp(velocity + delta * 0.55, -110, 110);
			ensureLoop();
		},
		{ passive: false }
	);

	// Drag: 1:1 tracking while held, then releases into momentum
	var isDown = false;
	var dragged = false;
	var startX = 0;
	var startScroll = 0;
	var lastX = 0;
	var lastT = 0;
	var dragVelocity = 0;

	track.addEventListener('pointerdown', function (e) {
		if (e.pointerType === 'touch') return;
		isDown = true;
		dragged = false;
		isPointerActive = true;
		settleTarget = null;
		velocity = 0;
		dragVelocity = 0;
		startX = lastX = e.clientX;
		lastT = performance.now();
		startScroll = current;
		track.classList.add('is-dragging');
		ensureLoop();
	});

	window.addEventListener('pointermove', function (e) {
		if (!isDown) return;
		var dx = e.clientX - startX;
		if (Math.abs(dx) > 4) dragged = true;

		var now = performance.now();
		var dt = now - lastT || 16;
		dragVelocity = ((e.clientX - lastX) / dt) * 16;
		lastX = e.clientX;
		lastT = now;

		current = clamp(startScroll - dx, 0, maxScroll());
	});

	function endDrag() {
		if (!isDown) return;
		isDown = false;
		isPointerActive = false;
		track.classList.remove('is-dragging');
		velocity = clamp(-dragVelocity * 1.4, -110, 110);
		ensureLoop();
	}
	window.addEventListener('pointerup', endDrag);
	window.addEventListener('pointercancel', endDrag);

	// Swallow the click that follows a drag so links aren't opened by accident
	track.addEventListener(
		'click',
		function (e) {
			if (dragged) {
				e.preventDefault();
				e.stopPropagation();
				dragged = false;
			}
		},
		true
	);

	// Keyboard navigation glides smoothly to the next/previous card
	track.addEventListener('keydown', function (e) {
		if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
		e.preventDefault();
		var step = cardStep();
		velocity = 0;
		settleTarget = clamp(
			current + (e.key === 'ArrowRight' ? step : -step),
			0,
			maxScroll()
		);
		ensureLoop();
	});

	// Click-to-seek on the progress bar
	if (scrollbar) {
		scrollbar.addEventListener('pointerdown', function (e) {
			var rect = scrollbar.getBoundingClientRect();
			var ratio = clamp((e.clientX - rect.left) / rect.width, 0, 1);
			velocity = 0;
			settleTarget = ratio * maxScroll();
			ensureLoop();
		});
	}

	// Touch keeps native momentum scrolling; just mirror it into our state
	track.addEventListener(
		'scroll',
		function () {
			if (rafId !== null) return;
			current = track.scrollLeft;
			updateChrome();
		},
		{ passive: true }
	);

	window.addEventListener('resize', function () {
		current = clamp(current, 0, maxScroll());
		track.scrollLeft = current;
		updateChrome();
	});

	updateChrome();
});
