// Mobile Navigation Toggle
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("nav-toggle")
  const navMenu = document.getElementById("nav-menu")

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active")
    })

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll(".nav-link")
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active")
      })
    })
  }

  // Simulation Timeline Controls
  const timeSlider = document.getElementById("time-slider")
  const simulationMap = document.getElementById("simulation-map")
  const currentTimeDisplay = document.getElementById("current-time")
  const playBtn = document.getElementById("play-btn")
  const pauseBtn = document.getElementById("pause-btn")
  const resetBtn = document.getElementById("reset-btn")

  if (timeSlider && simulationMap) {
    const timeLabels = ["1 Hour", "2 Hours", "3 Hours", "6 Hours", "12 Hours", "24 Hours"]
    const mapImages = [
      "/placeholder.svg?height=500&width=800&text=1h",
      "/placeholder.svg?height=500&width=800&text=2h",
      "/placeholder.svg?height=500&width=800&text=3h",
      "/placeholder.svg?height=500&width=800&text=6h",
      "/placeholder.svg?height=500&width=800&text=12h",
      "/placeholder.svg?height=500&width=800&text=24h",
    ]

    let isPlaying = false
    let playInterval

    timeSlider.addEventListener("input", function () {
      const timeIndex = Number.parseInt(this.value)
      updateSimulation(timeIndex)
    })

    function updateSimulation(timeIndex) {
      if (simulationMap && currentTimeDisplay) {
        simulationMap.src = mapImages[timeIndex]
        currentTimeDisplay.textContent = timeLabels[timeIndex]
      }
    }

    if (playBtn) {
      playBtn.addEventListener("click", () => {
        if (!isPlaying) {
          isPlaying = true
          playInterval = setInterval(() => {
            let currentValue = Number.parseInt(timeSlider.value)
            if (currentValue < 5) {
              currentValue++
              timeSlider.value = currentValue
              updateSimulation(currentValue)
            } else {
              // Reset to beginning
              timeSlider.value = 0
              updateSimulation(0)
            }
          }, 2000) // Change every 2 seconds
        }
      })
    }

    if (pauseBtn) {
      pauseBtn.addEventListener("click", () => {
        isPlaying = false
        clearInterval(playInterval)
      })
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        isPlaying = false
        clearInterval(playInterval)
        timeSlider.value = 0
        updateSimulation(0)
      })
    }
  }

  // Download Page Filters
  const mapTypeFilter = document.getElementById("map-type")
  const regionFilter = document.getElementById("region-filter")

  if (mapTypeFilter || regionFilter) {
    function filterMaps() {
      const mapCards = document.querySelectorAll(".map-card")
      const selectedType = mapTypeFilter ? mapTypeFilter.value : "all"
      const selectedRegion = regionFilter ? regionFilter.value : "all"

      mapCards.forEach((card) => {
        const cardType = card.querySelector(".map-type-badge").textContent.toLowerCase()
        const cardRegion = card.querySelector(".map-details").textContent.toLowerCase()

        let showCard = true

        if (selectedType !== "all" && !cardType.includes(selectedType)) {
          showCard = false
        }

        if (selectedRegion !== "all" && !cardRegion.includes(selectedRegion)) {
          showCard = false
        }

        card.style.display = showCard ? "block" : "none"
      })
    }

    if (mapTypeFilter) {
      mapTypeFilter.addEventListener("change", filterMaps)
    }

    if (regionFilter) {
      regionFilter.addEventListener("change", filterMaps)
    }
  }

  // Form Validation
  const forms = document.querySelectorAll("form")
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      const requiredFields = form.querySelectorAll("[required]")
      let isValid = true

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false
          field.style.borderColor = "#FF5A5F"
        } else {
          field.style.borderColor = "#DDDDDD"
        }
      })

      if (!isValid) {
        e.preventDefault()
        alert("Please fill in all required fields.")
      }
    })
  })

  // Set minimum date to today for date inputs
  const dateInputs = document.querySelectorAll('input[type="date"]')
  const today = new Date().toISOString().split("T")[0]
  dateInputs.forEach((input) => {
    input.min = today
  })
})
