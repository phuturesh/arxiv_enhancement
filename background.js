chrome.action.onClicked.addListener((tab) => {
    const pdfUrlPattern = /arxiv\.org\/pdf\/(\d+\.\d+)/i;
    const pdfMatch = tab.url.match(pdfUrlPattern);
    const absUrlPattern = /arxiv\.org\/abs\/(\d+\.\d+)/i;
    const absMatch = tab.url.match(absUrlPattern);
    const alphaxivPdfUrlPattern = /alphaxiv\.org\/pdf\/(\d+\.\d+)/i;
    const alphaxivPdfMatch = tab.url.match(alphaxivPdfUrlPattern);
    const alphaxivAbsUrlPattern = /alphaxiv\.org\/abs\/(\d+\.\d+)/i;
    const alphaxivAbsMatch = tab.url.match(alphaxivAbsUrlPattern);

    if (pdfMatch) {
        const arxivId = pdfMatch[1];
        const absUrl = `https://arxiv.org/abs/${arxivId}`;
        chrome.tabs.update(tab.id, { url: absUrl });
    } else if (absMatch) {
        const arxivId = absMatch[1];
        const pdfUrl = `https://arxiv.org/pdf/${arxivId}`;
        chrome.tabs.update(tab.id, { url: pdfUrl });
    } else if (alphaxivPdfMatch) {
        const alphaxivId = alphaxivPdfMatch[1];
        const absUrl = `https://alphaxiv.org/abs/${alphaxivId}`;
        chrome.tabs.update(tab.id, { url: absUrl });
    } else if (alphaxivAbsMatch) {
        const alphaxivId = alphaxivAbsMatch[1];
        const pdfUrl = `https://alphaxiv.org/pdf/${alphaxivId}`;
        chrome.tabs.update(tab.id, { url: pdfUrl });
    } else {
        console.log(tab.url, "is not an valid Arxiv/Alphaxiv page.");
    };
});