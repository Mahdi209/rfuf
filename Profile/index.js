// Initialize profile data
let isFollowing = false;
const user = {
  name: "عبدالله محمد",
  followers: 0,
  favBooks: [],
  downloadedBooks: [],
};

function loadProfileData() {
  const savedUser = localStorage.getItem("userProfile");
  const favorites = localStorage.getItem("favorites");
  const downloads = localStorage.getItem("downloads");

  if (savedUser) {
    Object.assign(user, JSON.parse(savedUser));
  }

  if (favorites) {
    user.favBooks = JSON.parse(favorites);
  }

  if (downloads) {
    user.downloadedBooks = JSON.parse(downloads);
  }

  updateUI();
  updateStats();
}

function updateUI() {
  document.getElementById("userName").textContent = user.name;
  updateBooksList("favBooks", user.favBooks);
  updateBooksList("downloadedBooks", user.downloadedBooks);
}

function updateBooksList(elementId, books) {
  const container = document.getElementById(elementId);
  container.innerHTML = books
    .map(
      (book) => `
    <div class="book-item">
      <h4>${book.title}</h4>
      <p><i class="fas fa-user-edit"></i> ${book.author}</p>
    </div>
  `
    )
    .join("");
}

function updateStats() {
  document.getElementById("followersCount").textContent = user.followers;
  document.getElementById("booksCount").textContent =
    user.favBooks.length + user.downloadedBooks.length;
}

document.getElementById("followBtn").addEventListener("click", () => {
  isFollowing = !isFollowing;
  const followBtn = document.getElementById("followBtn");

  if (isFollowing) {
    user.followers++;
    followBtn.innerHTML = '<i class="fas fa-user-minus"></i> Unfollow';
    followBtn.style.backgroundColor = "#dc3545";
  } else {
    user.followers--;
    followBtn.innerHTML = '<i class="fas fa-user-plus"></i> Follow';
    followBtn.style.backgroundColor = "#007bff";
  }

  updateStats();
  saveProfile();
});

function saveProfile() {
  localStorage.setItem("userProfile", JSON.stringify(user));
  localStorage.setItem("favorites", JSON.stringify(user.favBooks));
  localStorage.setItem("downloads", JSON.stringify(user.downloadedBooks));
}

function addToFavorites(book) {
  user.favBooks.push(book);
  saveProfile();
  updateUI();
  updateStats();
}

function addToDownloads(book) {
  user.downloadedBooks.push(book);
  saveProfile();
  updateUI();
  updateStats();
}

loadProfileData();

document
  .getElementById("profileImage")
  .addEventListener("mouseover", function () {
    this.style.cursor = "pointer";
  });
