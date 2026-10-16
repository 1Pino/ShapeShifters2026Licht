
async function setup() {
  
  createCanvas(400, 400);
  
let font = await loadFont('LICHT0930VF.ttf')
  fill('rgb(0, 0, 0)')
  textFont(font);
  textSize(360);
}



function draw() {
  let txt = select(".text")
  let box = select(".box")
  let width = screen.width
  let height = screen.height

  console.log(width, winMouseX);
  console.log(height, winMouseY);
  
    
  let wght = map(winMouseX, 0, width, -400, 400)
  let opsz = constrain(map(winMouseY, 0, height, 0, 800), 0, 800)
  
  txt.style(
    "font-variation-settings", 
    `'wght' ${wght}, 'opsz' ${opsz}`
  )
}

document.addEventListener("DOMContentLoaded", () => {
  const syncTestSurfacesFullBleed = () => {
    const surfaces = document.querySelectorAll(".test-surface")
    surfaces.forEach((surface) => {
      const rect = surface.getBoundingClientRect()
      surface.style.marginLeft = `${-rect.left}px`
      surface.style.width = `${window.innerWidth}px`
    })
  }

  const initFoundryTests = () => {
    const tests = document.querySelectorAll("[data-foundry]")

    tests.forEach((test) => {
      const sample = test.querySelector("[data-foundry-sample]")
      const sizeSlider = test.querySelector("[data-size-slider]")
      const sizeValue = test.querySelector("[data-size-value]")
      const spacingSlider = test.querySelector("[data-spacing-slider]")
      const spacingValue = test.querySelector("[data-spacing-value]")
      const leadingSlider = test.querySelector("[data-leading-slider]")
      const leadingValue = test.querySelector("[data-leading-value]")
      const axisSliders = test.querySelectorAll("[data-axis-slider]")

      if (!sample || !sizeSlider) {
        return
      }

      const updateSample = () => {
        const size = Number(sizeSlider.value)
        const axisValues = {}

        axisSliders.forEach((slider) => {
          const axis = slider.getAttribute("data-axis-slider")
          axisValues[axis] = Number(slider.value)

          const axisOutput = test.querySelector(`[data-axis-value="${axis}"]`)
          if (axisOutput) {
            axisOutput.textContent = String(axisValues[axis])
          }
        })

        if (sizeValue) {
          sizeValue.textContent = `${size}px`
        }

        const spacing = spacingSlider ? Number(spacingSlider.value) : 0
        const leading = leadingSlider ? Number(leadingSlider.value) / 100 : 0.91

        if (spacingValue) {
          spacingValue.textContent = `${spacing}px`
        }

        if (leadingValue) {
          leadingValue.textContent = leading.toFixed(2)
        }

        sample.style.fontSize = `${size}px`
        sample.style.letterSpacing = `${spacing}px`
        sample.style.lineHeight = String(leading)
        sample.style.fontVariationSettings = `'wght' ${axisValues.wght ?? 0}, 'opsz' ${axisValues.opsz ?? 800}`
      }

      sizeSlider.addEventListener("input", updateSample)
      if (spacingSlider) {
        spacingSlider.addEventListener("input", updateSample)
      }
      if (leadingSlider) {
        leadingSlider.addEventListener("input", updateSample)
      }
      axisSliders.forEach((slider) => slider.addEventListener("input", updateSample))
      updateSample()
    })

  }

  const initTestBackgroundToggle = () => {
    const toggle = document.querySelector("[data-test-bg-toggle]")
    if (!toggle) {
      return
    }

    const label = toggle.closest(".theme-toggle-label")
    const svgImage = label ? label.querySelector(".theme-toggle-image") : null

    if (svgImage instanceof HTMLImageElement) {
      const basePath = svgImage.getAttribute("data-toggle-svg-base") || ""
      const fileName = svgImage.getAttribute("data-toggle-svg-name") || ""

      if (fileName) {
        svgImage.src = `${basePath}${fileName}`
      }
    }

    const applyMode = () => {
      document.body.classList.toggle("tests-light", toggle.checked)
      if (label) {
        label.classList.toggle("is-active", toggle.checked)
      }
    }

    toggle.addEventListener("change", applyMode)
    applyMode()
  }

  const initWordLab = () => {
    const lab = document.querySelector("[data-word-lab]")
    if (!lab) {
      return
    }

    const modeButtons = lab.querySelectorAll("[data-word-mode]")
    const animSliders = lab.querySelectorAll("[data-word-anim-slider]")
    const stage = lab.querySelector("[data-word-stage]")
    if (!stage) {
      return
    }

    const rootStyle = document.documentElement.style

    let activeMode = "move"

    const setActiveMode = (mode) => {
      activeMode = mode
      stage.setAttribute("data-active-mode", activeMode)

      modeButtons.forEach((button) => {
        const buttonMode = button.getAttribute("data-word-mode") || "move"
        button.classList.toggle("is-active", buttonMode === activeMode)
      })
    }

    modeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        setActiveMode(button.getAttribute("data-word-mode") || "move")
      })
    })

    const isTypingTarget = (target) => {
      if (!(target instanceof Element)) {
        return false
      }

      if (target.closest("input, textarea, select")) {
        return true
      }

      return Boolean(target.closest("[contenteditable='true']"))
    }

    document.addEventListener("keydown", (event) => {
      if (isTypingTarget(event.target)) {
        return
      }

      const key = event.key.toLowerCase()

      if (key === "v") {
        event.preventDefault()
        setActiveMode("move")
        return
      }

      if (key === "s") {
        event.preventDefault()
        setActiveMode("scale")
        return
      }

      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault()
        setActiveMode("delete")
      }
    })

    setActiveMode("move")

    const updateAnimationSettings = () => {
      animSliders.forEach((slider) => {
        const type = slider.getAttribute("data-word-anim-slider")
        const value = Number(slider.value)
        const output = lab.querySelector(`[data-word-anim-value="${type}"]`)

        if (type === "letter-speed") {
          rootStyle.setProperty("--scan-letter-duration", `${value}s`)
          if (output) {
            output.textContent = `${value}s`
          }
          return
        }

        if (type === "belt-speed") {
          rootStyle.setProperty("--scan-belt-duration", `${value}s`)
          if (output) {
            output.textContent = `${value}s`
          }
          return
        }

        if (type === "intensity") {
          rootStyle.setProperty("--scan-max-wght", String(value))
          if (output) {
            output.textContent = String(value)
          }
        }
      })
    }

    animSliders.forEach((slider) => {
      slider.addEventListener("input", updateAnimationSettings)
    })
    updateAnimationSettings()

    const sourceText = "It will be used mainly in positive form and is not meant to represent a bold version of the typeface. The slightly heavier strokes, in positive form, balance the negative flare and visual presence of the regular font. We are continuing efforts directed toward overcoming the decay at all outside corners; tolerable if reception is at its best, but considerable under average viewing conditions."
    const words = sourceText.split(/\s+/).filter(Boolean)
    const stagePadding = 12
    const minWordSize = 22
    const maxWordSize = 85
    let zIndexCounter = 1
    let animationOffset = 0

    stage.innerHTML = ""

    const tokens = []

    words.forEach((word, index) => {
      const token = document.createElement("span")
      token.className = "word-token"
      token.textContent = ""
      token.dataset.scale = "1"

      for (const char of word) {
        const letter = document.createElement("span")
        letter.className = "word-token-letter"
        letter.style.setProperty("--offset", String(animationOffset))
        letter.textContent = char
        token.appendChild(letter)
        animationOffset += 1
      }

      token.dataset.initialIndex = String(index)
      token.style.zIndex = String(zIndexCounter++)
      stage.appendChild(token)
      tokens.push(token)
    })

    const buildInitialLayout = () => {
      const stageWidth = Math.max(stage.clientWidth - stagePadding * 2, 220)

      const layoutWithSize = (fontSize) => {
        stage.style.setProperty("--word-token-size", `${fontSize}px`)

        let cursorX = stagePadding
        let cursorY = stagePadding
        let rowHeight = 0

        tokens.forEach((token) => {
          token.style.left = `${cursorX}px`
          token.style.top = `${cursorY}px`

          const tokenWidth = token.offsetWidth
          const tokenHeight = token.offsetHeight

          if (cursorX + tokenWidth + 20 > stageWidth) {
            cursorX = stagePadding
            cursorY += rowHeight
            rowHeight = tokenHeight + 8
            token.style.left = `${cursorX}px`
            token.style.top = `${cursorY}px`
          }

          rowHeight = Math.max(rowHeight, tokenHeight + 8)
          cursorX += tokenWidth + 12
        })

        return cursorY + rowHeight + stagePadding
      }

      const availableHeight = Math.max(stage.clientHeight - stagePadding * 2, 160)
      let fontSize = maxWordSize
      let requiredHeight = layoutWithSize(fontSize)

      while (requiredHeight > availableHeight && fontSize > minWordSize) {
        fontSize -= 2
        requiredHeight = layoutWithSize(fontSize)
      }
    }

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

    const makeDraggable = (token) => {
      let dragging = false
      let pointerId = null
      let offsetX = 0
      let offsetY = 0
      let dragStartX = 0
      let dragStartY = 0
      let startScale = 1

      token.addEventListener("pointerdown", (event) => {
        if (activeMode === "delete") {
          token.remove()
          return
        }

        dragging = true
        pointerId = event.pointerId
        token.setPointerCapture(pointerId)
        token.classList.add("is-dragging")

        const tokenRect = token.getBoundingClientRect()
        offsetX = event.clientX - tokenRect.left
        offsetY = event.clientY - tokenRect.top
        dragStartX = event.clientX
        dragStartY = event.clientY
        startScale = Number(token.dataset.scale || "1")
        token.style.zIndex = String(zIndexCounter++)
      })

      token.addEventListener("pointermove", (event) => {
        if (!dragging || pointerId !== event.pointerId) {
          return
        }

        const stageRect = stage.getBoundingClientRect()
        const maxX = stage.clientWidth - token.offsetWidth
        const maxY = stage.clientHeight - token.offsetHeight
        const nextX = clamp(event.clientX - stageRect.left - offsetX, 0, Math.max(0, maxX))
        const nextY = clamp(event.clientY - stageRect.top - offsetY, 0, Math.max(0, maxY))
        const deltaY = event.clientY - dragStartY
        const nextScale = clamp(startScale + (-deltaY * 0.006), 0.35, 4.5)

        if (activeMode === "move") {
          token.style.left = `${nextX}px`
          token.style.top = `${nextY}px`
          return
        }

        if (activeMode === "scale") {
          token.style.transform = `scale(${nextScale})`
          token.dataset.scale = String(nextScale)
        }
      })

      const stopDrag = (event) => {
        if (!dragging || pointerId !== event.pointerId) {
          return
        }

        dragging = false
        token.releasePointerCapture(pointerId)
        pointerId = null
        token.classList.remove("is-dragging")
      }

      token.addEventListener("pointerup", stopDrag)
      token.addEventListener("pointercancel", stopDrag)
    }

    buildInitialLayout()
    tokens.forEach((token) => makeDraggable(token))
    window.addEventListener("resize", buildInitialLayout)
  }

  initFoundryTests()
  initTestBackgroundToggle()
  initWordLab()
  syncTestSurfacesFullBleed()
  window.addEventListener("resize", syncTestSurfacesFullBleed)

  const splitTextIntoLetters = (elements, letterClass, spaceClass = "") => {
    elements.forEach((element) => {
      const originalText = element.textContent || ""
      element.textContent = ""

      for (const char of originalText) {
        if (char === " ") {
          if (spaceClass) {
            const space = document.createElement("span")
            space.className = `${letterClass} ${spaceClass}`
            space.textContent = "\u00A0"
            element.appendChild(space)
          } else {
            element.appendChild(document.createTextNode(" "))
          }
          continue
        }

        const span = document.createElement("span")
        span.className = letterClass
        span.textContent = char
        element.appendChild(span)
      }
    })
  }

  splitTextIntoLetters(document.querySelectorAll("ul li"), "li-letter")
  splitTextIntoLetters(document.querySelectorAll("h1, h2"), "headline-letter")
  splitTextIntoLetters(document.querySelectorAll(".flux-hover"), "flux-letter", "flux-space")

  const zeilen = document.querySelectorAll(".zeile")
  zeilen.forEach((zeile, index) => {
    const baseText = (zeile.textContent || "").trim()

    zeile.textContent = ""
    zeile.classList.toggle("zeile-reverse", index % 2 === 1)

    const track = document.createElement("span")
    track.className = "zeile-track"

    const createCopy = () => {
      const copy = document.createElement("span")
      copy.className = "zeile-copy"

      for (let i = 0; i < baseText.length; i++) {
        const char = baseText[i]

        if (char === " ") {
          const space = document.createElement("span")
          space.className = "zeile-letter zeile-space"
          space.style.setProperty("--offset", String(i))
          space.textContent = "\u00A0"
          copy.appendChild(space)
          continue
        }

        const span = document.createElement("span")
        span.className = "zeile-letter"
        span.style.setProperty("--offset", String(i))
        span.textContent = char
        copy.appendChild(span)
      }

      return copy
    }

    track.appendChild(createCopy())
    track.appendChild(createCopy())
    zeile.appendChild(track)
  })
})

