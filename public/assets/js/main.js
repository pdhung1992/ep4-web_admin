/**
 * Main
 */

'use strict';

var menu, animate;



(function () {

  function initializeMenu() {
    const layoutMenuEl = document.querySelectorAll('#layout-menu');
    if (typeof Menu !== 'undefined') {
      layoutMenuEl.forEach(function (element) {
        menu = new Menu(element, {
          orientation: 'vertical',
          closeChildren: false,
        });
        window.Helpers.scrollToActive(false); // animate = false
        window.Helpers.mainMenu = menu;
      });
    } else {
      console.error('Menu is not defined. Please ensure the Menu library is loaded.');
    }
  }

  function initializeMenuTogglers() {
    let menuToggler = document.querySelectorAll('.layout-menu-toggle');
    menuToggler.forEach(item => {
      item.addEventListener('click', event => {
        event.preventDefault();
        window.Helpers.toggleCollapsed();
      });
    });
  }

  function setupMenuHover() {
    let delay = function (elem, callback) {
      let timeout = null;
      elem.onmouseenter = function () {
        if (!Helpers.isSmallScreen()) {
          timeout = setTimeout(callback, 300);
        } else {
          timeout = setTimeout(callback, 0);
        }
      };

      elem.onmouseleave = function () {
        document.querySelector('.layout-menu-toggle').classList.remove('d-block');
        clearTimeout(timeout);
      };
    };

    if (document.getElementById('layout-menu')) {
      delay(document.getElementById('layout-menu'), function () {
        if (!Helpers.isSmallScreen()) {
          document.querySelector('.layout-menu-toggle').classList.add('d-block');
        }
      });
    }
  }

  function setupMenuScroll() {
    let menuInnerContainer = document.getElementsByClassName('menu-inner'),
        menuInnerShadow = document.getElementsByClassName('menu-inner-shadow')[0];

    if (menuInnerContainer.length > 0 && menuInnerShadow) {
      menuInnerContainer[0].addEventListener('ps-scroll-y', function () {
        if (this.querySelector('.ps__thumb-y').offsetTop) {
          menuInnerShadow.style.display = 'block';
        } else {
          menuInnerShadow.style.display = 'none';
        }
      });
    }
  }

  function initializeTooltipAndAccordion() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    const accordionActiveFunction = function (e) {
      if (e.type == 'show.bs.collapse' || e.type == 'show.bs.collapse') {
        e.target.closest('.accordion-item').classList.add('active');
      } else {
        e.target.closest('.accordion-item').classList.remove('active');
      }
    };

    const accordionTriggerList = [].slice.call(document.querySelectorAll('.accordion'));
    accordionTriggerList.forEach(function (accordionTriggerEl) {
      accordionTriggerEl.addEventListener('show.bs.collapse', accordionActiveFunction);
      accordionTriggerEl.addEventListener('hide.bs.collapse', accordionActiveFunction);
    });
  }

  function initializeHelpers() {
    window.Helpers.setAutoUpdate(true);
    window.Helpers.initPasswordToggle();
    window.Helpers.initSpeechToText();
  }

  // Hàm quản lý menu collapse/expand
  function manageMenuCollapse() {
    if (window.Helpers.isSmallScreen()) {
      return;
    }

    window.Helpers.setCollapsed(true, false);
  }

  // Gọi các hàm khởi tạo
  initializeMenu();
  initializeMenuTogglers();
  setupMenuHover();
  setupMenuScroll();
  initializeTooltipAndAccordion();
  initializeHelpers();
  manageMenuCollapse();

})();

//JS Old
// -> Lỗi: Không thể chạy được vì các ham khai báo trước khi sử dụng
// (function () {
//   // Initialize menu
//   //-----------------
//
//   let layoutMenuEl = document.querySelectorAll('#layout-menu');
//   layoutMenuEl.forEach(function (element) {
//     menu = new Menu(element, {
//       orientation: 'vertical',
//       closeChildren: false
//     });
//     // Change parameter to true if you want scroll animation
//     window.Helpers.scrollToActive((animate = false));
//     window.Helpers.mainMenu = menu;
//   });
//
//   // Initialize menu togglers and bind click on each
//   let menuToggler = document.querySelectorAll('.layout-menu-toggle');
//   menuToggler.forEach(item => {
//     item.addEventListener('click', event => {
//       event.preventDefault();
//       window.Helpers.toggleCollapsed();
//     });
//   });
//
//   // Display menu toggle (layout-menu-toggle) on hover with delay
//   let delay = function (elem, callback) {
//     let timeout = null;
//     elem.onmouseenter = function () {
//       // Set timeout to be a timer which will invoke callback after 300ms (not for small screen)
//       if (!Helpers.isSmallScreen()) {
//         timeout = setTimeout(callback, 300);
//       } else {
//         timeout = setTimeout(callback, 0);
//       }
//     };
//
//     elem.onmouseleave = function () {
//       // Clear any timers set to timeout
//       document.querySelector('.layout-menu-toggle').classList.remove('d-block');
//       clearTimeout(timeout);
//     };
//   };
//   if (document.getElementById('layout-menu')) {
//     delay(document.getElementById('layout-menu'), function () {
//       // not for small screen
//       if (!Helpers.isSmallScreen()) {
//         document.querySelector('.layout-menu-toggle').classList.add('d-block');
//       }
//     });
//   }
//
//   // Display in main menu when menu scrolls
//   let menuInnerContainer = document.getElementsByClassName('menu-inner'),
//     menuInnerShadow = document.getElementsByClassName('menu-inner-shadow')[0];
//   if (menuInnerContainer.length > 0 && menuInnerShadow) {
//     menuInnerContainer[0].addEventListener('ps-scroll-y', function () {
//       if (this.querySelector('.ps__thumb-y').offsetTop) {
//         menuInnerShadow.style.display = 'block';
//       } else {
//         menuInnerShadow.style.display = 'none';
//       }
//     });
//   }
//
//   // Init helpers & misc
//   // --------------------
//
//   // Init BS Tooltip
//   const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
//   tooltipTriggerList.map(function (tooltipTriggerEl) {
//     return new bootstrap.Tooltip(tooltipTriggerEl);
//   });
//
//   // Accordion active class
//   const accordionActiveFunction = function (e) {
//     if (e.type == 'show.bs.collapse' || e.type == 'show.bs.collapse') {
//       e.target.closest('.accordion-item').classList.add('active');
//     } else {
//       e.target.closest('.accordion-item').classList.remove('active');
//     }
//   };
//
//   const accordionTriggerList = [].slice.call(document.querySelectorAll('.accordion'));
//   const accordionList = accordionTriggerList.map(function (accordionTriggerEl) {
//     accordionTriggerEl.addEventListener('show.bs.collapse', accordionActiveFunction);
//     accordionTriggerEl.addEventListener('hide.bs.collapse', accordionActiveFunction);
//   });
//
//   // Auto update layout based on screen size
//   window.Helpers.setAutoUpdate(true);
//
//   // Toggle Password Visibility
//   window.Helpers.initPasswordToggle();
//
//   // Speech To Text
//   window.Helpers.initSpeechToText();
//
//   // Manage menu expanded/collapsed with templateCustomizer & local storage
//   //------------------------------------------------------------------
//
//   // If current layout is horizontal OR current window screen is small (overlay menu) than return from here
//   if (window.Helpers.isSmallScreen()) {
//     return;
//   }
//
//   // If current layout is vertical and current window screen is > small
//
//   // Auto update menu collapsed/expanded based on the themeConfig
//   window.Helpers.setCollapsed(true, false);
// })();

