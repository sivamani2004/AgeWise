let allArticles = [];
let showingCount = 4;

function renderArticles(articles) {
  const container = document.getElementById('news-container');
  container.innerHTML = ''; // Clear first

  articles.forEach(article => {
    const div = document.createElement('div');
    div.className = "bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition";
    div.innerHTML = `
      <h2 class="text-lg font-bold mb-2">${article.title}</h2>
      <a href="${article.url}" target="_blank" class="text-blue-600 hover:underline font-medium">Read more</a>
      <p class="text-gray-500 text-xs mt-2">${new Date(article.publishedAt).toLocaleString()}</p>
      ${article.image ? `<img src="${article.image}" alt="${article.title}" class="w-full h-48 object-cover rounded-lg mt-2">` : ''}
    `;
    container.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/news")
    .then(res => res.json())
    .then(data => {
      if (!data.articles || data.articles.length === 0) {
        document.getElementById('news-container').innerHTML = '<p>No news available right now.</p>';
        return;
      }

      allArticles = data.articles;
      renderArticles(allArticles.slice(0, showingCount));

      const moreBtn = document.getElementById('more-news-btn');
      moreBtn.addEventListener("click", () => {
        showingCount = Math.min(allArticles.length, showingCount + 4);
        renderArticles(allArticles.slice(0, showingCount));

        if (showingCount >= allArticles.length) {
          moreBtn.style.display = 'none';
        }
      });
    })
    .catch(err => {
      console.error('News fetch error:', err);
      document.getElementById('news-container').innerHTML = '<p>Failed to load news.</p>';
    });
});
