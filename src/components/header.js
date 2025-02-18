function createHeader() {
  const header = document.createElement('header');
  header.className = 'main-header';
  
  header.innerHTML = `
    <nav class="nav-container">
      <a href="/" class="logo">Your Logo</a>
      <ul class="nav-menu">
        <li><a href="/">首页</a></li>
        <li><a href="/about.html">关于我们</a></li>
        <li><a href="/products.html">产品</a></li>
        <li><a href="/contact.html">联系我们</a></li>
      </ul>
    </nav>
  `;
  
  document.body.insertBefore(header, document.body.firstChild);
}

// 当页面加载完成时创建header
document.addEventListener('DOMContentLoaded', createHeader);
