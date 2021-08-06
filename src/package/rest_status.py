from bs4 import BeautifulSoup
from selenium import webdriver
import pandas as pd
from webdriver_manager.chrome import ChromeDriverManager
import json

# Things that would be good to get:
# get reviews?
# get link for menu
# get reservations
# get order websites
# some restaurants might not have all of this info - so we need to do error checking


'''
def get_url(name):
    return f"https://www.google.com/search?q=isla+vista+{name.replace(' ', '+')}"
# we would want to loop over all of the restautants in restaurants.txt - you can change the names to make sure the search result appears correctly
url = get_url("freebirds")
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
    delivery_url = anchor.get('href', '/')SS
    print(f'* {delivery_name}, {delivery_url}')
#
# GET ORDER NOW OPTIONS:
#
# for woodstocks there is als an Order Now for grubhub -- which isn't listed later below
#order_now_string = soup.find(string="Order Now")
#order_now_area = order_now_string.find_parent("a")
# print(order_now_area.prettify())
#
# GET RESTAURANT HOURS:
#
# click on the 'More hours' to see table
# see: https://stackoverflow.com/a/42982559
try:
    browser.find_element_by_xpath(
        "//div//span[contains(text(), 'More hours') and @class='XCdOnb']"
    ).click()
except:
    browser.find_element_by_xpath(
        "//div//span[ @class='BTP3Ac']"
    ).click()
# reset the beautiful soup - maybe change variable name idk
soup = BeautifulSoup(browser.page_source, 'html.parser')
# find the table and go through all of the rows
try:
    hour_area = soup.find("div", {"class", "eRD3Mb"}).find("table")
except:
    hour_area = soup.find("table", {"class", "WgFkxc"})
hour_area = soup.find("div", {"class", "eRD3Mb"})
if hour_area:
    hour_area.find("table")
for row in hour_area.find_all("tr"):
    day, times = row.find_all("td")
    print(day.getText(), times.getText())
'''


# def get_url(name):
# return f"https://www.google.com/search?q=isla+vista+{name.replace(' ', '+')}"


'''
f = open("restaurants.txt", "r")
content = f.read()
content_list = content.splitlines()
f.close()
content_list[0] = 'woodstock's pizza'
print(content_list)
'''


def get_url(name):
    return f"https://www.google.com/search?q=isla+vista+{name.replace(' ', '+')}"


restaurants = pd.read_csv("restaurants.csv").name
rest_list = [line.rstrip('\n') for line in restaurants]
print(rest_list)

'''
dict_order = {}
dict_order_now = {}
dict_times = {}
'''

output = []
for i in ["woodstock"]:
    rest = {}

    url = get_url(i)
    options = webdriver.ChromeOptions()
    # options.add_argument('headless') # uncommented for testing
    browser = webdriver.Chrome(
        ChromeDriverManager().install(), options=options)
    browser.get(url)

    soup = BeautifulSoup(browser.page_source, 'html.parser')

    order_string = soup.find(string="Order")
    order_now_string = soup.find(string="Order Now")
    order_string1 = soup.find(string="$")
    order_string2 = soup.find(string="$$")
    rest_closed = soup.find(string="Temporarily closed")
    stars = soup.find("span", {"class", "Aq14fc"})

    if order_string:
        # Find the word "Order inside a <b> tag, then get the parent div"
        try:
            order_area = order_string.find_parent("b").find_parent("div")
        except:
            order_area = order_string.find_parent("div")

        rest['order'] = []

        for anchor in order_area.find_all('a', {'class': 'xFAlBc'}):
            delivery_name = anchor.getText()
            delivery_url = anchor.get('href', '/')
            #dict_order[i].append([f'* {delivery_name}, {delivery_url}'])
            rest['order'].append({"name": delivery_name, "url": delivery_url})
            # = [f'* {delivery_name}, {delivery_url}']

    elif order_now_string:
        order_now_area = order_now_string.find_parent("a")
        # dict_order_now[i].append(order_now_area.prettify())
        # we might want to actually make this order_now
        rest['order_now'] = order_now_area.prettify()

    elif order_string1:
        rest['price range'] = order_string1

    elif order_string2:
        rest['price range'] = order_string2

    else:
        rest['price range'] = "no price range found"

    # find Menu
    # try:
        # browser.find_element_by_xpath(
        #"//div//span[contains(text(), 'Menu') and @class='xFAlBc']"
        # ).click()

    # except:
        #print("couldn't find menu for restaurant", i)

    # find menu
    menu_area = soup.find("div", {"data-attrid": "kc:/local:menu"})

    try:
        try:
            menu_area1 = menu_area.find_parent("b").find_parent("div")
        except:
            menu_area1 = menu_area.find_parent("div")

        menu_link = menu_area1.find('a', {"class": "xFAlBc"})
        rest['Menu'] = {"url": menu_link['href']}
    except:
        print("no menu")

    phone_area = soup.find(
        'a', {'data-local-attribute': 'd3ph'}
    )
    if phone_area:
        rest['phone_number'] = phone_area.find("span").getText()

    print(rest)

    # find
    try:
        # for hours:
        try:
            browser.find_element_by_xpath(
                "//div//span[contains(text(), 'More hours') and @class='XCdOnb']"
            ).click()
        except:
            browser.find_element_by_xpath(
                "//div//span[ @class='BTP3Ac']"
            ).click()

        # reset the beautiful soup - maybe change variable name
        souP = BeautifulSoup(browser.page_source, 'html.parser')

        #souP.find("div", {"class", "eRD3Mb"}).find("table")
        # find the table and go through all of the rows
        #hour_area = souP.find("div", {"class", "eRD3Mb"}).find("table")

        try:
            hour_area = soup.find("div", {"class", "eRD3Mb"}).find("table")
        except:
            hour_area = soup.find("table", {"class", "WgFkxc"})

        rest['hours'] = []
        for row in hour_area.find_all("tr"):
            day, times = row.find_all("td")
            #dict_times[i].append([day.getText(), times.getText()])
            rest['hours'].append(dict(day=day.getText(), time=times.getText()))

    except:
        print("couldn't find hours for restaurant", i)

    '''
    try:
        # for $:
        browser.find_element_by_xpath(
            "//div//span[ @class='YhemCb' and @data-ved='2ahUKEwj46vzz5dvxAhVMoZ4KHddVDyMQxuQDKAAwFXoECD0QAQ' ]"
            ).click()
        # for $$:
        browser.find_element_by_xpath(
            "//div//span[ @class='YhemCb' and @data-ved='2ahUKEwjIhe2P5NvxAhWHZM0KHRKTCQ4QxuQDKAAwGHoECGAQAQ' ]"
            ).click()
            
    except:
        print("couldn't find price range for restaurant", i)
    '''
    if stars:
        # print(stars.getText())
        rest["stars"] = stars.getText()

    rest["closed"] = rest_closed
    # if rest_closed:
    #     print("temporarily closed")

    # print(json.dumps(rest))

    output.append(rest)

    browser.close()
    browser.quit()

print(output)

# Notes:
# getting type error for phone number & menu
# The Habit & Tacos & Taproom & Sizzling Lunch are temporarily closed # <span>Temporarily Closed</span>
# can't find reservations for many of the restaurants
# for reviews, we can look at the number of stars (out of 5); class, sytle, aria-hidden="true"
