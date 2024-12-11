async function getCitationCount(arxivId) {
    try {
        const response = await fetch(`https://api.semanticscholar.org/v1/paper/arXiv:${arxivId}`);
        if (response.ok) {
            const data = await response.json();
            return data.numCitedBy || 0;
        }
    } catch (error) {
        console.error(`Failed to fetch citation count for ${arxivId}:`, error);
    }
    return 0;
}

function addCitationCountToElement(element, count) {
    const citationElement = document.createElement('span');
    citationElement.style.color = 'red';
    citationElement.style.fontWeight = 'bold';
    citationElement.textContent = ` Citations: ${count}`;
    element.insertAdjacentElement('afterend', citationElement);
}

async function annotateSearchResults() {
    const results = Array.from(document.querySelectorAll('.arxiv-result')); // 确保选择器正确
    const citationPromises = results.map(result => {
        const arxivLink = result.querySelector('a[href^="https://arxiv.org/abs/"]');
        if (arxivLink) {
            const arxivId = arxivLink.textContent.trim().split(':')[1];
            return getCitationCount(arxivId);
        }
        return Promise.resolve(0);
    });

    // 并行获取所有引用计数
    const citationCounts = await Promise.all(citationPromises);

    const resultsWithCitations = [];

    // 使用文档片段批量添加引用计数
    const fragment = document.createDocumentFragment();

    results.forEach((result, index) => {
        const arxivLink = result.querySelector('a[href^="https://arxiv.org/abs/"]');
        if (arxivLink) {
            const citationCount = citationCounts[index];
            addCitationCountToElement(arxivLink, citationCount);

            const arxivTitle = result.querySelector('.title');
            if (arxivTitle) {
                const linkedTitle = document.createElement('a');
                linkedTitle.href = arxivLink.href;
                linkedTitle.className = arxivTitle.className;
                while (arxivTitle.firstChild) {
                    linkedTitle.appendChild(arxivTitle.firstChild);
                }
                arxivTitle.parentNode.replaceChild(linkedTitle, arxivTitle);
            }

            resultsWithCitations.push({
                element: result,
                citationCount: citationCount
            });
        }
    });
    // Add citation count sorting option
    const orderSelect = document.querySelector('select[name="order"]');
    const citationOption = document.createElement('option');
    citationOption.value = '-citations';
    citationOption.textContent = 'Citations (highest first)';
    orderSelect.appendChild(citationOption);

    const reverseCitationOption = document.createElement('option');
    reverseCitationOption.value = 'citations';
    reverseCitationOption.textContent = 'Citations (lowest first)';
    orderSelect.appendChild(reverseCitationOption);

    // Handle sorting when order changes
    if (orderSelect) {
        orderSelect.addEventListener('change', () => {
            const parent = results[0]?.parentNode;
            if (!parent) return;

            let sortedResults;
            switch(orderSelect.value) {
                case '-citations':
                    sortedResults = resultsWithCitations.sort((a, b) => b.citationCount - a.citationCount);
                    break;
                case 'citations':
                    sortedResults = resultsWithCitations.sort((a, b) => a.citationCount - b.citationCount);
                    break;
                default:
                    return;
            }

            const sortedFragment = document.createDocumentFragment();
            sortedResults.forEach(item => sortedFragment.appendChild(item.element));
            parent.appendChild(sortedFragment);
        });
    }
}

window.addEventListener('load', annotateSearchResults);
