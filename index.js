document.addEventListener("DOMContentLoaded", function () {
  const splashScreen = document.querySelector(".splash-screen");

  setTimeout(() => {
    splashScreen.classList.add("hide");

    setTimeout(() => {
      splashScreen.style.display = "none";
    }, 1000);
  }, 1500);

  const sidebarToggle = document.getElementById("sidebar-toggle");
  const sidebar = document.querySelector(".sidebar");
  const mainContent = document.querySelector(".main-content");

  sidebarToggle.addEventListener("click", function () {
    sidebar.classList.toggle("open");
    mainContent.classList.toggle("shift");
  });

  document.addEventListener("click", function (event) {
    const isClickInsideSidebar = sidebar.contains(event.target);
    const isClickOnToggleButton = sidebarToggle.contains(event.target);

    if (
      !isClickInsideSidebar &&
      !isClickOnToggleButton &&
      sidebar.classList.contains("open")
    ) {
      sidebar.classList.remove("open");
      mainContent.classList.remove("shift");
    }
  });

  const searchBtn = document.getElementById("search-btn");
  const searchDialog = document.getElementById("search-dialog");
  const closeSearch = document.getElementById("close-search");
  const searchInput = document.getElementById("search-input");

  searchBtn.addEventListener("click", function () {
    searchDialog.classList.add("open");
    setTimeout(() => {
      searchInput.focus();
    }, 300);
  });

  closeSearch.addEventListener("click", function () {
    searchDialog.classList.remove("open");
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && searchDialog.classList.contains("open")) {
      searchDialog.classList.remove("open");
    }
  });

  searchDialog.addEventListener("click", function (event) {
    if (event.target === searchDialog) {
      searchDialog.classList.remove("open");
    }
  });

  const filterBtns = document.querySelectorAll(".filter-btn");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      filterBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      const filterType = this.dataset.filter;
      console.log(`Filter changed to: ${filterType}`);

      if (searchInput.value.trim() !== "") {
        performSearch(searchInput.value, filterType);
      }
    });
  });

  let searchTimeout;

  searchInput.addEventListener("input", function () {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
      const searchValue = this.value.trim();
      if (searchValue.length > 2) {
        const activeFilter =
          document.querySelector(".filter-btn.active").dataset.filter;
        performSearch(searchValue, activeFilter);
      } else if (searchValue === "") {
        clearSearchResults();
      }
    }, 300);
  });

  async function loadBooks() {
    try {
      const response = await fetch("./books/books.json");
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const data = await response.json();
      return data.books;
    } catch (error) {
      console.error("Error loading books:", error);
      showToast("حدث خطأ في تحميل الكتب");
      return [];
    }
  }

  async function performSearch(query, filterType) {
    const books = await loadBooks();
    const resultsContainer = document.getElementById(
      "search-results-container"
    );
    resultsContainer.innerHTML = "";

    const filteredBooks = books.filter((book) => {
      const matchesQuery =
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.category.toLowerCase().includes(query.toLowerCase());

      if (filterType === "all") return matchesQuery;
      if (filterType === "books") return matchesQuery;
      if (filterType === "authors")
        return book.author.toLowerCase().includes(query.toLowerCase());
      return false;
    });

    if (filteredBooks.length === 0) {
      resultsContainer.innerHTML = `
        <div class="no-results">لا توجد نتائج مطابقة لبحثك</div>
      `;
      return;
    }

    filteredBooks.forEach((book) => {
      const bookElement = document.createElement("div");
      bookElement.className = "search-result book-result";
      bookElement.innerHTML = `
        <img src="./books/${book.image || "default-book.png"}" alt="${
        book.title
      }">
        <div class="result-info">
          <h5>${book.title}</h5>
          <p>${book.author}</p>
          <span class="category">${book.category}</span>
        </div>
      `;
      resultsContainer.appendChild(bookElement);
    });
  }

  function clearSearchResults() {
    const resultsContainer = document.getElementById(
      "search-results-container"
    );
    resultsContainer.innerHTML = "";
  }

  function createBookSearchResult(book) {
    const bookElement = document.createElement("div");
    bookElement.className = "search-result book-result";
    bookElement.innerHTML = `
          <img src="${book.cover}" alt="${book.title}">
          <div class="result-info">
              <h5>${book.title}</h5>
              <p>${book.author}</p>
          </div>
      `;
    return bookElement;
  }

  function createAuthorSearchResult(author) {
    const authorElement = document.createElement("div");
    authorElement.className = "search-result author-result";
    authorElement.innerHTML = `
          <img src="${author.avatar}" alt="${author.name}">
          <div class="result-info">
              <h5>${author.name}</h5>
              <p>${author.books} كتاب</p>
          </div>
      `;
    return authorElement;
  }

  const favoriteButtons = document.querySelectorAll(
    ".book-action-btn.favorite"
  );
  const downloadButtons = document.querySelectorAll(
    ".book-action-btn.download"
  );

  favoriteButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      this.classList.toggle("active");

      const icon = this.querySelector("i");
      if (icon.classList.contains("fa-heart")) {
        if (icon.classList.contains("fas")) {
          icon.classList.remove("fas");
          icon.classList.add("far");
          showToast("تمت إزالة الكتاب من المفضلة");
        } else {
          icon.classList.remove("far");
          icon.classList.add("fas");
          showToast("تمت إضافة الكتاب إلى المفضلة");
        }
      }
    });
  });

  downloadButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      showToast("جاري تحميل الكتاب...");

      // Simulate download completed after 2 seconds
      setTimeout(() => {
        showToast("تم تحميل الكتاب بنجاح");
      }, 2000);
    });
  });

  function showToast(message) {
    // Check if a toast container already exists
    let toastContainer = document.querySelector(".toast-container");

    // If not, create one
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.className = "toast-container";
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("show");
    }, 10);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (href !== "#") {
        e.preventDefault();
        const targetElement = document.querySelector(href);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  });

  const style = document.createElement("style");
  style.textContent = `
      .toast-container {
          position: fixed;
          bottom: 20px;
          left: 20px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
      }
      
      .toast {
          background-color: var(--primary-color);
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          font-size: 14px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.3s, transform 0.3s;
      }
      
      .toast.show {
          opacity: 1;
          transform: translateY(0);
      }
      
      .search-result {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-radius: 8px;
          transition: background-color 0.3s;
          cursor: pointer;
      }
      
      .search-result:hover {
          background-color: rgba(225, 217, 183, 0.3);
      }
      
      .search-result img {
          width: 60px;
          height: 70px;
          object-fit: cover;
          border-radius: 6px;
      }
      
      .author-result img, .user-result img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
      }
      
      .result-info h5 {
          margin: 0 0 5px 0;
          font-size: 16px;
          color: var(--primary-color);
      }
      
      .result-info p {
          margin: 0;
          font-size: 14px;
          color: var(--text-light);
      }
      
      .no-results {
          padding: 20px;
          text-align: center;
          color: var(--text-light);
      }
  `;

  document.head.appendChild(style);

  document.querySelectorAll(".book-action-btn.favorite i").forEach((icon) => {
    if (icon.classList.contains("fa-heart")) {
      icon.classList.remove("fas");
      icon.classList.add("far");
    }
  });

  function createBookElement(book) {
    const stars =
      "★".repeat(Math.floor(book.rating)) +
      "☆".repeat(5 - Math.floor(book.rating));
    const favorites = getFavorites();
    const isFavorite = favorites.some((fav) => fav.title === book.title);

    const bookElement = document.createElement("div");
    bookElement.className = "book";
    bookElement.style.cursor = "pointer";
    bookElement.dataset.bookId = book.id;

    bookElement.innerHTML = `
      <div class="bookCover">
        <img
          class="imageCover"
          src="./books/${book.image || "default-book.png"}"
          alt="${book.title}"
          onerror="this.src='./assets/default-book.png'"
        />
        <div class="book-actions">
          <button class="book-action-btn favorite" title="إضافة إلى المفضلة">
            <i class="${isFavorite ? "fas" : "far"} fa-heart"></i>
          </button>
          <button class="book-action-btn download" title="تحميل الكتاب">
            <i class="fas fa-download"></i>
          </button>
        </div>
      </div>
      <div class="book-info">
        <h3 class="book-title">${book.title}</h3>
        <p class="book-author">${book.author}</p>
        <div class="book-rating">
          <span class="star">${stars}</span>
        </div>
        <span class="book-category">${book.category}</span>
      </div>
    `;

    bookElement.addEventListener("click", (e) => {
      if (!e.target.closest(".book-action-btn")) {
        window.location.href = `./bookDetails/index.html?id=${book.id}`;
      }
    });

    return bookElement;
  }

  async function displayBooks() {
    try {
      const response = await fetch("./books/books.json");
      const data = await response.json();
      const books = data.books;

      const popularBooks = books.filter((book) => book.rating >= 4).slice(0, 4);
      const popularContainer = document.getElementById("popularBooks");
      popularContainer.innerHTML = "";
      popularBooks.forEach((book) => {
        popularContainer.appendChild(createBookElement(book));
      });

      const newBooks = [...books].reverse().slice(0, 4);
      const newContainer = document.getElementById("newBooks");
      newContainer.innerHTML = "";
      newBooks.forEach((book) => {
        newContainer.appendChild(createBookElement(book));
      });

      // Recommended books (random selection)
      const recommendedBooks = [...books]
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
      const recommendedContainer = document.getElementById("recommendedBooks");
      recommendedContainer.innerHTML = "";
      recommendedBooks.forEach((book) => {
        recommendedContainer.appendChild(createBookElement(book));
      });

      initializeBookEffects();
    } catch (error) {
      console.error("Error loading books:", error);
      showToast("حدث خطأ في تحميل الكتب");
    }
  }

  function initializeBookEffects() {
    const books = document.querySelectorAll(".book");
    books.forEach((book) => {
      const bookCover = book.querySelector(".bookCover");
      book.addEventListener("mouseleave", function () {
        bookCover.style.transform = "";
      });
    });

    initializeBookActions();
  }

  function initializeBookActions() {
    document.querySelectorAll(".book-action-btn.favorite").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const bookElement = this.closest(".book");
        const book = {
          title: bookElement.querySelector(".book-title").textContent,
          author: bookElement.querySelector(".book-author").textContent,
          category: bookElement.querySelector(".book-category").textContent,
          image: bookElement
            .querySelector(".imageCover")
            .getAttribute("src")
            .split("/")
            .pop(),
          rating:
            bookElement.querySelector(".star").textContent.split("★").length -
            1,
        };

        const icon = this.querySelector("i");
        if (icon.classList.contains("far")) {
          if (addToFavorites(book)) {
            icon.classList.replace("far", "fas");
            showToast("تمت إضافة الكتاب إلى المفضلة");
          }
        } else {
          removeFromFavorites(book);
          icon.classList.replace("fas", "far");
          showToast("تمت إزالة الكتاب من المفضلة");
        }
      });
    });

    document.querySelectorAll(".book-action-btn.download").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const bookElement = this.closest(".book");
        const book = {
          title: bookElement.querySelector(".book-title").textContent,
          author: bookElement.querySelector(".book-author").textContent,
          category: bookElement.querySelector(".book-category").textContent,
          image: bookElement
            .querySelector(".imageCover")
            .getAttribute("src")
            .split("/")
            .pop(),
        };

        if (addToDownloads(book)) {
          showToast("جاري تحميل الكتاب...");
          setTimeout(() => {
            showToast("تم تحميل الكتاب بنجاح");
          }, 2000);
        } else {
          showToast("تم تحميل هذا الكتاب مسبقاً");
        }
      });
    });
  }

  displayBooks();

  document.addEventListener(
    "error",
    function (e) {
      if (e.target.tagName === "IMG") {
        e.target.src = "./assets/default-book.png";
      }
    },
    true
  );

  updateFavoritesCount();
});

function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites") || "[]");
}

function getDownloads() {
  return JSON.parse(localStorage.getItem("downloads") || "[]");
}

function addToFavorites(book) {
  const favorites = getFavorites();
  if (!favorites.some((fav) => fav.title === book.title)) {
    favorites.push(book);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    updateFavoritesCount();
    return true;
  }
  return false;
}

function removeFromFavorites(book) {
  const favorites = getFavorites();
  const filtered = favorites.filter((fav) => fav.title !== book.title);
  localStorage.setItem("favorites", JSON.stringify(filtered));
  updateFavoritesCount();
}

function addToDownloads(book) {
  const downloads = getDownloads();
  if (!downloads.some((dl) => dl.title === book.title)) {
    downloads.push({
      ...book,
      downloadDate: new Date().toISOString(),
    });
    localStorage.setItem("downloads", JSON.stringify(downloads));
    return true;
  }
  return false;
}

function updateFavoritesCount() {
  const count = getFavorites().length;
  const favMenuIcon = document.querySelector(".menu-item i.fa-heart");
  if (favMenuIcon) {
    const countSpan = favMenuIcon.nextElementSibling;
    countSpan.textContent = `المفضلة (${count})`;
  }
}
