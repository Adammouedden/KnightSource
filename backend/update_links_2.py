# update_links.py
# Validates existing KnightSource links, detects likely outdated fiscal-year docs,
# and (optionally) finds suggested replacements via Google CSE.
#
# Dependencies: requests, beautifulsoup4
# Optional: You can later add pypdf/pdfminer for deeper PDF parsing if needed.

import csv
import re
import time
import datetime as dt
from typing import Dict, List, Tuple, Optional

import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

from scraper_agent import Scraper

DEFAULT_UA = "KnightSource-LinkChecker/1.0 (+https://knightsource.example)"


def infer_current_fiscal_cycle(today: Optional[dt.date] = None) -> Tuple[int, int]:
    """
    UCF fiscal year runs July 1 -> June 30.
    Given a date, return (start_year, end_year) for the current fiscal cycle.
    """
    today = today or dt.date.today()
    if today.month >= 7:  # July..Dec
        start = today.year
    else:
        start = today.year - 1
    return start, start + 1


# Regexes to detect years in URLs or page text
YEAR_RANGE_PATTERNS = [
    re.compile(r"\b(20\d{2})\s*[-–/]\s*(20\d{2})\b"),     # 2024-2025, 2024/2025
    re.compile(r"\bFY\s*'?(\d{2})\b", re.IGNORECASE),     # FY25
    re.compile(r"\b(20\d{2})\b"),                         # single year like 2025
    re.compile(r"\b(\d{2})\s*[-–/]\s*(\d{2})\b"),         # 24-25
]


def normalize_year_range(found: List[str]) -> Optional[Tuple[int, int]]:
    """
    Given regex groups like ['2024','2025'] or ['24','25'] or FY codes,
    normalize to (start_year, end_year). Return None if ambiguous.
    """
    if len(found) == 2:
        a, b = found
        try:
            a_i = int(a)
            b_i = int(b)
            # Convert 2-digit to 4-digit assuming 20xx
            if a_i < 100:
                a_i += 2000
            if b_i < 100:
                b_i += 2000
            if b_i == a_i + 1 or b_i >= a_i:  # be lenient
                return (a_i, b_i)
        except ValueError:
            return None
    elif len(found) == 1:
        # Single year → return (year, year+1) as a best-effort fiscal guess
        try:
            y = int(found[0])
            if y < 100:
                y += 2000
            return (y, y + 1)
        except ValueError:
            return None
    return None


def extract_years_from_text(text: str) -> Optional[Tuple[int, int]]:
    """
    Try multiple patterns to find a fiscal year range in the given text.
    """
    text = text or ""
    for pat in YEAR_RANGE_PATTERNS:
        m = pat.search(text)
        if not m:
            continue
        # Use captured groups (filter Nones)
        found = [g for g in m.groups() if g]
        rng = normalize_year_range(found)
        if rng:
            return rng
    return None


def head_then_get(url: str, session: Optional[requests.Session] = None, timeout: int = 20):
    """
    Perform a HEAD first to check status/content-type/last-modified.
    Fallback to GET if HEAD not allowed or inconclusive.
    """
    s = session or requests.Session()
    try:
        r = s.head(url, allow_redirects=True, timeout=timeout)
        if r.status_code >= 400 or not r.headers.get("Content-Type"):
            # Some servers don’t support HEAD properly → GET
            r = s.get(url, allow_redirects=True, timeout=timeout)
    except Exception:
        r = s.get(url, allow_redirects=True, timeout=timeout)
    return r


def looks_like_auth_wall(html: str) -> bool:
    """
    Very coarse auth-wall detector for campus SSO, Qualtrics, etc.
    """
    if not html:
        return False
    markers = [
        "Sign in", "Log in", "Single Sign-On", "SSO",
        "Access Denied", "You do not have permission",
        "Please authenticate", "Shibboleth",
    ]
    hlow = html.lower()
    return any(m.lower() in hlow for m in markers)


def parse_html_title_and_h1(html: str) -> str:
    soup = BeautifulSoup(html, "html.parser")
    title = (soup.title.text.strip() if soup.title else "") or ""
    h1 = ""
    h1_tag = soup.find("h1")
    if h1_tag and h1_tag.get_text(strip=True):
        h1 = h1_tag.get_text(strip=True)
    # Join unique snippets
    parts = [p for p in [title, h1] if p]
    return " | ".join(dict.fromkeys(parts))


def crawl_links(url: str) -> List[str]:
    """
    Crawl a single page and return absolute hrefs found (best-effort).
    """
    session = requests.Session()
    session.headers.update({"User-Agent": DEFAULT_UA})
    try:
        response = session.get(url, timeout=25)
        response.raise_for_status()
    except Exception as e:
        print(f"[WARN] crawl_links() failed for {url}: {e}")
        return []

    soup = BeautifulSoup(response.content, "html.parser")
    urls = []
    for a in soup.find_all("a", href=True):
        urls.append(urljoin(url, a["href"]))
    return urls


def score_candidate(url: str, expected_phrases: List[str], expected_ext: Optional[str] = None) -> int:
    """
    Simple deterministic scoring:
      +20 if domain is studentgovernment.ucf.edu (primary CRT source),
      +10 per expected phrase present in URL,
      +10 if expected file extension matches,
      +5 if URL path contains a year-like pattern (heuristic for specificity).
    """
    score = 0
    netloc = urlparse(url).netloc.lower()
    if "studentgovernment.ucf.edu" in netloc:
        score += 20
    if expected_ext:
        path = urlparse(url).path.lower()
        if path.endswith("." + expected_ext.lower().lstrip(".")):
            score += 10
    for phrase in expected_phrases:
        if phrase.lower() in url.lower():
            score += 10
    if re.search(r"20\d{2}", url):
        score += 5
    return score


def find_replacement_via_search(scraper: Scraper,
                                category_name: str,
                                site_filters: List[str],
                                expected_phrases: List[str],
                                expected_ext: Optional[str] = "pdf",
                                pages: int = 3) -> Optional[str]:
    """
    Use Google CSE to find a likely replacement on allowed sites. We build
    a query like: site:example.edu "CRT" "Spending Policy" filetype:pdf
    Evaluate top results with a simple URL-based score.
    """
    phrases = [category_name] + expected_phrases
    quoted = " ".join(f"\"{p}\"" for p in phrases if p)
    filetype_q = f" filetype:{expected_ext}" if expected_ext else ""
    sites_q = " OR ".join(f"site:{s}" for s in site_filters) if site_filters else ""

    # Conservative: split site filters into separate queries to avoid query length limits
    candidates: List[str] = []
    for site in site_filters or [""]:
        q = f'{quoted}{filetype_q} site:{site}'.strip()
        for p in range(pages):
            start = p * 10 + 1
            urls = scraper.fetch_urls(q, start_index=start, num=10)
            candidates.extend(urls)
            # courtesy sleep happens inside Scraper

    if not candidates:
        return None

    # Rank candidates deterministically by URL-based score
    ranked = sorted(
        set(candidates),
        key=lambda u: score_candidate(u, expected_phrases, expected_ext),
        reverse=True
    )
    return ranked[0] if ranked else None


def check_link(url: str, session: Optional[requests.Session] = None) -> Dict[str, str]:
    """
    Check availability, final URL, content type, guessed year range, and basic HTML details.
    Returns a dict suitable for CSV/JSON reporting.
    """
    s = session or requests.Session()
    s.headers.update({"User-Agent": DEFAULT_UA})

    out = {
        "original_url": url,
        "final_url": "",
        "status_code": "",
        "content_type": "",
        "last_modified": "",
        "is_alive": "no",
        "auth_wall": "no",
        "detected_year": "",
        "html_title": "",
    }

    try:
        r = head_then_get(url, session=s, timeout=25)
        out["final_url"] = r.url
        out["status_code"] = str(r.status_code)
        ctype = r.headers.get("Content-Type", "")
        out["content_type"] = ctype
        out["last_modified"] = r.headers.get("Last-Modified", "")

        if 200 <= r.status_code < 400:
            out["is_alive"] = "yes"

            # Try to detect year from URL or content
            text_source = r.url
            detected = extract_years_from_text(text_source)

            if not detected:
                if "pdf" in ctype.lower():
                    # Without PDF parsing dependency, fallback to filename/URL only
                    pass
                else:
                    # HTML: attempt title/H1 and a small body slice
                    html = r.text[:10000] if hasattr(r, "text") else ""
                    out["auth_wall"] = "yes" if looks_like_auth_wall(html) else "no"
                    title = parse_html_title_and_h1(html)
                    out["html_title"] = title
                    # Expand the text for year detection
                    detected = extract_years_from_text(title) or extract_years_from_text(html)

            if detected:
                out["detected_year"] = f"{detected[0]}-{detected[1]}"

        else:
            out["is_alive"] = "no"

    except Exception as e:
        out["status_code"] = f"error: {e}"

    return out


def freshness_label(detected_year: Optional[str], expected_cycle: Tuple[int, int]) -> str:
    """
    Compare detected year (e.g., '2024-2025') to expected (YYYY, YYYY+1).
    Returns one of: 'current', 'outdated', 'unknown'
    """
    if not detected_year:
        return "unknown"
    m = re.match(r"^\s*(20\d{2})\s*[-–/]\s*(20\d{2})\s*$", detected_year)
    if not m:
        return "unknown"
    dy = (int(m.group(1)), int(m.group(2)))
    return "current" if dy == expected_cycle else "outdated"


def main():
    # KnightSource registry (category -> list of URLs we currently publish)
    knight_source_urls_dict: Dict[str, List[str]] = {
        "Conference Registration and Travel at UCF": [
            "https://studentgovernment.ucf.edu/wp-content/uploads/sites/4/2024/10/CRT-Spending-Policy-24-25-Title-VIII-Appendix-A.pdf",
            "https://knightconnect.campuslabs.com/engage/submitter/form/start/636439",
            "https://knightconnect.campuslabs.com/engage/submitter/form/start/636440",
            "https://webcourses.ucf.edu/enroll/4FCC68",
        ],
        "A2O Scholarships at UCF": ["https://ucf.academicworks.com"],
        "Dental care at UCF": ["https://studenthealth.ucf.edu/services/dental/"],
        "Legal DUI at UCF": ["http://sls.sdes.ucf.edu/"],
        "Lawyer": ["https://sls.sswb.ucf.edu/info/"],
        "Outdoor Adventure Challenge Course at UCF": [
            "https://ucfrwc.org/booking/54e23deb-011a-4743-94df-b986b042dab1",
            "https://rwc.sswb.ucf.edu/programs/outdoor-adventure/challenge-course/",
        ],
        "Reservations at Recreation and Wellness Center": [
            "http://ucf.qualtrics.com/jfe/form/SV_5uq5qcKL9OIWd49"
        ],
        "Sign up for intramural sports at UCF": [
            "https://imleagues.com/spa/intramural/136f2fd71bae48bc8ee2f37e418505d9/home"
        ],
        "Reserve Outdoor Equipment at the Outdoor Adventure": [
            "https://ucf.qualtrics.com/jfe/form/SV_ewAQOlYlr2Xg1A9",
            "https://rwc.sswb.ucf.edu/wp-content/uploads/sites/32/2020/02/OAC-Equipment-Rental-Fees-revised-06.2019.pdf",
            "https://rwc.sswb.ucf.edu/facilities/outdoor-adventure-center/",
        ],
        "Ticket Center at UCF": ["https://ticketcenter.sdes.ucf.edu/"],
    }

    # Hints for canonical discovery by category (expand per category as needed)
    search_hints = {
        "Conference Registration and Travel at UCF": {
            "site_filters": ["studentgovernment.ucf.edu"],
            "expected_phrases": ["CRT", "Spending Policy", "Appendix A"],
            "expected_ext": "pdf",
        },
        # Add more hints for other categories if you want replacements there too
    }

    # Prepare HTTP session
    session = requests.Session()
    session.headers.update({"User-Agent": DEFAULT_UA})

    # Prepare Google CSE
    scraper = None
    try:
        scraper = Scraper()
    except Exception as e:
        print(f"[WARN] Google CSE disabled: {e}")

    # Report CSV
    report_rows: List[Dict[str, str]] = []
    expected_cycle = infer_current_fiscal_cycle()

    for category, links in knight_source_urls_dict.items():  # FIX: .items()
        print(f"\n=== Checking category: {category} ===")
        for link in links:
            meta = check_link(link, session=session)
            meta["category"] = category

            # Freshness
            label = freshness_label(meta.get("detected_year", ""), expected_cycle)
            meta["expected_year"] = f"{expected_cycle[0]}-{expected_cycle[1]}"
            meta["freshness"] = label

            # If outdated or broken, try to find a replacement (only when we have hints)
            suggestion_url = ""
            suggestion_reason = ""
            if (label in ("outdated", "unknown") or meta.get("is_alive") != "yes") and category in search_hints and scraper:
                hints = search_hints[category]
                candidate = find_replacement_via_search(
                    scraper=scraper,
                    category_name=category,
                    site_filters=hints.get("site_filters", []),
                    expected_phrases=hints.get("expected_phrases", []),
                    expected_ext=hints.get("expected_ext", None),
                    pages=3,
                )
                if candidate:
                    suggestion_url = candidate
                    suggestion_reason = "Found higher-scoring candidate via site-scoped search"

            meta["suggested_replacement"] = suggestion_url
            meta["suggestion_reason"] = suggestion_reason

            report_rows.append(meta)

            # Small courtesy delay between link checks
            time.sleep(0.2)

    # Write the report
    fieldnames = [
        "category",
        "original_url",
        "final_url",
        "status_code",
        "is_alive",
        "auth_wall",
        "content_type",
        "last_modified",
        "html_title",
        "detected_year",
        "expected_year",
        "freshness",
        "suggested_replacement",
        "suggestion_reason",
    ]
    with open("link_check_report.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        for row in report_rows:
            w.writerow({k: row.get(k, "") for k in fieldnames})

    print("\nReport written to link_check_report.csv")
    print("Tip: Prefer updating KnightSource to canonical landing pages when available.")


if __name__ == "__main__":
    main()
