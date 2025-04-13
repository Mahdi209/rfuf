document.addEventListener("DOMContentLoaded", function () {
  const favoriteBooks = JSON.parse(localStorage.getItem("favorites") || "[]");
  const favoritesContainer = document.getElementById("favoriteBooks");
  const emptyFavorites = document.querySelector(".empty-favorites");

  function createBookElement(book) {
    const stars =
      "★".repeat(Math.floor(book.rating)) +
      "☆".repeat(5 - Math.floor(book.rating));

    const bookElement = document.createElement("div");
    bookElement.className = "book";
    bookElement.innerHTML = `
      <div class="bookCover">
        <div class="book-overlay"></div>
        <span class="bgCover"></span>
        <img
          class="imageCover"
          src="../books/${book.image || "default-book.png"}"
          alt="${book.title}"
          onerror="this.src='../assets/default-book.png'"
        />
        <div class="book-actions">
          <button class="book-action-btn favorite" title="إزالة من المفضلة">
            <i class="fas fa-heart"></i>
          </button>
          <button class="book-action-btn download" title="تحميل الكتاب">
            <i class="fas fa-download"></i>
          </button>
        </div>
      </div>
      <div class="book-info">
        <h3 class="book-title">${book.title}</h3>
        <p class="book-author">
          <i class="fas fa-user-edit"></i>
          ${book.author}
        </p>
        <div class="book-rating">
          <span class="star" title="${book.rating} من 5">${stars}</span>
        </div>
        <span class="book-category">
          <i class="fas fa-bookmark"></i>
          ${book.category}
        </span>
      </div>
    `;

    const bookCover = bookElement.querySelector(".bookCover");

    bookElement.addEventListener("mouseleave", function () {
      bookCover.style.transform = "";
      bookCover.style.transition = "transform 0.5s ease";
    });

    const removeBtn = bookElement.querySelector(".favorite");
    removeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const updatedFavorites = favoriteBooks.filter(
        (fav) => fav.title !== book.title
      );
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

      bookElement.style.transform = "scale(0.8)";
      bookElement.style.opacity = "0";

      setTimeout(() => {
        bookElement.remove();
        if (updatedFavorites.length === 0) {
          emptyFavorites.classList.remove("hidden");
          favoritesContainer.classList.add("hidden");
        }
      }, 300);

      showToast("تم إزالة الكتاب من المفضلة");
    });

    const downloadBtn = bookElement.querySelector(".download");
    downloadBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      showToast("جاري تحميل الكتاب...");
      setTimeout(() => {
        showToast("تم تحميل الكتاب بنجاح");
      }, 2000);
    });

    return bookElement;
  }

  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("show");
      setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
          toast.remove();
        }, 300);
      }, 2000);
    }, 100);
  }

  if (favoriteBooks.length > 0) {
    favoriteBooks.forEach((book) => {
      favoritesContainer.appendChild(createBookElement(book));
    });
    emptyFavorites.classList.add("hidden");
  } else {
    emptyFavorites.classList.remove("hidden");
    favoritesContainer.classList.add("hidden");
  }
});
