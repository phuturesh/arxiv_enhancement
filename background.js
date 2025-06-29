chrome.action.onClicked.addListener((tab) => {
    const _pdfUrlPattern = /arxiv\.org\/pdf\/(\d+\.\d+)/i;
    const pdfMatch = tab.url.match(_pdfUrlPattern);
    const _absUrlPattern = /arxiv\.org\/abs\/(\d+\.\d+)/i;
    const absMatch = tab.url.match(_absUrlPattern);
    const _alphaxivPdfUrlPattern = /alphaxiv\.org\/pdf\/(\d+\.\d+)/i;
    const alphaxivPdfMatch = tab.url.match(_alphaxivPdfUrlPattern);
    const _alphaxivAbsUrlPattern = /alphaxiv\.org\/abs\/(\d+\.\d+)/i;
    const alphaxivAbsMatch = tab.url.match(_alphaxivAbsUrlPattern);
    const _openreviewPdfUrlPattern = /openreview\.net\/pdf\?id=([^&]+)/i;
    const openreviewPdfMatch = tab.url.match(_openreviewPdfUrlPattern);
    const _openreviewForumUrlPattern = /openreview\.net\/forum\?id=([^&]+)/i;
    const openreviewForumMatch = tab.url.match(_openreviewForumUrlPattern);

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
    } else if (openreviewPdfMatch) {
        const openreviewId = openreviewPdfMatch[1];
        newUrl = `https://openreview.net/forum?id=${openreviewId}`;
    } else if (openreviewForumMatch) {
        const openreviewId = openreviewForumMatch[1];
        newUrl = `https://openreview.net/pdf?id=${openreviewId}`;
    } else {
        console.log(tab.url, "is not a valid Arxiv/Alphaxiv/OpenReview page.");
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
