class Reflection {
  constructor(options) {
    this.options = {
      id: 'reflection',
      container: 'reflection-container',
      selector: 'reflection-item',
      active: 'active',
      navigation: true,
      ...options
    }
    this.container = document.querySelector(`#${this.options.id}.${this.options.container}`);

    if (this.container) this.init();
  }

  init = () => {
    this.template();
    this.bindEvent();
  }

  bindEvent = () => {
    this.container.addEventListener('click', (e) => {
      const item = e.path.find((el) => (el.classList && el.classList.contains(this.options.selector)));

      if (item) {
        const index = item.getAttribute('data-index');
        const event = {
          originalEvet: e,
          target: this.slides[index],
          index
        };

        event.target.classList.add(this.options.active);

        if (!this.root.classList.contains(this.options.active)) this.root.classList.toggle(this.options.active);

        this.mounted(event);
      }
    });

    const checkBoundary = () => {
      let outer = this.root.getBoundingClientRect();

      console.log(
        outer);
    };

    this.root.addEventListener('mousemove', (e) => {
      console.log(e);
      checkBoundary();
    });
  }

  template = () => {
    this.root = document.createElement('div');
    this.addClasses(this.root, 'reflection reflection-wrapper');
    this.root.id = `reflection-${this.options.id}`;

    const slidesTemplate =
      [...this.container.querySelectorAll(`.${this.options.selector}`)].map((slide, ind) => {
        const s = slide.cloneNode(true);
        const type = this.getType(slide);
        if (type) s.classList.add(type);
        s.setAttribute('data-index', ind);
        slide.setAttribute('data-index', ind);
        return s.outerHTML;
      });

    this.root.innerHTML = `
      <ul class="reflection-list">
        ${slidesTemplate.join('')}
      </ul>
      <div class="reflection-actions">
      </div>`;

    document.body.appendChild(this.root);
    this.slides = this.root.querySelectorAll(`.${this.options.selector}`);

    if (this.options.navigation) {
      const nextButton = this.createButton('reflection-next icon-right-open', this.next);
      const prevButton = this.createButton('reflection-prev icon-left-open', this.prev);

      this.root.appendChild(nextButton);
      this.root.appendChild(prevButton);
    }

    const closeButton = this.createButton('reflection-close icon-cancel', this.close);

    this.root.appendChild(closeButton);
  }

  createButton = (classes, onClick) => {
    const btn = document.createElement('button');
    this.addClasses(btn, classes);
    btn.addEventListener('click', onClick);
    return btn;
  }

  next = () => {
    const active = [...this.root.querySelectorAll('.reflection-item')].findIndex(slide => (slide.classList.contains(this.options.active)));
    if (this.slides.length > active + 1 && active > -1) {
      this.slides[active].classList.remove(this.options.active);
      this.slides[active + 1].classList.add(this.options.active);
    } else {
      this.slides[this.slides.length - 1].classList.remove(this.options.active);
      this.slides[0].classList.add(this.options.active);
    }

    const event = new Event('next');
    this.root.dispatchEvent(event);
  }

  prev = () => {
    const active = [...this.root.querySelectorAll('.reflection-item')].findIndex(slide => (slide.classList.contains(this.options.active)));
    if (active > 0) {
      this.slides[active].classList.remove(this.options.active);
      this.slides[active - 1].classList.add(this.options.active);
    } else {
      this.slides[0].classList.remove(this.options.active);
      this.slides[this.slides.length - 1].classList.add(this.options.active);
    }

    const event = new Event('prev');
    this.root.dispatchEvent(event);
  }

  close = () => {
    this.root.querySelector(`li.${this.options.active}`).classList.remove(this.options.active);
    this.root.classList.remove(this.options.active);
  }

  mounted = (e) => {
    const event = new CustomEvent('mounted', {
      currentTarget: e.target,
      bubbles: true,
      detail: e
    });
    e.target.dispatchEvent(event);
  }

  getType = (item) => {
    const image = item.querySelector('img');

    if (image) return 'image';

    const video = item.querySelector('video');

    if (video) return 'video';

    const iframe = item.querySelector('iframe');

    if (iframe) {
      if (iframe.src.includes('vimeo')) {
        return 'vimeo';
      } else if (iframe.src.includes('youtube')) {
        return 'youtube';
      } else return 'iframe'
    }
  }

  addClasses = (item, classes) => {
    classes.split(' ').forEach((cls) => {
      item.classList.add(cls);
    });
  }
}

function main() {
  new Reflection({
    id: 'test'
  });

  document.querySelectorAll('.reflection-item').forEach(slide => {
    slide.addEventListener('mounted', (e) => {
      console.log(e);
    });
  });

  const reflect = document.querySelector('#reflection-test');
  reflect.addEventListener('next', (e) => { console.log(e) });
  reflect.addEventListener('prev', (e) => { console.log(e) });
}

main();