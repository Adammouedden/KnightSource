import requests
import re
import csv
import os

class Scraper():
    def __init__(self):
        #Google API and custom search engine setup
        self.API_KEY = os.getenv("CUSTOM_SEARCH_API")
        self.CUSTOM_SEARCH_ENGINE_ID = os.getenv("CSE_ID")

        #Google Custom Search API endpoint
        self.BASE_URL = "https://www.googleapis.com/customsearch/v1"

    def fetch_urls(self, query, start_index = 1):
        params = {
            'key': self.API_KEY,
            'cx': self.CUSTOM_SEARCH_ENGINE_ID,
            'q': query,
            'start': start_index,
        }

        response = requests.get(self.BASE_URL, params=params)
        data = response.json()


        # Now to extract the URLs from the responses
        job_urls = []

        if 'items' in data:
            for item in data['items']:
                job_urls.append(item['link'])

        return job_urls


    #Now for a function to save the URLs into a csv file

    def convert_to_csv(urls, filename='internship_urls.csv'):
        with open(filename, mode='w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(['Internship URL']) #Column header
            for url in urls:
                writer.writerow([url])


if __name__== "__main__":
    a = Scraper()
    result_job_urls = []
    query = "Software Engineering Internships near Orlando, FL"
    total_results = 100
    pages = total_results // 10

    for page_num in range (pages):
        print(f"Fetching page {page_num + 1}...")
        start_index = page_num * 10 + 1 #Google custom search uses 1-based index
        job_urls = a.fetch_urls(query, start_index)
        result_job_urls.extend(job_urls)

    a.convert_to_csv(result_job_urls)
    print(f"Scraping complete! {len(result_job_urls)} URLs saved to internship_urls.csv.")
