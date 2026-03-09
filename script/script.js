let currentTab = "all";
const tabActive = ["bg-[#4A00FF]", "text-white", "rounded-md", "border-1"];
const tabInactive = ["bg-white", "text-gray-500", "rounded-md", "border-1"];

const allCardContainer = document.getElementById("allCardContainer");
const openCardContainer = document.getElementById("openCardContainer")
const closedCardContainer = document.getElementById("closedCardContainer")
const issueCount = document.getElementById("issueCount");
const issueModal = document.getElementById("openIssueModal");
const loadingSpinner = document.getElementById("loadingSpinner");
const container =document.getElementById("container");

const modalTitle = document.getElementById("modalTitle")
const modalStatus = document.getElementById("modalStatus")
const modalAuthor = document.getElementById("modalAuthor")
const modalCreatedAt = document.getElementById("createdAt")
const modalLabels = document.getElementById("modalLabels")
const modalDescription = document.getElementById("modalDescription")
const modalAssignee = document.getElementById("modalAssignee")
const modalPriority = document.getElementById("modalPriority")


function showLoading(){
    loadingSpinner.classList.remove("hidden")
    
}
function hideLoading(){
    loadingSpinner.classList.add("hidden")

}


// tab switch function
function switchTab(tab) {

    const tabs = ["all", "open", "closed"];
    currentTab = tab;
    
    for (const t of tabs) {
        const tabName = document.getElementById("tabIssue-" + t)
        if (t === tab) {
            tabName.classList.remove(...tabInactive);
            tabName.classList.add(...tabActive);
        } else {
            tabName.classList.remove(...tabActive);
            tabName.classList.add(...tabInactive);
        }
        // console.log(currentTab)

        if (currentTab === "all") {
            allCardContainer.classList.remove("hidden")

        }
        else if (currentTab === "open") {
            allCardContainer.classList.add("hidden")
            closedCardContainer.classList.add("hidden")
            openCardContainer.classList.remove("hidden")

        }
        else {
            closedCardContainer.classList.remove("hidden")
            allCardContainer.classList.add("hidden")
            openCardContainer.classList.add("hidden")
        }

    }

    function updateCount() {
        const allCount = allCardContainer.children.length;
        const openCount = openCardContainer.children.length;
        const closedCount = closedCardContainer.children.length;

        if (currentTab === "all") {
            issueCount.innerText = allCount;
        } else if (currentTab === "open") {
            issueCount.innerText = openCount;
        }
        else {
            issueCount.innerText = closedCount;
        }
    }
    updateCount()
}
switchTab(currentTab) // tab switch function call
async function loadIssues() {
    showLoading(); 
    try {
        const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
        const data = await res.json();
        const issues = data.data;

        displayIssues(issues);
    } catch (e) {
        console.e("Error loading issues:", e);
    } finally {
        hideLoading(); 
    }
}

function createCard(issues) {
    const card = document.createElement("div");
    card.className = "card bg-base-100 mx-auto drop-shadow-md";

    card.innerHTML = `
        <div onclick="openIssueModal(${issues.id})" class=" group card-body rounded-xl border-t-4 ${issues.status === "open"
            ? "border-green-600"
            : "border-purple-600"
        }">

            <div class="flex justify-between">
            ${issues.status === "open"
            ? '<img src="assets/Open-Status.png">'
            : '<img src="assets/Closed-Status.png">'
        }

            <h2 class="px-6 py-1 rounded-3xl text-md font-semibold uppercase
                ${issues.priority === "high"
            ? "bg-red-200 text-[#EF4444]"
            : issues.priority === "medium"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-gray-200 text-gray-600"}
                ">
                ${issues.priority}
            </h2>

            </div>
            <h2 class=" cursor-pointer hover:text-green-800 card-title">${issues.title}</h2>

            <p class ="mb-1 line-clamp-2">${issues.description}</p>
            <div class="card-actions justify-start">
                ${issues.labels.map(label => `<div class="badge ${label === "bug" ? "bg-red-100 text-red-600" : label === "help wanted" ? "bg-yellow-100 text-yellow-600" : "bg-green-100 text-green-600"}">${label}</div>`).join("")}
            </div>
        </div>
            <hr class ="opacity-15 w-full">
            <div class=" rounded-md p-4">
                <p>#${issues.id} ${issues.author}</p>
                <p>${issues.updatedAt}</p>
            </div>
        
    `;
    return card;
}
function displayIssues(issues) {
    showLoading()
    issueCount.innerText = issues.length;
    openCardContainer.innerHTML = "";
    issues.forEach((issues) => {

        const allCard = createCard(issues);
        allCardContainer.appendChild(allCard);

        if (issues.status === "open") {
            const openCard = createCard(issues);

            openCardContainer.appendChild(openCard);
            
        }
        

        if (issues.status === "closed") {
            const closedCard = createCard(issues);
            closedCardContainer.appendChild(closedCard);
        }
    });
hideLoading()
}


async function openIssueModal(id) {
    
    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
    const data = await res.json();
    
    const singleIssue = data.data;
    // console.log(singleIssue)
    issueModal.showModal()


    modalTitle.innerText = singleIssue.title;
    modalStatus.innerText = singleIssue.status;
    modalAuthor.innerText = singleIssue.author;
    modalCreatedAt.innerText = singleIssue.createdAt;
    modalLabels.innerText = singleIssue.labels;
    modalDescription.innerText = singleIssue.description;
    modalPriority.innerText = singleIssue.priority;
    modalAssignee.innerText = singleIssue.assignee;

    modalStatus.className = `rounded-full px-2 py-1 text-white ${singleIssue.status === "open" ? "bg-green-600" : "bg-purple-600"}`;
    modalLabels.innerHTML = singleIssue.labels.map(label => `<span class = "px-2 py-1 rounded-full bg-gray-200">${label}</span>`.join(""));

}

loadIssues()
