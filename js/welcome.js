class LetterRain {
  constructor(element, options = {}) {
    this.element = element;
    this.symbols =
      options.symbols ||
      "\u16A0\u16A1\u16A2\u16A3\u16A4\u16A5\u16A6\u16A7\u16A8" +
        "\u16A9\u16AA\u16AB\u16AC\u16AD\u16AE\u16AF\u16B0\u16B1" +
        "\u16B2\u16B3\u16B4\u16B5\u16B6\u16B7\u16B8\u16B9\u16BA" +
        "\u16BB\u16BC\u16BD\u16BE\u16BF\u16C0\u16C1\u16C2\u16C3" +
        "\u16C4\u16C5\u16C6\u16C7\u16C8\u16C9\u16CA\u16CB\u16CC" +
        "\u16CD\u16CE\u16CF\u16D0\u16D1\u16D2\u16D3\u16D4\u16D5" +
        "\u16D6\u16D7\u16D8\u16D9\u16DA\u16DB\u16DC\u16DD\u16DE" +
        "\u16DF\u16E0\u16E1\u16E2\u16E3\u16E4\u16E5\u16E6\u16E7" +
        "\u16E8\u16E9\u16EA\u16EB\u16EC\u16ED\u16EE\u16EF\u16F0" +
        "\u16F1\u16F2\u16F3\u16F4\u16F5\u16F6\u16F7\u16F8";
    this.rainInterval = options.rainInterval || 100;
    this.symbolFadeTime = options.symbolFadeTime || 5000;
    this.timer = null;
    this.sizeMin = options.sizeMin || 12;
    this.sizeMax = options.sizeMax || 36;
    this.color = options.color || "#0F0";
  }

  getRandomSymbol() {
    return this.symbols[Math.floor(Math.random() * this.symbols.length)];
  }

  start() {
    this.timer = setInterval(() => {
      const span = document.createElement("span");
      span.style.opacity = "0";
      span.style.position = "absolute";
      span.style.color = this.color;
      span.style.fontSize =
        Math.floor(Math.random() * (this.sizeMax - this.sizeMin) + this.sizeMin) + "px";
      const rect = this.element.getBoundingClientRect();
      span.style.left = Math.random() * rect.width + "px";
      span.style.top = Math.random() * rect.height + "px";
      span.textContent = this.getRandomSymbol();
      this.element.appendChild(span);

      setTimeout(() => {
        span.style.transition = `opacity ${this.symbolFadeTime}ms ease`;
        span.style.opacity = ".6";
        setTimeout(() => {
          span.style.opacity = "0";
          setTimeout(() => {
            this.element.removeChild(span);
          }, this.symbolFadeTime);
        }, this.symbolFadeTime);
      }, this.rainInterval);
    }, this.rainInterval);
  }
}

class TextAnimator {
  constructor(element, options = {}) {
    this.element = element;
    this.messages = options.messages || [];
    this.symbols =
      options.symbols ||
      "\u16A0\u16A1\u16A2\u16A3\u16A4\u16A5\u16A6\u16A7\u16A8" +
        "\u16A9\u16AA\u16AB\u16AC\u16AD\u16AE\u16AF\u16B0\u16B1" +
        "\u16B2\u16B3\u16B4\u16B5\u16B6\u16B7\u16B8\u16B9\u16BA" +
        "\u16BB\u16BC\u16BD\u16BE\u16BF\u16C0\u16C1\u16C2\u16C3" +
        "\u16C4\u16C5\u16C6\u16C7\u16C8\u16C9\u16CA\u16CB\u16CC" +
        "\u16CD\u16CE\u16CF\u16D0\u16D1\u16D2\u16D3\u16D4\u16D5" +
        "\u16D6\u16D7\u16D8\u16D9\u16DA\u16DB\u16DC\u16DD\u16DE" +
        "\u16DF\u16E0\u16E1\u16E2\u16E3\u16E4\u16E5\u16E6\u16E7" +
        "\u16E8\u16E9\u16EA\u16EB\u16EC\u16ED\u16EE\u16EF\u16F0" +
        "\u16F1\u16F2\u16F3\u16F4\u16F5\u16F6\u16F7\u16F8";
    this.revealInterval = options.revealInterval || 100;
    this.transitionDuration = options.transitionDuration || 400;
    this.messageInterval = options.messageInterval || 5000;
    this.revealLength = options.revealLength || 4;
    this.currentIndex = 0;
    this.timer = null;
  }

  getRandomSymbol() {
    return this.symbols[Math.floor(Math.random() * this.symbols.length)];
  }

  start() {
    this.element.style.position = "relative";
    this.animate();
  }

  animate() {
    if (this.timer) return;
    let revealed = 0;
    const message = this.messages[this.currentIndex];
    this.element.innerHTML =
      `<span style="visibility: hidden;">${message}</span>` +
      `<span style="position: absolute; left: 0; right: 0;">` +
      message
        .split("")
        .map((char) => {
          return `<span style="opacity: 0; transition: opacity ${
            this.transitionDuration
          }ms ease;">${char === " " ? "&nbsp;" : this.getRandomSymbol()}</span>`;
        })
        .join("") +
      `</span>`;

    const spans = this.element.querySelectorAll("span:last-child > span");
    this.timer = setInterval(() => {
      spans.forEach((span, index) => {
        if (index < revealed) {
          span.textContent = message[index] === " " ? "\u00A0" : message[index];
          span.style.opacity = "1";
        } else if (index >= revealed + this.revealLength) {
          span.textContent = "";
          span.style.opacity = "0";
        } else {
          span.textContent = message[index] === " " ? "\u00A0" : this.getRandomSymbol();
          span.style.opacity = "0.3";
        }
      });

      revealed++;
      if (revealed > message.length) {
        clearInterval(this.timer);
        this.timer = null;
        setTimeout(() => {
          this.currentIndex = (this.currentIndex + 1) % this.messages.length;
          this.animate();
        }, this.messageInterval);
      }
    }, this.revealInterval);
  }
}

class CustomSelect {
  constructor(parent, options = {}) {
    this.parent = parent;
    this.options = options.options || [];
    this.currentValue = options.value || (this.options[0] ? this.options[0].value : "");
    this.onChange = options.onChange || (() => {});

    this.element = null;
    this.trigger = null;
    this.dropdown = null;
    this.valueDisplay = null;
    this.optionElements = [];
    this.hiddenSelect = null;

    this.create();
    this.init();
  }

  create() {
    this.element = document.createElement("div");
    this.element.className = "select-custom";

    const currentOption =
      this.options.find((opt) => opt.value === this.currentValue) || this.options[0];
    const currentLabel = currentOption ? currentOption.label : "";

    this.trigger = document.createElement("button");
    this.trigger.type = "button";
    this.trigger.className = "select-trigger";
    this.trigger.setAttribute("aria-expanded", "false");

    this.valueDisplay = document.createElement("span");
    this.valueDisplay.className = "select-value";
    this.valueDisplay.textContent = currentLabel;

    const arrow = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    arrow.setAttribute("class", "select-arrow");
    arrow.setAttribute("width", "12");
    arrow.setAttribute("height", "8");
    arrow.setAttribute("viewBox", "0 0 12 8");

    const arrowPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    arrowPath.setAttribute("fill", "currentColor");
    arrowPath.setAttribute("d", "M6 8L0 2l1.4-1.4L6 5.2 10.6.6 12 2z");
    arrow.appendChild(arrowPath);

    this.trigger.appendChild(this.valueDisplay);
    this.trigger.appendChild(arrow);

    this.dropdown = document.createElement("div");
    this.dropdown.className = "select-dropdown";

    this.options.forEach((opt) => {
      const optionBtn = document.createElement("button");
      optionBtn.type = "button";
      optionBtn.className = "select-option";
      optionBtn.dataset.value = opt.value;
      optionBtn.textContent = opt.label;

      if (opt.value === this.currentValue) {
        optionBtn.classList.add("selected");
      }

      this.dropdown.appendChild(optionBtn);
      this.optionElements.push(optionBtn);
    });

    this.hiddenSelect = document.createElement("select");
    this.hiddenSelect.name = "language";
    this.hiddenSelect.style.display = "none";

    this.options.forEach((opt) => {
      const option = document.createElement("option");
      option.value = opt.value;
      option.textContent = opt.label;
      if (opt.value === this.currentValue) {
        option.selected = true;
      }
      this.hiddenSelect.appendChild(option);
    });

    this.element.appendChild(this.trigger);
    this.element.appendChild(this.dropdown);
    this.element.appendChild(this.hiddenSelect);

    this.parent.appendChild(this.element);
  }

  init() {
    this.trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggle();
    });

    this.optionElements.forEach((option) => {
      option.addEventListener("click", (e) => {
        e.stopPropagation();
        this.selectOption(option);
      });
    });

    document.addEventListener("click", () => {
      this.close();
    });

    this.trigger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.toggle();
      } else if (e.key === "Escape") {
        this.close();
      }
    });
  }

  toggle() {
    this.element.classList.toggle("open");

    if (this.element.classList.contains("open")) {
      this.trigger.setAttribute("aria-expanded", "true");
    } else {
      this.trigger.setAttribute("aria-expanded", "false");
    }
  }

  close() {
    this.element.classList.remove("open");
    this.trigger.setAttribute("aria-expanded", "false");
  }

  selectOption(option) {
    const value = option.dataset.value;
    const text = option.textContent;

    this.valueDisplay.textContent = text;
    this.hiddenSelect.value = value;
    this.currentValue = value;

    this.optionElements.forEach((opt) => opt.classList.remove("selected"));
    option.classList.add("selected");
    this.close();

    this.onChange(value);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let copyline = document.querySelector(".copyline");
  if (copyline) {
    let languages = {
      en: "English",
      ru: "Русский",
    };

    let pathParts = document.location.pathname.split("/").filter((p) => p);
    let currentLang =
      pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2] || "en";

    if (!languages[currentLang]) {
      currentLang = pathParts.find((p) => p === "en" || p === "ru") || "en";
    }

    let selectContainer = document.createElement("div");
    copyline.insertBefore(selectContainer, copyline.children[0]);

    new CustomSelect(selectContainer, {
      options: [
        { value: "en", label: "English" },
        { value: "ru", label: "Русский" },
      ],
      value: currentLang,
      onChange: (newLang) => {
        if (newLang === currentLang) return;
        let pathParts = window.location.pathname.split("/").filter((p) => p);
        let basePath = "";

        if (pathParts.length > 0 && !languages[pathParts[0]]) {
          basePath = "/" + pathParts[0];
        }

        window.location.href = basePath + "/" + newLang + "/";
      },
    });
  }
});
