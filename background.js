chrome.action.onClicked.addListener((tab) => {
    const _pdfUrlPattern = /arxiv\.org\/pdf\/(\d+\.\d+)/i;
    const pdfMatch = tab.url.match(_pdfUrlPattern);
    const _absUrlPattern = /arxiv\.org\/abs\/(\d+\.\d+)/i;
    const absMatch = tab.url.match(_absUrlPattern);
    const _alphaxivPdfUrlPattern = /alphaxiv\.org\/pdf\/(\d+\.\d+)/i;
    const alphaxivPdfMatch = tab.url.match(_alphaxivPdfUrlPattern);
    const _alphaxivAbsUrlPattern = /alphaxiv\.org\/abs\/(\d+\.\d+)/i;
    const alphaxivAbsMatch = tab.url.match(_alphaxivAbsUrlPattern);

    let newUrl;

    if (pdfMatch) {
        const arxivId = pdfMatch[1];
        newUrl = `https://arxiv.org/abs/${arxivId}`;
    } else if (absMatch) {
        const arxivId = absMatch[1];
        newUrl = `https://arxiv.org/pdf/${arxivId}`;
    } else if (alphaxivPdfMatch) {
        const alphaxivId = alphaxivPdfMatch[1];
        newUrl = `https://alphaxiv.org/abs/${alphaxivId}`;
    } else if (alphaxivAbsMatch) {
        const alphaxivId = alphaxivAbsMatch[1];
        newUrl = `https://alphaxiv.org/pdf/${alphaxivId}`;
    } else {
        console.log(tab.url, "is not a valid Arxiv/Alphaxiv page.");
        return;
    }

    chrome.tabs.update(tab.id, { url: newUrl });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'fetchSemanticScholar') {
        fetch(message.url)
            .then(res => res.json())
            .then(data => sendResponse({ success: true, data }))
            .catch(err => sendResponse({ success: false, error: err.message }));
        return true; // 保持响应通道
    }
});
