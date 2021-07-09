from bs4 import BeautifulSoup
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager

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
'''




#def get_url(name):
    #return f"https://www.google.com/search?q=isla+vista+{name.replace(' ', '+')}"



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

restaurants = open("restaurants.txt", "r")
rest_list = [line.rstrip('\n') for line in restaurants]
restaurants.close()
print(rest_list)

'''
dict_order = {}
dict_order_now = {}
dict_times = {}
'''

output = []
for i in rest_list:
    rest = {}
    
    url = get_url(i)
    options = webdriver.ChromeOptions()
    # options.add_argument('headless') # uncommented for testing
    browser = webdriver.Chrome(ChromeDriverManager().install(), options=options)
    browser.get(url)
    
    soup = BeautifulSoup(browser.page_source, 'html.parser')
    
    if soup.find(string="Order"):
    # Find the word "Order inside a <b> tag, then get the parent div"
        order_string = soup.find(string="Order")
        order_area = order_string.find_parent("b").find_parent("div")
        for anchor in order_area.find_all('a', {'class': 'xFAlBc'}):
            delivery_name = anchor.getText()
            delivery_url = anchor.get('href', '/')
            #dict_order[i].append([f'* {delivery_name}, {delivery_url}'])
            rest['order'] = {"name": delivery_name, "url": delivery_url}
            #= [f'* {delivery_name}, {delivery_url}']
            
    elif soup.find(string="Order Now"):
        order_now_string = soup.find(string="Order Now")
        order_now_area = order_now_string.find_parent("a")
        #dict_order_now[i].append(order_now_area.prettify())
        rest['order'] = order_now_area.prettify()
        
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
        

    
        for row in hour_area.find_all("tr"):
            day, times = row.find_all("td")
            #dict_times[i].append([day.getText(), times.getText()])
            rest['hours'] = {day.getText(), times.getText()}

    except:
        print("couldn't find hours for restaurant", i)
        
    output.append(rest)

print(output)

#print(dict_order)
#print(dict_order_now)
#print(dict_times)


    
