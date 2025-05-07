import pandas as pd
import numpy as np
np.random.seed(42)

# Generate synthetic retail sales data
n_rows = 1000
store_ids = np.random.choice(['Store A', 'Store B', 'Store C'], n_rows)
product_ids = np.random.choice(['P001', 'P002', 'P003', 'P004', 'P005'], n_rows)
dates = pd.date_range('2024-01-01', periods=180).to_list()
date_samples = np.random.choice(dates, n_rows)
quantities = np.random.poisson(3, n_rows) + 1
prices = np.random.uniform(10, 100, n_rows).round(2)
revenues = (quantities * prices).round(2)
customer_ids = np.random.randint(1000, 1100, n_rows)

# RFM features
recency = np.random.randint(1, 60, n_rows)
frequency = np.random.randint(1, 10, n_rows)
monetary = np.random.uniform(20, 500, n_rows).round(2)

# Inventory
stock_level = np.random.randint(10, 200, n_rows)

# Build DataFrame
sales = pd.DataFrame({
    'Date': date_samples,
    'Store': store_ids,
    'ProductID': product_ids,
    'CustomerID': customer_ids,
    'Quantity': quantities,
    'UnitPrice': prices,
    'Revenue': revenues,
    'Recency': recency,
    'Frequency': frequency,
    'Monetary': monetary,
    'StockLevel': stock_level
})

sales = sales.sort_values('Date')
sales.to_excel('sample_data.xlsx', index=False)
print('Sample retail sales data generated: sample_data.xlsx') 