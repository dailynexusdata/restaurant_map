from bs4 import BeautifulSoup
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager

# Things that would be good to get:
# get reviews?
# get link for menu
# get reservations
# get order websites
# some restaurants might not have all of this info - so we need to do error checking


def get_url(name):
    return f"https://www.google.com/search?q=isla+vista+{name.replace(' ', '+')}"


# we would want to loop over all of the restautants in restaurants.txt - you can change the names to make sure the search result appears correctly
url = get_url("woodstock's pizza")

options = webdriver.ChromeOptions()
# options.add_argument('headless') # uncommented for testing
browser = webdriver.Chrome(ChromeDriverManager().install(), options=options)
browser.get(url)

soup = BeautifulSoup(browser.page_source, 'html.parser')

#
# GET DELIVERY OPTIONS:
#

# Find the word "Order inside a <b> tag, then get the parent div"
order_string = soup.find(string="Order")
order_area = order_string.find_parent("b").find_parent("div")

for anchor in order_area.find_all('a', {'class': 'xFAlBc'}):
    delivery_name = anchor.getText()
    delivery_url = anchor.get('href', '/')

    print(f'* {delivery_name}, {delivery_url}')


#
# GET ORDER NOW OPTIONS:
#

# for woodstocks there is als an Order Now for grubhub -- which isn't listed later below
order_now_string = soup.find(string="Order Now")
order_now_area = order_now_string.find_parent("a")
print(order_now_area.prettify())


#
# GET RESTAURANT HOURS:
#

# click on the 'More hours' to see table
# see: https://stackoverflow.com/a/42982559
browser.find_element_by_xpath(
    "//div//span[contains(text(), 'More hours') and @class='XCdOnb']"
).click()

# reset the beautiful soup - maybe change variable name idk
soup = BeautifulSoup(browser.page_source, 'html.parser')

# find the table and go through all of the rows
hour_area = soup.find("div", {"class", "eRD3Mb"}).find("table")
for row in hour_area.find_all("tr"):
    day, times = row.find_all("td")

    print(day.getText(), times.getText())
