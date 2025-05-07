"""
Predicting Customer Churn for a Subscription Business

Project Overview:
• Problem: Predict which customers are likely to churn in a subscription business.
• Data Source: Synthetic data generated within this script.
• Methods:
    - Data Simulation: Create a dataset with customer features (age, monthly charges, tenure, etc.).
    - Data Cleaning & Preprocessing: Encode categorical variables.
    - Modeling: Train Logistic Regression and Random Forest classifiers.
    - Evaluation: Display accuracy, classification reports, and save confusion matrix plots.
    - Insights: Save feature importance plot from the Random Forest model.
• Tools: Python (Pandas, NumPy, Matplotlib, Seaborn, Scikit-learn)
• Repository: Document your work on GitHub with a well-documented README.
"""

import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

# Create a directory to save plots
OUTPUT_DIR = "plots"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def generate_data(n_customers=1000):
    """
    Simulates a dataset for a subscription business.
    Features:
      - customer_id: Unique ID for each customer
      - age: Customer's age (18-80)
      - monthly_charges: Monthly fee (20 to 120)
      - tenure: Number of months the customer has been subscribed (1 to 60)
      - customer_support_calls: Number of support calls made (0-10)
      - contract: Type of subscription contract (Month-to-month, One year, Two year)
      - churn: Binary target (1=churn, 0=stay), simulated based on other features
    """
    data = pd.DataFrame()
    data['customer_id'] = np.arange(1, n_customers + 1)
    data['age'] = np.random.randint(18, 80, size=n_customers)
    data['monthly_charges'] = np.random.uniform(20, 120, size=n_customers).round(2)
    data['tenure'] = np.random.randint(1, 61, size=n_customers)
    data['customer_support_calls'] = np.random.randint(0, 11, size=n_customers)
    data['contract'] = np.random.choice(
        ['Month-to-month', 'One year', 'Two year'], 
        size=n_customers, 
        p=[0.6, 0.25, 0.15]
    )
    
    # Simulate churn probability:
    # Month-to-month contracts, higher support calls, and higher charges increase churn risk.
    # Longer tenure reduces churn probability.
    base_prob = 0.2
    contract_effect = 0.2 * (data['contract'] == 'Month-to-month').astype(int)
    support_effect = 0.03 * data['customer_support_calls']
    charge_effect = 0.002 * data['monthly_charges']
    tenure_effect = -0.005 * data['tenure']
    
    prob = base_prob + contract_effect + support_effect + charge_effect + tenure_effect
    prob = np.clip(prob, 0, 1)
    
    # Generate churn flag based on probability
    data['churn'] = np.where(np.random.rand(n_customers) < prob, 1, 0)
    
    return data

def preprocess_data(df):
    """
    Preprocess the dataset:
      - Checks for missing values (none expected in synthetic data).
      - One-hot encodes the categorical 'contract' column.
    """
    # Remove missing values if any (synthetic data should be clean)
    if df.isnull().sum().sum() > 0:
        df = df.dropna()
    
    # One-hot encode 'contract' (drop first to avoid dummy variable trap)
    df = pd.get_dummies(df, columns=['contract'], drop_first=True)
    return df

def save_plot(fig, filename):
    """
    Saves a Matplotlib figure to the specified filename and closes the figure.
    """
    fig.tight_layout()
    fig.savefig(os.path.join(OUTPUT_DIR, filename))
    plt.close(fig)

def train_models(df):
    """
    Splits the data, trains Logistic Regression and Random Forest models,
    evaluates performance, and saves generated plots.
    """
    # Define features and target variable
    features = ['age', 'monthly_charges', 'tenure', 'customer_support_calls', 
                'contract_One year', 'contract_Two year']
    X = df[features]
    y = df['churn']
    
    # Split data (80% training, 20% testing)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # --- Logistic Regression ---
    logreg = LogisticRegression(max_iter=1000)
    logreg.fit(X_train, y_train)
    y_pred_log = logreg.predict(X_test)
    
    print("=== Logistic Regression Model Evaluation ===")
    print("Accuracy:", accuracy_score(y_test, y_pred_log))
    print("Classification Report:\n", classification_report(y_test, y_pred_log))
    
    # Plot confusion matrix for Logistic Regression
    cm_log = confusion_matrix(y_test, y_pred_log)
    fig_log, ax_log = plt.subplots(figsize=(6, 4))
    sns.heatmap(cm_log, annot=True, fmt='d', cmap='Blues', ax=ax_log)
    ax_log.set_title('Logistic Regression Confusion Matrix')
    ax_log.set_xlabel('Predicted')
    ax_log.set_ylabel('Actual')
    save_plot(fig_log, "logistic_regression_confusion_matrix.png")
    
    # --- Random Forest Classifier ---
    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf.fit(X_train, y_train)
    y_pred_rf = rf.predict(X_test)
    
    print("=== Random Forest Model Evaluation ===")
    print("Accuracy:", accuracy_score(y_test, y_pred_rf))
    print("Classification Report:\n", classification_report(y_test, y_pred_rf))
    
    # Plot confusion matrix for Random Forest
    cm_rf = confusion_matrix(y_test, y_pred_rf)
    fig_rf, ax_rf = plt.subplots(figsize=(6, 4))
    sns.heatmap(cm_rf, annot=True, fmt='d', cmap='Greens', ax=ax_rf)
    ax_rf.set_title('Random Forest Confusion Matrix')
    ax_rf.set_xlabel('Predicted')
    ax_rf.set_ylabel('Actual')
    save_plot(fig_rf, "random_forest_confusion_matrix.png")
    
    # --- Feature Importance from Random Forest ---
    importances = pd.Series(rf.feature_importances_, index=features)
    importances_sorted = importances.sort_values()
    
    fig_imp, ax_imp = plt.subplots(figsize=(8, 6))
    importances_sorted.plot(kind='barh', ax=ax_imp)
    ax_imp.set_title('Feature Importances from Random Forest')
    ax_imp.set_xlabel('Importance Score')
    ax_imp.set_ylabel('Feature')
    save_plot(fig_imp, "random_forest_feature_importance.png")

def main():
    # Generate and display a sample of the synthetic dataset
    df = generate_data(n_customers=1000)
    print("=== Sample of Generated Data ===")
    print(df.head())
    
    # Preprocess the data (e.g., encoding categorical variables)
    df_processed = preprocess_data(df)
    
    # Train models, evaluate performance, and save plots
    train_models(df_processed)
    
if __name__ == "__main__":
    main()
