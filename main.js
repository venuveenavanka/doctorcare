window.addEventListener('scroll', onScroll)

onScroll()
function onScroll() {
  showNavOnScroll()
  showBackToTopButtonOnScroll()

  activateMenuAtCurrentSection(home)
  activateMenuAtCurrentSection(services)
  activateMenuAtCurrentSection(about)
  activateMenuAtCurrentSection(testimonials)
  activateMenuAtCurrentSection(contact)
}

function showNavOnScroll() {
  if (scrollY > 0) {
    navig.classList.add('scroll')
  } else {
    navig.classList.remove('scroll')
  }
}

function activateMenuAtCurrentSection(section) {
  // innherHeight is a number  that represents the size of the viewport
  const targetLine = scrollY + innerHeight / 2

  const sectionTop = section.offsetTop
  const sectionHeight = section.offsetHeight

  const sectionTopReachOrPassedTargetLine = targetLine >= sectionTop

  const sectionEndsAt = sectionTop + sectionHeight

  const sectionEndPassedTargetLine = sectionEndsAt <= targetLine

  const sectionBoundaries =
    sectionTopReachOrPassedTargetLine && !sectionEndPassedTargetLine

  const sectionId = section.getAttribute('id')
  const menuElement = document.querySelector(`.menu a[href*=${sectionId}]`)

  menuElement.classList.remove('active')
  if (sectionBoundaries) {
    menuElement.classList.add('active')
  }
}

function showBackToTopButtonOnScroll() {
  if (scrollY > 550) {
    backToTopButton.classList.add('show')
  } else {
    backToTopButton.classList.remove('show')
  }
}

function openMenu() {
  document.body.classList.add('menu-expanded')
}

function closeMenu() {
  document.body.classList.remove('menu-expanded')
}

// Lib swiperJs

// Swiper of #testimonials refeering as 's1' instead of 'swiper'
const swiper1 = new Swiper('.s1', {
  slidesPerView: 1,
  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },
  mousewheel: true,
  keyboard: true,

  breakpoints: {
    1024: {
      slidesPerView: 2,
    },
  }
})

// Swiper of #brands refeering as 's2' instead of 'swiper'
const swiper2 = new Swiper('.s2', {
  slidesPerView: 2,
  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },
  mousewheel: true,
  keyboard: true,

  breakpoints: {
    1024: {
      slidesPerView: 3,
    },
  }
})


// Lib scrollReveal
ScrollReveal({
  origin: 'top',
  distance: '30px',
  duration: 700
}).reveal(`
  #home, 
  #home img, 
  #home .stats,
  #services,
  #services header,
  #services .card,
  #about,
  #about header,
  #about .content,
  #testimonials,
  #testimonials header,
  #testimonials .content,
  #brands,
  #brands header,
  #brands .content`)
