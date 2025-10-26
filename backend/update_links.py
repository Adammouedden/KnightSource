from scraper_agent import Scraper

import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

def crawl_links(url):
    # Send a GET request to the source URL
    response = requests.get(source_url)

    # Create a BeautifulSoup object to parse the HTML
    soup = BeautifulSoup(response.content, 'html.parser')

    # Find all anchor tags (which contain links)
    links = soup.find_all('a', href=True)

    # Extract and store the full URLs
    website_urls = []
    for link in links:
        href = link.get('href')
        # Use urljoin to construct an absolute URL if the href is relative
        full_url = urljoin(source_url, href)
        website_urls.append(full_url)

    # Print the collected URLs
    return website_urls


if __name__ == '__main__':
    # Array of URLs on our website, KnightSource
    knight_source_urls_dict = {
"Conference Registration and Travel at UCF":["https://studentgovernment.ucf.edu/wp-content/uploads/sites/4/2024/10/CRT-Spending-Policy-24-25-Title-VIII-Appendix-A.pdf",
                                             "https://knightconnect.campuslabs.com/engage/submitter/form/start/636439",
                                             "https://knightconnect.campuslabs.com/engage/submitter/form/start/636440",
                                             "https://webcourses.ucf.edu/enroll/4FCC68"],
 "A2O Scholarships at UCF":["https://ucf.academicworks.com"],
 "Dental care at UCF":["https://studenthealth.ucf.edu/services/dental/"],
 "Legal DUI at UCF":["http://sls.sdes.ucf.edu/"],
 "Lawyer":["https://sls.sswb.ucf.edu/info/"],
 "Outdoor Adventure Challenge Course at UCF":["https://ucfrwc.org/booking/54e23deb-011a-4743-94df-b986b042dab1",
                                              "https://rwc.sswb.ucf.edu/programs/outdoor-adventure/challenge-course/"],
 "Reservations at Recreation and Wellness Center":["http://ucf.qualtrics.com/jfe/form/SV_5uq5qcKL9OIWd49"],
 "Sign up for intramural sports at UCF":["https://imleagues.com/spa/intramural/136f2fd71bae48bc8ee2f37e418505d9/home"],
 "Reserve Outdoor Equipment at the Outdoor Adventure":["https://ucf.qualtrics.com/jfe/form/SV_ewAQOlYlr2Xg1A9",
                                                       "https://rwc.sswb.ucf.edu/wp-content/uploads/sites/32/2020/02/OAC-Equipment-Rental-Fees-revised-06.2019.pdf",
                                                       "https://rwc.sswb.ucf.edu/facilities/outdoor-adventure-center/"],
 "Ticket Center at UCF":["https://ticketcenter.sdes.ucf.edu/"]}
    
    #TODO: Crawl knight source domain to programmatically find them all.
    #crawl_links("knightsource.com")

    for category, link in knight_source_urls_dict:
        potential_urls = crawl_links(link)