// Navigation functionality
document.addEventListener("DOMContentLoaded", () => {
  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll(".nav-link")

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      // Remove active class from all links
      navLinks.forEach((l) => l.classList.remove("active"))

      // Add active class to clicked link
      this.classList.add("active")

      // Get target section
      const targetId = this.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Division card functionality
  const divisionCards = document.querySelectorAll(".division-card")

  divisionCards.forEach((card) => {
    card.addEventListener("click", function () {
      const division = this.getAttribute("data-division")
      showDivisionPage(division)
    })
  })

  // Update active nav link on scroll
  window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section[id]")
    const scrollPos = window.scrollY + 100

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight
      const sectionId = section.getAttribute("id")

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active")
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active")
          }
        })
      }
    })
  })

  // Session Tracking Initialization
  generateCalendar()
})

// Division page functionality
function showDivisionPage(division) {
  // Hide all division pages
  const divisionPages = document.querySelectorAll(".division-page")
  divisionPages.forEach((page) => {
    page.classList.remove("active")
  })

  // Show selected division page
  const targetPage = document.getElementById(`${division}-page`)
  if (targetPage) {
    targetPage.classList.add("active")
    document.body.classList.add("division-active")

    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }
}

function showHome() {
  // Hide all division pages
  const divisionPages = document.querySelectorAll(".division-page")
  divisionPages.forEach((page) => {
    page.classList.remove("active")
  })

  // Show main content
  document.body.classList.remove("division-active")

  // Scroll to top
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

// Add smooth hover effects
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".division-card")

  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-8px)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)"
    })
  })
})

// Add loading animation
window.addEventListener("load", () => {
  document.body.style.opacity = "0"
  document.body.style.transition = "opacity 0.5s ease-in-out"

  setTimeout(() => {
    document.body.style.opacity = "1"
  }, 100)
})

// Booking System Data Storage
const bookings = {
  music: JSON.parse(localStorage.getItem("musicBookings") || "{}"),
  video: JSON.parse(localStorage.getItem("videoBookings") || "{}"),
}

// Booking System Functions
function switchBookingTab(type) {
  // Remove active class from all tabs
  document.querySelectorAll(".booking-tab").forEach((tab) => {
    tab.classList.remove("active")
  })

  // Hide all booking content
  document.querySelectorAll(".booking-content").forEach((content) => {
    content.classList.remove("active")
  })

  // Show selected tab and content
  document.querySelector(`[onclick="switchBookingTab('${type}')"]`).classList.add("active")
  document.getElementById(`${type}-booking`).classList.add("active")
}

function updateMusicSlots() {
  const dateInput = document.getElementById("music-date")
  const slotSelect = document.getElementById("music-slot")
  const selectedDate = dateInput.value

  if (!selectedDate) {
    slotSelect.innerHTML = '<option value="">Select a date first</option>'
    return
  }

  // Generate time slots (7 AM to 5 PM, 2-hour sessions, skip lunch 1-2 PM)
  const slots = ["07:00-09:00", "09:00-11:00", "11:00-13:00", "14:00-16:00", "16:00-18:00"]

  slotSelect.innerHTML = '<option value="">Select a time slot</option>'

  slots.forEach((slot) => {
    const isBooked = bookings.music[selectedDate] && bookings.music[selectedDate].includes(slot)
    const option = document.createElement("option")
    option.value = slot
    option.textContent = isBooked ? `${slot} (Booked)` : slot
    option.disabled = isBooked
    slotSelect.appendChild(option)
  })
}

function updateVideoSlots() {
  const dateInput = document.getElementById("video-date")
  const selectedDate = dateInput.value

  if (!selectedDate) return

  // Check if date is already booked for video (full day)
  const isBooked = bookings.video[selectedDate]

  if (isBooked) {
    alert("This date is already booked for video production.")
    dateInput.value = ""
  }
}

// Session Tracking Variables
const currentDate = new Date()
let currentMonth = currentDate.getMonth()
let currentYear = currentDate.getFullYear()

// Session Tracking Functions
function switchTrackingTab(type) {
  // Remove active class from all tabs
  document.querySelectorAll(".tracking-tab").forEach((tab) => {
    tab.classList.remove("active")
  })

  // Hide all tracking content
  document.querySelectorAll(".tracking-content").forEach((content) => {
    content.classList.remove("active")
  })

  // Show selected tab and content
  document.querySelector(`[onclick="switchTrackingTab('${type}')"]`).classList.add("active")
  document.getElementById(`tracking-${type}`).classList.add("active")

  // Load content based on tab
  if (type === "calendar") {
    generateCalendar()
  } else if (type === "upcoming") {
    loadUpcomingSessions()
  } else if (type === "history") {
    loadSessionHistory()
  }
}

function generateCalendar() {
  const calendarGrid = document.getElementById("calendar-grid")
  const monthYearElement = document.getElementById("calendar-month-year")

  // Set month/year header
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  monthYearElement.textContent = `${monthNames[currentMonth]} ${currentYear}`

  // Clear calendar
  calendarGrid.innerHTML = ""

  // Add day headers
  const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  dayHeaders.forEach((day) => {
    const dayHeader = document.createElement("div")
    dayHeader.className = "calendar-day-header"
    dayHeader.textContent = day
    calendarGrid.appendChild(dayHeader)
  })

  // Get first day of month and number of days
  const firstDay = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate()

  // Add previous month's trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    const dayElement = createCalendarDay(daysInPrevMonth - i, true, currentMonth - 1, currentYear)
    calendarGrid.appendChild(dayElement)
  }

  // Add current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = createCalendarDay(day, false, currentMonth, currentYear)
    calendarGrid.appendChild(dayElement)
  }

  // Add next month's leading days
  const totalCells = calendarGrid.children.length - 7 // Subtract day headers
  const remainingCells = 42 - totalCells // 6 rows × 7 days
  for (let day = 1; day <= remainingCells; day++) {
    const dayElement = createCalendarDay(day, true, currentMonth + 1, currentYear)
    calendarGrid.appendChild(dayElement)
  }
}

function createCalendarDay(day, isOtherMonth, month, year) {
  const dayElement = document.createElement("div")
  dayElement.className = "calendar-day"

  if (isOtherMonth) {
    dayElement.classList.add("other-month")
  }

  // Check if it's today
  const today = new Date()
  if (!isOtherMonth && day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
    dayElement.classList.add("today")
  }

  // Create day number
  const dayNumber = document.createElement("div")
  dayNumber.className = "calendar-day-number"
  dayNumber.textContent = day
  dayElement.appendChild(dayNumber)

  // Create sessions container
  const sessionsContainer = document.createElement("div")
  sessionsContainer.className = "calendar-sessions"

  // Get sessions for this day
  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  const musicSessions = bookings.music[dateStr] || []
  const videoSession = bookings.video[dateStr]

  // Add music sessions
  musicSessions.forEach((slot) => {
    const sessionElement = document.createElement("div")
    sessionElement.className = "calendar-session music-session"
    sessionElement.textContent = `Music ${slot}`
    sessionsContainer.appendChild(sessionElement)
  })

  // Add video session
  if (videoSession) {
    const sessionElement = document.createElement("div")
    sessionElement.className = "calendar-session video-session"
    sessionElement.textContent = "Video Production"
    sessionsContainer.appendChild(sessionElement)
  }

  dayElement.appendChild(sessionsContainer)
  return dayElement
}

function previousMonth() {
  currentMonth--
  if (currentMonth < 0) {
    currentMonth = 11
    currentYear--
  }
  generateCalendar()
}

function nextMonth() {
  currentMonth++
  if (currentMonth > 11) {
    currentMonth = 0
    currentYear++
  }
  generateCalendar()
}

function loadUpcomingSessions() {
  const upcomingContainer = document.getElementById("upcoming-sessions")
  const today = new Date()
  const upcomingSessions = []

  // Get all music sessions
  Object.entries(bookings.music).forEach(([date, slots]) => {
    const sessionDate = new Date(date)
    if (sessionDate >= today) {
      slots.forEach((slot) => {
        upcomingSessions.push({
          type: "music",
          date: sessionDate,
          dateStr: date,
          slot: slot,
          details: getSessionDetails(date, "music", slot),
        })
      })
    }
  })

  // Get all video sessions
  Object.entries(bookings.video).forEach(([date, details]) => {
    const sessionDate = new Date(date)
    if (sessionDate >= today) {
      upcomingSessions.push({
        type: "video",
        date: sessionDate,
        dateStr: date,
        details: details,
      })
    }
  })

  // Sort by date
  upcomingSessions.sort((a, b) => a.date - b.date)

  if (upcomingSessions.length === 0) {
    upcomingContainer.innerHTML = `
      <div class="empty-state">
        <h3>No Upcoming Sessions</h3>
        <p>Book a session to see it here!</p>
      </div>
    `
    return
  }

  upcomingContainer.innerHTML = upcomingSessions.map((session) => createSessionItemHTML(session)).join("")
}

function loadSessionHistory() {
  const historyContainer = document.getElementById("session-history")
  const today = new Date()
  const pastSessions = []

  // Get all past music sessions
  Object.entries(bookings.music).forEach(([date, slots]) => {
    const sessionDate = new Date(date)
    if (sessionDate < today) {
      slots.forEach((slot) => {
        pastSessions.push({
          type: "music",
          date: sessionDate,
          dateStr: date,
          slot: slot,
          details: getSessionDetails(date, "music", slot),
        })
      })
    }
  })

  // Get all past video sessions
  Object.entries(bookings.video).forEach(([date, details]) => {
    const sessionDate = new Date(date)
    if (sessionDate < today) {
      pastSessions.push({
        type: "video",
        date: sessionDate,
        dateStr: date,
        details: details,
      })
    }
  })

  // Sort by date (most recent first)
  pastSessions.sort((a, b) => b.date - a.date)

  if (pastSessions.length === 0) {
    historyContainer.innerHTML = `
      <div class="empty-state">
        <h3>No Session History</h3>
        <p>Completed sessions will appear here.</p>
      </div>
    `
    return
  }

  historyContainer.innerHTML = pastSessions.map((session) => createSessionItemHTML(session)).join("")
}

function createSessionItemHTML(session) {
  const formattedDate = session.date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  let detailsHTML = ""

  if (session.type === "music") {
    detailsHTML = `
      <div class="session-detail">
        <div class="session-detail-label">Time Slot</div>
        <div class="session-detail-value">${session.slot}</div>
      </div>
      <div class="session-detail">
        <div class="session-detail-label">Artist</div>
        <div class="session-detail-value">${session.details?.artist || "N/A"}</div>
      </div>
      <div class="session-detail">
        <div class="session-detail-label">Contact</div>
        <div class="session-detail-value">${session.details?.contact || "N/A"}</div>
      </div>
    `
  } else {
    detailsHTML = `
      <div class="session-detail">
        <div class="session-detail-label">Duration</div>
        <div class="session-detail-value">Full Day (8:00 AM - 6:00 PM)</div>
      </div>
      <div class="session-detail">
        <div class="session-detail-label">Client</div>
        <div class="session-detail-value">${session.details.artist}</div>
      </div>
      <div class="session-detail">
        <div class="session-detail-label">Contact</div>
        <div class="session-detail-value">${session.details.contact}</div>
      </div>
      <div class="session-detail">
        <div class="session-detail-label">Project</div>
        <div class="session-detail-value">${session.details.project}</div>
      </div>
    `
  }

  return `
    <div class="session-item ${session.type}-session">
      <div class="session-header">
        <div>
          <span class="session-type ${session.type}">${session.type === "music" ? "Music Recording" : "Video Production"}</span>
          <div class="session-date">${formattedDate}</div>
        </div>
      </div>
      <div class="session-details">
        ${detailsHTML}
      </div>
    </div>
  `
}

function getSessionDetails(date, type, slot) {
  // This would typically come from a more detailed booking system
  // For now, return placeholder data
  return {
    artist: "Artist Name",
    contact: "Contact Info",
  }
}

function bookMusicSession() {
  const date = document.getElementById("music-date").value
  const slot = document.getElementById("music-slot").value
  const artist = document.getElementById("music-artist").value
  const contact = document.getElementById("music-contact").value

  if (!date || !slot || !artist || !contact) {
    alert("Please fill in all fields.")
    return
  }

  // Check if slot is already booked
  if (bookings.music[date] && bookings.music[date].includes(slot)) {
    alert("This time slot is already booked.")
    return
  }

  // Book the session
  if (!bookings.music[date]) {
    bookings.music[date] = []
  }
  bookings.music[date].push(slot)

  // Store session details
  const sessionDetails = JSON.parse(localStorage.getItem("sessionDetails") || "{}")
  if (!sessionDetails[date]) {
    sessionDetails[date] = {}
  }
  sessionDetails[date][slot] = { artist, contact, type: "music" }
  localStorage.setItem("sessionDetails", JSON.stringify(sessionDetails))

  // Save to localStorage
  localStorage.setItem("musicBookings", JSON.stringify(bookings.music))

  // Clear form
  document.getElementById("music-date").value = ""
  document.getElementById("music-slot").innerHTML = '<option value="">Select a date first</option>'
  document.getElementById("music-artist").value = ""
  document.getElementById("music-contact").value = ""

  // Refresh calendar if visible
  if (document.getElementById("tracking-calendar").classList.contains("active")) {
    generateCalendar()
  }

  alert(`Music session booked successfully!\nDate: ${date}\nTime: ${slot}\nArtist: ${artist}`)
}

function bookVideoSession() {
  const date = document.getElementById("video-date").value
  const artist = document.getElementById("video-artist").value
  const contact = document.getElementById("video-contact").value
  const project = document.getElementById("video-project").value

  if (!date || !artist || !contact || !project) {
    alert("Please fill in all fields.")
    return
  }

  // Check if date is already booked
  if (bookings.video[date]) {
    alert("This date is already booked for video production.")
    return
  }

  // Book the session
  bookings.video[date] = {
    artist,
    contact,
    project,
  }

  // Save to localStorage
  localStorage.setItem("videoBookings", JSON.stringify(bookings.video))

  // Clear form
  document.getElementById("video-date").value = ""
  document.getElementById("video-artist").value = ""
  document.getElementById("video-contact").value = ""
  document.getElementById("video-project").value = ""

  // Refresh calendar if visible
  if (document.getElementById("tracking-calendar").classList.contains("active")) {
    generateCalendar()
  }

  alert(`Video production session booked successfully!\nDate: ${date}\nClient: ${artist}`)
}

// E-book System Data Storage
const ebooks = JSON.parse(localStorage.getItem("ebooks") || "[]")
let currentFontSize = 18
let isDarkTheme = false

// E-book System Functions
function switchEbookTab(type) {
  // Remove active class from all tabs
  document.querySelectorAll(".ebook-tab").forEach((tab) => {
    tab.classList.remove("active")
  })

  // Hide all ebook content
  document.querySelectorAll(".ebook-content").forEach((content) => {
    content.classList.remove("active")
  })

  // Show selected tab and content
  document.querySelector(`[onclick="switchEbookTab('${type}')"]`).classList.add("active")
  document.getElementById(`ebook-${type}`).classList.add("active")

  if (type === "library") {
    loadEbookLibrary()
  }
}

function loadEbookLibrary() {
  const ebookGrid = document.getElementById("ebook-grid")

  if (ebooks.length === 0) {
    ebookGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--neutral-gray-600);">
        <h3>No e-books available</h3>
        <p>Upload your first e-book to get started!</p>
      </div>
    `
    return
  }

  ebookGrid.innerHTML = ebooks
    .map(
      (book, index) => `
    <div class="ebook-item" onclick="openEbook(${index})">
      <div class="ebook-cover">
        ${book.cover ? `<img src="${book.cover}" alt="${book.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;">` : "📖"}
      </div>
      <div class="ebook-title">${book.title}</div>
      <div class="ebook-author">by ${book.author}</div>
    </div>
  `,
    )
    .join("")
}

function uploadEbook() {
  const title = document.getElementById("ebook-title").value
  const author = document.getElementById("ebook-author").value
  const description = document.getElementById("ebook-description").value
  const content = document.getElementById("ebook-content").value
  const cover = document.getElementById("ebook-cover").value

  if (!title || !author || !content) {
    alert("Please fill in the required fields (Title, Author, and Content).")
    return
  }

  const newBook = {
    id: Date.now(),
    title,
    author,
    description,
    content,
    cover: cover || null,
    uploadDate: new Date().toISOString(),
  }

  ebooks.push(newBook)
  localStorage.setItem("ebooks", JSON.stringify(ebooks))

  // Clear form
  document.getElementById("ebook-title").value = ""
  document.getElementById("ebook-author").value = ""
  document.getElementById("ebook-description").value = ""
  document.getElementById("ebook-content").value = ""
  document.getElementById("ebook-cover").value = ""

  alert(`E-book "${title}" uploaded successfully!`)

  // Switch to library tab
  switchEbookTab("library")
}

function openEbook(index) {
  const book = ebooks[index]
  if (!book) return

  // Switch to reader tab
  switchEbookTab("reader")

  // Load book content
  const readerContent = document.getElementById("reader-content")
  readerContent.innerHTML = formatEbookContent(book)
  readerContent.style.fontSize = `${currentFontSize}px`
}

function formatEbookContent(book) {
  let formattedContent = `<h1>${book.title}</h1><p><em>by ${book.author}</em></p><hr>`

  if (book.description) {
    formattedContent += `<p><strong>Description:</strong> ${book.description}</p><hr>`
  }

  // Simple Markdown parsing
  let content = book.content

  // Headers
  content = content.replace(/^### (.*$)/gim, "<h3>$1</h3>")
  content = content.replace(/^## (.*$)/gim, "<h2>$1</h2>")
  content = content.replace(/^# (.*$)/gim, "<h1>$1</h1>")

  // Bold and Italic
  content = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
  content = content.replace(/\*(.*?)\*/g, "<em>$1</em>")

  // Links
  content = content.replace(/\[([^\]]+)\]$$([^)]+)$$/g, '<a href="$2" target="_blank">$1</a>')

  // Code blocks
  content = content.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
  content = content.replace(/`([^`]+)`/g, "<code>$1</code>")

  // Blockquotes
  content = content.replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>")

  // Line breaks
  content = content.replace(/\n\n/g, "</p><p>")
  content = content.replace(/\n/g, "<br>")

  // Wrap in paragraphs
  content = "<p>" + content + "</p>"

  // Clean up empty paragraphs
  content = content.replace(/<p><\/p>/g, "")
  content = content.replace(/<p><br><\/p>/g, "")

  return formattedContent + content
}

function closeReader() {
  switchEbookTab("library")
}

function increaseFontSize() {
  currentFontSize = Math.min(currentFontSize + 2, 24)
  document.getElementById("reader-content").style.fontSize = `${currentFontSize}px`
}

function decreaseFontSize() {
  currentFontSize = Math.max(currentFontSize - 2, 12)
  document.getElementById("reader-content").style.fontSize = `${currentFontSize}px`
}

function toggleTheme() {
  const readerContent = document.getElementById("reader-content")
  isDarkTheme = !isDarkTheme

  if (isDarkTheme) {
    readerContent.classList.add("dark-theme")
  } else {
    readerContent.classList.remove("dark-theme")
  }
}
