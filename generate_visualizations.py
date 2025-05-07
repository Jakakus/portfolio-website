import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta

# Set style
plt.style.use('default')  # Use default style instead of seaborn
sns.set_theme()  # Use seaborn's theme

# Create directories for visualizations
import os
# Define project directories
project_dirs = {
    'seo': 'public/images/projects/seo-analytics',
    'email': 'public/images/projects/email-marketing',
    'hr': 'public/images/projects/hr-analytics',
    'covid': 'public/images/covid-impact',
    'churn': 'public/images/churn-analysis',
    'sql': 'public/images/sql-analysis'
}

# Create directories if they don't exist
for dir_path in project_dirs.values():
    os.makedirs(dir_path, exist_ok=True)

# Generate synthetic SEO data
np.random.seed(42)
dates = pd.date_range(start='2024-01-01', end='2024-04-30', freq='D')
keywords = ['data analytics', 'machine learning', 'python tutorial', 'data science', 'AI trends']

# Keyword performance data
keyword_data = []
for keyword in keywords:
    base_rank = np.random.randint(5, 15)
    rank_trend = np.random.normal(0, 0.5, len(dates))
    ranks = np.maximum(1, np.minimum(100, base_rank + np.cumsum(rank_trend)))
    
    base_clicks = np.random.randint(50, 200)
    click_noise = np.random.normal(0, 10, len(dates))
    clicks = np.maximum(0, base_clicks + click_noise + (100 - ranks) * 2)
    
    for date, rank, click in zip(dates, ranks, clicks):
        keyword_data.append({
            'date': date,
            'keyword': keyword,
            'rank': rank,
            'clicks': click
        })

df_keywords = pd.DataFrame(keyword_data)

# 1. Keyword Performance Visualization
plt.figure(figsize=(12, 6))
for keyword in keywords:
    data = df_keywords[df_keywords['keyword'] == keyword]
    plt.plot(data['date'], data['rank'], label=keyword, linewidth=2)

plt.gca().invert_yaxis()  # Invert Y-axis as rank 1 is better
plt.title('Keyword Rankings Over Time', fontsize=14, pad=20)
plt.xlabel('Date', fontsize=12)
plt.ylabel('Ranking Position', fontsize=12)
plt.legend(title='Keywords', bbox_to_anchor=(1.05, 1), loc='upper left')
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig(f"{project_dirs['seo']}/keyword_ranking_trends.png", dpi=300, bbox_inches='tight')
plt.close()

# Traffic source data
sources = ['Organic Search', 'Direct', 'Social', 'Referral', 'Email']
traffic_data = []
for date in dates:
    total_traffic = np.random.normal(1000, 100)
    source_distribution = np.random.dirichlet(np.array([5, 3, 2, 1, 1]))
    for source, share in zip(sources, source_distribution):
        traffic = int(total_traffic * share)
        traffic_data.append({
            'date': date,
            'source': source,
            'visits': traffic
        })

df_traffic = pd.DataFrame(traffic_data)

# 2. Traffic Patterns Visualization
plt.figure(figsize=(12, 6))
traffic_by_source = df_traffic.pivot(index='date', columns='source', values='visits')
plt.stackplot(df_traffic['date'].unique(), 
              [traffic_by_source[source] for source in sources],
              labels=sources)

plt.title('Website Traffic by Source', fontsize=14, pad=20)
plt.xlabel('Date', fontsize=12)
plt.ylabel('Daily Visits', fontsize=12)
plt.legend(title='Traffic Sources', bbox_to_anchor=(1.05, 1), loc='upper left')
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig(f"{project_dirs['seo']}/traffic_source_breakdown.png", dpi=300, bbox_inches='tight')
plt.close()

print("Visualizations generated successfully!") 