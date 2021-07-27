from selenium import webdriver
import pandas as pd
from webdriver_manager.chrome import ChromeDriverManager

# this is the actual website being used:::
url = "https://pressagent.envisionconnect.com/main.phtml?agency=sbc"

# woodstocks (with an s) wont work
name = "habit"

options = webdriver.ChromeOptions()
# options.add_argument('headless') # uncommented for testing
browser = webdriver.Chrome(
    ChromeDriverManager().install(),
    options=options
)
browser.get(url)


# pass in the restaurant name:
inputBox = browser.find_element_by_id("businessname")
inputBox.send_keys(name)
inputBox.submit()
link = browser.find_elements_by_xpath("//a[@href]")[0].get_attribute("href")
browser.get(link)

rows = browser.find_elements_by_xpath(
    "//table//tbody//tr"
)[2].find_elements_by_xpath("//td//table//tbody//tr")


for top_row, hidden_row in zip(rows[5::2], rows[6::2]):
    top_row_data = top_row.find_elements_by_tag_name("td")

    date = top_row_data[0].text

    top_row_data[1].click()
    result = hidden_row.find_elements_by_tag_name("td")[1].text

    print(date, ":", result.replace("\\n", " "))
