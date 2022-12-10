#! /usr/bin/env python3

import sys, os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import mysql.connector

# print("Data sent back")
# sys.stdout.flush()

def get_sales_data():
    '''Get sales data from database'''
    try:
        cnx = mysql.connector.connect(user='root', password='N4MTeCeK56zHW9nBEkf3LQKP', host='157.230.69.100', database='alpine')
        cursor = cnx.cursor(buffered=True)
        query = "SELECT categoryName, COUNT(categoryName) AS appearances FROM category C JOIN (SELECT OP.productId, categoryId FROM orderproduct OP LEFT JOIN product P ON OP.productId = P.productId) AS prod ON C.categoryId = prod.categoryId GROUP BY categoryName;"
        cursor.execute(query)

        data = {}
        for (categoryName, appearances) in cursor:
            data[categoryName] = appearances

        cursor.close()
        cnx.close()

        return data
    except mysql.connector.Error as err:
        print("Something went wrong: {}".format(err))
        sys.stdout.flush()
        return


def generate_pie_chart(name):
    '''Generate a pie chart of sales based on category'''
    # declaring data
    d = get_sales_data()
    print(d)

    # get this data from the database
    # data = [44, 45, 40, 41, 39]
    # keys = ['Class 1', 'Class 2', 'CLass 3', 'Class 4', 'Class 5']
    df = pd.DataFrame.from_dict(d, orient='index').reset_index().rename(columns={'index':'Category', 0:'Sales'})
    print(df)
    
    # define Seaborn color palette to use
    palette_color = sns.color_palette("crest", df['Category'].nunique())
    
    # plotting data on chart
    
    plt.rcParams.update({"figure.dpi": 300, "figure.figsize": (10, 10), 'font.size': 22})
    plt.pie(df['Sales'], labels=df['Category'], colors=palette_color, autopct='%.0f%%')
    # displaying chart
    # plt.show()

    fileName = os.path.dirname(os.path.realpath(__file__)) + '/../public/' + name
    plt.savefig(fileName, bbox_inches='tight')
    print(name)
    sys.stdout.flush()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.argv.append('img/charts/output.png')
    generate_pie_chart(sys.argv[1])