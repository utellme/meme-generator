const projectList = document.getElementById("project-list");
const launchOutput = document.getElementById("launch-output");
const serverStatus = document.getElementById("server-status");

document.querySelectorAll(".copy-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const target = document.getElementById(btn.dataset.copyTarget);
    if (!target) return;
    await navigator.clipboard.writeText(target.textContent);
    btn.textContent = "Copied!";
    setTimeout(() => {
      btn.textContent = "Copy";
    }, 1500);
  });
});

async function checkServer() {
  try {
    const res = await fetch("/api/health");
    if (!res.ok) throw new Error("offline");
    const data = await res.json();
    serverStatus.textContent = `✓ Server is running on http://localhost:${data.port}`;
    serverStatus.className = "server-status online";
  } catch {
    serverStatus.textContent =
      "Server not detected — run ./scripts/launch-vibecoding-landing.sh in your terminal.";
    serverStatus.className = "server-status offline";
  }
}

async function loadProjects() {
  if (!projectList) return;

  const res = await fetch("/api/projects");
  const { projects } = await res.json();

  projectList.innerHTML = projects
    .map(
      (p) => `
    <div class="project-item">
      <div class="project-info">
        <h4>${escapeHtml(p.name)}</h4>
        <p>${escapeHtml(p.description)}</p>
      </div>
      <button class="btn btn-secondary launch-btn" data-id="${p.id}">Get command</button>
    </div>`
    )
    .join("");

  document.querySelectorAll(".launch-btn").forEach((btn) => {
    btn.addEventListener("click", () => launchProject(btn.dataset.id));
  });
}

async function launchProject(id) {
  const res = await fetch(`/api/launch/${id}`, { method: "POST" });
  const data = await res.json();
  launchOutput.textContent = data.message;
  launchOutput.classList.remove("hidden");

  if (navigator.clipboard) {
    await navigator.clipboard.writeText(`cd ${data.cwd}\n${data.command}`);
    launchOutput.textContent += "\n\n(Copied to clipboard!)";
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

checkServer();
loadProjects();
