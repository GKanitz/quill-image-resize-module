import { BaseModule } from './BaseModule';

export class Resize extends BaseModule {
    onCreate = () => {
        // track resize handles
        this.boxes = [];

        // add 4 resize handles
        this.addBox('nwse-resize'); // top left
        this.addBox('nesw-resize'); // top right
        this.addBox('nwse-resize'); // bottom right
        this.addBox('nesw-resize'); // bottom left

        this.positionBoxes();
    };

    onDestroy = () => {
        // reset drag handle cursors
        this.setCursor('');
    };

    positionBoxes = () => {
        const handleXOffset = `${-parseFloat(this.options.handleStyles.width) / 2}px`;
        const handleYOffset = `${-parseFloat(this.options.handleStyles.height) / 2}px`;

        // set the top and left for each drag handle
        [
            { left: handleXOffset, top: handleYOffset },        // top left
            { right: handleXOffset, top: handleYOffset },       // top right
            { right: handleXOffset, bottom: handleYOffset },    // bottom right
            { left: handleXOffset, bottom: handleYOffset },     // bottom left
        ].forEach((pos, idx) => {
            Object.assign(this.boxes[idx].style, pos);
        });
    };

    addBox = (cursor) => {
        // create div element for resize handle
        const box = document.createElement('div');

        // Star with the specified styles
        Object.assign(box.style, this.options.handleStyles);
        box.style.cursor = cursor;

        // Set the width/height to use 'px'
        box.style.width = `${this.options.handleStyles.width}px`;
        box.style.height = `${this.options.handleStyles.height}px`;

        // listen for mousedown/touchstart on each box
        box.addEventListener('mousedown', this.handleMousedown, false);
		box.addEventListener('touchstart', this.handleTouchstart, false);
        // add drag handle to document
        this.overlay.appendChild(box);
        // keep track of drag handle
        this.boxes.push(box);
    };

    handleMousedown = (evt) => {
		// handle the event
		this.handleStart(evt.target, evt.clientX);
        // listen for movement and mouseup
        document.addEventListener('mousemove', this.handleMousemove, false);
        document.addEventListener('mouseup', this.handleMouseup, false);
    };

	handleTouchstart = (evt) => {
		// handle the event
		this.handleStart(evt.target, evt.touches[0].screenX);
		// listen for movement and touchend
		document.addEventListener('touchmove', this.handleTouchmove, false);
		document.addEventListener('touchend', this.handleTouchend, false);
	};

	handleStart = (target, x) => {
		// note which box
		this.dragBox = target;
		// note starting mousedown position
		this.dragStartX = x;
		// store the width before the drag
		this.preDragWidth = this.img.width || this.img.naturalWidth;
		// set the proper cursor everywhere
		this.setCursor(this.dragBox.style.cursor);
	};

    handleMouseup = () => {
        // reset cursor everywhere
        this.setCursor('');
        // stop listening for movement and mouseup
        document.removeEventListener('mousemove', this.handleMousemove);
        document.removeEventListener('mouseup', this.handleMouseup);
    };

	handleTouchend = () => {
		// reset cursor everywhere
		this.setCursor('');
		// stop listening for movement and mouseup
		document.removeEventListener('touchmove', this.handleTouchmove);
		document.removeEventListener('touchend', this.handleTouchend);
	};

	handleMousemove = (evt) => {
		this.handleMove(evt.clientX);
	};

	handleTouchmove = (evt) => {
		this.handleMove(evt.touches[0].screenX);
	};

    handleMove = (x) => {
        if (!this.img) {
            // image not set yet
            return;
        }
        // update image size
        const deltaX = x - this.dragStartX;
        if (this.dragBox === this.boxes[0] || this.dragBox === this.boxes[3]) {
            // left-side resize handler; dragging right shrinks image
            this.img.width = Math.round(this.preDragWidth - deltaX);
        } else {
            // right-side resize handler; dragging right enlarges image
            this.img.width = Math.round(this.preDragWidth + deltaX);
        }
        this.requestUpdate();
    };

    setCursor = (value) => {
        [
            document.body,
            this.img,
        ].forEach((el) => {
            el.style.cursor = value;   // eslint-disable-line no-param-reassign
        });
    };
}
