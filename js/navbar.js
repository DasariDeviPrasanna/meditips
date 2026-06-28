const currentPage =
window.location.pathname.split("/").pop();

document.body.insertAdjacentHTML(
"beforeend",

`
<nav class="bottom-nav">

<a href="dashboard.html"
class="nav-item ${currentPage==="dashboard.html"?"active":""}">

🏠

<span>Home</span>

</a>

<a href="scan.html"
class="nav-item ${currentPage==="scan.html"?"active":""}">

📷

<span>Scan</span>

</a>

<a href="assistant.html"
class="nav-item ${currentPage==="assistant.html"?"active":""}">

🤖

<span>AI</span>

</a>

<a href="history.html"
class="nav-item ${currentPage==="history.html"?"active":""}">

📜

<span>History</span>

</a>

<a href="profile.html"
class="nav-item ${currentPage==="profile.html"?"active":""}">

👤

<span>Profile</span>

</a>

</nav>
`
);
