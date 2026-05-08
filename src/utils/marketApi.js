export const fetchLivePrice = async (symbol, exchange) => {
  try {
    if (!symbol) return null;

    // Yahoo Suffixes: NSE -> .NS, BSE -> .BO
    const suffix = exchange === "BSE" ? ".BO" : ".NS";
    const ticker = `${symbol.toUpperCase()}${suffix}`;

    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`;

    const response = await fetch(proxyUrl + targetUrl);
    const data = await response.json();

    return data.chart.result[0].meta.regularMarketPrice;
  } catch (error) {
    console.error(`Price fetch failed for ${symbol}:`, error);
    return null;
  }
};
