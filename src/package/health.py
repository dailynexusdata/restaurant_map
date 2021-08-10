from bs4 import BeautifulSoup
from selenium import webdriver
import csv
import pandas as pd
import math
from webdriver_manager.chrome import ChromeDriverManager
import json

# this is the actual website being used:::

url = "https://pressagent.envisionconnect.com/main.phtml?agency=sbc"


'''
with open('restaurants.csv', newline='') as csvfile:
    reader.DictReader(csvfile)
    for row in reader:
        print(row['name'], row['address']
'''

'''
alist = ["woodstock", "freebirds", "starbucks coffee #5332", "buddha bowls", "super cucas #3",
         "rockfire grill", "bagel cafe", "naan stop", "sizzling lunch", "the habit burger grill", "pho bistro",
         "hana kitchen", "deja vu", "domino's pizza", "caje"]
'''
selected_vars = ['name', 'address']
df = pd.read_csv('closed_restaurants.csv', usecols=selected_vars)
# print(df)

# woodstocks (with an s) wont work
#name = "woodstock"

first_column = df.iloc[:, 0].tolist()
first_column

output = []

for index, row in df.iterrows():

    print(row)

    options = webdriver.ChromeOptions()
    # options.add_argument('headless') # uncommented for testing
    browser = webdriver.Chrome(
        ChromeDriverManager().install(),
        options=options
    )
    browser.get(url)

    # pass in the restaurant name:
    # finds the place where we will input the name
    inputBox = browser.find_element_by_id("businessname")
    # actually inputting name of restaurant into search box
    inputBox.send_keys(row["name"])

    # streetBox = browser.find_element_by_xpath(
    #     "//input[@name='businessstreet']")
    # streetBox.send_keys(93117)

    # cityBox = browser.find_element_by_xpath("//input[@name='city']")
    # cityBox.send_keys(93117)

    zipBox = browser.find_element_by_xpath("//input[@name='zip']")
    zipBox.send_keys(93117)

    inputBox.submit()  # submitting search

    # check if multiple facility names pop up
    # if count(browser.find_elements_by_xpath("//a[@href]").get_attribute("href")) > 1:
    #     # find corresponding address in df that matches restaurant name
    #     index_num = df[df['name'] == name].index[0]
    #     rest_address = df.iloc[index_num, 1]
    #     # find the address on the website to figure out the correct one, then click on the facility name corresponding to that
    #     address_string = soup.find(string=rest_address.tostring())

    # check if there is only 1 facility name
    # if there is only 1 facility name then get the first href
    # else:

<<<<<<< HEAD
    if browser.find_elements_by_xpath("//a[@href]")[0]:
        
        link = browser.find_elements_by_xpath(
            "//a[@href]")[0].get_attribute("href")
        browser.get(link)

        try:
            rows = browser.find_elements_by_xpath(
                "//table//tbody//tr"
            )[2].find_elements_by_xpath("//td//table//tbody//tr")

            inspecs = []

            for top_row, hidden_row in zip(rows[5::2], rows[6::2]):
                top_row_data = top_row.find_elements_by_tag_name("td")

                date = top_row_data[0].text

                top_row_data[1].click()
                result = hidden_row.find_elements_by_tag_name("td")[1].text

                inspecs.append({"date": date, "desc": result.replace("\\n", " ")})

            output.append({"name": row["name"], "inspecs": inspecs})
            
            print(output)

        except:
            pass
        
        #output.append({"name": row["name"], "inspecs": "not found"})
=======
    try:
        rows = browser.find_elements_by_xpath(
            "//table//tbody//tr"
        )[2].find_elements_by_xpath("//td//table//tbody//tr")

        inspecs = []

        for top_row, hidden_row in zip(rows[5::2], rows[6::2]):
            top_row_data = top_row.find_elements_by_tag_name("td")

            date = top_row_data[0].text

            top_row_data[1].click()
            result = hidden_row.find_elements_by_tag_name("td")[1].text

            inspecs.append({"date": date, "desc": result.replace("\\n", " ")})

        output.append({"name": row["name"], "inspecs": inspecs})
        print(output)
    except:
        pass
>>>>>>> 596707ab746f747e69728deb75d3b9d2ef8a66ba

    browser.close()
    browser.quit()
