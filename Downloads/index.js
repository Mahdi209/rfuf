document.addEventListener("DOMContentLoaded", function () {
  const downloadedBooks = JSON.parse(localStorage.getItem("downloads") || "[]");
  const downloadsContainer = document.getElementById("downloadedBooks");
  const emptyDownloads = document.querySelector(".empty-state");

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
          <button class="book-action-btn remove" title="حذف من التنزيلات">
            <i class="fas fa-trash-alt"></i>
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
        <span class="download-date">
          <i class="fas fa-calendar-alt"></i>
          ${new Date(book.downloadDate).toLocaleDateString("ar-SA")}
        </span>
      </div>
    `;

    const bookCover = bookElement.querySelector(".bookCover");
    bookElement.addEventListener("mouseleave", function () {
      bookCover.style.transform = "";
      bookCover.style.transition = "transform 0.5s ease";
    });

    const removeBtn = bookElement.querySelector(".remove");
    removeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const updatedDownloads = downloadedBooks.filter(
        (dl) => dl.title !== book.title
      );
      localStorage.setItem("downloads", JSON.stringify(updatedDownloads));

      bookElement.style.transform = "scale(0.8)";
      bookElement.style.opacity = "0";

      setTimeout(() => {
        bookElement.remove();
        if (updatedDownloads.length === 0) {
          emptyDownloads.classList.remove("hidden");
          downloadsContainer.classList.add("hidden");
        }
      }, 300);

      showToast("تم حذف الكتاب من التنزيلات");
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

  if (downloadedBooks.length > 0) {
    downloadedBooks.forEach((book) => {
      downloadsContainer.appendChild(createBookElement(book));
    });
    emptyDownloads.classList.add("hidden");
  } else {
    emptyDownloads.classList.remove("hidden");
    downloadsContainer.classList.add("hidden");
  }
});
