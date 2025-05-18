////////////////////
// enhanceAbsPage //
////////////////////

// main
async function enhanceAbsPage() {
    const arxivIdMatch = window.location.pathname.match(/^\/abs\/([\d\.]+)$/);
    if (!arxivIdMatch) return;
    const arxivId = arxivIdMatch[1];
    const aclUrl = await getAclLinkFromSemanticScholar(arxivId);
    if (!aclUrl) return;

    const container = document.querySelector(".extra-services .full-text")
    console.log('[arXiv-enhancement] container:', container);
    const aclButton = document.createElement("a");
    aclButton.href = aclUrl;
    aclButton.textContent = "🔗 View on ACL Anthology";
    aclButton.style.cssText = `
        display: inline-block;
        margin-top: 8px;
        padding: 6px 12px;
        color: #ed1c24;
        border-radius: 6px;
        font-size: 14px;
        text-decoration: none;
    `;
    aclButton.target = "_blank";

    if (container) container.appendChild(aclButton);
}

// utils
function getTitleFromHead() {
    const rawTitle = document.title;
    const match = rawTitle.match(/^(.+)\| Abstract$/);
    return match ? match[1].trim() : null;
}


function getTitleFromMeta() {
    const metaTitle = document.querySelector('meta[property="og:title"]');
    if (metaTitle) {
        return metaTitle.getAttribute("content");
    }
    return null;
}


async function fetchDataFromSemanticScholar(url) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
            { action: 'fetchSemanticScholar', url },
            (response) => {
                if (response?.success) {
                    resolve(response.data);
                } else {
                    reject(response?.error || 'Unknown error');
                }
            }
        );
    });
}


async function getAclLinkFromSemanticScholar(arxivId) {
    const url = `https://api.semanticscholar.org/graph/v1/paper/arXiv:${arxivId}?fields=externalIds,url,venue,publicationVenue,title`;

    try {
        const data = await fetchDataFromSemanticScholar(url);
        console.log("[arXiv-enhancement] url:", url);
        console.log("[arXiv-enhancement] data:", data);

        // 1. 尝试从 externalIds 查找 ACL Anthology DOI
        if (data.externalIds?.ACL) {
            const aclID = data.externalIds.ACL;
            return `https://aclanthology.org/${aclID}`;
        }

        // 2.  转向 Semantic Scholar 页面
        if (data.url?.includes("aclanthology.org")) {
            return data.url;
        }

        // 3. 尝试从 title 再构造搜索链接 (兜底策略)
        const title = data.title;
        const aclQuery = title.trim();
        return `https://aclanthology.org/search/?q=${encodeURIComponent(aclQuery)}`;

    } catch (err) {
        console.error("Semantic Scholar lookup failed:", err);
        return null;
    }
}


window.addEventListener("load", enhanceAbsPage);
