document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get("id");
  const id = parseInt(bookId);
  if (!bookId) {
    showToast("لم يتم العثور على معرف الكتاب");
    return;
  }

  fetch("../books/books.json")
    .then((response) => response.json())
    .then((data) => {
      const book = data.books.find((b) => b.id === id);

      if (!book) {
        showToast("لم يتم العثور على الكتاب");
        return;
      }

      updateBookDetails(book);
    })
    .catch((error) => {
      console.error("Error:", error);
      showToast("حدث خطأ أثناء تحميل بيانات الكتاب");
    });

  function updateBookDetails(book) {
    document.querySelector(".book-title").textContent = book.title;

    if (book.image) {
      const coverContainer = document.querySelector(".cover-container");
      coverContainer.innerHTML = `<img src="../books/${book.image}" alt="${book.title}" style="width: 100%; height: 100%; object-fit: cover;">`;
    }

    const metaItems = document.querySelectorAll(".meta-item");
    metaItems.forEach((item) => {
      const label = item.querySelector(".meta-label").textContent.trim();
      const value = item.querySelector(".meta-value");

      switch (label) {
        case "المؤلف :":
          value.textContent = book.author;
          break;
        case "عدد الصفحات :":
          value.textContent = book.pages;
          break;
        case "نبذة :":
          value.textContent = book.description;
          break;
      }
    });

    if (book.rating) {
      const stars = document.querySelectorAll(".stars i");
      const rating = Math.round(book.rating);
      stars.forEach((star, index) => {
        if (index < rating) {
          star.classList.add("fas");
          star.classList.remove("far");
        } else {
          star.classList.add("far");
          star.classList.remove("fas");
        }
      });
    }

    document.title = `رفوفي - ${book.title}`;
  }

  const favoriteBtn = document.querySelector(".btn-favorite");
  if (favoriteBtn) {
    favoriteBtn.addEventListener("click", function () {
      const icon = this.querySelector("i");
      if (icon.classList.contains("far")) {
        // Add to favorites
        icon.classList.remove("far");
        icon.classList.add("fas");
        showToast("تمت الإضافة إلى المفضلة");
      } else {
        // Remove from favorites
        icon.classList.remove("fas");
        icon.classList.add("far");
        showToast("تمت الإزالة من المفضلة");
      }
    });
  }

  const downloadBtn = document.querySelector(".btn-download");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", function () {
      showToast("جاري تحميل الكتاب...");

      // Simulate download completion after 2 seconds
      setTimeout(() => {
        showToast("تم تحميل الكتاب بنجاح");
      }, 2000);
    });
  }

  const stars = document.querySelectorAll(".stars i");
  if (stars.length) {
    stars.forEach((star, index) => {
      star.addEventListener("click", () => {
        // Update stars UI
        stars.forEach((s, i) => {
          if (i <= index) {
            s.classList.add("fas");
            s.classList.remove("far");
          } else {
            s.classList.add("far");
            s.classList.remove("fas");
          }
        });

        const rating = index + 1;
        showToast(`تم تقييم الكتاب بـ ${rating} نجوم`);
      });

      star.addEventListener("mouseenter", () => {
        stars.forEach((s, i) => {
          if (i <= index) {
            s.classList.add("hovered");
          } else {
            s.classList.remove("hovered");
          }
        });
      });

      star.addEventListener("mouseleave", () => {
        stars.forEach((s) => s.classList.remove("hovered"));
      });
    });
  }

  const bookCards = document.querySelectorAll(".book-card");
  if (bookCards.length) {
    bookCards.forEach((card) => {
      card.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-8px)";
        this.style.boxShadow = "0 15px 30px rgba(0, 0, 0, 0.15)";
      });

      card.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0)";
        this.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)";
      });

      card.addEventListener("click", function () {
        showToast("جاري الانتقال إلى صفحة الكتاب...");
      });
    });
  }

  const searchInput = document.querySelector(".search-input");
  const searchButton = document.querySelector(".search-button");

  if (searchInput && searchButton) {
    searchButton.addEventListener("click", function () {
      performSearch(searchInput.value);
    });

    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        performSearch(this.value);
      }
    });
  }

  function performSearch(query) {
    if (query.trim() === "") {
      showToast("الرجاء إدخال نص للبحث");
      return;
    }

    showToast(`جاري البحث عن: ${query}`);
  }

  function showToast(message) {
    let toastContainer = document.querySelector(".toast-container");

    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.className = "toast-container";
      document.body.appendChild(toastContainer);

      if (!document.getElementById("toast-styles")) {
        const style = document.createElement("style");
        style.id = "toast-styles";
        style.textContent = `
                    .toast-container {
                        position: fixed;
                        bottom: 20px;
                        left: 20px;
                        z-index: 1000;
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                    }
                    
                    .toast {
                        background-color: #64553f;
                        color: white;
                        padding: 12px 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                        opacity: 0;
                        transform: translateY(20px);
                        transition: opacity 0.3s, transform 0.3s;
                        font-family: 'Tajawal', sans-serif;
                    }
                    
                    .toast.show {
                        opacity: 1;
                        transform: translateY(0);
                    }
                `;
        document.head.appendChild(style);
      }
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

  const bookCover = document.querySelector(".cover-container");
  if (bookCover) {
    bookCover.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.02) rotate(1deg)";
      this.style.boxShadow = "0 15px 30px rgba(0, 0, 0, 0.2)";
    });

    bookCover.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1) rotate(0)";
      this.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)";
    });
  }

  const logoImg = document.querySelector(".logo");
  if (logoImg && logoImg.src.includes("book-logo.svg")) {
    const svgData = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#64553f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
        `;

    const encodedSvg = "data:image/svg+xml;base64," + btoa(svgData);
    logoImg.src = encodedSvg;
  }
});
