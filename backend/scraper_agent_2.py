# scraper_agent.py
# Minimal Google Custom Search wrapper + simple CSV writer.
# Depends on: requests
# Env vars:
#CUSTOM_SEARCH_API=os.getenv("CUSTOM_SEARCH_API")
#CSE_ID=os.getenv("CSE_ID")

import os
import csv
import time
import requests
from typing import List, Optional


DEFAULT_UA = "KnightSource-LinkChecker/1.0 (+https://knightsource.example)"

class Scraper:
    def __init__(self, api_key: Optional[str] = None, cse_id: Optional[str] = None, user_agent: str = DEFAULT_UA):
        # Google API and custom search engine setup
        self.API_KEY = api_key or os.getenv("CUSTOM_SEARCH_API")
        self.CUSTOM_SEARCH_ENGINE_ID = cse_id or os.getenv("CSE_ID")
        if not self.API_KEY or not self.CUSTOM_SEARCH_ENGINE_ID:
            raise RuntimeError("Missing CUSTOM_SEARCH_API and/or CSE_ID environment variables.")

        # Google Custom Search API endpoint
        self.BASE_URL = "https://www.googleapis.com/customsearch/v1"
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": user_agent})

    def fetch_urls(self, query: str, start_index: int = 1, num: int = 10) -> List[str]:
        """
        Fetch up to `num` URLs (max 10 per call) from Google CSE for a given query.
        `start_index` must be 1..91 (Google CSE returns at most 100 results).
        """
        start_index = max(1, min(start_index, 91))
        num = max(1, min(num, 10))

        params = {
            "key": self.API_KEY,
            "cx": self.CUSTOM_SEARCH_ENGINE_ID,
            "q": query,
            "start": start_index,
            "num": num,
        }

        try:
            resp = self.session.get(self.BASE_URL, params=params, timeout=20)
            resp.raise_for_status()
            data = resp.json()
        except Exception as e:
            # Fail open with empty list; caller can decide how to proceed
            print(f"[WARN] Google CSE fetch failed for '{query}' @ start={start_index}: {e}")
            return []

        urls: List[str] = []
        for item in data.get("items", []):
            link = item.get("link")
            if link:
                urls.append(link)

        # Courtesy sleep to avoid hammering the API
        time.sleep(0.3)
        return urls

    @staticmethod
    def convert_to_csv(urls: List[str], filename: str = "urls.csv") -> None:
        """
        Write a one-column CSV with the provided URLs.
        """
        with open(filename, mode="w", newline="", encoding="utf-8") as f:
            w = csv.writer(f)
            w.writerow(["URL"])
            for u in urls:
                w.writerow([u])


if __name__ == "__main__":
    # Example usage (kept from your original, but with safer bounds/guards)
    a = Scraper()
    result_urls: List[str] = []
    query = "Software Engineering Internships near Orlando, FL"
    total_results = 50  # Keep modest; CSE hard-caps at ~100
    pages = total_results // 10

    for page_num in range(pages):
        start_index = page_num * 10 + 1  # 1-based index
        print(f"Fetching page {page_num + 1} (start={start_index})...")
        result_urls.extend(a.fetch_urls(query, start_index=start_index, num=10))

    a.convert_to_csv(result_urls, filename="internship_urls.csv")
    print(f"Scraping complete! {len(result_urls)} URLs saved to internship_urls.csv.")
