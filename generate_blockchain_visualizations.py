import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import networkx as nx
from datetime import datetime, timedelta
import os

# Set style
plt.style.use('dark_background')
sns.set_theme(style="darkgrid")

# Create blockchain project directory
blockchain_dir = 'public/images/projects/blockchain'
os.makedirs(blockchain_dir, exist_ok=True)

# Set color scheme (Bitcoin orange and complementary colors)
COLORS = {
    'primary': '#F7931A',  # Bitcoin orange
    'secondary': '#0D47A1',  # Deep blue
    'tertiary': '#1E88E5',  # Lighter blue
    'text': '#FFFFFF',
    'background': '#121212',
    'grid': '#333333'
}

# 1. Generate Supply Chain Dashboard visualization
def create_supply_chain_dashboard():
    # Generate synthetic data for product tracking
    np.random.seed(42)
    dates = pd.date_range(start='2023-01-01', end='2023-06-30', freq='D')
    
    # Simulate three product types with different supply chain patterns
    product_types = ['Electronics', 'Pharmaceuticals', 'Luxury Goods']
    
    # Shipping stages
    stages = ['Manufacturing', 'Distribution Center', 'Regional Hub', 'Local Warehouse', 'Retailer']
    
    # Create sample data
    data = []
    for product in product_types:
        base_transit_time = np.random.randint(10, 20)
        base_verification_rate = np.random.uniform(0.7, 0.98)
        
        for month in range(6):
            # Add some seasonality
            transit_time = base_transit_time + np.sin(month) * 3
            verification_rate = min(0.99, base_verification_rate + month * 0.01)
            incidents = max(0, int(np.random.normal(10 - month, 3)))
            
            data.append({
                'Product Type': product,
                'Month': dates[month * 30].strftime('%b'),
                'Avg Transit Time (days)': transit_time,
                'Blockchain Verification Rate': verification_rate,
                'Supply Chain Incidents': incidents
            })
    
    df = pd.DataFrame(data)
    
    # Create figure with subplots
    fig, axes = plt.subplots(2, 2, figsize=(16, 10), facecolor=COLORS['background'])
    fig.suptitle('Blockchain Supply Chain Analytics Dashboard', fontsize=20, color=COLORS['text'], y=0.98)
    
    # 1. Transit Time Trends
    sns.barplot(x='Month', y='Avg Transit Time (days)', hue='Product Type', data=df, ax=axes[0, 0], palette=[COLORS['primary'], COLORS['secondary'], COLORS['tertiary']])
    axes[0, 0].set_title('Average Transit Time by Product Type', color=COLORS['text'])
    axes[0, 0].set_xlabel('Month', color=COLORS['text'])
    axes[0, 0].set_ylabel('Days', color=COLORS['text'])
    axes[0, 0].tick_params(colors=COLORS['text'])
    axes[0, 0].legend(loc='upper right')
    
    # 2. Verification Rate
    sns.lineplot(x='Month', y='Blockchain Verification Rate', hue='Product Type', data=df, ax=axes[0, 1], marker='o', linewidth=2.5, palette=[COLORS['primary'], COLORS['secondary'], COLORS['tertiary']])
    axes[0, 1].set_title('Blockchain Verification Success Rate', color=COLORS['text'])
    axes[0, 1].set_xlabel('Month', color=COLORS['text'])
    axes[0, 1].set_ylabel('Rate', color=COLORS['text'])
    axes[0, 1].tick_params(colors=COLORS['text'])
    axes[0, 1].set_ylim(0.7, 1.0)
    axes[0, 1].legend(loc='lower right')
    
    # 3. Incidents Trend
    sns.lineplot(x='Month', y='Supply Chain Incidents', hue='Product Type', data=df, ax=axes[1, 0], marker='s', linewidth=2.5, palette=[COLORS['primary'], COLORS['secondary'], COLORS['tertiary']])
    axes[1, 0].set_title('Supply Chain Incidents Over Time', color=COLORS['text'])
    axes[1, 0].set_xlabel('Month', color=COLORS['text'])
    axes[1, 0].set_ylabel('Number of Incidents', color=COLORS['text'])
    axes[1, 0].tick_params(colors=COLORS['text'])
    axes[1, 0].legend(loc='upper right')
    
    # 4. Current Supply Chain Status (Simulated gauges)
    axes[1, 1].set_title('Real-time Supply Chain Status', color=COLORS['text'])
    axes[1, 1].axis('off')
    
    status_data = {
        'Active Shipments': 428,
        'Pending Verification': 12,
        'Completed Today': 156,
        'Alerts': 3
    }
    
    # Create a table in the subplot for the status metrics
    cell_text = [[f"{v}"] for v in status_data.values()]
    axes[1, 1].table(cellText=cell_text, 
                    rowLabels=list(status_data.keys()),
                    loc='center',
                    cellLoc='center',
                    rowLoc='center',
                    colWidths=[0.3],
                    fontsize=14)
    
    # Add blockchain logo/icon simulation
    circle = plt.Circle((0.5, 0.8), 0.15, color=COLORS['primary'], alpha=0.8, transform=axes[1, 1].transAxes)
    axes[1, 1].add_patch(circle)
    axes[1, 1].text(0.5, 0.8, '₿', fontsize=40, ha='center', va='center', transform=axes[1, 1].transAxes, color=COLORS['background'])
    
    plt.tight_layout()
    plt.subplots_adjust(top=0.9)
    
    # Save the dashboard visualization
    plt.savefig(f"{blockchain_dir}/supply_chain_dashboard.png", dpi=300, bbox_inches='tight', facecolor=COLORS['background'])
    plt.close()
    print("Supply Chain Dashboard visualization created successfully!")

# 2. Generate Smart Contract Architecture diagram
def create_smart_contract_architecture():
    G = nx.DiGraph()
    
    # Define the nodes (smart contract components)
    nodes = [
        "Proxy Contract", "Implementation", "Registry",
        "Product NFT", "Auth Manager", "Supply Chain Logic",
        "Oracle", "Event Log", "User Interface"
    ]
    
    # Define node colors by type
    node_colors = {
        "Proxy Contract": COLORS['primary'],
        "Implementation": COLORS['primary'],
        "Registry": COLORS['primary'],
        "Product NFT": COLORS['secondary'],
        "Auth Manager": COLORS['secondary'],
        "Supply Chain Logic": COLORS['secondary'],
        "Oracle": COLORS['tertiary'],
        "Event Log": COLORS['tertiary'],
        "User Interface": COLORS['tertiary']
    }
    
    # Add nodes
    for node in nodes:
        G.add_node(node)
    
    # Define the edges (connections between contracts)
    edges = [
        ("Proxy Contract", "Implementation"),
        ("Proxy Contract", "Registry"),
        ("Implementation", "Product NFT"),
        ("Implementation", "Auth Manager"),
        ("Implementation", "Supply Chain Logic"),
        ("Supply Chain Logic", "Oracle"),
        ("Supply Chain Logic", "Event Log"),
        ("User Interface", "Proxy Contract"),
        ("Registry", "Implementation"),
        ("Auth Manager", "Oracle"),
        ("Event Log", "User Interface"),
        ("Product NFT", "Event Log")
    ]
    
    # Add edges
    G.add_edges_from(edges)
    
    # Create the plot
    plt.figure(figsize=(12, 10), facecolor=COLORS['background'])
    plt.title("Smart Contract Architecture", color=COLORS['text'], fontsize=20, pad=20)
    
    # Generate a hierarchical layout
    pos = nx.spring_layout(G, seed=42)
    
    # Draw the nodes
    node_colors_list = [node_colors[node] for node in G.nodes()]
    nx.draw_networkx_nodes(G, pos, node_size=3000, node_color=node_colors_list, alpha=0.9)
    
    # Draw the edges
    nx.draw_networkx_edges(G, pos, width=2, alpha=0.7, edge_color=COLORS['text'], arrowsize=20)
    
    # Draw the labels
    nx.draw_networkx_labels(G, pos, font_size=11, font_color=COLORS['background'], font_weight='bold')
    
    # Add a legend
    legend_elements = [
        plt.Line2D([0], [0], marker='o', color='w', markerfacecolor=COLORS['primary'], markersize=15, label='Core Contracts'),
        plt.Line2D([0], [0], marker='o', color='w', markerfacecolor=COLORS['secondary'], markersize=15, label='Logic Contracts'),
        plt.Line2D([0], [0], marker='o', color='w', markerfacecolor=COLORS['tertiary'], markersize=15, label='External Services')
    ]
    plt.legend(handles=legend_elements, loc='upper left', facecolor=COLORS['background'], edgecolor=COLORS['text'], fontsize=12)
    
    # Add explanatory text
    plt.figtext(0.5, 0.01, 
                "Blockchain Supply Chain System Architecture: The proxy pattern allows for upgradeable contracts\n"
                "while maintaining persistent storage and identity on the blockchain.",
                ha="center", color=COLORS['text'], fontsize=12, bbox=dict(facecolor=COLORS['background'], alpha=0.7, edgecolor=COLORS['primary']))
    
    plt.axis('off')
    plt.tight_layout()
    
    # Save the architecture diagram
    plt.savefig(f"{blockchain_dir}/smart_contract_architecture.png", dpi=300, bbox_inches='tight', facecolor=COLORS['background'])
    plt.close()
    print("Smart Contract Architecture diagram created successfully!")

# 3. Generate Authentication Flow visualization
def create_authentication_flow():
    plt.figure(figsize=(14, 8), facecolor=COLORS['background'])
    
    # Define stages of authentication
    stages = [
        "Product Creation", 
        "Digital Signature", 
        "Blockchain Registration", 
        "Supply Chain Checkpoint", 
        "Zero-Knowledge Proof", 
        "Authenticity Verification"
    ]
    
    # Authentication success rates at each stage (in percentage)
    success_rates = [100, 98, 97, 94, 92, 89]
    
    # Number of products processed at each stage
    products_processed = [1000, 980, 951, 903, 876, 850]
    
    # Calculate the width for each block based on success rates
    block_widths = [rate/20 for rate in success_rates]
    
    # Position of each block
    positions = list(range(len(stages)))
    
    # Create the blocks
    for i, (stage, pos, width, processed) in enumerate(zip(stages, positions, block_widths, products_processed)):
        color = COLORS['primary'] if i % 2 == 0 else COLORS['secondary']
        
        # Draw the main block
        plt.fill_between([pos-width/2, pos+width/2], [0, 0], [success_rates[i], success_rates[i]], 
                        color=color, alpha=0.7, edgecolor='white', linewidth=1)
        
        # Add stage name
        plt.text(pos, success_rates[i] + 3, stage, ha='center', va='bottom', 
                color=COLORS['text'], fontsize=11, rotation=0, fontweight='bold')
        
        # Add percentage
        plt.text(pos, success_rates[i]/2, f"{success_rates[i]}%", ha='center', va='center', 
                color=COLORS['background'], fontsize=12, fontweight='bold')
        
        # Add products processed
        plt.text(pos, -5, f"{processed} products", ha='center', va='top', 
                color=COLORS['text'], fontsize=9)
        
        # Add arrows between blocks if not the last one
        if i < len(stages) - 1:
            plt.arrow(pos+width/2+0.1, success_rates[i], 
                    positions[i+1]-width/2-pos-width/2-0.2, success_rates[i+1]-success_rates[i],
                    head_width=1.5, head_length=0.15, fc=COLORS['tertiary'], ec=COLORS['tertiary'], zorder=0)
    
    # Set labels and title
    plt.title('Blockchain Authentication Flow with Success Rates', color=COLORS['text'], fontsize=20, pad=20)
    plt.xlabel('Authentication Process Flow', color=COLORS['text'], fontsize=14, labelpad=15)
    plt.ylabel('Success Rate (%)', color=COLORS['text'], fontsize=14, labelpad=15)
    
    # Set axis limits
    plt.xlim(-1, len(stages))
    plt.ylim(-10, 110)
    
    # Configure ticks
    plt.xticks([])  # Hide x-ticks as we have custom labels
    plt.yticks(color=COLORS['text'])
    
    # Add grid for better readability
    plt.grid(axis='y', linestyle='--', alpha=0.3)
    
    # Add annotations
    plt.annotate('Product Creation\n100% starting rate', xy=(0, 100), xytext=(0, 110),
                arrowprops=dict(arrowstyle='->', color=COLORS['text']),
                ha='center', va='bottom', color=COLORS['text'], fontsize=10)
    
    plt.annotate('Final Verification\n89% success rate', xy=(5, 89), xytext=(5, 75),
                arrowprops=dict(arrowstyle='->', color=COLORS['text']),
                ha='center', va='top', color=COLORS['text'], fontsize=10)
    
    # Add infobox with explanation
    plt.figtext(0.5, 0.01, 
                "Authentication Flow Analysis: Each step in the product authentication process is verified on the blockchain.\n"
                "Success rates show percentage of products that pass each verification step in the supply chain journey.",
                ha="center", color=COLORS['text'], fontsize=12, bbox=dict(facecolor=COLORS['background'], alpha=0.7, edgecolor=COLORS['primary']))
    
    plt.tight_layout()
    
    # Save the authentication flow diagram
    plt.savefig(f"{blockchain_dir}/authentication_flow.png", dpi=300, bbox_inches='tight', facecolor=COLORS['background'])
    plt.close()
    print("Authentication Flow visualization created successfully!")

# Run all visualization generators
if __name__ == "__main__":
    print("Generating blockchain supply chain visualizations...")
    create_supply_chain_dashboard()
    create_smart_contract_architecture()
    create_authentication_flow()
    print("All blockchain visualizations created successfully!") 